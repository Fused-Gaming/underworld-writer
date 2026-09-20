# Podcast Project Architecture

Underworld Writer is a reusable podcast production engine. No production code should assume a specific show, genre, host, season structure, editorial stance, or publishing brand.

The core hierarchy is:

```text
show -> season -> episode -> render profile -> assets/voices -> render manifest
```

`Insight Corruption` is one configured show using this engine, not the engine itself.

## Design principles

1. **Engine and content are separate.** `src/` and `modal/` implement reusable capabilities. `projects/<show-id>/` contains show-specific identity, editorial rules, seasons, episodes, research, and assets.
2. **Configuration composes by inheritance.** Defaults may be declared at show level, overridden by season, then by episode, then by an explicit render profile.
3. **Episodes are portable packages.** An episode package describes content and production intent without embedding Modal, Chatterbox, storage-provider, or publishing-provider implementation details.
4. **Rendering is reproducible.** Every completed render produces a manifest containing resolved configuration, model/backend versions, voice profile IDs, asset hashes, seeds/parameters, and output metadata.
5. **Branding is data.** Intro/outro, music beds, sonic logo, cover-art references, disclosure language, credits, sponsor formatting, and loudness targets are configuration rather than conditionals in code.
6. **Voices are reusable but consent-scoped.** Voice profiles live independently from episodes and may be referenced by any show only when their consent scope permits it.
7. **Provider boundaries remain replaceable.** Chatterbox is the initial TTS backend and Modal is the initial compute provider. Neither should leak into the canonical show/episode schemas.

## Canonical project layout

```text
projects/
├── _template/
│   ├── show.json
│   ├── seasons/
│   │   └── season-01.json
│   └── episodes/
│       └── s01e01/
│           └── episode.json
└── <show-id>/
    ├── show.json
    ├── brand/
    │   ├── brand.json
    │   ├── artwork/
    │   └── audio/
    ├── voices/
    │   └── voice-bindings.json
    ├── seasons/
    │   └── season-01.json
    ├── episodes/
    │   └── s01e01/
    │       ├── episode.json
    │       ├── script-output.json
    │       ├── sources/
    │       └── production/
    └── renders/
        └── s01e01/
            └── <render-id>/render-manifest.json
```

Existing project folders do not need to migrate immediately. The resolver should support legacy paths while new shows use the canonical layout.

## Configuration resolution

Resolve configuration from least to most specific:

```text
engine defaults
  -> show defaults
  -> brand defaults
  -> season overrides
  -> episode overrides
  -> named render profile
  -> CLI flags
```

The resolved configuration is immutable for a render and is written into the render manifest.

## Show configuration

`show.json` answers: **what show is this?**

Recommended fields:

- `schemaVersion`
- `showId`
- `title`
- `description`
- `language`
- `genre` / `categories`
- `brandRef`
- `defaultRenderProfile`
- `defaultVoiceBindingsRef`
- `editorialProfile`
- `publishing`
- `defaults`

Editorial configuration may include citation requirements, disclosure policy, fact-check gates, tone guidance, explicit-content rules, and source-verification modes. These belong to the show, not the rendering engine.

## Brand configuration

`brand/brand.json` answers: **what should this show sound and look like?**

It may define:

- sonic logo
- intro/outro assets
- transition stings
- background-bed library
- music ducking defaults
- target LUFS / peak ceiling
- cover-art templates
- typography/color references for generated promotional assets
- standard credits
- disclosure language
- sponsor-break treatment

Assets are referenced by logical IDs rather than hard-coded file paths. This permits local files today and object storage/CDN assets later.

## Season configuration

`seasons/season-XX.json` answers: **what changes for this run of episodes?**

Use seasons for:

- season title/theme
- host lineup changes
- release cadence
- episode numbering policy
- season-specific intro/outro
- recurring sponsor slots
- season-specific production defaults
- default render profile override

A show with no meaningful season concept can use a perpetual `season-00` or omit user-facing season numbering while retaining an internal season ID.

## Episode package

`episodes/<episode-id>/episode.json` answers: **what is this episode and how should it be produced?**

Recommended top-level sections:

```json
{
  "schemaVersion": "1.0",
  "episodeId": "s01e01",
  "identity": {},
  "content": {},
  "cast": {},
  "timeline": [],
  "production": {},
  "publishing": {},
  "extensions": {}
}
```

### `identity`

Title, subtitle, season/episode number, slug, description, tags, explicit flag.

### `content`

References the generated script and optional research/source package. The renderer consumes a normalized timeline rather than assuming every episode is pure synthesized narration.

### `cast`

Maps semantic roles such as `host`, `narrator`, `guest:alice`, or fictional character IDs to voice profile IDs or recorded-source IDs.

### `timeline`

The long-term canonical production abstraction. Each item can be one of:

- `speech.generated`
- `speech.recorded`
- `music`
- `sfx`
- `silence`
- `transition`
- `ad.break`
- `chapter.marker`

This enables documentary podcasts, interviews, fiction, roundtables, solo narration, news briefs, and hybrid synthetic/recorded productions without changing the engine.

### `production`

Episode-specific overrides such as render profile, pacing, pauses, pronunciation dictionary, music ducking, segment limits, or mix target.

### `publishing`

Release date, show notes, chapter metadata, artwork override, disclosure text, platform metadata, and destination references.

### `extensions`

Namespaced experimental configuration:

```json
{
  "extensions": {
    "underworld.experimental.someFeature": {}
  }
}
```

Core code must ignore unknown extension namespaces rather than reject the entire episode.

## Render profiles

Render profiles describe **how** to turn an episode package into media. They do not describe the editorial identity of a show.

Examples:

- `podcast-standard`
- `podcast-fast-preview`
- `podcast-high-quality`
- `social-clip`
- `trailer`
- `audiogram`

A profile may choose:

- TTS backend capability (`chatterbox`, later alternatives)
- compute class preference (`cheapest-compatible`, `low-latency`, explicit GPU)
- output format/bitrate/sample rate
- concurrency and retries
- chunking strategy
- LUFS target
- deterministic seed behavior
- caching policy

## Voice bindings

Episodes should reference semantic speakers, not a model implementation.

Example:

```json
{
  "host": "voice-eric-nissen-01",
  "narrator": "voice-eric-nissen-01",
  "guest:example": "recording:guest-example-interview"
}
```

The rendering layer resolves a `voiceProfileId` into consent metadata, reference audio, synthesis backend preferences, and generation defaults.

## Render manifest

Every render should write a manifest such as:

```json
{
  "renderId": "2026-09-20T112233Z-abc123",
  "showId": "example-show",
  "episodeId": "s01e01",
  "resolvedConfig": {},
  "backend": {
    "provider": "modal",
    "tts": "chatterbox",
    "modelVersion": "...",
    "hardware": "T4"
  },
  "inputs": [],
  "outputs": [],
  "timings": {},
  "cost": {},
  "qualityChecks": {}
}
```

This is the basis for retries, comparisons, cost tracking, auditability, and future re-rendering.

## CLI contract

The CLI should operate on generic show/episode IDs:

```bash
python modal/cli.py scaffold show my-new-show --title "My New Show"
python modal/cli.py validate projects/my-new-show
python modal/cli.py render my-new-show s01e01 --profile podcast-standard
python modal/cli.py deploy
```

Commands must never require an Insight Corruption-specific path or field.

## Modal/MCP boundary

Modal is an execution provider. Agent tooling may manage deployment and volumes through the Modal MCP server, while the Underworld CLI remains the stable user-facing contract.

This lets Codex/Claude/Cursor perform operational tasks without making episode configuration depend on MCP or Modal.

## Migration strategy for Insight Corruption

Do not destroy the existing `PROJECT_MANIFEST.json`. Treat it as legacy source metadata and progressively add:

1. `projects/insight-corruption/show.json`
2. `projects/insight-corruption/brand/brand.json`
3. season files
4. canonical episode packages as episodes are rendered/revised

The existing manifest can remain the research/source catalog until migration is complete.
