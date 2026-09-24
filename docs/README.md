# Underworld Writer documentation

Start here if this is your first visit.

## First-time path
1. [Getting started](guides/GETTING_STARTED.md) — install, generate, validate.
2. [Podcast project architecture](PODCAST_PROJECT_ARCHITECTURE.md) — reusable brands, shows and episode packages.
3. [Voice intake](guides/VOICE_INTAKE.md) — consent, provenance, Chatterbox references.
4. [Production audio](guides/PRODUCTION_AUDIO.md) — music, SFX, cue plans and mastering.
5. [Modal setup](ops/MODAL_SETUP.md) — GPU/runtime setup.\n6. [Modal voice sync](ops/MODAL_VOICE_SYNC.md) — repository → persistent voice volume deployment.
7. [Production release](ops/PRODUCTION_RELEASE.md) — release gates and deliverables.
8. [Publishing](ops/PUBLISHING.md) — distribution workflow.

## Core reference
- [Audio generation architecture](AUDIO_GENERATION_PLAN.md)
- [Episode publishing schema](EPISODE_PUBLISHING_SCHEMA.md)
- [Length specifications](LENGTH_SPECIFICATIONS.md)
- [Template length guidance](TEMPLATES_LENGTH.md)
- [Performance guide](performance-guide.md)
- [Use cases](USE_CASES_OVERVIEW.md)

## Repository boundaries
- `src/`: editorial/package engine.
- `projects/`: brand/show source configuration and evidence-backed episode packages.
- `templates/`: reusable editorial templates and dictionaries.
- `modal/`: runtime synthesis, caching, post-production and render configuration.
- `output/`: generated proof/release artifacts; never the authoritative editorial source.
- `assets/`: repository-safe brand assets. Large audio binaries belong in configured storage.
- `docs/archive/`: historical plans and completed migration notes; not current operating guidance.

For podcast work, edit the project package/configuration, regenerate output, pass editorial gates, then render audio. Do not hand-edit generated output as the source of truth.

