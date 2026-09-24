# Episode Run Configs

One JSON file per episode, passed to `generate_episode_audio` in
`modal/app.py`. Each config points at a `ScriptOutput` JSON (produced by
`ScriptGenerator`, see `src/podcast-script-generator.ts`) and maps each
segment `speaker` value to a voice profile id.

## Run

```bash
modal run modal/app.py::generate_episode_audio \
  --episode-config config/episodes/insight-corruption-ep01.json
```

## Schema

```jsonc
{
  "scriptOutputPath": "path to a ScriptOutput JSON on disk or a mounted volume",
  "speakerVoiceProfiles": {
    // ScriptSegment.speaker values ('narrator' | 'guest' | 'both') map to
    // a voiceProfileId uploaded to the underworld-voice-profiles volume
    "narrator": "voice-eric-nissen-01",
    "guest": "voice-<guest-profile-id>"
  },
  "episodeMeta": {
    "pauseAfterSegment": { "0": true, "3": true } // segment index -> insert pause
  },
  "introBedPath": "optional path to an intro music bed (not model-generated)",
  "outroBedPath": "optional path to an outro music bed",
  "outputFileName": "insight-corruption-ep01.wav"
}
```
