# Insight Corruption

Season 1 — 15 episodes, single-part format, ~30 minutes each with one 90-second mid-roll.

## Canonical workspace

```text
output/insight-corruption/
├── README.md
├── SERIES_CONFIG.json
├── production/
│   ├── assets/
│   └── voice/
└── season-1/
    ├── SEASON_CONFIG.json
    ├── episode-1/
    │   ├── EPISODE_CONFIG.json
    │   ├── scripts/
    │   │   ├── manifest.json
    │   │   ├── assembled-script.md
    │   │   └── segments/
    │   └── published-assets/
    │       └── articles/
    │           └── linkedin/
    │               ├── manifest.json
    │               ├── article.md
    │               └── segments/
    ├── ...
    └── episode-15/
```

Source/research material remains under `projects/insight-corruption/`; generated and producer-facing artifacts belong here under `output/`.

## Editorial package workflow

Episode-specific source packages live under:

```text
projects/insight-corruption/episode-packages/season-<n>/episode-<n>.json
```

They are the source of truth for sources, claim status, podcast segment bodies, article sections, and reusable-template references.

Generate an episode's podcast and article outputs together:

```bash
npm run editorial:generate -- --series insight-corruption --season 1 --episode 1
```

Validate runtime and article length without writing:

```bash
npm run editorial:check -- --series insight-corruption --season 1 --episode 1
```

The segmented files are authoritative. `assembled-script.md` and `article.md` are generated convenience views for producer/editor review.

## Episode 1 validation reference

Episode 1 is the first fully segment-first production package in the repository.

- **Podcast segments:** 13
- **Scripted words:** 4,092
- **Estimated runtime:** 29.52 minutes at 145 WPM including the fixed 90-second mid-roll
- **Runtime target:** 30 ± 1 minute
- **Runtime validation:** PASS
- **LinkedIn article:** 1,864 words
- **Article target:** 1,800–2,300 words
- **Article validation:** PASS

The Episode 1 package also corrects the old shorthand that treated the original fentanyl allegation as the final offense. The generated editorial package distinguishes the original allegation, the government's testing correction, the tapentadol guilty plea, sentencing arguments, and final sentence.

## Agent workflow

Before creating future seasons or episodes, agents should run:

```bash
npm run agent:preflight
npm run podcast:new-season -- insight-corruption <season-number>
npm run podcast:new-episode -- insight-corruption <season-number> <episode-number>
npm run validate:workspace
```

The authoritative cross-agent repository contract is `/AGENTS.md`.

| Ep | Subject | Working title | Tier |
|----|---------|---------------|------|
| 1 | Joanne Segovia | Police Union Executive Imported Thousands of Opioid Pills — Then Received Probation | 2 |
| 2 | Clarke Howatt | Finance Director Stole $3.9M from Bay Area Housing Fund, Got 1 Year in Prison | 2 |
| 3 | Rodolfo Pada | SF Building Inspector Took Bribes for 14 Years, Served Only 1 Year in Prison | 2 |
| 4 | Ken Wong | SF Parole Officer Got Only 6 Months for $20K Bribery in City Hiring Scheme | 2 |
| 5 | Florence Kong | Contractor Bribed SF Official with $36K Rolex, Got 1 Year Prison + $95K Fine | 2 |
| 6 | Officers Vasquez, Mabanag, Siapno, Hornung | 48 Felonies Against Four Cops: The Riders Scandal | 2 |
| 7 | BART Police Officer | BART Police Officer: Excessive Force, False Reports | 2 |
| 8 | Fire Captain | Fire Captain: Overtime Fraud, Embezzlement | 2 |
| 9 | Parks Director | Parks Director: Grant Fraud, Embezzlement | 2 |
| 10 | Housing Authority Official | Housing Authority Official: Embezzlement | 2 |
| 11 | Eric Richholt | Eric Richholt: Drug Possession, Corruption | 2 |
| 12 | Mark Neely | Mark Neely: Drug Possession, Conspiracy | 2 |
| 13 | Bryan Azevedo | Bryan Azevedo: Corruption | 2 |
| 14 | Harry Hu | Harry Hu: Bribery, Corruption | 2 |
| 15 | (10-case roundup) | The Docket Watch | 2 |

See `PROJECT_MANIFEST.json` in `projects/insight-corruption/` for the full 24-case source library and the resolved/pending split rationale.
