# Insight Corruption — Season 1 Episode 18

**Episode:** Elizabeth Williams & Insight Housing: The Paper Trail  
**Tracking issue:** #148  
**Status:** studio-prep

## Production files

- `EPISODE_CONFIG.json` — editorial/runtime/source configuration
- `scripts/script.md` — full human-readable recording script
- `script-output.json` — `ScriptOutput` payload consumed by the Modal studio renderer
- `producer-briefs/brief.md` — source tiers, risk notes, right-of-reply questions
- `published-assets/article.md` — long-form companion article draft
- `modal/config/episodes/insight-corruption-ep18.json` — audio render configuration

## Studio render

From the repository root, using the existing Modal environment/voice volume:

```bash
modal run modal/app.py::generate_episode_audio \
  --episode-config config/episodes/insight-corruption-ep18.json
```

Run from `modal/` if the current studio command expects episode configs relative to that directory, consistent with `modal/config/episodes/README.md`.

Expected output:

```text
insight-corruption-ep18.wav
```

Voice profile:

```text
voice-eric-nissen-01
```

## Editorial gate before publication

The studio script is intentionally safe to render now because unresolved ACCELA/fire/payment-ledger claims are framed as questions or attributed allegations rather than established facts.

**2026-09-26 update:** Issue #148 received a follow-up comment with an ACCELA link, a NextRequest link, a 2018 Indybay article, and a YouTube video. Research from those links (plus press coverage of the PEC's final decision) has been folded into `EPISODE_CONFIG.json`, `script-output.json` (attributions, missingFacts, Segment 2 narration), `scripts/script.md`, `published-assets/article.md`, and the producer brief — see each file's new/updated sections for details. Key additions: the Commission's final $309,600 fine / 47-violation count, the Espinosa-as-Williams's-contractor conflict, a second inspector (Anthony Harbaugh, $55,000 fine), direct confirmation of ACCELA Case No. 2600830 at the placement property, and the *Judge Faith* small-claims arbitration (*Johnson v. Williams*) where tenant Danielle Johnson — the same tenant named in the 2018 Indybay article, at a different property — won a $1,525 habitability judgment against Williams. The 732 Apgar Street fire account and the exact Williams-to-Espinosa payment total remain single-sourced/unreconciled; NextRequest 26-7112 still needs direct review.

**Article regenerated (2026-09-26):** `published-assets/article.md` has been rewritten as a single integrated pass rather than a base article with bolted-on "what later reporting adds" sections — the final fine/violation count, the contractor-conflict payments, Harbaugh, the confirmed ACCELA case, and the *Judge Faith*/Danielle Johnson corroboration are now woven into the main narrative in source-tier order, and the right-of-reply and sources sections were updated to include Harbaugh and the pending Johnson witness outreach.

**Runtime widened, not trimmed:** folding all of the above into Segment 2's spoken narration (344 → 733 words, at this episode's ~1 word/second hand-timed convention) added about 6:28 of runtime rather than being cut for time. Segment 2's duration and every downstream segment's timestamp in `scripts/script.md` and `script-output.json` have been recomputed accordingly, and `EPISODE_CONFIG.json`'s duration targets were widened (part/total target 30→36.5 min, max 32→40 min) to match. New runtime: **~36:28** including the 90-second mid-roll.

Before **publication**:

1. Incorporate any material right-of-reply response from Elizabeth Williams, Insight Housing, Anthony Harbaugh, or SSVF oversight.
2. Reconcile direct ACCELA/code/fire records if obtained (ACCELA Case 2600830 confirmed; full history still needed).
3. Reconcile the complete SSVF payment ledger if obtained.
4. Reconcile the Commission's final written decision against the "43 vs. 47 violations" and "$176,000 vs. ~$112,000" discrepancies currently attributed only to press coverage.
5. Review NextRequest 26-7112 status (YouTube video now reviewed — see producer brief).
6. Re-run `npm run editorial:check` and re-render audio — timestamps/durations have been recomputed by hand to match the new narration, but the actual audio has not been re-rendered against the updated script.

## Child issues

- #162 — Script Framing
- #163 — Sponsor Break
- #164 — Producer Brief & Source Handoff
- #165 — Publication Pipeline
- #166 — Audio Render
- #167 — Scheduling & Air Date
