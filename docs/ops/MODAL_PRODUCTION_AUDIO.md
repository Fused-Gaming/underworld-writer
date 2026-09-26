# Modal production-audio generation

Insight Corruption's music/SFX identity assets are self-generated with open-weight
models on Modal rather than licensed from a stock library — see
`docs/guides/ASSET_PROCUREMENT.md` for why and under what license terms.

This is a **separate Modal app** (`underworld-production-audio`) from the
narration app in `modal/app.py` (`underworld-audio`): different, heavier
dependencies (ACE-Step 1.5's own CUDA image, `diffusers`/Stable Audio Open),
so it doesn't bloat the Chatterbox narration image.

## One-time setup: Hugging Face access for Stable Audio Open

`stabilityai/stable-audio-open-1.0` is a **gated** Hugging Face model — the
Community License is free, but downloading the weights still requires an
authenticated, license-accepted request. Discovered by actually running
this: it fails with `huggingface_hub.errors.GatedRepoError` (401), not a
Modal or network error, until this is done once:

1. Accept the license at
   [huggingface.co/stabilityai/stable-audio-open-1.0](https://huggingface.co/stabilityai/stable-audio-open-1.0)
   while logged in to a Hugging Face account.
2. Create an access token with read access to that repo at
   [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
3. Store it as a Modal secret named exactly `huggingface-secret` with key
   `HF_TOKEN`:
   ```sh
   modal secret create huggingface-secret HF_TOKEN=<your token>
   ```

ACE-Step 1.5 (the music model) does not appear to require this — its
weights download without authentication.

## Workflow

1. **Generate one asset and stage it locally for review:**

   ```sh
   modal run modal/generate_production_audio.py::main --asset-id ic-stinger-chapter
   ```

   This reads the prompt/seed for that asset from
   `projects/insight-corruption/production/audio/generation-prompts.json`,
   runs the matching model (ACE-Step 1.5 for `kind: "music"`, Stable Audio
   Open for `kind: "sfx"`), reconforms the output to 48 kHz/24-bit WAV, and
   writes it under `projects/insight-corruption/production/audio/generated/`
   (committed to Git once approved, alongside its provenance record). It
   prints the file's SHA-256 and a ready-to-paste `asset-registry.json`
   patch.

2. **Listen to the file.** This step is not optional and nothing in this
   pipeline does it for you. Check it against the brief
   (`projects/insight-corruption/production/audio/SOUND_DESIGN_BRIEF.md`)
   and the editorial-restraint rules
   (`modal/config/production_profiles/investigative-documentary.json`).
   If it's not right, adjust the prompt or try a new seed in
   `generation-prompts.json` and regenerate — don't hand-edit the audio to
   paper over a bad take and keep the old prompt/seed as if it were accurate.

3. **If approved**, hand-edit
   `projects/insight-corruption/production/audio/asset-registry.json`:
   set that asset's `status` to `"approved"` and paste in the printed
   `sha256`/`license` block (the `license` field carries this asset's
   provenance record: model, version, prompt, seed, generated date — the
   same field a purchased asset's license/receipt would occupy).

4. **Sync approved assets to the Modal volume:**

   ```sh
   modal run scripts/sync-modal-production-audio.py --show insight-corruption
   ```

   This fails closed exactly like `scripts/sync-modal-voice-profiles.py`:
   it only uploads assets whose registry `status` is `"approved"`, whose
   locally staged file's SHA-256 matches the registry's recorded value, and
   which have a non-empty `license` record. A missing file, a checksum
   mismatch, or an asset still `required-not-procured` stops the sync.

5. Once all five required assets are `approved` and synced, `npm run
   generate:episode-audio` (`modal/app.py`) can resolve them via
   `validate_asset_clearance()` in `modal/audio/postproduction.py`.

## Models in use

| Purpose | Model | License | Commercial terms |
| --- | --- | --- | --- |
| Music (theme, beds) | [ACE-Step 1.5](https://github.com/ace-step/ACE-Step-1.5) | Apache-2.0 | Unconditional |
| Short SFX (stinger, bumper) | [Stable Audio Open 1.0](https://huggingface.co/stabilityai/stable-audio-open-1.0) | Stability AI Community License | Free under USD $1M annual revenue; Enterprise license required above that |

Re-verify the Stable Audio Open revenue threshold against Stability AI's
current license terms before relying on it — license terms for hosted
model providers change.

## Known gaps (not yet automated)

- **Stems and cutdowns for the theme.** The brief wants the ~75s master
  plus separate stems and 15/30s cutdowns; this pipeline only generates
  the single master. Stems/cutdowns are a manual follow-up once the master
  itself is approved (see that asset's `followUp` note in
  `generation-prompts.json`).
- **Seamless-loop verification for the beds.** ACE-Step is not guaranteed
  to produce a clean loop point at the exact requested duration. Listen
  for a seam at the loop boundary; if there is one, crossfade-loop or trim
  to a cleanly loopable region before approving.
