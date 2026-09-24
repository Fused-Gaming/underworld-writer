#!/usr/bin/env python3
"""Sync repository voice profiles + repository reference audio into a Modal Volume.

This is a deployment/sync step, not a Docker image bake. Keeping voice bytes in
the persistent Modal Volume means model/image rebuilds do not duplicate private
voice material into immutable image layers.

Usage:
  modal run scripts/sync-modal-voice-profiles.py --show insight-corruption
"""
from __future__ import annotations
import hashlib, json
from pathlib import Path
import modal

ROOT=Path(__file__).resolve().parents[1]
app=modal.App("underworld-voice-profile-sync")
volume=modal.Volume.from_name("underworld-voice-profiles",create_if_missing=True)
MOUNT="/vol/voice-profiles"

def sha256(path:Path)->str:
    h=hashlib.sha256()
    with path.open("rb") as fh:
        for block in iter(lambda:fh.read(1024*1024),b""): h.update(block)
    return h.hexdigest()

def source_for(show:str,clip:dict)->Path:
    # Runtime path clips/eric-nissen/foo.wav maps to the versioned repository
    # source projects/<show>/production/voice/references/clips/eric-nissen/foo.wav.
    return ROOT/"projects"/show/"production"/"voice"/"references"/clip["path"]

@app.function(volumes={MOUNT:volume})
def sync(show:str="insight-corruption",verify_only:bool=False)->dict:
    profile_dir=ROOT/"projects"/show/"voice-profiles"
    if not profile_dir.exists(): raise FileNotFoundError(profile_dir)
    synced=[]
    for profile_path in sorted(profile_dir.glob("*.json")):
        profile=json.loads(profile_path.read_text())
        if profile.get("consent",{}).get("status")!="confirmed":
            raise PermissionError(f"{profile_path.name}: consent is not confirmed")
        runtime_profile=Path(MOUNT)/f"{profile['voiceProfileId']}.json"
        for clip in profile.get("referenceAudio",{}).get("clips",[]):
            src=source_for(show,clip); dst=Path(MOUNT)/clip["path"]
            if not src.exists():
                raise FileNotFoundError(
                    f"Missing repository reference audio: {src}. "
                    "Add the verified WAV bytes at this path before deploying."
                )
            actual=sha256(src); expected=clip.get("sha256")
            if expected and actual!=expected:
                raise ValueError(f"{src}: sha256 {actual} != expected {expected}")
            if not verify_only:
                dst.parent.mkdir(parents=True,exist_ok=True); dst.write_bytes(src.read_bytes())
            if dst.exists() and sha256(dst)!=actual:
                raise ValueError(f"Modal volume verification failed for {dst}")
            synced.append({"profile":profile["voiceProfileId"],"clip":clip["path"],"sha256":actual})
        if not verify_only:
            runtime_profile.write_text(json.dumps(profile,indent=2)+"\n")
    if not verify_only: volume.commit()
    return {"show":show,"verifyOnly":verify_only,"synced":synced}

@app.local_entrypoint()
def main(show:str="insight-corruption",verify_only:bool=False):
    print(json.dumps(sync.remote(show,verify_only),indent=2))

