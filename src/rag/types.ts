/**
 * Retrieval-Augmented Verification (RAG) — type definitions
 *
 * Grounds fact-checking against the tier system in
 * use-cases/true-crime/protocols/verification-engine.md by indexing case
 * files and their cited sources, then retrieving the most relevant
 * evidence for a claim before it's classified.
 */

export type SourceTier = 1 | 2 | 3 | 4;

/**
 * One retrievable unit of evidence. A case file is chunked into several
 * of these (character, offense, sentence, fallout, sources, etc.), and
 * each cited source string becomes its own chunk so it can be retrieved
 * and cited independently of the claim it originally supported.
 */
export interface EvidenceChunk {
  id: string;
  caseId: string;
  section: string; // e.g. "offense", "sentence", "sources", "fallout"
  text: string;
  /** Heuristic tier guess for this chunk; refined per-claim in VerificationResult. */
  suggestedTier: SourceTier;
  citation: string;
}

export interface RetrievedEvidence extends EvidenceChunk {
  score: number;
}

export interface VerificationQuery {
  claim: string;
  caseId?: string; // restrict retrieval to one case's chunks if known
  topK?: number; // default 5
}

export interface VerificationResult {
  claim: string;
  tier: SourceTier;
  confidence: number; // 0-1
  supportingEvidence: RetrievedEvidence[];
  verdict:
    | 'tier-1-only'
    | 'tier-1-with-conflict'
    | 'tier-2-corroborated'
    | 'tier-3-convergent'
    | 'tier-3-cautious'
    | 'single-source'
    | 'unverified';
  singleSource: boolean;
  notes: string;
}
