# Modal voice-reference sync

Voice references are deployed **from the repository checkout to the persistent Modal volume**, not baked into the Chatterbox image.

## Why
The Dockerfile validates the Node package. Modal's Python image is declared in `modal/app.py`. Voice WAVs are runtime data: keeping them in `underworld-voice-profiles` prevents immutable image layers from retaining old voice material and lets a reference update occur without rebuilding the large ML image.

## Repository layout
`projects/<show>/production/voice/references/<clip.path>` mirrors the `clip.path` stored in the voice profile.

For Eric, add the three already-derived WAVs beneath:
`projects/insight-corruption/production/voice/references/clips/eric-nissen/`.

## Deployment
Run:

```sh
./scripts/deploy-modal-audio.sh insight-corruption
```

The script:
1. builds the Docker validator target;
2. runs `scripts/sync-modal-voice-profiles.py`;
3. checks confirmed consent and every expected SHA-256;
4. copies the exact repository bytes into `underworld-voice-profiles`;
5. commits/verifies the Modal volume;
6. deploys `modal/app.py`.

The deploy fails before synthesis if a WAV is missing or its bytes do not match the profile record.

