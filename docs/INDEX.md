# Documentation index

| Need | Read |
|---|---|
| Install and run the package | [Getting started](guides/GETTING_STARTED.md) |
| Understand repository structure | [Podcast architecture](PODCAST_PROJECT_ARCHITECTURE.md) |
| Create/configure a podcast brand | [Podcast architecture](PODCAST_PROJECT_ARCHITECTURE.md) |
| Intake an authorized voice | [Voice intake](guides/VOICE_INTAKE.md) |
| Configure Chatterbox/Modal | [Modal setup](ops/MODAL_SETUP.md) |
| Add music, beds, stingers or SFX | [Production audio](guides/PRODUCTION_AUDIO.md) |
| Prepare a release candidate | [Production release](ops/PRODUCTION_RELEASE.md) |
| Publish | [Publishing](ops/PUBLISHING.md) |
| Diagnose performance/cost | [Performance guide](performance-guide.md) |
| See historical plans | [Archive](archive/) |

## Current audio stack
Approved script → sentence-aware Chatterbox chunks → content-addressed cache → voice QC → deterministic dialogue edit → cleared music/SFX cue mix → two-pass EBU R128 mastering → WAV master + MP3 delivery → render/provenance manifest → human approval.

The production mixer fails closed when a cue references an asset that is not approved in the show's asset registry.

