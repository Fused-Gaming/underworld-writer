"""
Underworld Writer — episode audio generation on Modal.com.

Consumes a ScriptOutput JSON (from ScriptGenerator, see src/podcast-types.ts)
plus an episode config (see modal/config/episodes/*.json) and a voice
profile per speaker (see modal/config/voice_profiles/*.json), and produces
a mixed, edited episode audio file using a zero-shot voice-cloning model.

Design references:
    docs/AUDIO_GENERATION_PLAN.md (original XTTS-v2 plan)
    modal/CHATTERBOX_INTEGRATION_PLAN.md (Phase 1 backend swap this file implements)
    projects/insight-corruption/production/voice/VOICE_PODCAST_GENERATION.md

Usage:
    modal deploy modal/app.py
    modal run modal/app.py::generate_episode_audio --episode-config modal/config/episodes/s1e01.json
"""

import json
import os
import sys
from pathlib import Path

import modal

# This file lives in a directory named `modal/`, which shadows the `modal`
# SDK package by name. Import sibling local modules (`backends/`, `audio/`)
# by adding this directory to sys.path directly, rather than as `modal.*`
# submodules, so they never collide with `import modal` above.
sys.path.insert(0, str(Path(__file__).parent))
from audio.segmenter import chunk_text  # noqa: E402
from backends.chatterbox import ChatterboxBackend  # noqa: E402

APP_NAME = "underworld-audio"

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("ffmpeg", "libsndfile1")
    .pip_install(
        "torch==2.6.0",
        "torchaudio==2.6.0",
        "chatterbox-tts",
        "pydub==0.25.1",
        "soundfile==0.12.1",
        "pyloudnorm==0.1.1",
    )
    # Ship the local backends/audio modules explicitly rather than relying
    # on Modal's automount, so the container's directory layout under
    # sys.path.insert(...) above matches this file's local layout.
    .add_local_dir(str(Path(__file__).parent / "backends"), remote_path="/root/backends")
    .add_local_dir(str(Path(__file__).parent / "audio"), remote_path="/root/audio")
    .add_local_dir(str(Path(__file__).parent / "config"), remote_path="/root/config")
    .add_local_dir(str(Path(__file__).parent.parent / "output"), remote_path="/root/output")
)

app = modal.App(APP_NAME, image=image)

voice_profiles_volume = modal.Volume.from_name(
    "underworld-voice-profiles", create_if_missing=True
)
episode_output_volume = modal.Volume.from_name(
    "underworld-episode-output", create_if_missing=True
)

VOICE_PROFILES_MOUNT = "/vol/voice-profiles"
EPISODE_OUTPUT_MOUNT = "/vol/episode-output"
RENDER_PROFILE_PATH = Path(__file__).parent / "config" / "render_profiles" / "podcast-standard.json"

DEFAULT_PAUSE_MS = 800
DEFAULT_CROSSFADE_MS = 150
TARGET_LUFS = -16.0

# modal/CHATTERBOX_INTEGRATION_PLAN.md Section 3: benchmark cheapest-first.
# L4 is the VOICE_PODCAST_GENERATION.md executive recommendation for the
# initial inference GPU; the prior H100 default was never benchmarked
# against it and is oversized/overpriced for this workload.
DEFAULT_GPU = "L4"


def _load_render_profile() -> dict:
    if RENDER_PROFILE_PATH.exists():
        return json.loads(RENDER_PROFILE_PATH.read_text())
    return {}


# Read once at module load (both locally, when the App is registered, and
# in-container) so the concurrency cap below is config-driven instead of
# hardcoded, per CHATTERBOX_INTEGRATION_PLAN.md Section 3 ("cap concurrency
# rather than blindly fanning out all segments").
_DEFAULT_RENDER_PROFILE = _load_render_profile()
_MAX_CONCURRENT_CALLS = (
    _DEFAULT_RENDER_PROFILE.get("synthesis", {}).get("concurrency", {}).get("maxCalls", 4)
)


@app.cls(
    gpu=DEFAULT_GPU,
    volumes={VOICE_PROFILES_MOUNT: voice_profiles_volume},
    # Short scaledown window per CHATTERBOX_INTEGRATION_PLAN.md Section 3
    # ("target: 30-60 seconds during benchmarks") instead of paying to keep
    # a GPU warm for an occasional podcast render.
    scaledown_window=60,
)
class VoiceSynthesizer:
    """Loads a TTS model once per container and reuses it across segments."""

    @modal.enter()
    def load_model(self):
        self.backend = ChatterboxBackend()
        self.backend.load()
        self.render_profile = _load_render_profile()

    @modal.method()
    def synthesize(self, text: str, voice_profile_id: str, language: str = "en") -> bytes:
        """Synthesize one script segment's text in the given voice profile.

        The segment's text is split into sentence-aware chunks per the
        render profile's `synthesis.chunking` target (see
        modal/audio/segmenter.py) so a 300-600 word section is not sent to
        the model as a single inference call, and a failed chunk can be
        retried on its own instead of forcing the whole segment to re-render.
        """
        profile = self._load_voice_profile(voice_profile_id)
        reference_wav = self._resolve_reference_audio(profile)
        synth_opts = profile.get("synthesis", {})

        chunking = self.render_profile.get("synthesis", {}).get("chunking", {})
        retry_count = self.render_profile.get("synthesis", {}).get("concurrency", {}).get("retryCount", 2)

        chunks = chunk_text(
            text,
            target_seconds_min=chunking.get("targetSecondsMin", 10),
            target_seconds_max=chunking.get("targetSecondsMax", 30),
        )

        chunk_wavs = [
            self._synthesize_chunk_with_retry(
                chunk,
                reference_wav,
                language=language,
                exaggeration=synth_opts.get("exaggeration"),
                cfg_weight=synth_opts.get("cfgWeight"),
                retry_count=retry_count,
            )
            for chunk in chunks
        ]

        return self._stitch_chunks(chunk_wavs)

    def _synthesize_chunk_with_retry(
        self,
        chunk_text_value: str,
        reference_wav: str,
        *,
        language: str,
        exaggeration: float | None,
        cfg_weight: float | None,
        retry_count: int,
    ) -> bytes:
        last_error: Exception | None = None
        for attempt in range(retry_count + 1):
            try:
                return self.backend.synthesize(
                    chunk_text_value,
                    reference_wav,
                    language=language,
                    exaggeration=exaggeration,
                    cfg_weight=cfg_weight,
                )
            except Exception as error:  # noqa: BLE001 - retry any synthesis failure
                last_error = error
        raise RuntimeError(
            f"Synthesis failed after {retry_count + 1} attempt(s) for chunk: "
            f"{chunk_text_value[:80]!r}"
        ) from last_error

    def _stitch_chunks(self, chunk_wavs: list[bytes]) -> bytes:
        """Concatenate a segment's synthesized chunks back into one clip."""
        if len(chunk_wavs) == 1:
            return chunk_wavs[0]

        from io import BytesIO

        from pydub import AudioSegment

        combined = AudioSegment.empty()
        for i, data in enumerate(chunk_wavs):
            clip = AudioSegment.from_wav(BytesIO(data))
            combined = clip if i == 0 else combined.append(clip, crossfade=DEFAULT_CROSSFADE_MS)

        out_buf = BytesIO()
        combined.export(out_buf, format="wav")
        return out_buf.getvalue()

    def _load_voice_profile(self, voice_profile_id: str) -> dict:
        profile_path = Path(VOICE_PROFILES_MOUNT) / f"{voice_profile_id}.json"
        if not profile_path.exists():
            raise FileNotFoundError(
                f"Voice profile '{voice_profile_id}' not found at {profile_path}. "
                "Upload it to the underworld-voice-profiles volume first."
            )
        return json.loads(profile_path.read_text())

    def _resolve_reference_audio(self, profile: dict) -> str:
        if profile.get("consent", {}).get("status") != "confirmed":
            raise PermissionError(
                f"Voice profile '{profile.get('voiceProfileId')}' has no confirmed "
                "consent record. Refusing to synthesize. See "
                "docs/AUDIO_GENERATION_PLAN.md Section 6a."
            )
        clips = profile.get("referenceAudio", {}).get("clips", [])
        if not clips:
            raise FileNotFoundError(
                f"Voice profile '{profile.get('voiceProfileId')}' has no reference "
                "clips uploaded to the voice-profiles volume yet."
            )
        clip_path = Path(VOICE_PROFILES_MOUNT) / clips[0]["path"]
        if not clip_path.exists():
            raise FileNotFoundError(f"Reference clip not found: {clip_path}")
        return str(clip_path)


@app.function(volumes={EPISODE_OUTPUT_MOUNT: episode_output_volume})
def assemble_episode(
    segment_audio: list[bytes],
    episode_meta: dict,
    intro_bed_path: str | None = None,
    outro_bed_path: str | None = None,
) -> bytes:
    """Stitch synthesized segments into one normalized episode file.

    No ML here on purpose — splicing, crossfades, pause padding, and
    loudness normalization are deterministic audio-editing steps.
    """
    from io import BytesIO

    import pyloudnorm as pyln
    import soundfile as sf
    from pydub import AudioSegment

    clips = [AudioSegment.from_wav(BytesIO(data)) for data in segment_audio]

    mixed = AudioSegment.silent(duration=0)
    if intro_bed_path and Path(intro_bed_path).exists():
        mixed += AudioSegment.from_file(intro_bed_path)

    for i, clip in enumerate(clips):
        if i == 0:
            mixed += clip
        else:
            mixed = mixed.append(clip, crossfade=DEFAULT_CROSSFADE_MS)
        if episode_meta.get("pauseAfterSegment", {}).get(str(i)):
            mixed += AudioSegment.silent(duration=DEFAULT_PAUSE_MS)

    if outro_bed_path and Path(outro_bed_path).exists():
        mixed += AudioSegment.from_file(outro_bed_path)

    buf = BytesIO()
    mixed.export(buf, format="wav")
    buf.seek(0)

    data, rate = sf.read(buf)
    meter = pyln.Meter(rate)
    loudness = meter.integrated_loudness(data)
    normalized = pyln.normalize.loudness(data, loudness, TARGET_LUFS)

    out_buf = BytesIO()
    sf.write(out_buf, normalized, rate, format="WAV")
    return out_buf.getvalue()


@app.function(volumes={EPISODE_OUTPUT_MOUNT: episode_output_volume}, timeout=1200)
def generate_episode_audio(episode_config_json: str) -> str:
    """Entrypoint: render one episode's audio from its ScriptOutput + config.

    episode_config_json: path to a modal/config/episodes/*.json file
    (see that directory for the expected shape).
    """
    config = json.loads(Path(episode_config_json).read_text())
    script_output = json.loads(Path(config["scriptOutputPath"]).read_text())

    synthesizer = VoiceSynthesizer()
    segment_texts_and_speakers = [
        (segment["text"], segment.get("speaker", "narrator"))
        for part in script_output["episodes"]
        for segment in part["segments"]
    ]
    speaker_to_voice_profile = config["speakerVoiceProfiles"]

    calls = [
        (text, speaker_to_voice_profile.get(speaker, speaker_to_voice_profile["narrator"]))
        for text, speaker in segment_texts_and_speakers
    ]
    segment_audio = list(
        synthesizer.synthesize.starmap(calls)
    )

    final_audio = assemble_episode.remote(
        segment_audio,
        config.get("episodeMeta", {}),
        intro_bed_path=config.get("introBedPath"),
        outro_bed_path=config.get("outroBedPath"),
    )

    output_path = Path(EPISODE_OUTPUT_MOUNT) / config["outputFileName"]
    output_path.write_bytes(final_audio)
    episode_output_volume.commit()
    return str(output_path)


@app.local_entrypoint()
def main(episode_config: str):
    result_path = generate_episode_audio.remote(episode_config)
    print(f"Episode audio rendered to: {result_path}")
