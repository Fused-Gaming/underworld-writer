"""
Underworld Writer — self-generated music/SFX for episode post-production.

Generates the show-identity assets asset-registry.json requires
(insight-corruption/music/theme-main.wav etc.) with open-weight models
instead of licensing stock/library audio, per docs/guides/ASSET_PROCUREMENT.md:

    music (theme, beds)  -> ACE-Step 1.5   (Apache-2.0, unconditional commercial use)
    short SFX (stinger,
    bumper)              -> Stable Audio Open 1.0 (Stability AI Community
                             License: free commercial use for orgs under
                             USD $1M annual revenue; confirm this applies
                             before treating output as cleared)

Neither model's *code* license is the only thing that matters — record the
model name, exact version/revision, prompt, seed, and output checksum in
projects/<show>/production/audio/asset-registry.json as this asset's
provenance, exactly as ASSET_PROCUREMENT.md requires for any other source.
Generation is not clearance: a human must still listen to the result and
flip status to "approved" themselves (docs/guides/PRODUCTION_AUDIO.md step
10). This module never sets status to "approved" on its own.

Design references:
    projects/insight-corruption/production/audio/SOUND_DESIGN_BRIEF.md (specs)
    projects/insight-corruption/production/audio/generation-prompts.json (prompts/seeds)
    projects/insight-corruption/production/audio/asset-registry.json (clearance gate)
    docs/guides/ASSET_PROCUREMENT.md

Usage:
    modal run modal/generate_production_audio.py::main --asset-id ic-stinger-chapter
    modal run modal/generate_production_audio.py::main --asset-id ic-theme-main
"""

import hashlib
import json
import subprocess
import tempfile
from pathlib import Path

import modal

REPO_ROOT = Path(__file__).parent.parent
PROMPTS_PATH = (
    REPO_ROOT / "projects" / "insight-corruption" / "production" / "audio" / "generation-prompts.json"
)
# Committed to Git once generated: these are the show's self-generated
# identity assets, tracked as source alongside their provenance record in
# asset-registry.json, not disposable build output.
DEFAULT_OUT_DIR = REPO_ROOT / "projects" / "insight-corruption" / "production" / "audio" / "generated"

# Both target spec, per SOUND_DESIGN_BRIEF.md: "Request 48 kHz/24-bit WAV
# masters". Neither model is known to natively emit exactly this, so every
# generated clip is reconformed with ffmpeg regardless of native output.
TARGET_SAMPLE_RATE_HZ = 48000
TARGET_CODEC = "pcm_s24le"  # 24-bit PCM

app = modal.App("underworld-production-audio")

# ---------------------------------------------------------------------------
# ACE-Step 1.5 — music (theme, investigation bed, reflection bed)
# ---------------------------------------------------------------------------

music_image = (
    modal.Image.from_registry("nvidia/cuda:13.0.0-cudnn-devel-ubuntu22.04", add_python="3.12")
    .apt_install("git", "ffmpeg")
    .run_commands(
        "git clone --branch v0.1.6 --depth 1 https://github.com/ace-step/ACE-Step-1.5.git /opt/ace-step",
    )
    .uv_pip_install("/opt/ace-step", "hf_transfer==0.1.9", "torchcodec==0.10.0", "torch~=2.10.0")
    .entrypoint([])
    .env({"ACESTEP_PROJECT_ROOT": "/opt/ace-step", "HF_HUB_ENABLE_HF_TRANSFER": "1"})
)

music_checkpoints_dir = "/opt/ace-step/checkpoints"
music_model_cache = modal.Volume.from_name("underworld-ace-step-model-cache", create_if_missing=True)


@app.cls(gpu="l40s", image=music_image, volumes={music_checkpoints_dir: music_model_cache})
class MusicGenerator:
    """Instrumental music generation via ACE-Step 1.5 (Apache-2.0)."""

    @modal.enter()
    def init(self):
        from acestep.handler import AceStepHandler
        from acestep.llm_inference import LLMHandler
        from acestep.model_downloader import ensure_lm_model, ensure_main_model

        lm_model_name = "acestep-5Hz-lm-4B"
        ensure_main_model(checkpoints_dir=music_checkpoints_dir)
        ensure_lm_model(model_name=lm_model_name, checkpoints_dir=music_checkpoints_dir)

        self.dit_handler = AceStepHandler()
        init_status, enable_generate = self.dit_handler.initialize_service(
            project_root="/opt/ace-step",
            config_path="acestep-v15-turbo",
            device="cuda",
        )
        if not enable_generate:
            raise RuntimeError(f"ACE-Step DiT initialization failed: {init_status}")

        self.llm_handler = LLMHandler()
        lm_status, lm_success = self.llm_handler.initialize(
            checkpoint_dir=music_checkpoints_dir,
            lm_model_path=lm_model_name,
            backend="vllm",
            device="cuda",
        )
        if not lm_success:
            raise RuntimeError(f"ACE-Step LM initialization failed: {lm_status}")

    @modal.method()
    def generate(self, prompt: str, duration_s: float, seed: int) -> bytes:
        from acestep.inference import GenerationConfig, GenerationParams, generate_music

        params = GenerationParams(
            caption=prompt,
            lyrics="",
            instrumental=True,
            duration=duration_s,
            # thinking=True hands the caption to the LM, which was found (by
            # actually reading the generation log) to *replace* the caption
            # wholesale rather than just infer missing metadata like BPM/key
            # from it — e.g. a documentary-theme prompt came back conditioned
            # on an unrelated "atmospheric world fusion" caption instead.
            # False uses the caption verbatim as DiT conditioning.
            thinking=False,
        )
        config = GenerationConfig(
            audio_format="wav",
            batch_size=1,
            seeds=[seed],
            use_random_seed=False,
        )
        result = generate_music(
            self.dit_handler,
            self.llm_handler,
            params,
            config,
            save_dir="/dev/shm",
        )
        if not result.success:
            raise RuntimeError(f"ACE-Step generation failed: {result.error}")
        raw_bytes = Path(result.audios[0]["path"]).read_bytes()
        return _conform_wav(raw_bytes)


# ---------------------------------------------------------------------------
# Stable Audio Open 1.0 — short SFX (chapter stinger, midroll bumper)
# ---------------------------------------------------------------------------

sfx_image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("ffmpeg")
    .pip_install(
        "torch==2.6.0",
        "diffusers>=0.30.0",
        "transformers",
        "accelerate",
        "soundfile==0.12.1",
        # StableAudioPipeline's default scheduler (CosineDPMSolverMultistepScheduler)
        # requires this even though diffusers doesn't declare it as a hard
        # dependency — found by actually running it: ImportError at
        # from_pretrained() time, not an install-time failure.
        "torchsde",
    )
)

sfx_model_cache = modal.Volume.from_name("underworld-stable-audio-model-cache", create_if_missing=True)
SFX_MODEL_CACHE_DIR = "/vol/hf-cache"


@app.cls(
    gpu="l4",
    image=sfx_image,
    volumes={SFX_MODEL_CACHE_DIR: sfx_model_cache},
    env={"HF_HOME": SFX_MODEL_CACHE_DIR},
    secrets=[modal.Secret.from_name("huggingface-secret")],
)
class SfxGenerator:
    """Short SFX/stinger generation via Stable Audio Open 1.0.

    Stability AI Community License: free for organizations with less than
    USD $1M in annual revenue (see docs/guides/ASSET_PROCUREMENT.md).
    Confirm that still applies before treating any output as cleared.

    stabilityai/stable-audio-open-1.0 is a GATED model on Hugging Face:
    downloading it (even after accepting the Community License, which is
    free) requires an authenticated request. Before this class can load,
    you must:
      1. Accept the license at
         https://huggingface.co/stabilityai/stable-audio-open-1.0
         (logged in with your Hugging Face account).
      2. Create a Hugging Face access token with read access to that repo:
         https://huggingface.co/settings/tokens
      3. Store it as a Modal secret named exactly "huggingface-secret"
         with key HF_TOKEN:
         modal secret create huggingface-secret HF_TOKEN=<your token>
    Without this, from_pretrained() below fails with
    huggingface_hub.errors.GatedRepoError (401), not a Modal/network issue.
    """

    @modal.enter()
    def init(self):
        import os

        import torch
        from diffusers import StableAudioPipeline

        self.pipe = StableAudioPipeline.from_pretrained(
            "stabilityai/stable-audio-open-1.0",
            torch_dtype=torch.float16,
            token=os.environ["HF_TOKEN"],
        ).to("cuda")

    @modal.method()
    def generate(self, prompt: str, duration_s: float, seed: int, negative_prompt: str = "Low quality, music, melody, speech.") -> bytes:
        import io

        import soundfile as sf
        import torch

        if duration_s > 47.0:
            raise ValueError(
                f"Stable Audio Open 1.0 supports at most ~47s of output; got duration_s={duration_s}. "
                "Use MusicGenerator for anything longer."
            )

        generator = torch.Generator("cuda").manual_seed(seed)
        audio = self.pipe(
            prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=200,
            audio_end_in_s=duration_s,
            num_waveforms_per_prompt=1,
            generator=generator,
        ).audios

        output = audio[0].T.float().cpu().numpy()
        buf = io.BytesIO()
        sf.write(buf, output, self.pipe.vae.sampling_rate, format="WAV")
        return _conform_wav(buf.getvalue())


# ---------------------------------------------------------------------------
# Shared helpers (importable both remotely and from the local entrypoint)
# ---------------------------------------------------------------------------


def _conform_wav(raw_wav_bytes: bytes) -> bytes:
    """Reconform arbitrary WAV bytes to the brief's 48 kHz / 24-bit PCM spec.

    Runs wherever it's called (inside a Modal container or locally) — both
    generator images and the caller's environment need ffmpeg on PATH.
    """
    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / "raw.wav"
        dst = Path(tmp) / "conformed.wav"
        src.write_bytes(raw_wav_bytes)
        subprocess.run(
            [
                "ffmpeg", "-y", "-v", "error",
                "-i", str(src),
                "-ar", str(TARGET_SAMPLE_RATE_HZ),
                "-c:a", TARGET_CODEC,
                str(dst),
            ],
            check=True,
        )
        return dst.read_bytes()


def _load_prompt_entry(asset_id: str) -> dict:
    prompts = json.loads(PROMPTS_PATH.read_text())
    for entry in prompts["assets"]:
        if entry["assetId"] == asset_id:
            return entry
    raise KeyError(
        f"No prompt entry for {asset_id!r} in {PROMPTS_PATH}. "
        f"Known ids: {[e['assetId'] for e in prompts['assets']]}"
    )


@app.local_entrypoint()
def main(asset_id: str, out_dir: str = str(DEFAULT_OUT_DIR)):
    """Generate one required asset and stage it locally for human review.

    This never touches Git, the Modal volume, or asset-registry.json —
    it only writes a local WAV file plus a printed SHA-256 and a
    ready-to-paste registry patch. Listen to the file, and only then
    decide whether to run scripts/sync-modal-production-audio.py and
    hand-edit the registry to "approved".
    """
    entry = _load_prompt_entry(asset_id)
    kind = entry["kind"]
    prompt = entry["prompt"]
    duration_s = entry["durationSeconds"]
    seed = entry["seed"]

    print(f"Generating {asset_id} ({kind}, {duration_s}s, seed={seed}) ...")
    if kind == "music":
        wav_bytes = MusicGenerator().generate.remote(prompt, duration_s, seed)
    elif kind == "sfx":
        wav_bytes = SfxGenerator().generate.remote(prompt, duration_s, seed)
    else:
        raise ValueError(f"Unknown kind {kind!r} for {asset_id}")

    out_path = Path(out_dir) / entry["registryPath"]
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_bytes(wav_bytes)

    digest = hashlib.sha256(wav_bytes).hexdigest()
    print(f"\nWrote {out_path} ({len(wav_bytes)} bytes)")
    print(f"SHA-256: {digest}")
    print("\nListen to this file before doing anything else.")
    print("If it's good, paste this into asset-registry.json for this asset (status still")
    print('needs a human to set it to "approved" — this script will not do that for you):\n')
    print(
        json.dumps(
            {
                "status": "approved",
                "sha256": digest,
                "license": {
                    "type": "self-generated",
                    "model": entry["model"],
                    "modelLicense": entry["modelLicense"],
                    "prompt": prompt,
                    "seed": seed,
                    "durationSeconds": duration_s,
                    "generatedDate": "<fill in — the date a human actually approved this>",
                },
            },
            indent=2,
        )
    )
    print(
        "\n(status is shown as \"approved\" above only as the target end-state of that edit — "
        "make it yourself, after listening, not before.)"
    )
