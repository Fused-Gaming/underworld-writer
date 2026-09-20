# Insight Corruption Podcast Project

## Bay Area Government Corruption Investigation Series

**Brand:** Insight Corruption (formerly "Corruption Insight" - renamed 2026-09-15)  
**Region:** California Bay Area  
**Project status:** Season 1 complete — canonical generated output lives in `output/insight-corruption/`

---

## Project Overview

**Insight Corruption** is an investigative true-crime podcast series covering Bay Area government-corruption cases. Season 1 is 15 episodes, single-part format, 30 minutes each plus one 90-second mid-roll sponsor break.

Unlike the original 5-case pilot, Season 1 draws on all 24 case files compiled in `projects/insight-corruption/characters/` (5 original + 19 added in the "Oakland expansion") — but only 14 of those 24 have a resolved legal outcome. The other 10 are indicted, under investigation, or awaiting sentencing. Rather than narrate an unresolved case as though it fit the show's "how they got away with it" premise, those 10 became a dedicated Episode 15 ("The Docket Watch") with presumption-of-innocence framing throughout. See `projects/insight-corruption/PROJECT_MANIFEST.json` (`seasonOneStatus` field) for the exact split.

## Repository boundary

There is one output root: `output/`.

- `projects/insight-corruption/` is **input/source material only**: case files, project manifest, producer guide, and voice profile definitions.
- `output/insight-corruption/` is **all generated and producer-facing series output**: episode configs, scripts, briefs, publishing assets, verification reports, production assets, and voice-generation documentation.
- `output/examples/` contains non-canonical sample/demo output from the engine.
- Do not create new generated episode directories under `projects/` or at the repository root.

The former `projects/corruption-insight/` generated tree was consolidated into `output/insight-corruption/`. Its episode planning records are preserved under each corresponding episode's `planning/legacy-corruption-insight/` directory and its social assets are under `output/insight-corruption/production/assets/`.

## Where everything lives

| What | Location |
|------|----------|
| Source case files (24) | `projects/insight-corruption/characters/` (+ `oakland-cases/` subfolder) |
| Project manifest / source catalog | `projects/insight-corruption/PROJECT_MANIFEST.json` |
| Producer source guide | `projects/insight-corruption/PRODUCER_GUIDE.md` |
| Voice profile definitions | `projects/insight-corruption/voice-profiles/` |
| Series config | `output/insight-corruption/SERIES_CONFIG.json` |
| Episodes 1-15 | `output/insight-corruption/season-1/episode-1/` … `episode-15/` |
| Brand / social production assets | `output/insight-corruption/production/assets/` |
| Voice production specification | `output/insight-corruption/production/voice/` |
| Non-canonical sample output | `output/examples/` |
| Workspace validation | `node scripts/validate-insight-corruption.mjs` |

## Generating a script via the CLI

Always point CLI output into the canonical episode tree rather than allowing an ad-hoc root-level output file:

```bash
npm run build
node dist/cli.js generate-script \
  --character projects/insight-corruption/characters/joanne-segovia-case.json \
  --format single \
  --output output/insight-corruption/season-1/episode-1/scripts/generated-draft.md
```

For producer formatting, use the same episode directory as the destination root rather than `podcast-output/` or another top-level working directory.

**Known limitation:** the CLI's `ScriptGenerator` produces a fixed-length script (currently ~9 minutes for `--format single`) and does not read the `length`/`sponsorBreaks` block in `EPISODE_CONFIG.json`. It cannot generate a 30-minute episode directly. Episodes 1-15 under `output/insight-corruption/` were written by hand to the documented directory structure to hit the actual requested runtime — the CLI output is useful as a fact-checked first draft of the narration segments, not as a finished episode. See `output/insight-corruption/season-1/episode-1/producer-briefs/brief.md` for how the runtime gap is handled without fabricating content.

## Verification status

Every episode's facts trace back to its case file's own `sources` and `verification_status` fields — see each episode's `scripts/script.md` footer and `producer-briefs/brief.md` for the tier breakdown. Sentencing/case status can change after this repository's data was compiled; re-verify before airing, especially for Episode 15's pending cases.

---

*Last updated: 2026-09-20, during output-tree consolidation.*
