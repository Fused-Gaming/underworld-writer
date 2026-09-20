import { VerificationRAG } from '../src/rag/verification-rag.js';
import { CorpusIndex } from '../src/rag/corpus-indexer.js';
import type { TrueCrimeCaseFile } from '../src/podcast-types.js';

const segoviaCase: TrueCrimeCaseFile = {
  caseId: 'corruption-bay-001',
  caseName: "Joanne Segovia - San Jose Police Officers' Association Opioid Smuggling",
  character: { name: 'Joanne Segovia' },
  offense: {
    description:
      'Smuggled over 17,000 opioid pills (Tapentadol) into the U.S. from India over multiple years while serving as head of the police union',
  },
  sentence: {
    prison_time: 'Zero days',
    probation: '3 years',
    status: 'AVOIDED INCARCERATION',
  },
  fallout: {
    consequences: ['Loss of union position', 'Permanent criminal record'],
  },
  sources: ['San José Spotlight - 2024', 'NBC Bay Area - 2024', 'KQED News - 2024'],
  verification_status: 'published-sources',
};

describe('CorpusIndex', () => {
  it('returns no results for an empty index', () => {
    const index = new CorpusIndex();
    expect(index.search('anything')).toEqual([]);
  });

  it('ranks the chunk containing the query terms above unrelated chunks', () => {
    const index = new CorpusIndex();
    index.addChunks([
      { id: '1', caseId: 'c1', section: 'offense', text: 'smuggled opioid pills across the border', suggestedTier: 1, citation: 'court record' },
      { id: '2', caseId: 'c1', section: 'fallout', text: 'lost his job at the union', suggestedTier: 3, citation: 'news report' },
    ]);
    const results = index.search('opioid smuggling', 5);
    expect(results[0].id).toBe('1');
  });
});

describe('VerificationRAG', () => {
  let rag: VerificationRAG;

  beforeEach(() => {
    rag = new VerificationRAG();
    rag.indexCaseFile(segoviaCase, 'joanne-segovia-case.json');
  });

  it('indexes one chunk per case section plus one per source', () => {
    // offense + sentence + fallout + 3 sources = 6
    expect(rag.corpusSize()).toBe(6);
  });

  it('classifies a sentencing claim as Tier 2 (published-reporting record, not a raw docket pull)', () => {
    const result = rag.verifyClaim({ claim: 'Joanne Segovia avoided prison time and got probation' });
    expect(result.tier).toBe(2);
    expect(result.verdict).toBe('tier-2-corroborated');
    expect(result.singleSource).toBe(false);
  });

  it('classifies an offense claim as Tier 2', () => {
    const result = rag.verifyClaim({ claim: 'smuggled opioid pills from India' });
    expect(result.tier).toBe(2);
  });

  it('returns unverified with no evidence for an unrelated claim', () => {
    const result = rag.verifyClaim({ claim: 'the moon landing conspiracy theory' });
    expect(result.verdict).toBe('unverified');
    expect(result.tier).toBe(4);
    expect(result.singleSource).toBe(true);
  });

  it('restricts retrieval to the given caseId when multiple cases are indexed', () => {
    const otherCase: TrueCrimeCaseFile = {
      caseId: 'other-case',
      character: { name: 'Someone Else' },
      offense: { description: 'unrelated embezzlement scheme involving city funds' },
      sentence: {},
      sources: ['Some Outlet - 2020'],
      verification_status: 'published-sources',
    };
    rag.indexCaseFile(otherCase, 'other-case.json');

    const results = rag.retrieve({ claim: 'embezzlement scheme', caseId: 'corruption-bay-001' });
    expect(results.every((e) => e.caseId === 'corruption-bay-001')).toBe(true);
  });
});
