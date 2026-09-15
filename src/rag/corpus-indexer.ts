/**
 * In-memory BM25 retrieval index — no vector DB or external API required.
 *
 * This is deliberately dependency-free: the corpus here (a season's worth
 * of case files) is small enough that a classic term-frequency index beats
 * the operational cost of standing up embeddings/a vector store, and it
 * keeps the RAG pipeline runnable in CI with zero network access.
 */

import type { EvidenceChunk, RetrievedEvidence } from './types.js';

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'for', 'with',
  'is', 'was', 'were', 'be', 'been', 'by', 'as', 'at', 'that', 'this', 'it',
  'from', 'per',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

const K1 = 1.5;
const B = 0.75;

export class CorpusIndex {
  private chunks: EvidenceChunk[] = [];
  private docTokens: string[][] = [];
  private docFreq: Map<string, number> = new Map();
  private avgDocLength = 0;

  addChunk(chunk: EvidenceChunk): void {
    this.chunks.push(chunk);
    const tokens = tokenize(chunk.text);
    this.docTokens.push(tokens);

    const seen = new Set<string>();
    for (const t of tokens) {
      if (!seen.has(t)) {
        this.docFreq.set(t, (this.docFreq.get(t) ?? 0) + 1);
        seen.add(t);
      }
    }
    this.avgDocLength =
      this.docTokens.reduce((sum, d) => sum + d.length, 0) / this.docTokens.length;
  }

  addChunks(chunks: EvidenceChunk[]): void {
    for (const c of chunks) this.addChunk(c);
  }

  size(): number {
    return this.chunks.length;
  }

  /** BM25 search over all indexed chunks, optionally restricted to one case. */
  search(query: string, topK = 5, caseId?: string): RetrievedEvidence[] {
    const queryTokens = tokenize(query);
    const n = this.chunks.length;
    if (n === 0 || queryTokens.length === 0) return [];

    const scores = this.chunks.map((chunk, i) => {
      if (caseId && chunk.caseId !== caseId) return { chunk, score: -Infinity };

      const tokens = this.docTokens[i];
      const docLength = tokens.length || 1;
      let score = 0;

      for (const qt of queryTokens) {
        const tf = tokens.filter((t) => t === qt).length;
        if (tf === 0) continue;
        const df = this.docFreq.get(qt) ?? 0;
        if (df === 0) continue;
        const idf = Math.log((n - df + 0.5) / (df + 0.5) + 1);
        const numerator = tf * (K1 + 1);
        const denominator = tf + K1 * (1 - B + B * (docLength / this.avgDocLength));
        score += idf * (numerator / denominator);
      }

      return { chunk, score };
    });

    return scores
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(({ chunk, score }) => ({ ...chunk, score }));
  }
}
