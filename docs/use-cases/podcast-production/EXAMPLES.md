# Real-World Examples

Two complete example series, built end-to-end through this use case's documented
workflow (Series Framework → Episode Development → Guest Coordination), live under
`output/` in this repository. Both were built as a consistency test of this package
and are referenced here instead of restating their content.

---

## Example 1: Insight Corruption (true crime, uses the True Crime use case too)

- **Location:** `output/insight-corruption/`
- **Format:** 15 episodes, single-part, 30 minutes + one 90-second mid-roll sponsor break
- **Source data:** `projects/insight-corruption/characters/*.json` (24 sourced Bay Area
  government-corruption case files; 14 with resolved outcomes become Episodes 1-14,
  and the 10 still pending become the Episode 15 "Docket Watch" roundup instead of
  being narrated as though they were resolved)

**What this example demonstrates:**

- How to select which case files actually fit a series premise. Not every
  compiled case file is ready to script — see
  `projects/insight-corruption/PROJECT_MANIFEST.json` for the resolved/pending
  split and why 10 of the original 24 cases were routed to a dedicated
  "pending cases" episode instead of the main season format.
- How to handle a requested runtime (30 minutes) that exceeds what the
  verified source material can honestly narrate — see any
  `output/insight-corruption/season-1/episode-*/producer-briefs/brief.md` for
  the "Runtime Feasibility" section, and the corresponding `[EXPAND]` block
  in that episode's `scripts/script.md`. The fix is a labeled guest/analysis
  segment, not padded narration.
- How fact-tier attribution (Tier 1-4, per
  [verification-engine.md](../true-crime/protocols/verification-engine.md))
  is carried from a case file's own `sources`/`verification_status` fields
  into the generated script, rather than defaulting to an unverified tier.

## Example 2: The Homeless Lunchbox (format outside this use case's default assumptions)

- **Location:** `output/homeless-lunchbox/`
- **Format:** 10 episodes, single-part, 15 minutes + one 30-second sponsor break
- **Format:** two cohosts reviewing a meal from a real Bay Area homeless-services
  organization, then discussing a related Bay Area/California policy topic

**What this example demonstrates:**

- This use case's schema assumes a narrated true-crime or fiction episode
  (one narrator, a "character"/"case" reference, optional single guest). A
  two-cohost review/discussion format doesn't map onto that cleanly — see
  `output/homeless-lunchbox/SERIES_CONFIG.json`'s `productionNotes` for the
  specific mismatches (no `character` schema in use, `guest-materials/` is
  omitted per episode by default).
- How to avoid presenting unverified specifics as fact when a script is
  written before the reporting exists to support it: the meal-tasting
  segment and any time-sensitive policy claim are explicit
  `[PRODUCER]`/`[VERIFY]` placeholders in every episode's `scripts/script.md`,
  not pre-written guesses.
- An explicit consent/ethics checklist (`producer-briefs/brief.md` in each
  episode) for featuring a real charity, which nothing in
  [GUEST_COORDINATION.md](./GUEST_COORDINATION.md) currently covers.

---

**See also:** [SERIES_FRAMEWORK.md](./SERIES_FRAMEWORK.md) ·
[EPISODE_DEVELOPMENT.md](./EPISODE_DEVELOPMENT.md) ·
[TEMPLATES.md](./TEMPLATES.md)
