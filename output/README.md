# Generated Output

`output/` is the single repository root for generated, producer-facing, and publishable artifacts.

## Structure

```text
output/
├── README.md
├── SERIES_REGISTRY.json
├── insight-corruption/
│   ├── README.md
│   ├── SERIES_CONFIG.json
│   ├── production/
│   └── season-1/
│       ├── SEASON_CONFIG.json
│       ├── episode-1/
│       └── … episode-15/
└── examples/
    ├── homeless-lunchbox/
    ├── producer-ready/
    └── solarwinds-episode/
```

## Rules

1. Real series output belongs under `output/<series-slug>/`.
2. Every real series must be registered in `output/SERIES_REGISTRY.json`.
3. Episode output belongs under `output/<series-slug>/season-<n>/episode-<n>/`.
4. Shared production assets belong under `output/<series-slug>/production/`.
5. Sample/demo engine output belongs under `output/examples/`.
6. `projects/` is reserved for source/input material and must not become a second generated-output tree.
7. Agents must scaffold new work through the workspace commands instead of inventing directories.
8. Raw CLI generation must use an explicit `--output` path inside the canonical `output/` tree.

## Agent workflow

```bash
npm run agent:preflight
npm run podcast:new-series -- <slug> "Series Title"
npm run podcast:new-season -- <slug> <season-number>
npm run podcast:new-episode -- <slug> <season-number> <episode-number>
npm run validate:workspace
```

The authoritative cross-agent policy is `/AGENTS.md`. Agent-specific instruction files should point to that contract rather than maintaining independent directory rules.

JSON contracts are versioned under `schemas/podcast/` and generated configs declare a `schemaVersion`.

This layout prevents generated scripts, producer packets, publishing assets, and production resources from being split across unrelated repository directories.
