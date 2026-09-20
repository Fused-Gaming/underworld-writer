# Agent Workspace Contract

This file is authoritative for every automated agent and human contributor working in this repository.

## Repository boundaries

- `src/` contains software that creates or processes content.
- `projects/<series-slug>/` contains source material: research, evidence, case files, manifests, editorial guidance, authorized voice profiles, and episode editorial packages.
- `output/<series-slug>/` contains generated, producer-facing, publishing, and production artifacts.
- `output/examples/` contains sample/demo output only.

Generated podcast or article artifacts MUST NOT be created outside `output/`.

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
        manifest.json
        assembled-script.md
        segments/
          01-*.md
          02-*.md
      producer-briefs/
      published-assets/
        articles/
          <channel>/
            manifest.json
            article.md
            segments/
      verification/
      provenance/
```

Directories may be empty until used, but agents must not invent competing output roots.

## Episode editorial packages

For evidence-based podcast production, the source of truth is an episode package under:

```text
projects/<series-slug>/episode-packages/season-<n>/episode-<n>.json
```

An episode package may contain:

- a source manifest;
- claim IDs and claim status (`alleged`, `admitted`, `corrected`, `court-outcome`, analysis/context, etc.);
- podcast segment definitions;
- article section definitions; and
- references to reusable editorial templates.

Reusable intros, outros, sponsor/house-ad blocks, disclosures, transitions, article deks, source notes, and calls-to-action live under:

```text
templates/editorial/
```

Case-specific facts MUST NOT be baked into reusable templates.

## Segment-first generation contract

Podcast scripts and articles are generated as composable segments first.

The files below are **derived convenience artifacts**, not the primary authoring surface:

- `scripts/assembled-script.md`
- `published-assets/articles/<channel>/article.md`

Agents MUST NOT make a lasting factual/editorial correction only in an assembled file. Instead:

1. Update the source episode package or reusable template.
2. Regenerate the outputs.
3. Re-run runtime/article-length validation.
4. Review the generated manifest and assembled view.

Generate an editorial package with:

```bash
npm run editorial:generate -- --series <slug> --season <n> --episode <n>
```

Validate without writing files:

```bash
npm run editorial:check -- --series <slug> --season <n> --episode <n>
```

Episode runtime is validated from actual spoken-word count plus fixed-duration blocks. Section timestamps or labels alone are never sufficient proof of runtime.

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

For a release candidate, use:

```bash
npm run validate:release
```

When GitHub Actions are unavailable (for example because hosted-runner billing is disabled), the same commands are the local release contract and their results must be recorded during review.

## Registry and schemas

`output/SERIES_REGISTRY.json` is the source of truth for real podcast series output roots. JSON contracts live in `schemas/podcast/`.

Every generated config must declare a `schemaVersion`. Existing series may be migrated incrementally, but new scaffolds must use the current schema version produced by the tooling.

## Agent-specific instruction files

Agent-specific files such as `CLAUDE.md` and `.github/copilot-instructions.md` are pointers to this contract. If they conflict with this file, `AGENTS.md` wins.
