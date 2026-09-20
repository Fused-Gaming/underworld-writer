# Generated Output

`output/` is the single repository root for generated, producer-facing, and publishable artifacts.

## Structure

```text
output/
├── README.md
├── insight-corruption/
│   ├── README.md
│   ├── SERIES_CONFIG.json
│   ├── production/
│   └── season-1/
│       ├── episode-1/
│       └── … episode-15/
└── examples/
    ├── homeless-lunchbox/
    ├── producer-ready/
    └── solarwinds-episode/
```

## Rules

1. Real series output belongs under `output/<series-slug>/`.
2. Episode output belongs under `output/<series-slug>/season-<n>/episode-<n>/`.
3. Shared production assets belong under `output/<series-slug>/production/`.
4. Sample/demo engine output belongs under `output/examples/`.
5. `projects/` is reserved for source/input material and must not become a second generated-output tree.
6. CLI invocations should pass an explicit `--output` path inside this tree until the CLI gains series/season-aware default path resolution.

This layout prevents generated scripts, producer packets, publishing assets, and production resources from being split across unrelated repository directories.
