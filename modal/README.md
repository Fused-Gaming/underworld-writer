# Modal.com Audio Generation

Implementation of [`docs/AUDIO_GENERATION_PLAN.md`](../docs/AUDIO_GENERATION_PLAN.md).
Turns a `ScriptOutput` (text, from `ScriptGenerator`) into a mixed episode
audio file using Hugging Face voice-cloning models (XTTS-v2 by default),
one trained/cloned voice profile per host/character.

## Setup

### Step 1: Install Modal CLI

```bash
pip install -r modal/requirements.txt
```

### Step 2: Authenticate with Modal

Create a Modal account at [modal.com](https://modal.com) if you don't have one.

**Option A: Interactive setup (recommended for first-time configuration)**
```bash
modal setup   # opens browser to authenticate and saves credentials locally
```

**Option B: Environment variables (for CI/remote environments)**

In Claude Code (this project), credentials are configured via `.claude/settings.json`:

```json
{
  "env": {
    "MODAL_TOKEN_ID": "your-token-id-here",
    "MODAL_TOKEN_SECRET": "your-token-secret-here"
  }
}
```

To obtain these credentials:
1. Log into Modal at https://modal.com
2. Go to Settings → Tokens
3. Create a new token or copy your existing token ID and secret
4. Update `.claude/settings.json` with these values (see `.claude/settings.json` template)

**Never commit `.claude/settings.json` with real credentials.** Use `.claude/settings.local.json` for local-only overrides (already in `.gitignore`).

## Files

| File | Purpose |
|---|---|
| `app.py` | Modal app: `VoiceSynthesizer` (GPU inference class), `assemble_episode` (CPU audio editing), `generate_episode_audio` (entrypoint) |
| `train_voice.py` | Optional LoRA fine-tuning, only needed if zero-shot cloning quality is insufficient for a recurring voice |
| `config/voice_profiles/` | Per-voice-actor config uploaded to the `underworld-voice-profiles` volume |
| `config/episodes/` | Per-episode run config: which `ScriptOutput` + which voice profile per speaker |

## Deploy the app

```bash
modal deploy modal/app.py
```

## Voice profile intake (once per host/character)

1. Confirm consent — see `docs/AUDIO_GENERATION_PLAN.md` §6a and the
   per-project record, e.g.
   `projects/insight-corruption/voice-profiles/eric-william-nissen.json`.
2. Copy `config/voice_profiles/voice-eric-nissen-01.example.json` to a real
   file, fill in the actual reference clip path(s).
3. Upload the config and clips to the Modal Volume:
   ```bash
   modal volume put underworld-voice-profiles config/voice_profiles/voice-eric-nissen-01.json voice-eric-nissen-01.json
   modal volume put underworld-voice-profiles path/to/clip1.wav clips/eric-nissen/clip1.wav
   ```
4. (Optional, only if zero-shot quality is insufficient) fine-tune:
   ```bash
   modal run modal/train_voice.py --voice-profile-id voice-eric-nissen-01
   ```

## Render an episode

1. Generate the episode's `ScriptOutput` via the existing CLI/MCP tooling
   (`npx underworld-writer generate-script ...`).
2. Copy `config/episodes/insight-corruption-ep01.example.json` to a real
   file pointing at that `ScriptOutput` and the voice profiles per speaker.
3. Run:
   ```bash
   modal run modal/app.py::generate_episode_audio --episode-config modal/config/episodes/insight-corruption-ep01.json
   ```
4. Download the rendered file from the `underworld-episode-output` volume:
   ```bash
   modal volume get underworld-episode-output insight-corruption-ep01.wav .
   ```

## Notes

- `VoiceSynthesizer` refuses to synthesize for a voice profile without a
  confirmed consent record or without uploaded reference clips — this is
  enforced in code, not just documentation.
- `train_voice.py` is currently a scaffold (writes a training manifest,
  not a real fine-tuning loop) — wire in the actual XTTS-v2/F5-TTS
  training recipe before relying on it for a real fine-tune.
