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

import hashlib
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import modal

# This file lives in a directory named `modal/`, which shadows the `modal`
# SDK package by name. Import sibling local modules (`backends/`, `audio/`)
# by adding this directory to sys.path directly, rather than as `modal.*`
# submodules, so they never collide with `import modal` above.
sys.path.insert(0, str(Path(__file__).parent))
from audio.segmenter import chunk_text  # noqa: E402
from backends.chatterbox import ChatterboxBackend  # noqa: E402
from cache.chunk_cache import (  # noqa: E402
    CACHE_VERSION,
    FilesystemChunkCache,
    compute_cache_key,
    hash_file,
)

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
    .add_local_dir(str(Path(__file__).parent / "cache"), remote_path="/root/cache")
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
# Chunk cache lives on the same persistent volume as episode output, keyed
# by content hash (modal/cache/chunk_cache.py), so it survives across
# container restarts/retries of the same episode render.
CHUNK_CACHE_DIR = f"{EPISODE_OUTPUT_MOUNT}/chunk-cache"
RENDER_PROFILE_PATH = Path(__file__).parent / "config" / "render_profiles" / "podcast-standard.json"

DEFAULT_PAUSE_MS = 800
DEFAULT_CROSSFADE_MS = 150
# Fallback defaults, used only when the render profile's `mix` block
# (modal/config/render_profiles/podcast-standard.json) doesn't specify a
# value. The render profile is authoritative — see _master_episode_audio().
TARGET_LUFS = -16.0
TRUE_PEAK_LIMIT_DB = -1.0
TARGET_LRA = 11.0

RENDER_MANIFEST_SCHEMA_VERSION = "1.0"

# modal/CHATTERBOX_INTEGRATION_PLAN.md Section 3: benchmark cheapest-first.
# L4 is the VOICE_PODCAST_GENERATION.md executive recommendation for the
# initial inference GPU; the prior H100 default was never benchmarked
# against it and is oversized/overpriced for this workload.
DEFAULT_GPU = "L4"


def _parse_ffmpeg_loudnorm_json(stderr_text: str) -> dict:
    """Extract the JSON stats block ffmpeg's loudnorm filter prints to stderr."""
    start = stderr_text.rfind("{")
    end = stderr_text.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise RuntimeError(
            f"Could not find loudnorm JSON stats in ffmpeg output:\n{stderr_text[-2000:]}"
        )
    return json.loads(stderr_text[start : end + 1])


def _master_episode_audio(
    wav_bytes: bytes, target_lufs: float, true_peak_db: float, lra: float
) -> tuple[bytes, dict]:
    """Master a stitched episode WAV with ffmpeg's two-pass EBU R128 loudnorm.

    This replaces the previous naive sample-peak np.clip() limiter (which
    could clip audio and did not measure or enforce true peak) with a real
    true-peak-aware loudness normalization: pass 1 measures integrated
    loudness/LRA/true peak, pass 2 applies `linear=true` loudnorm using the
    measured values so the final file hits the target LUFS without the
    non-linear compression the single-pass filter would otherwise apply.

    Returns (mastered_wav_bytes, stats) where stats has "measured" (pass 1)
    and "final" (pass 2) loudnorm JSON blocks, including true peak and LRA.
    """
    import subprocess
    import tempfile

    with tempfile.TemporaryDirectory() as tmpdir:
        in_path = Path(tmpdir) / "in.wav"
        out_path = Path(tmpdir) / "out.wav"
        in_path.write_bytes(wav_bytes)

        measure_filter = (
            f"loudnorm=I={target_lufs}:TP={true_peak_db}:LRA={lra}:print_format=json"
        )
        measure_proc = subprocess.run(
            ["ffmpeg", "-y", "-i", str(in_path), "-af", measure_filter, "-f", "null", "-"],
            capture_output=True,
            text=True,
        )
        if measure_proc.returncode != 0:
            raise RuntimeError(
                f"ffmpeg loudnorm measurement pass failed (exit {measure_proc.returncode}):\n"
                f"{measure_proc.stderr[-2000:]}"
            )
        measured = _parse_ffmpeg_loudnorm_json(measure_proc.stderr)

        apply_filter = (
            f"loudnorm=I={target_lufs}:TP={true_peak_db}:LRA={lra}:"
            f"measured_I={measured['input_i']}:measured_TP={measured['input_tp']}:"
            f"measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}:"
            f"offset={measured.get('target_offset', 0)}:linear=true:print_format=json"
        )
        apply_proc = subprocess.run(
            ["ffmpeg", "-y", "-i", str(in_path), "-af", apply_filter, str(out_path)],
            capture_output=True,
            text=True,
        )
        if apply_proc.returncode != 0:
            raise RuntimeError(
                f"ffmpeg loudnorm apply pass failed (exit {apply_proc.returncode}):\n"
                f"{apply_proc.stderr[-2000:]}"
            )
        final_stats = _parse_ffmpeg_loudnorm_json(apply_proc.stderr)
        mastered_bytes = out_path.read_bytes()

    return mastered_bytes, {"measured": measured, "final": final_stats}


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
    volumes={
        VOICE_PROFILES_MOUNT: voice_profiles_volume,
        # Chunk cache lives on the episode-output volume so cache entries
        # survive across container restarts/retries of the same episode
        # (see modal/cache/chunk_cache.py).
        EPISODE_OUTPUT_MOUNT: episode_output_volume,
    },
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
        self.chunk_cache = FilesystemChunkCache(
            CHUNK_CACHE_DIR, backend_version=f"chatterbox:v{CACHE_VERSION}"
        )

    @modal.method()
    def synthesize(
        self,
        text: str,
        voice_profile_id: str,
        language: str = "en",
        force_regenerate: bool = False,
    ) -> bytes:
        """Synthesize one script segment's text in the given voice profile.

        The segment's text is split into sentence-aware chunks per the
        render profile's `synthesis.chunking` target (see
        modal/audio/segmenter.py) so a 300-600 word section is not sent to
        the model as a single inference call, and a failed chunk can be
        retried on its own instead of forcing the whole segment to re-render.

        Each chunk is looked up in the content-addressed chunk cache
        (modal/cache/chunk_cache.py) before synthesis; a hit reuses the
        cached audio instead of calling the model. Pass `force_regenerate`
        to bypass the cache for an intentional re-render (e.g. after a
        script or voice-profile change).
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

        reference_audio_hash = hash_file(reference_wav)

        chunk_wavs = [
            self._synthesize_chunk_with_retry(
                chunk,
                reference_wav,
                language=language,
                exaggeration=synth_opts.get("exaggeration"),
                cfg_weight=synth_opts.get("cfgWeight"),
                retry_count=retry_count,
                voice_profile_id=voice_profile_id,
                voice_profile_revision=str(profile.get("fineTunedCheckpoint") or profile.get("consent", {}).get("confirmedDate", "")),
                reference_audio_hash=reference_audio_hash,
                force_regenerate=force_regenerate,
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
        voice_profile_id: str,
        voice_profile_revision: str,
        reference_audio_hash: str,
        force_regenerate: bool = False,
    ) -> bytes:
        cache_key = compute_cache_key(
            chunk_text_value,
            voice_profile_id=voice_profile_id,
            voice_profile_revision=voice_profile_revision,
            reference_audio_hash=reference_audio_hash,
            backend_revision=self.chunk_cache.backend_version,
            exaggeration=exaggeration,
            cfg_weight=cfg_weight,
            extra_params={"language": language},
        )

        if not force_regenerate:
            cached = self.chunk_cache.get(cache_key)
            if cached is not None:
                return cached

        last_error: Exception | None = None
        for attempt in range(retry_count + 1):
            try:
                audio = self.backend.synthesize(
                    chunk_text_value,
                    reference_wav,
                    language=language,
                    exaggeration=exaggeration,
                    cfg_weight=cfg_weight,
                )
                self.chunk_cache.put(cache_key, audio)
                episode_output_volume.commit()
                return audio
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
    segment_chunks: list[tuple[str, str]] | None = None,
) -> tuple[bytes, dict]:
    """Stitch synthesized segments into one mastered episode file.

    No ML here on purpose — splicing, crossfades, pause padding, and
    loudness mastering are deterministic audio-editing steps.

    `segment_chunks` is the optional (text, voice_profile_id) list that
    drove `segment_audio` synthesis, in the same order, used only to build
    the render manifest's per-segment info (text hash, voice profile,
    duration) — it is not required for mastering itself.

    Returns (mastered_wav_bytes, render_manifest). The manifest is written
    to disk by the caller alongside the WAV; this function only builds it.
    """
    from io import BytesIO

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
    stitched_wav_bytes = buf.getvalue()

    # The render profile's `mix` block is authoritative for mastering
    # targets; the module-level TARGET_LUFS/TRUE_PEAK_LIMIT_DB/TARGET_LRA
    # constants are fallback defaults only (podcast-standard.json currently
    # sets targetLufs: -16, truePeakDb: -1).
    render_profile = _load_render_profile()
    mix_cfg = render_profile.get("mix", {})
    target_lufs = mix_cfg.get("targetLufs", TARGET_LUFS)
    true_peak_db = mix_cfg.get("truePeakDb", TRUE_PEAK_LIMIT_DB)
    target_lra = mix_cfg.get("lra", TARGET_LRA)

    mastered_wav_bytes, loudnorm_stats = _master_episode_audio(
        stitched_wav_bytes, target_lufs, true_peak_db, target_lra
    )

    segments_manifest = []
    for i, clip in enumerate(clips):
        entry = {
            "index": i,
            "durationSeconds": round(clip.duration_seconds, 3),
        }
        if segment_chunks and i < len(segment_chunks):
            text, voice_profile_id = segment_chunks[i]
            entry["textSha256"] = hashlib.sha256(text.encode("utf-8")).hexdigest()
            entry["voiceProfileId"] = voice_profile_id
        segments_manifest.append(entry)

    synthesis_cfg = render_profile.get("synthesis", {})
    render_manifest = {
        "manifestSchemaVersion": RENDER_MANIFEST_SCHEMA_VERSION,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "synthesis": {
            "backend": synthesis_cfg.get("backend", "chatterbox"),
            "modelVariant": synthesis_cfg.get("modelVariant"),
        },
        "mastering": {
            "method": "ffmpeg-loudnorm-two-pass",
            "target": {
                "integratedLufs": target_lufs,
                "truePeakDb": true_peak_db,
                "lra": target_lra,
            },
            "measured": loudnorm_stats["measured"],
            "final": loudnorm_stats["final"],
        },
        "segments": segments_manifest,
    }

    return mastered_wav_bytes, render_manifest


@app.function(volumes={EPISODE_OUTPUT_MOUNT: episode_output_volume}, timeout=1200)
def generate_episode_audio(episode_config_json: str, force_regenerate: bool = False) -> str:
    """Entrypoint: render one episode's audio from its ScriptOutput + config.

    episode_config_json: path to a modal/config/episodes/*.json file
    (see that directory for the expected shape).

    Resumability: each segment's chunks are synthesized through the chunk
    cache (modal/cache/chunk_cache.py, keyed by content hash), so re-running
    this function after a partial failure — the `starmap` below raises if
    any one segment's synthesis ultimately fails after its retries — skips
    every chunk whose cache entry already exists and only regenerates the
    ones that are missing or failed. Pass `force_regenerate=True` to bypass
    the cache entirely for an intentional re-render (e.g. after a script or
    voice-profile change).
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
    synth_calls = [
        (text, voice_profile_id, "en", force_regenerate) for text, voice_profile_id in calls
    ]
    segment_audio = list(
        synthesizer.synthesize.starmap(synth_calls)
    )

    final_audio, render_manifest = assemble_episode.remote(
        segment_audio,
        config.get("episodeMeta", {}),
        intro_bed_path=config.get("introBedPath"),
        outro_bed_path=config.get("outroBedPath"),
        segment_chunks=calls,
    )
    manifest_json = json.dumps(render_manifest, indent=2)

    # Write to Modal volume, alongside a render manifest with the same stem.
    output_path = Path(EPISODE_OUTPUT_MOUNT) / config["outputFileName"]
    output_path.write_bytes(final_audio)
    manifest_path = output_path.with_name(output_path.stem + ".manifest.json")
    manifest_path.write_text(manifest_json)
    episode_output_volume.commit()

    # Also write to local output directory for accessibility
    meta = config.get("episodeMeta", {})
    series = meta.get("series", "")
    season_num = meta.get("seasonNumber", 1)
    ep_num = meta.get("episodeNumber", 1)
    local_output_dir = Path("/root/output") / series / f"season-{season_num}" / f"episode-{ep_num}"
    local_output_dir.mkdir(parents=True, exist_ok=True)
    local_output_path = local_output_dir / "episode.wav"
    local_output_path.write_bytes(final_audio)
    (local_output_dir / "episode.manifest.json").write_text(manifest_json)

    return str(output_path)


@app.local_entrypoint()
def main(episode_config: str, force_regenerate: bool = False):
    try:
        result_path = generate_episode_audio.remote(episode_config, force_regenerate=force_regenerate)
        print(f"Episode audio rendered to: {result_path}")
    finally:
        # Automatically shut down the Modal app after generation completes
        # to avoid unnecessary cloud compute charges.
        print("Shutting down Modal app...")
        app.stop()
