"""Standalone stdlib unittest coverage for modal/cache/chunk_cache.py.

No pytest in this repo's modal/requirements.txt, so this uses stdlib
unittest only, and exercises hashing + cache hit/miss logic against
DictChunkCache (in-memory) and FilesystemChunkCache (tempdir) — never a
real Modal Volume or TTS backend.

Run directly:
    python3 modal/tests/test_chunk_cache.py
"""

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from cache.chunk_cache import (  # noqa: E402
    CACHE_VERSION,
    ChunkCacheKey,
    DictChunkCache,
    FilesystemChunkCache,
    compute_cache_key,
    hash_file,
)


def _key(**overrides) -> ChunkCacheKey:
    defaults = dict(
        chunk_text="Hello world.",
        voice_profile_id="voice-eric-nissen-01",
        voice_profile_revision="2026-09-15",
        reference_audio_hash="abc123",
        backend_revision="chatterbox:v1",
        exaggeration=0.5,
        cfg_weight=0.5,
    )
    defaults.update(overrides)
    return compute_cache_key(
        defaults.pop("chunk_text"),
        voice_profile_id=defaults.pop("voice_profile_id"),
        voice_profile_revision=defaults.pop("voice_profile_revision"),
        reference_audio_hash=defaults.pop("reference_audio_hash"),
        backend_revision=defaults.pop("backend_revision"),
        exaggeration=defaults.pop("exaggeration"),
        cfg_weight=defaults.pop("cfg_weight"),
    )


class TestCacheKeyHashing(unittest.TestCase):
    def test_same_inputs_produce_same_digest(self):
        self.assertEqual(_key().digest(), _key().digest())

    def test_digest_is_sha256_hex(self):
        digest = _key().digest()
        self.assertEqual(len(digest), 64)
        int(digest, 16)  # raises if not hex

    def test_text_change_changes_digest(self):
        self.assertNotEqual(_key().digest(), _key(chunk_text="Goodbye world.").digest())

    def test_voice_profile_change_changes_digest(self):
        self.assertNotEqual(
            _key().digest(), _key(voice_profile_id="voice-other-01").digest()
        )

    def test_reference_audio_hash_change_changes_digest(self):
        self.assertNotEqual(
            _key().digest(), _key(reference_audio_hash="def456").digest()
        )

    def test_synthesis_param_change_changes_digest(self):
        self.assertNotEqual(_key().digest(), _key(exaggeration=0.9).digest())
        self.assertNotEqual(_key().digest(), _key(cfg_weight=0.1).digest())

    def test_backend_revision_change_changes_digest(self):
        self.assertNotEqual(
            _key().digest(), _key(backend_revision="chatterbox:v2").digest()
        )

    def test_cache_version_is_folded_into_digest(self):
        import cache.chunk_cache as cc

        original = cc.CACHE_VERSION
        try:
            digest_v1 = _key().digest()
            cc.CACHE_VERSION = original + 1
            digest_v2 = _key().digest()
            self.assertNotEqual(digest_v1, digest_v2)
        finally:
            cc.CACHE_VERSION = original


class TestHashFile(unittest.TestCase):
    def test_same_content_same_hash(self):
        with tempfile.TemporaryDirectory() as d:
            p1 = Path(d) / "a.wav"
            p2 = Path(d) / "b.wav"
            p1.write_bytes(b"some audio bytes")
            p2.write_bytes(b"some audio bytes")
            self.assertEqual(hash_file(p1), hash_file(p2))

    def test_different_content_different_hash(self):
        with tempfile.TemporaryDirectory() as d:
            p1 = Path(d) / "a.wav"
            p2 = Path(d) / "b.wav"
            p1.write_bytes(b"some audio bytes")
            p2.write_bytes(b"different audio bytes")
            self.assertNotEqual(hash_file(p1), hash_file(p2))


class TestDictChunkCache(unittest.TestCase):
    def test_miss_then_hit(self):
        cache = DictChunkCache()
        key = _key()
        self.assertIsNone(cache.get(key))
        cache.put(key, b"audio-bytes")
        self.assertEqual(cache.get(key), b"audio-bytes")
        self.assertEqual(len(cache), 1)

    def test_get_or_synthesize_calls_fn_only_on_miss(self):
        cache = DictChunkCache()
        key = _key()
        calls = {"count": 0}

        def synth():
            calls["count"] += 1
            return b"synthesized"

        first = cache.get_or_synthesize(key, synth)
        second = cache.get_or_synthesize(key, synth)
        self.assertEqual(first, b"synthesized")
        self.assertEqual(second, b"synthesized")
        self.assertEqual(calls["count"], 1, "synthesize_fn should run once; second call is a cache hit")

    def test_force_bypasses_cache(self):
        cache = DictChunkCache()
        key = _key()
        cache.put(key, b"stale-audio")
        calls = {"count": 0}

        def synth():
            calls["count"] += 1
            return b"fresh-audio"

        result = cache.get_or_synthesize(key, synth, force=True)
        self.assertEqual(result, b"fresh-audio")
        self.assertEqual(calls["count"], 1)
        # And the fresh result is now what's stored.
        self.assertEqual(cache.get(key), b"fresh-audio")


class TestFilesystemChunkCache(unittest.TestCase):
    def test_put_then_get_round_trips_and_writes_metadata(self):
        with tempfile.TemporaryDirectory() as d:
            cache = FilesystemChunkCache(d, backend_version="chatterbox:v1")
            key = _key()
            self.assertIsNone(cache.get(key))

            cache.put(key, b"wav-bytes")
            self.assertEqual(cache.get(key), b"wav-bytes")

            digest = key.digest()
            self.assertTrue((Path(d) / f"{digest}.wav").exists())
            meta_path = Path(d) / f"{digest}.json"
            self.assertTrue(meta_path.exists())
            import json

            meta = json.loads(meta_path.read_text())
            self.assertEqual(meta["hash"], digest)
            self.assertEqual(meta["cacheVersion"], CACHE_VERSION)
            self.assertEqual(meta["backendVersion"], "chatterbox:v1")
            self.assertIn("createdAt", meta)

    def test_survives_a_new_cache_instance_pointed_at_same_dir(self):
        """Simulates resume across a container restart: a fresh FilesystemChunkCache
        instance pointed at the same directory should see prior entries."""
        with tempfile.TemporaryDirectory() as d:
            FilesystemChunkCache(d).put(_key(), b"episode-1-chunk-1")
            resumed = FilesystemChunkCache(d)
            self.assertEqual(resumed.get(_key()), b"episode-1-chunk-1")

    def test_different_chunks_do_not_collide(self):
        with tempfile.TemporaryDirectory() as d:
            cache = FilesystemChunkCache(d)
            key_a = _key(chunk_text="Chunk A.")
            key_b = _key(chunk_text="Chunk B.")
            cache.put(key_a, b"audio-a")
            cache.put(key_b, b"audio-b")
            self.assertEqual(cache.get(key_a), b"audio-a")
            self.assertEqual(cache.get(key_b), b"audio-b")


if __name__ == "__main__":
    unittest.main()
