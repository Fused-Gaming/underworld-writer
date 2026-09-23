"""Chunk-level synthesis cache for audio rendering.

Per GitHub issue #146 (P0 "Chunk cache and resumable rendering"): synthesis
is expensive and per-chunk, so a failure partway through an episode
currently forces re-synthesizing every chunk via `starmap`. This module
provides a pluggable cache keyed by a stable hash of everything that
determines a chunk's audio output, so a retry/resume can skip chunks that
were already rendered and only regenerate what's missing.

Two pieces:
    - `ChunkCacheKey` / `compute_cache_key()`: the stable sha256 hash.
    - `ChunkCache` (abstract) / `FilesystemChunkCache`: the storage backend.
      `FilesystemChunkCache` writes into a directory, which in `modal/app.py`
      is backed by a `modal.Volume` mount (see `EPISODE_OUTPUT_MOUNT`/
      `episode_output_volume`) so cache entries persist across container
      restarts and across retries of the same episode render.

Bump `CACHE_VERSION` whenever synthesis logic changes materially (e.g. a
change to chunking, stitching, or how backend params are applied) — it is
folded into the hash, so every prior entry is invalidated at once without
needing to touch stored files.
"""

from __future__ import annotations

import hashlib
import json
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path

# Bump this when synthesis logic changes in a way that should invalidate
# every existing cache entry (e.g. chunking strategy, stitching, retry
# semantics, or how synthesis params are passed to the backend).
CACHE_VERSION = 1


@dataclass(frozen=True)
class ChunkCacheKey:
    """All inputs that determine a chunk's synthesized audio."""

    chunk_text: str
    voice_profile_id: str
    voice_profile_revision: str
    reference_audio_hash: str
    backend_revision: str
    synthesis_params: dict

    def digest(self) -> str:
        """Stable sha256 hex digest over every field, plus CACHE_VERSION."""
        payload = {
            "cacheVersion": CACHE_VERSION,
            "chunkText": self.chunk_text,
            "voiceProfileId": self.voice_profile_id,
            "voiceProfileRevision": self.voice_profile_revision,
            "referenceAudioHash": self.reference_audio_hash,
            "backendRevision": self.backend_revision,
            "synthesisParams": self.synthesis_params,
        }
        canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"))
        return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def hash_file(path: str | Path) -> str:
    """sha256 of a file's bytes, used for the reference-audio-hash input."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(65536), b""):
            h.update(block)
    return h.hexdigest()


def compute_cache_key(
    chunk_text: str,
    *,
    voice_profile_id: str,
    voice_profile_revision: str = "",
    reference_audio_hash: str = "",
    backend_revision: str = "",
    exaggeration: float | None = None,
    cfg_weight: float | None = None,
    extra_params: dict | None = None,
) -> ChunkCacheKey:
    """Build a `ChunkCacheKey` from whatever synthesis params are available.

    `synthesis_params` folds in exaggeration/cfg_weight (the params present
    on voice profiles today, see modal/config/voice_profiles/*.json) plus
    any `extra_params` a backend exposes, so the hash changes whenever any
    param that could affect the audio changes.
    """
    params = {"exaggeration": exaggeration, "cfgWeight": cfg_weight}
    if extra_params:
        params.update(extra_params)
    return ChunkCacheKey(
        chunk_text=chunk_text,
        voice_profile_id=voice_profile_id,
        voice_profile_revision=voice_profile_revision,
        reference_audio_hash=reference_audio_hash,
        backend_revision=backend_revision,
        synthesis_params=params,
    )


class ChunkCache(ABC):
    """Pluggable chunk-audio cache interface."""

    @abstractmethod
    def get(self, key: ChunkCacheKey) -> bytes | None:
        """Return cached audio bytes for `key`, or None on a miss."""

    @abstractmethod
    def put(self, key: ChunkCacheKey, audio: bytes, *, metadata: dict | None = None) -> None:
        """Store `audio` under `key`, with optional extra metadata."""

    def get_or_synthesize(self, key: ChunkCacheKey, synthesize_fn, *, force: bool = False) -> bytes:
        """Cache-through helper: return cached audio, or synthesize + store.

        `synthesize_fn` is called with no arguments on a miss (or when
        `force` bypasses the cache for an intentional re-render).
        """
        if not force:
            cached = self.get(key)
            if cached is not None:
                return cached
        audio = synthesize_fn()
        self.put(key, audio, metadata={"forced": force})
        return audio


class FilesystemChunkCache(ChunkCache):
    """Filesystem-backed chunk cache.

    Intended to be pointed at a directory inside a mounted `modal.Volume`
    (see `EPISODE_OUTPUT_MOUNT` in modal/app.py) so entries survive across
    container restarts/retries of the same episode. Each entry is two
    files: `<hash>.wav` (audio) and `<hash>.json` (metadata: the hash
    inputs, a timestamp, and backend version) written under `cache_dir`.
    """

    def __init__(self, cache_dir: str | Path, *, backend_version: str = ""):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.backend_version = backend_version

    def _audio_path(self, digest: str) -> Path:
        return self.cache_dir / f"{digest}.wav"

    def _meta_path(self, digest: str) -> Path:
        return self.cache_dir / f"{digest}.json"

    def has(self, key: ChunkCacheKey) -> bool:
        return self._audio_path(key.digest()).exists()

    def get(self, key: ChunkCacheKey) -> bytes | None:
        audio_path = self._audio_path(key.digest())
        if not audio_path.exists():
            return None
        try:
            return audio_path.read_bytes()
        except OSError:
            return None

    def put(self, key: ChunkCacheKey, audio: bytes, *, metadata: dict | None = None) -> None:
        digest = key.digest()
        self._audio_path(digest).write_bytes(audio)
        meta = {
            "hash": digest,
            "cacheVersion": CACHE_VERSION,
            "voiceProfileId": key.voice_profile_id,
            "voiceProfileRevision": key.voice_profile_revision,
            "referenceAudioHash": key.reference_audio_hash,
            "backendRevision": key.backend_revision,
            "synthesisParams": key.synthesis_params,
            "chunkTextPreview": key.chunk_text[:120],
            "backendVersion": self.backend_version,
            "createdAt": time.time(),
        }
        if metadata:
            meta.update(metadata)
        self._meta_path(digest).write_text(json.dumps(meta, indent=2))


class DictChunkCache(ChunkCache):
    """In-memory dict-backed cache, for tests decoupled from a real filesystem."""

    def __init__(self):
        self._store: dict[str, tuple[bytes, dict]] = {}

    def get(self, key: ChunkCacheKey) -> bytes | None:
        entry = self._store.get(key.digest())
        return entry[0] if entry else None

    def put(self, key: ChunkCacheKey, audio: bytes, *, metadata: dict | None = None) -> None:
        self._store[key.digest()] = (audio, metadata or {})

    def __len__(self) -> int:
        return len(self._store)
