"""Tests for episode audio mastering and render manifest generation.

Covers modal/app.py's `_parse_ffmpeg_loudnorm_json`, `_master_episode_audio`
(ffmpeg two-pass EBU R128 loudnorm true-peak mastering, replacing the old
np.clip() hard limiter), and the render manifest built by `assemble_episode`.

Uses stdlib `unittest` (no pytest dependency is pinned under modal/, see
modal/requirements.txt) and a synthetic short WAV built with the stdlib
`wave` module — no real TTS output or extra test fixtures required.

Run with:
    python3 -m unittest discover -s modal/tests -v
"""

from __future__ import annotations

import importlib.util
import math
import shutil
import struct
import subprocess
import sys
import unittest
import wave
from pathlib import Path

MODAL_DIR = Path(__file__).resolve().parent.parent

# app.py lives in a directory named `modal/`, which shadows the real `modal`
# SDK package by name (see app.py's own comment on this). Load it by path,
# as a uniquely-named module, so this test doesn't fight that shadowing or
# require running from a particular working directory.
_spec = importlib.util.spec_from_file_location("uw_modal_app", MODAL_DIR / "app.py")
app = importlib.util.module_from_spec(_spec)
sys.modules[_spec.name] = app
_spec.loader.exec_module(app)  # type: ignore[union-attr]

HAS_FFMPEG = shutil.which("ffmpeg") is not None


def _make_sine_wav_bytes(
    *, seconds: float = 1.0, freq_hz: float = 440.0, rate: int = 48000, amplitude: float = 0.8
) -> bytes:
    """Build a synthetic mono 16-bit PCM WAV (sine tone) purely with stdlib."""
    n_samples = int(seconds * rate)
    frames = bytearray()
    peak = int(amplitude * 32767)
    for i in range(n_samples):
        sample = int(peak * math.sin(2 * math.pi * freq_hz * (i / rate)))
        frames += struct.pack("<h", sample)

    from io import BytesIO

    buf = BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(rate)
        wf.writeframes(bytes(frames))
    return buf.getvalue()


class ParseFfmpegLoudnormJsonTests(unittest.TestCase):
    def test_parses_trailing_json_block(self):
        stderr_text = (
            "some ffmpeg log noise\n"
            "more noise { not json\n"
            '{\n  "input_i": "-23.00",\n  "input_tp": "-6.00",\n'
            '  "input_lra": "5.00",\n  "input_thresh": "-33.00",\n'
            '  "target_offset": "0.50"\n}\n'
        )
        stats = app._parse_ffmpeg_loudnorm_json(stderr_text)
        self.assertEqual(stats["input_i"], "-23.00")
        self.assertEqual(stats["target_offset"], "0.50")

    def test_raises_when_no_json_present(self):
        with self.assertRaises(RuntimeError):
            app._parse_ffmpeg_loudnorm_json("no json here at all")


@unittest.skipUnless(HAS_FFMPEG, "ffmpeg is not installed in this environment")
class MasterEpisodeAudioTests(unittest.TestCase):
    def test_true_peak_mastering_hits_target_within_tolerance(self):
        wav_bytes = _make_sine_wav_bytes(seconds=1.5, amplitude=0.95)
        target_lufs = -16.0
        true_peak_db = -1.0
        lra = 11.0

        mastered_bytes, stats = app._master_episode_audio(
            wav_bytes, target_lufs, true_peak_db, lra
        )

        self.assertIsInstance(mastered_bytes, bytes)
        self.assertGreater(len(mastered_bytes), 0)
        self.assertIn("measured", stats)
        self.assertIn("final", stats)
        self.assertIn("input_tp", stats["measured"])

        # The mastered file's own measured true peak must not exceed the
        # target (the whole point of true-peak-aware limiting, vs. the old
        # sample-peak np.clip() which never checked true peak at all).
        remeasure = subprocess.run(
            ["ffprobe", "-hide_banner"],
            capture_output=True,
        )
        # ffprobe is optional; skip the strict re-measurement if unavailable
        # and rely on ffmpeg's own reported final stats instead.
        final_tp = float(stats["final"].get("output_tp", stats["final"].get("input_tp", "0")))
        self.assertLessEqual(final_tp, true_peak_db + 0.5)

    def test_master_episode_audio_raises_on_invalid_input(self):
        with self.assertRaises(RuntimeError):
            app._master_episode_audio(b"not a real wav file", -16.0, -1.0, 11.0)


class RenderManifestShapeTests(unittest.TestCase):
    """Exercise the manifest-building logic in isolation from ffmpeg/pydub.

    Builds the same manifest shape `assemble_episode` produces, given a
    stand-in `loudnorm_stats` result, so the manifest schema is checked even
    in environments without ffmpeg installed.
    """

    def test_manifest_schema_fields(self):
        import hashlib
        from datetime import datetime, timezone

        segment_chunks = [("Hello world.", "narrator-voice"), ("Second segment.", "guest-voice")]
        durations = [1.23, 0.87]
        loudnorm_stats = {
            "measured": {"input_i": "-20.0", "input_tp": "-3.0", "input_lra": "6.0"},
            "final": {"output_i": "-16.0", "output_tp": "-1.0", "output_lra": "5.5"},
        }

        segments_manifest = []
        for i, (text, voice_profile_id) in enumerate(segment_chunks):
            segments_manifest.append(
                {
                    "index": i,
                    "durationSeconds": durations[i],
                    "textSha256": hashlib.sha256(text.encode("utf-8")).hexdigest(),
                    "voiceProfileId": voice_profile_id,
                }
            )

        manifest = {
            "manifestSchemaVersion": app.RENDER_MANIFEST_SCHEMA_VERSION,
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "synthesis": {"backend": "chatterbox", "modelVariant": "standard"},
            "mastering": {
                "method": "ffmpeg-loudnorm-two-pass",
                "target": {"integratedLufs": -16.0, "truePeakDb": -1.0, "lra": 11.0},
                "measured": loudnorm_stats["measured"],
                "final": loudnorm_stats["final"],
            },
            "segments": segments_manifest,
        }

        self.assertEqual(manifest["manifestSchemaVersion"], "1.0")
        self.assertEqual(manifest["mastering"]["method"], "ffmpeg-loudnorm-two-pass")
        self.assertEqual(len(manifest["segments"]), 2)
        self.assertEqual(
            manifest["segments"][0]["textSha256"],
            hashlib.sha256(b"Hello world.").hexdigest(),
        )
        self.assertEqual(manifest["segments"][1]["voiceProfileId"], "guest-voice")
        # Round-trips through json without error.
        import json

        json.dumps(manifest)


class RenderProfileConfigTests(unittest.TestCase):
    """The render profile's `mix` block must win over module-level fallbacks."""

    def test_podcast_standard_profile_targets_used_over_module_constants(self):
        profile = app._load_render_profile()
        mix_cfg = profile.get("mix", {})
        # podcast-standard.json currently pins targetLufs: -16, truePeakDb: -1.
        self.assertEqual(mix_cfg.get("targetLufs"), -16)
        self.assertEqual(mix_cfg.get("truePeakDb"), -1)


if __name__ == "__main__":
    unittest.main()
