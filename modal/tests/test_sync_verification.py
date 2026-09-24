"""Regression tests for verify_only in the Modal volume sync scripts.

Covers scripts/sync-modal-voice-profiles.py and
scripts/sync-modal-production-audio.py: verify_only=True previously only
checked the local repository/staged source, then skipped the block that
actually compared against the destination (Modal volume) entirely — a
clip/asset that was never synced still came back reported as "synced"
during a verify-only pass instead of failing. Both scripts must now raise
when the destination is missing or its bytes don't match during
verification, exactly as a real sync would.

Run with:
    python3 -m unittest discover -s modal/tests -v
"""
from __future__ import annotations

import hashlib
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]


def _load(module_name: str, rel_path: str):
    spec = importlib.util.spec_from_file_location(module_name, REPO_ROOT / rel_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


class VoiceSyncVerifyOnlyTests(unittest.TestCase):
    def setUp(self):
        self.mod = _load("sync_modal_voice_profiles", "scripts/sync-modal-voice-profiles.py")
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.mod.ROOT = self.root

        self.show = "test-show"
        self.clip_bytes = b"fake wav bytes"
        self.clip_rel = "clips/host/clip.wav"

        src_dir = self.root / "projects" / self.show / "production" / "voice" / "references"
        src_dir.mkdir(parents=True)
        (src_dir / "clips" / "host").mkdir(parents=True)
        (src_dir / self.clip_rel).write_bytes(self.clip_bytes)

        profile_dir = self.root / "projects" / self.show / "voice-profiles"
        profile_dir.mkdir(parents=True)
        (profile_dir / "host.json").write_text(json.dumps({
            "voiceProfileId": "voice-host-01",
            "consent": {"status": "confirmed"},
            "referenceAudio": {"clips": [
                {"path": self.clip_rel, "sha256": _sha256_bytes(self.clip_bytes)},
            ]},
        }))

        self.dst_root = self.root / "fake-volume"
        self.mod.MOUNT = str(self.dst_root)

    def test_verify_only_fails_when_destination_missing(self):
        # Never synced: destination directory doesn't exist at all.
        with self.assertRaises(FileNotFoundError):
            self.mod.sync.local(show=self.show, verify_only=True)

    def test_verify_only_fails_when_destination_bytes_mismatch(self):
        dst = self.dst_root / self.clip_rel
        dst.parent.mkdir(parents=True)
        dst.write_bytes(b"different bytes entirely")
        with self.assertRaises(ValueError):
            self.mod.sync.local(show=self.show, verify_only=True)

    def test_verify_only_passes_when_destination_matches(self):
        dst = self.dst_root / self.clip_rel
        dst.parent.mkdir(parents=True)
        dst.write_bytes(self.clip_bytes)
        result = self.mod.sync.local(show=self.show, verify_only=True)
        self.assertEqual(len(result["synced"]), 1)
        self.assertEqual(result["synced"][0]["clip"], self.clip_rel)


class ProductionAudioSyncVerifyOnlyTests(unittest.TestCase):
    def setUp(self):
        self.mod = _load("sync_modal_production_audio", "scripts/sync-modal-production-audio.py")
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.mod.ROOT = self.root

        self.show = "test-show"
        self.asset_bytes = b"fake approved audio bytes"
        self.asset_rel = "test-show/music/theme-main.wav"

        staged_dir = self.root / "projects" / self.show / "production" / "audio" / "generated"
        (staged_dir / "test-show" / "music").mkdir(parents=True)
        (staged_dir / self.asset_rel).write_bytes(self.asset_bytes)

        registry_dir = self.root / "projects" / self.show / "production" / "audio"
        registry_dir.mkdir(parents=True, exist_ok=True)
        (registry_dir / "asset-registry.json").write_text(json.dumps({
            "assets": [
                {
                    "id": "ic-theme-main",
                    "path": self.asset_rel,
                    "status": "approved",
                    "sha256": _sha256_bytes(self.asset_bytes),
                    "license": {"type": "self-generated"},
                },
            ]
        }))

        self.dst_root = self.root / "fake-volume"
        self.mod.MOUNT = str(self.dst_root)

    def test_verify_only_fails_when_destination_missing(self):
        with self.assertRaises(FileNotFoundError):
            self.mod.sync.local(show=self.show, verify_only=True)

    def test_verify_only_fails_when_destination_bytes_mismatch(self):
        dst = self.dst_root / self.asset_rel
        dst.parent.mkdir(parents=True)
        dst.write_bytes(b"corrupted or stale bytes")
        with self.assertRaises(ValueError):
            self.mod.sync.local(show=self.show, verify_only=True)

    def test_verify_only_passes_when_destination_matches(self):
        dst = self.dst_root / self.asset_rel
        dst.parent.mkdir(parents=True)
        dst.write_bytes(self.asset_bytes)
        result = self.mod.sync.local(show=self.show, verify_only=True)
        self.assertEqual(len(result["synced"]), 1)
        self.assertEqual(result["synced"][0]["path"], self.asset_rel)


if __name__ == "__main__":
    unittest.main()
