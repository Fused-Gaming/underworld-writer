# Modal.com Audio Generation — Setup Guide

This project uses [Modal.com](https://modal.com) for GPU-accelerated audio generation using Hugging Face voice-cloning models (XTTS-v2).

## Current Status

✅ **Modal CLI installed** (v1.5.5)  
✅ **Audio generation app ready** (`modal/app.py`)  
✅ **Voice profile templates available** (`modal/config/voice_profiles/`)  
⏳ **Awaiting authentication**

## Quick Start

### Step 1: Get Modal Credentials

1. Sign up at [modal.com](https://modal.com) (free tier available)
2. Go to **Settings → Tokens**
3. Create a new token or copy your existing token ID and secret

### Step 2: Authenticate with Modal CLI

```bash
modal setup
```

This opens your browser to authenticate. Your credentials are saved locally at `~/.modal/config.toml`.

### Step 3: Verify Setup

```bash
bash scripts/setup-modal.sh
```

This script verifies:
- ✓ Modal CLI is installed
- ✓ Your credentials are configured
- ✓ The app is ready to deploy

### Step 4: Deploy the Audio App

```bash
modal deploy modal/app.py
```

This deploys the `underworld-audio` app to Modal's cloud, creating:
- **underworld-voice-profiles** volume for voice reference audio
- **underworld-episode-output** volume for rendered audio files

## Generate Episode Audio

Once deployed, you can generate audio for any episode:

### 1. Generate the Script

```bash
npm run editorial:generate -- --series insight-corruption --season 1 --episode 1
```

This creates: `output/insight-corruption/season-1/episode-1/scripts/assembled-script.md`

### 2. Create Episode Configuration

Copy and edit the example:

```bash
cp modal/config/episodes/insight-corruption-ep01.example.json \
   modal/config/episodes/insight-corruption-ep01.json
```

Then update `insight-corruption-ep01.json` with:
- `scriptOutputPath`: Path to the generated script output JSON
- `speakerVoiceProfiles`: Map speaker names to voice profiles (see step 3 below)
- `introBedPath` / `outroBedPath`: Path to intro/outro audio files (optional)

### 3. Configure Voice Profiles

#### Create a Voice Profile (Once Per Actor)

```bash
cp modal/config/voice_profiles/voice-eric-nissen-01.example.json \
   modal/config/voice_profiles/voice-eric-nissen-01.json
```

Update the profile with:
- Reference audio clips (10-30 seconds of clear speech)
- Consent status (must be `"confirmed"`)
- Language and model details

#### Upload to Modal

```bash
# Upload the voice profile config
modal volume put underworld-voice-profiles \
  modal/config/voice_profiles/voice-eric-nissen-01.json \
  voice-eric-nissen-01.json

# Upload the reference audio clips
modal volume put underworld-voice-profiles \
  path/to/clip1.wav \
  clips/eric-nissen/clip1.wav
```

Verify uploads:
```bash
modal volume ls underworld-voice-profiles
```

### 4. Run Audio Generation

```bash
modal run modal/app.py::generate_episode_audio \
  --episode-config modal/config/episodes/insight-corruption-ep01.json
```

The app will:
1. Load the TTS model (XTTS-v2) on a GPU (A10G)
2. Synthesize each segment in the speaker's voice
3. Mix audio with intro/outro beds
4. Apply crossfades and loudness normalization
5. Save the final WAV file to the `underworld-episode-output` volume

### 5. Download the Audio

```bash
modal volume get underworld-episode-output insight-corruption-ep01.wav .
```

## Voice Profile Details

### Consent & Ethics

The `VoiceSynthesizer` class enforces consent verification:
- Each voice profile must have `"consent": { "status": "confirmed" }`
- Reference audio clips must be sourced ethically (published content, explicit permission, etc.)
- See `projects/<series-slug>/voice-profiles/` for consent records

### Fine-Tuning (Optional)

For better voice quality with recurring hosts, optionally fine-tune:

```bash
modal run modal/train_voice.py --voice-profile-id voice-eric-nissen-01
```

Once complete, update the voice profile's `fineTunedCheckpoint` field.

## Troubleshooting

### `modal setup` fails

If the browser doesn't open or authentication fails:

1. Visit https://modal.com/settings/tokens manually
2. Create a token
3. Set environment variables:
   ```bash
   export MODAL_TOKEN_ID="your-token-id"
   export MODAL_TOKEN_SECRET="your-token-secret"
   ```

### Voice profile not found

Make sure the profile is uploaded to the Modal volume:

```bash
# List what's in the volume
modal volume ls underworld-voice-profiles

# Check the expected path
modal volume get underworld-voice-profiles voice-eric-nissen-01.json -
```

### Deployment fails

Check the app logs:

```bash
modal app logs underworld-audio
```

## Architecture

```
Underworld Writer Script
        ↓
modal/app.py
├─ VoiceSynthesizer (GPU inference)
│  └─ TTS.api.TTS ("tts_models/multilingual/multi-dataset/xtts_v2")
├─ assemble_episode (CPU audio editing)
│  └─ ffmpeg/pydub for mixing, crossfades, normalization
└─ generate_episode_audio (entrypoint)
   └─ Returns rendered audio from underworld-episode-output volume
```

**Model**: Coqui XTTS-v2 (open-weight multilingual voice cloning)  
**Hardware**: A10G GPU (suitable for inference on 10-30s reference clips)  
**Storage**: Modal Volumes (underworld-voice-profiles, underworld-episode-output)

## Reference

- [Modal Documentation](https://modal.com/docs)
- [AUDIO_GENERATION_PLAN.md](docs/AUDIO_GENERATION_PLAN.md)
- [modal/README.md](modal/README.md)
- [XTTS-v2 on Hugging Face](https://huggingface.co/coqui/XTTS-v2)
