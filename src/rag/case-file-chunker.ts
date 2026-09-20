/**
 * Turns a TrueCrimeCaseFile (projects/*\/characters/*.json) into indexable
 * EvidenceChunks, one per case section plus one per cited source string.
 *
 * Tier guesses here are heuristic starting points, not final classification
 * — see verification-engine.md for the authoritative tier definitions.
 * `VerificationRAG.verifyClaim` treats these as a prior, not a verdict.
 */

import type { TrueCrimeCaseFile } from '../podcast-types.js';
import type { EvidenceChunk } from './types.js';

// This project's case files (projects/insight-corruption, verificationMode:
// "published-sources-and-court-records") are themselves built from news
// reporting on court outcomes, not from a raw PACER docket pull — see e.g.
// output/insight-corruption/season-1/episode-1/scripts/script.md, which
// tags its offense/sentence facts "[Tier 2]" (direct reporting with
// specific corroboration), not Tier 1. Default the offense/sentence
// sections to that same Tier 2 prior; a case file that DOES carry an
// explicit docket/PACER reference should be indexed with suggestedTier 1
// at the call site instead of relying on this default.
const CASE_RECORD_TIER_HINT = 2;

export function chunkCaseFile(caseFile: TrueCrimeCaseFile, caseFilePath: string): EvidenceChunk[] {
  const caseId = caseFile.caseId ?? caseFilePath;
  const chunks: EvidenceChunk[] = [];

  const addChunk = (
    section: string,
    text: string | undefined,
    suggestedTier: 1 | 2 | 3 | 4,
    citation: string
  ) => {
    if (!text) return;
    chunks.push({
      id: `${caseId}:${section}:${chunks.length}`,
      caseId,
      section,
      text,
      suggestedTier,
      citation,
    });
  };

  addChunk(
    'offense',
    caseFile.offense.description,
    CASE_RECORD_TIER_HINT,
    `${caseFile.caseName ?? caseId} — offense record`
  );

  if (caseFile.sentence) {
    const sentenceText = Object.entries(caseFile.sentence)
      .filter(([, v]) => Boolean(v))
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');
    addChunk(
      'sentence',
      sentenceText,
      CASE_RECORD_TIER_HINT,
      `${caseFile.caseName ?? caseId} — sentencing outcome per published reporting`
    );
  }

  if (caseFile.fallout?.consequences?.length) {
    addChunk(
      'fallout',
      caseFile.fallout.consequences.join('; '),
      3, // consequences are typically reported, not adjudicated
      `${caseFile.caseName ?? caseId} — fallout reporting`
    );
  }

  if (caseFile.howTheyGotAwayWithIt?.keyFactors?.length) {
    addChunk(
      'escape-mechanism',
      caseFile.howTheyGotAwayWithIt.keyFactors.join('; '),
      3,
      `${caseFile.caseName ?? caseId} — analysis of sentencing/defense strategy`
    );
  }

  // Each cited source becomes its own retrievable chunk so a claim can be
  // matched to (and cited from) the specific outlet that reported it,
  // instead of the case file's own summary of that outlet's reporting.
  for (const [i, source] of (caseFile.sources ?? []).entries()) {
    addChunk(`source-${i}`, source, 3, source);
  }

  return chunks;
}
