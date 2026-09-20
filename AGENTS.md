# Agent Workspace Contract

This file is authoritative for every automated agent and human contributor working in this repository.

## Repository boundaries

- `src/` contains software that creates or processes content.
- `projects/<series-slug>/` contains source material: research, evidence, case files, manifests, editorial guidance, and authorized voice profiles.
- `output/<series-slug>/` contains generated, producer-facing, publishing, and production artifacts.
- `output/examples/` contains sample/demo output only.

Generated podcast artifacts MUST NOT be created outside `output/`.

## Canonical podcast layout

```text
output/<series-slug>/
  SERIES_CONFIG.json
  README.md
  production/
    assets/
    audio/
    publishing/
    voice/
  season-<n>/
    SEASON_CONFIG.json
    episode-<n>/
      EPISODE_CONFIG.json
      README.md
      planning/
      scripts/
      producer-briefs/
      published-assets/
      verification/
      provenance/
```

Directories may be empty until used, but agents must not invent competing output roots.

## Forbidden generated-output locations

Do not create or restore:

- `/podcast-output/`
- `/generated-output/`
- `/producer-ready/`
- `/guest-handoff/`
- `/generated-script.md`
- `projects/*/episodes/` for generated episode artifacts
- unregistered series directories directly beneath `output/`

## Required workflow

Before creating or modifying podcast output:

```bash
npm run agent:preflight
```

Create workspace structure through the scaffold commands instead of hand-building directories:

```bash
npm run podcast:new-series -- <slug> "Series Title"
npm run podcast:new-season -- <slug> <season-number>
npm run podcast:new-episode -- <slug> <season-number> <episode-number>
```

Before committing or declaring work complete:

```bash
npm run validate:workspace
```

CI runs the same validation and must pass before merge.

## Registry and schemas

`output/SERIES_REGISTRY.json` is the source of truth for real podcast series output roots. JSON contracts live in `schemas/podcast/`.

Every generated config must declare a `schemaVersion`. Existing series may be migrated incrementally, but new scaffolds must use the current schema version produced by the tooling.

## Agent-specific instruction files

Agent-specific files such as `CLAUDE.md` and `.github/copilot-instructions.md` are pointers to this contract. If they conflict with this file, `AGENTS.md` wins.
