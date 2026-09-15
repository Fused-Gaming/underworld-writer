"""
Underworld Writer — episode audio generation on Modal.com.

Consumes a ScriptOutput JSON (from ScriptGenerator, see src/podcast-types.ts)
plus an episode config (see modal/config/episodes/*.json) and a voice
profile per speaker (see modal/config/voice_profiles/*.json), and produces
a mixed, edited episode audio file using Hugging Face voice-cloning models.

Design reference: docs/AUDIO_GENERATION_PLAN.md

Usage:
    modal deploy modal/app.py
    modal run modal/app.py::generate_episode_audio --episode-config modal/config/episodes/s1e01.json
"""

import json
import os
from pathlib import Path

import modal

APP_NAME = "underworld-audio"

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("ffmpeg", "libsndfile1")
    .pip_install(
        "torch==2.3.1",
        "torchaudio==2.3.1",
        "TTS==0.22.0",  # coqui/XTTS-v2 runtime
        "pydub==0.25.1",
        "soundfile==0.12.1",
        "pyloudnorm==0.1.1",
    )
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

DEFAULT_PAUSE_MS = 800
DEFAULT_CROSSFADE_MS = 150
TARGET_LUFS = -16.0


@app.cls(
    gpu="A10G",
    volumes={VOICE_PROFILES_MOUNT: voice_profiles_volume},
    scaledown_window=300,
)
class VoiceSynthesizer:
    """Loads a TTS model once per container and reuses it across segments."""

    @modal.enter()
    def load_model(self):
        from TTS.api import TTS

        # Warm start: the model weights stay resident for the container's
        # lifetime so per-segment calls only pay for inference, not load time.
        self.tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
        self.tts.to("cuda")

    @modal.method()
    def synthesize(self, text: str, voice_profile_id: str, language: str = "en") -> bytes:
        """Synthesize one script segment's text in the given voice profile."""
        profile = self._load_voice_profile(voice_profile_id)
        reference_wav = self._resolve_reference_audio(profile)

        out_path = f"/tmp/{voice_profile_id}-{abs(hash(text))}.wav"
        self.tts.tts_to_file(
            text=text,
            speaker_wav=reference_wav,
            language=language,
            file_path=out_path,
        )
        with open(out_path, "rb") as f:
            data = f.read()
        os.remove(out_path)
        return data

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


@app.function(volumes={EPISODE_OUTPUT_MOUNT: episode_output_volume})
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
