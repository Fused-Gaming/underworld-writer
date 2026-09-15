/**
 * VerificationRAG — retrieval-augmented claim verification.
 *
 * Automates the tier classification worksheet in
 * use-cases/true-crime/protocols/verification-engine.md: retrieve the
 * evidence chunks most relevant to a claim, then apply that doc's own
 * rules (tier-1-adjudicated wins, 5+ convergent tier-3 sources count as
 * corroboration, single-source claims get flagged) to produce a
 * FactAttribution-compatible verdict.
 *
 * This does not replace human editorial judgment (see escalation-protocols.md
 * and cross-source-reconciliation.md for cases this can't resolve) — it
 * removes the busywork of re-deriving the worksheet by hand for every claim.
 */

import type { TrueCrimeCaseFile } from '../podcast-types.js';
import { CorpusIndex } from './corpus-indexer.js';
import { chunkCaseFile } from './case-file-chunker.js';
import type {
  RetrievedEvidence,
  SourceTier,
  VerificationQuery,
  VerificationResult,
} from './types.js';

const MIN_SCORE_TO_COUNT_AS_SUPPORT = 0.1;
const CONVERGENT_TIER3_THRESHOLD = 5;
const CAUTIOUS_TIER3_THRESHOLD = 3;

export class VerificationRAG {
  private index = new CorpusIndex();

  indexCaseFile(caseFile: TrueCrimeCaseFile, caseFilePath: string): void {
    this.index.addChunks(chunkCaseFile(caseFile, caseFilePath));
  }

  corpusSize(): number {
    return this.index.size();
  }

  retrieve(query: VerificationQuery): RetrievedEvidence[] {
    return this.index
      .search(query.claim, query.topK ?? 5, query.caseId)
      .filter((e) => e.score >= MIN_SCORE_TO_COUNT_AS_SUPPORT);
  }

  /**
   * Retrieve evidence for a claim and classify it per the tier worksheet.
   * This is the function `ScriptGenerator`'s fact-attribution step should
   * call instead of trusting a single case-file field at face value.
   */
  verifyClaim(query: VerificationQuery): VerificationResult {
    const evidence = this.retrieve(query);

    if (evidence.length === 0) {
      return {
        claim: query.claim,
        tier: 4,
        confidence: 0,
        supportingEvidence: [],
        verdict: 'unverified',
        singleSource: true,
        notes: 'No indexed evidence retrieved above the relevance threshold. Escalate via query-construction-guide.md.',
      };
    }

    const bestTier = Math.min(...evidence.map((e) => e.suggestedTier)) as SourceTier;
    const tier1Evidence = evidence.filter((e) => e.suggestedTier === 1);
    const tier2Evidence = evidence.filter((e) => e.suggestedTier === 2);
    const tier3Evidence = evidence.filter((e) => e.suggestedTier === 3);

    // Count independent origins, not repetition — distinct citation strings
    // are treated as distinct sourcing lines (see "the repetition problem"
    // in verification-engine.md).
    const distinctTier3Origins = new Set(tier3Evidence.map((e) => e.citation)).size;

    if (tier1Evidence.length > 0) {
      const conflicting = evidence.some(
        (e) => e.suggestedTier === 1 && e.section === tier1Evidence[0].section && e.text !== tier1Evidence[0].text
      );
      return {
        claim: query.claim,
        tier: 1,
        confidence: conflicting ? 0.7 : 0.95,
        supportingEvidence: evidence,
        verdict: conflicting ? 'tier-1-with-conflict' : 'tier-1-only',
        singleSource: false,
        notes: conflicting
          ? 'Multiple Tier 1 records found with differing text — disclose both per cross-source-reconciliation.md.'
          : 'Adjudicated Tier 1 record (sentencing/offense data) supports this claim directly.',
      };
    }

    if (tier2Evidence.length > 0) {
      return {
        claim: query.claim,
        tier: 2,
        confidence: 0.75,
        supportingEvidence: evidence,
        verdict: 'tier-2-corroborated',
        singleSource: false,
        notes: 'Tier 2 direct-statement evidence found. Confirm the corroboration statement is specific, not just "we fact-checked it".',
      };
    }

    if (distinctTier3Origins >= CONVERGENT_TIER3_THRESHOLD) {
      return {
        claim: query.claim,
        tier: 3,
        confidence: 0.7,
        supportingEvidence: evidence,
        verdict: 'tier-3-convergent',
        singleSource: false,
        notes: `${distinctTier3Origins} independent Tier 3 sources converge on this claim.`,
      };
    }

    if (distinctTier3Origins >= CAUTIOUS_TIER3_THRESHOLD) {
      return {
        claim: query.claim,
        tier: 3,
        confidence: 0.5,
        supportingEvidence: evidence,
        verdict: 'tier-3-cautious',
        singleSource: false,
        notes: `Only ${distinctTier3Origins} independent Tier 3 sources — usable but mark for further corroboration.`,
      };
    }

    if (distinctTier3Origins >= 1) {
      return {
        claim: query.claim,
        tier: 3,
        confidence: 0.3,
        supportingEvidence: evidence,
        verdict: 'single-source',
        singleSource: true,
        notes: 'Mark [SINGLE-SOURCE] in the manuscript; seek Tier 1/2 backup via query-construction-guide.md.',
      };
    }

    return {
      claim: query.claim,
      tier: bestTier,
      confidence: 0.2,
      supportingEvidence: evidence,
      verdict: 'single-source',
      singleSource: true,
      notes: 'Only Tier 4 (marketing/uncorroborated) evidence found. Does not count as verification.',
    };
  }
}
