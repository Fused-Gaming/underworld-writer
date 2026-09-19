# Retrieval-Augmented Verification (RAG) Pipeline

Automates the tier-classification worksheet in
[`use-cases/true-crime/protocols/verification-engine.md`](../../use-cases/true-crime/protocols/verification-engine.md):
index every case file's sections and cited sources, retrieve the evidence
most relevant to a claim, then apply that doc's own rules (Tier 1
adjudicated facts win, 5+ convergent Tier 3 sources count as corroboration,
single-source claims get flagged) to produce a verdict.

This does not replace editorial judgment — conflicting Tier 1 records or
unresolved gaps still route to `cross-source-reconciliation.md` and
`escalation-protocols.md`. It removes the busywork of re-deriving the
worksheet by hand for every claim in every episode.

## Why no vector DB / embeddings API

A season's case-file corpus is a few hundred short text chunks — small
enough that a classic BM25 term-frequency index (`corpus-indexer.ts`)
outperforms the operational cost (API keys, network calls, latency) of a
vector store, and it keeps this pipeline runnable offline and in CI.

## Components

| File | Purpose |
|---|---|
| `types.ts` | `EvidenceChunk`, `VerificationQuery`, `VerificationResult` |
| `corpus-indexer.ts` | Dependency-free in-memory BM25 index |
| `case-file-chunker.ts` | Splits a `TrueCrimeCaseFile` into chunks (offense, sentence, fallout, escape-mechanism, one per cited source) |
| `verification-rag.ts` | `VerificationRAG` — indexes case files, retrieves evidence per claim, classifies tier |

## Usage

```ts
import { VerificationRAG } from './src/rag/index.js';

const rag = new VerificationRAG();
rag.indexCaseFile(caseFileJson, 'joanne-segovia-case.json');

const result = rag.verifyClaim({
  claim: 'Joanne Segovia avoided prison time and got probation',
});
// result.tier === 1, result.verdict === 'tier-1-only'
```

## Running it against a whole project

```bash
npm run build
node scripts/verify-episode-claims.mjs \
  --project projects/insight-corruption \
  --episode-config output/insight-corruption/season-1/episode-1/EPISODE_CONFIG.json \
  --out output/insight-corruption/season-1/episode-1/verification-report.json
```

This indexes every case file under `<project>/characters/` (including
subdirectories, e.g. `oakland-cases/`), verifies each of the episode
config's `keyPoints` against the corpus, and writes a verification report.

## Tier-guess heuristics (starting point, not final)

`case-file-chunker.ts` assigns a heuristic `suggestedTier` per section:

- `offense` / `sentence` → Tier 1 (these fields describe adjudicated
  outcomes in the case file's own structured data)
- `fallout` / `escape-mechanism` → Tier 3 (reported analysis, not a legal
  record)
- Each cited source string → Tier 3 (a named outlet, treated as
  journalistic reporting unless a human editor reclassifies it)

These are priors the retrieval step surfaces for a human/editorial pass —
`VerificationResult.notes` always says what to check next (e.g. "disclose
both" on a Tier 1 conflict, or "mark [SINGLE-SOURCE]" when corroboration is
thin).

## Known limitations / follow-ups

- BM25 keyword matching, not semantic search — a claim phrased very
  differently from the source text may not retrieve well. Fine for this
  corpus's size and vocabulary overlap; revisit if claims start being
  auto-generated in very different phrasing than the case files.
- Tier guesses at the chunker level are heuristic, not authoritative —
  they encode "case file structured fields = Tier 1" as a starting
  assumption, which holds for this repo's case files (built from
  Tier 1/2/3 sourced facts per `PRODUCER_GUIDE.md`) but should be reviewed
  before reusing this chunker against a differently-sourced corpus.
- Not yet wired into `ScriptGenerator`'s existing `FactAttribution`
  pipeline — `VerificationResult` and `FactAttribution` have compatible
  shapes (`tier`, `confidence`) but aren't unified yet.
