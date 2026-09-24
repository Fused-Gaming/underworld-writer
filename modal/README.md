# Modal audio runtime

The `modal/` directory is the production runtime for authorized synthetic narration and deterministic podcast post-production.

## Layout
- `app.py` — orchestration, Modal entrypoints, mastering and delivery export.
- `backends/` — TTS adapters; Chatterbox is current default.
- `audio/segmenter.py` — sentence-aware synthesis chunking.
- `audio/postproduction.py` — semantic cue resolution, asset-clearance gate and music/SFX mixing.
- `generate_production_audio.py` — separate Modal app; self-generates the required music/SFX identity assets (ACE-Step 1.5, Stable Audio Open) instead of licensing stock audio. See `docs/ops/MODAL_PRODUCTION_AUDIO.md`.
- `cache/` — content-addressed chunk cache.
- `config/voice_profiles/` — runtime voice-profile templates.
- `config/render_profiles/` — technical render/mastering defaults.
- `config/production_profiles/` — sound-design policy/bus defaults.
- `config/episodes/` — per-episode runtime bindings.

## Render
The episode config binds script output, speaker voices, production plan, asset registry and output filename. Deploy with Modal, upload the exact authorized voice reference bytes, ensure all production assets are approved and present, then run `generate_episode_audio`.

The runtime fails closed for missing voice consent/reference files and for uncleared production assets. Large audio files belong in Modal/object storage, not Git.

See `docs/guides/VOICE_INTAKE.md`, `docs/guides/PRODUCTION_AUDIO.md`, and `docs/ops/PRODUCTION_RELEASE.md`.

