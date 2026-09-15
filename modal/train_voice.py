"""
Voice profile fine-tuning on Modal.com.

Zero-shot cloning (VoiceSynthesizer in app.py) should be tried first for
every voice profile — this script is only needed when zero-shot quality
isn't sufficient for a recurring host/character voice.

Consent is checked before any training run starts; see
docs/AUDIO_GENERATION_PLAN.md Section 6a.

Usage:
    modal run modal/train_voice.py --voice-profile-id voice-eric-nissen-01
"""

import json
from pathlib import Path

import modal

from app import VOICE_PROFILES_MOUNT, app, image, voice_profiles_volume

train_image = image.pip_install(
    "peft==0.11.1",
    "accelerate==0.31.0",
)


@app.function(
    image=train_image,
    gpu="A100",
    volumes={VOICE_PROFILES_MOUNT: voice_profiles_volume},
    timeout=60 * 60 * 6,  # fine-tunes can run for hours
)
def fine_tune_voice(voice_profile_id: str, epochs: int = 10, learning_rate: float = 1e-4) -> str:
    """LoRA fine-tune the XTTS-v2 speaker encoder/decoder on a voice profile's clips.

    Returns the path to the saved checkpoint on the voice-profiles volume.
    """
    profile_path = Path(VOICE_PROFILES_MOUNT) / f"{voice_profile_id}.json"
    if not profile_path.exists():
        raise FileNotFoundError(f"Voice profile not found: {profile_path}")
    profile = json.loads(profile_path.read_text())

    if profile.get("consent", {}).get("status") != "confirmed":
        raise PermissionError(
            f"Refusing to fine-tune '{voice_profile_id}': no confirmed consent "
            "record. Update the voice profile's consent block first."
        )

    clips = profile.get("referenceAudio", {}).get("clips", [])
    if len(clips) < 3:
        raise ValueError(
            f"Voice profile '{voice_profile_id}' has only {len(clips)} reference "
            "clip(s) uploaded. Fine-tuning needs multiple clean clips (aim for "
            "several minutes of solo speech total) — zero-shot cloning from a "
            "single clip is usually a better use of one short reference anyway."
        )

    # NOTE: this is a scaffold. Wire in the actual XTTS-v2/Coqui fine-tuning
    # loop (or F5-TTS's training recipe) here once clips are uploaded and
    # zero-shot cloning has been evaluated and found insufficient.
    checkpoint_dir = Path(VOICE_PROFILES_MOUNT) / "checkpoints" / voice_profile_id
    checkpoint_dir.mkdir(parents=True, exist_ok=True)

    training_manifest = {
        "voiceProfileId": voice_profile_id,
        "baseModel": profile["baseModel"],
        "epochs": epochs,
        "learningRate": learning_rate,
        "clipCount": len(clips),
        "status": "scaffold-not-yet-implemented",
    }
    manifest_path = checkpoint_dir / "training_manifest.json"
    manifest_path.write_text(json.dumps(training_manifest, indent=2))
    voice_profiles_volume.commit()

    return str(checkpoint_dir)


@app.local_entrypoint()
def main(voice_profile_id: str, epochs: int = 10, learning_rate: float = 1e-4):
    checkpoint_path = fine_tune_voice.remote(voice_profile_id, epochs, learning_rate)
    print(f"Checkpoint (scaffold) written to: {checkpoint_path}")
    print(
        "Update the voice profile's fineTunedCheckpoint field to point here "
        "once the actual training loop is implemented."
    )
