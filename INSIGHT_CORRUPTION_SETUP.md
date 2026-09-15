# Insight Corruption Podcast Project

## Bay Area Government Corruption Investigation Series

**Brand:** Insight Corruption (formerly "Corruption Insight" - renamed 2026-09-15)
**Region:** California Bay Area
**Project status:** Season 1 complete — see `output/insight-corruption/`

---

## Project Overview

**Insight Corruption** is an investigative true-crime podcast series covering
Bay Area government-corruption cases. Season 1 is 15 episodes, single-part
format, 30 minutes each plus one 90-second mid-roll sponsor break.

Unlike the original 5-case pilot, Season 1 draws on all 24 case files compiled
in `projects/insight-corruption/characters/` (5 original + 19 added in the
"Oakland expansion") — but only 14 of those 24 have a resolved legal outcome.
The other 10 are indicted, under investigation, or awaiting sentencing. Rather
than narrate an unresolved case as though it fit the show's "how they got away
with it" premise, those 10 became a dedicated Episode 15 ("The Docket Watch")
with presumption-of-innocence framing throughout. See
`projects/insight-corruption/PROJECT_MANIFEST.json` (`seasonOneStatus` field)
for the exact split.

## Where everything lives

| What | Location |
|------|----------|
| Source case files (24) | `projects/insight-corruption/characters/` (+ `oakland-cases/` subfolder) |
| Series config | `output/insight-corruption/SERIES_CONFIG.json` |
| Episodes 1-15 (config, script, producer brief, README each) | `output/insight-corruption/season-1/episode-1/` … `episode-15/` |
| Producer quick-reference (Episodes 1-5 guest angles) | `projects/insight-corruption/PRODUCER_GUIDE.md` |
| Workspace validation | `node scripts/validate-insight-corruption.mjs` |

## Generating a script via the CLI

```bash
npm run build
node dist/cli.js generate-script --character projects/insight-corruption/characters/joanne-segovia-case.json --format single
```

**Known limitation:** the CLI's `ScriptGenerator` produces a fixed-length
script (currently ~9 minutes for `--format single`) and does not read the
`length`/`sponsorBreaks` block in `EPISODE_CONFIG.json`. It cannot generate a
30-minute episode directly. Episodes 1-15 under `output/insight-corruption/`
were written by hand to the documented directory structure to hit the actual
requested runtime — the CLI output is useful as a fact-checked first draft of
the narration segments, not as a finished episode. See
`output/insight-corruption/season-1/episode-1/producer-briefs/brief.md` for
how the runtime gap is handled without fabricating content.

## Verification status

Every episode's facts trace back to its case file's own `sources` and
`verification_status` fields — see each episode's `scripts/script.md` footer
and `producer-briefs/brief.md` for the tier breakdown. Sentencing/case status
can change after this repository's data was compiled; re-verify before airing,
especially for Episode 15's pending cases.

---

*Last updated: 2026-09-15, as part of a package-consistency review.*
