# Voice Profile Configs

These JSON files are uploaded to the `underworld-voice-profiles` Modal
Volume at `<voice_profile_id>.json` — they are the runtime copy of the
metadata records under `projects/<project>/voice-profiles/*.json` in this
repo (which track consent) plus the resolved reference-clip paths that
`VoiceSynthesizer` reads at inference time.

## Upload

```bash
modal volume put underworld-voice-profiles \
  modal/config/voice_profiles/voice-eric-nissen-01.json \
  voice-eric-nissen-01.json

modal volume put underworld-voice-profiles \
  path/to/clip1.wav \
  clips/eric-nissen/clip1.wav
```

`VoiceSynthesizer._resolve_reference_audio` refuses to run if
`consent.status != "confirmed"` or `referenceAudio.clips` is empty —
uploading the JSON record alone does not enable synthesis until the
actual clip files are also uploaded and referenced.

## Schema

See `voice-eric-nissen-01.example.json` in this directory for the shape
expected by `modal/app.py`.
