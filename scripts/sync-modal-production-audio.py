#!/usr/bin/env python3
"""Upload approved, checksum-verified production audio into a Modal Volume.

Mirrors scripts/sync-modal-voice-profiles.py's fail-closed shape, but for
music/SFX instead of voice references: only assets whose asset-registry.json
status is "approved" and whose recorded sha256 matches the local staged file
are uploaded. Nothing here ever flips status to "approved" itself — that is
a human decision made after listening to the file (docs/guides/
PRODUCTION_AUDIO.md step 10).

Local staged files are expected at:
  projects/<show>/production/audio/generated/<registry path>
(gitignored — see modal/generate_production_audio.py, which writes them
there for review.)

Usage:
  modal run scripts/sync-modal-production-audio.py --show insight-corruption
  modal run scripts/sync-modal-production-audio.py --show insight-corruption --verify-only true
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import modal

LOCAL_ROOT = Path(__file__).resolve().parents[1]
# `modal run` only auto-mounts this single script file by default, not its
# sibling directories — Path(__file__).resolve().parents[1] resolves to "/"
# inside the container, not the repo root, unless the local project tree is
# explicitly mounted here. ROOT below is the in-container path that mirrors
# LOCAL_ROOT, via this explicit image.
ROOT = Path("/root/repo")
image = modal.Image.debian_slim(python_version="3.11").add_local_dir(
    str(LOCAL_ROOT / "projects"), remote_path=str(ROOT / "projects")
)
app = modal.App("underworld-production-audio-sync", image=image)
volume = modal.Volume.from_name("underworld-production-audio", create_if_missing=True)
MOUNT = "/vol/production-audio"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for block in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def staged_source_for(show: str, asset: dict) -> Path:
    return ROOT / "projects" / show / "production" / "audio" / "generated" / asset["path"]


@app.function(volumes={MOUNT: volume})
def sync(show: str = "insight-corruption", verify_only: bool = False) -> dict:
    registry_path = ROOT / "projects" / show / "production" / "audio" / "asset-registry.json"
    if not registry_path.exists():
        raise FileNotFoundError(registry_path)
    registry = json.loads(registry_path.read_text())

    synced = []
    skipped = []
    for asset in registry.get("assets", []):
        if asset.get("status") != "approved":
            skipped.append({"id": asset["id"], "reason": f"status={asset.get('status')}"})
            continue
        expected = asset.get("sha256")
        if not expected:
            skipped.append({"id": asset["id"], "reason": "approved but missing sha256"})
            continue
        if not asset.get("license"):
            skipped.append({"id": asset["id"], "reason": "approved but missing license/provenance record"})
            continue

        src = staged_source_for(show, asset)
        if not src.exists():
            raise FileNotFoundError(
                f"{asset['id']}: approved in the registry but not staged at {src}. "
                "Regenerate/place the exact approved bytes there before syncing."
            )
        actual = sha256(src)
        if actual != expected:
            raise ValueError(f"{asset['id']} ({src}): sha256 {actual} != registry {expected}")

        dst = Path(MOUNT) / asset["path"]
        if verify_only:
            # Verification must confirm the asset actually exists in the
            # Modal volume with matching bytes — checking only the local
            # staged copy (above) and skipping this block entirely
            # previously let a never-synced asset be reported as "synced".
            if not dst.exists():
                raise FileNotFoundError(f"Modal volume verification failed: {dst} does not exist")
            if sha256(dst) != actual:
                raise ValueError(f"Modal volume verification failed for {dst}")
        else:
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_bytes(src.read_bytes())
            if sha256(dst) != actual:
                raise ValueError(f"Modal volume verification failed for {dst}")
        synced.append({"id": asset["id"], "path": asset["path"], "sha256": actual})

    if not verify_only:
        volume.commit()
    return {"show": show, "verifyOnly": verify_only, "synced": synced, "skipped": skipped}


@app.local_entrypoint()
def main(show: str = "insight-corruption", verify_only: bool = False):
    print(json.dumps(sync.remote(show, verify_only), indent=2))
