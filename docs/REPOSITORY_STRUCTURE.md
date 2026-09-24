# Repository structure

```text
src/                         product/editorial engine
scripts/                     CLI validation/generation utilities
templates/                   reusable editorial templates/dictionaries
projects/<show>/              authoritative show configuration
  brand/                     visual/editorial brand
  episode-packages/          source-backed episode inputs
  voice-profiles/            consent/provenance + synthesis behavior
  voices/                    logical speaker -> profile bindings
  production/audio/          asset registry, sound brief, episode cue plans
modal/                       cloud audio runtime
  backends/                  TTS adapters
  audio/                     segmentation + deterministic post-production
  cache/                     chunk cache
  config/                    runtime/render/production profiles
output/                      generated proofs/releases, never source-of-truth
assets/                      repository-safe shared assets
docs/                        current guides/reference
docs/archive/                historical/completed plans
```

## Placement rules
Generic capability belongs in `src/` or `modal/`. Show-specific decisions belong in `projects/<show>/`. Generated artifacts belong in `output/`. Historical implementation plans belong in `docs/archive/`. Large voice/music/master binaries stay out of Git unless intentionally versioned.

Do not put Eric/Insight Corruption assumptions into generic mixer code. Do not hand-edit generated output when the same change can be expressed in the episode package/template/config.

