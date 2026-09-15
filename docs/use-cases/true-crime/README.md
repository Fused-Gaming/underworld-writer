# True Crime Use Case

## Overview

The True Crime use case provides a rigorous, fact-checking methodology for creating narratives grounded in court records, public documents, and journalistic investigation. Every claim is classified by source tier, traced to primary records, and verified through systematic cross-checking and escalation protocols.

---

## When to Use This Use Case

Use True Crime when you are:

- ✅ Creating podcasts, articles, or narratives about real criminal cases
- ✅ Reporting on factual criminal investigations or prosecutions
- ✅ Working with primary sources (PACER records, court documents, DOJ press releases)
- ✅ Interviewing subjects or experts about real crimes
- ✅ Need to verify every claim with documented sources

Do NOT use this use case if you are:

- ❌ Writing entirely fictional underworld crime stories (use Fiction instead)
- ❌ Don't have time for rigorous fact-checking
- ❌ Working with stories that cannot be verified against primary sources

---

## Core Workflow: Four-Step Verification Process

The True Crime workflow follows a four-step process for verifying every claim:

### Step 1: Source-Tier Triage
Classify each claim's evidence quality:

- **Tier 1** — Primary legal record (court dockets, DOJ press releases, sentencing transcripts, BOP records, indictments)
- **Tier 2** — Direct subject statement (long-form interview where subject speaks in their own words)
- **Tier 3** — Journalistic paraphrase (reputable outlets summarizing claims)
- **Tier 4** — Marketing/bio copy (self-description, usually not independently checked)

### Step 2: Query Construction
Use specialized search strategies to find evidence:

- Pair suspect name with handle/alias, entity, or named associate
- Search court records specifically with targeted operators
- Discard false positives aggressively
- Log dead ends as `[GAP — searched, not public]`

### Step 3: Cross-Source Reconciliation
When multiple sources give different information:

- **Convergence rule:** If 5+ independent sources agree, use their consensus
- **Split evidence:** If sources split, attribute each version to its source
- **Never average or guess** — count independent sources

### Step 4: Escalation for Persistent Gaps
For unresolved claims:

1. **PACER direct docket search** — Federal court records
2. **BOP inmate locator** — Bureau of Prisons records
3. **Local news archives** — Regional historical coverage
4. **Genuine gap disclosure** — Document remaining gaps in author's note

---

## Key Documents

### Verification Protocols
- **[SKILL.md](./protocols/SKILL.md)** — Core 4-step verification workflow
- **[verification-engine.md](./protocols/verification-engine.md)** — Tier definitions with examples
- **[query-construction-guide.md](./protocols/query-construction-guide.md)** — Research search strategies
- **[cross-source-reconciliation.md](./protocols/cross-source-reconciliation.md)** — Handling conflicting sources
- **[escalation-protocols.md](./protocols/escalation-protocols.md)** — PACER, BOP, archives, gap disclosure

### Examples & Workflows
- **EXAMPLES.md** — Real-world fact-checking walkthroughs (planned, not yet written)

---

## Output Format

True Crime workflow produces:

1. **Sourcing Annotations** — Every claim tagged with tier and source
2. **Verification Status** — Overall confidence and gaps
3. **Attribution Notes** — Footnotes or integrated citations per outlet
4. **Gap Documentation** — Explicit marking of unresolved claims
5. **Author's Note** — Transparency about methodology and limitations

---

## Integration with Other Use Cases

### True Crime + Podcast Production
Combine verification workflow with episodic podcast structure:

```
Verify facts (True Crime) → Organize into episodes → Generate scripts (Podcast Production) → Record with guests
```

**Example:** "Insight Corruption" Bay Area corruption podcast (see `output/insight-corruption/`)

### True Crime + Fiction
Blend real cases with imagined reconstruction:

```
Verify core facts (True Crime) → Fill gaps with research (True Crime) → Build narrative (Fiction) → Finalize
```

**Example:** Dramatized reconstructions of real underworld operations

---

## Typical Workflow

1. **Collect Source Materials**
   - Primary: court records, DOJ press releases, PACER dockets
   - Secondary: news articles, interviews, published investigations

2. **List All Claims**
   - Extract every factual statement from your narrative
   - Organize by topic or chronology

3. **Tier Each Claim** (Step 1)
   - Classify source quality (Tier 1-4)
   - Document source with specific reference

4. **Construct Search Queries** (Step 2)
   - Research each claim systematically
   - Try multiple search angles
   - Log negative results

5. **Reconcile Conflicting Sources** (Step 3)
   - Note when sources disagree
   - Count independent confirmation
   - Apply convergence rule or split evidence

6. **Escalate Unresolved Claims** (Step 4)
   - PACER searches for federal cases
   - BOP locator for inmate information
   - News archives for historical coverage
   - Document gaps that remain

7. **Annotate Narrative**
   - Add citations or footnotes
   - Mark verification status
   - Prepare author's note on methodology

---

## Success Criteria

A well-verified true crime narrative should have:

- ✅ Every claim classified by source tier (Tier 1-4)
- ✅ All Tier 1 and most Tier 2 claims verified through primary records
- ✅ No single-source-only claims (except marked as gaps)
- ✅ Conflicting sources explicitly attributed
- ✅ Gaps transparently documented
- ✅ Author's note explaining verification methodology
- ✅ Full audit trail for peer review

---

## Key Concepts

### What Counts as Tier 1?

✅ **YES:**
- Court docket entries
- Federal sentencing transcripts
- DOJ press releases
- FTC complaint filings
- Bureau of Prisons records
- Police incident reports (official)
- Grand jury indictments

❌ **NO:**
- News articles (even reputable ones) = Tier 3
- Author interviews = Tier 2
- Wikipedia = Tier 4
- Reddit threads = Tier 4
- Company bios = Tier 4

### Repetition ≠ Corroboration

A claim repeated across 100 news articles is still Tier 3 (journalistic paraphrase), not Tier 1. It only becomes corroborated when you find it independently confirmed in Tier 1 or Tier 2.

### Why Tiers Matter

Different claims require different verification levels:

- **Critical facts** (crimes, sentences, identity) = Must be Tier 1
- **Supporting details** (background, timeline) = Tier 2-3 acceptable
- **Context/analysis** = Tier 3-4, with clear attribution
- **Contested claims** = Need multiple tier sources

---

## Common Pitfalls

❌ **Pitfall:** Trusting a news article's fact-checking  
✅ **Fix:** Go to primary source yourself (PACER docket, court records)

❌ **Pitfall:** Assuming Google results are exhaustive  
✅ **Fix:** Use site-specific searches, news archives, PACER directly

❌ **Pitfall:** Averaging conflicting sources ("some say X, some say Y")  
✅ **Fix:** Use convergence rule (5+ sources) or split evidence

❌ **Pitfall:** Leaving gaps unmarked  
✅ **Fix:** Explicitly document `[GAP — searched, not public]`

---

## Next Steps

1. Read [SKILL.md](./protocols/SKILL.md) for the complete 4-step workflow
2. Study [verification-engine.md](./protocols/verification-engine.md) for tier definitions
3. Review [query-construction-guide.md](./protocols/query-construction-guide.md) for search strategies
4. Reference [cross-source-reconciliation.md](./protocols/cross-source-reconciliation.md) for conflicts
5. Learn [escalation-protocols.md](./protocols/escalation-protocols.md) for PACER and gaps
6. See [Podcast Production EXAMPLES.md](../podcast-production/EXAMPLES.md) for a worked true-crime example series (true-crime-specific examples are planned but not yet written)
7. Start verifying claims in your own narrative

---

**Return to:** [Use Cases Overview](../USE_CASES_OVERVIEW.md)
