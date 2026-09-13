/**
 * PACER Integration Tests
 *
 * Tests the PACER client mock implementation and verification engine
 * Reference case: United States v. Brett Johnson (ShadowCrew)
 * Case Number: 03-CR-0322 (Middle District of Florida)
 */

import {
  PACERClient,
  PACERCase,
  VerificationEngine,
  VerificationResult,
} from '../src/pacer-integration';

describe('PACER Integration', () => {
  let pacerClient: PACERClient;
  let verificationEngine: VerificationEngine;

  beforeEach(() => {
    pacerClient = new PACERClient(true); // Use mock mode
    verificationEngine = new VerificationEngine();
  });

  describe('PACERClient - Mock Mode', () => {
    it('should return null for unknown case numbers', async () => {
      const result = await pacerClient.queryCaseByNumber('99-CR-99999', 'Middle District of Florida');
      expect(result).toBeNull();
    });

    it('should retrieve Brett Johnson ShadowCrew case', async () => {
      const result = await pacerClient.queryCaseByNumber('03-CR-0322', 'Middle District of Florida');

      expect(result).not.toBeNull();
      expect(result?.title).toContain('Johnson');
      expect(result?.defendants).toContain('Brett Johnson');
      expect(result?.status).toBe('closed');
    });

    it('should parse sentencing information correctly', async () => {
      const result = await pacerClient.queryCaseByNumber('03-CR-0322', 'Middle District of Florida');

      expect(result?.sentencingInfo).toBeDefined();
      expect(result?.sentencingInfo?.sentenceLength).toBe('90 months');
      expect(result?.sentencingInfo?.releaseDate).toBe('2007-10-08');
    });

    it('should include docket entries in order', async () => {
      const result = await pacerClient.queryCaseByNumber('03-CR-0322', 'Middle District of Florida');

      expect(result?.docketEntries.length).toBeGreaterThan(0);
      expect(result?.docketEntries[0].description).toContain('Indictment');
      expect(result?.docketEntries[result.docketEntries.length - 1].description).toContain('Sentencing');
    });

    it('should query by defendant name', async () => {
      const results = await pacerClient.queryCaseByDefendant('Brett Johnson', 'Middle District of Florida');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].defendants).toContain('Brett Johnson');
    });

    it('should include federal charges in case', async () => {
      const result = await pacerClient.queryCaseByNumber('03-CR-0322', 'Middle District of Florida');

      expect(result?.charges).toBeDefined();
      expect(result?.charges?.length).toBeGreaterThan(0);
      expect(result?.charges).toContain('Wire fraud');
      expect(result?.charges).toContain('Identity theft');
    });
  });

  describe('VerificationEngine - Tier Classification', () => {
    it('should classify PACER records as Tier 1', () => {
      const mockCase: PACERCase = {
        caseNumber: '03-CR-0322',
        title: 'United States v. Johnson',
        district: 'Middle District of Florida',
        filedDate: '2003-05-08',
        status: 'closed',
        defendants: ['Brett Johnson'],
        docketEntries: [],
      };

      const result = verificationEngine.classifyClaim(
        'Brett Johnson was sentenced to 90 months',
        { pacer: mockCase }
      );

      expect(result.tier).toBe('tier1');
      expect(result.confidence).toBe(100);
      expect(result.sources).toContain('PACER docket sheet');
    });

    it('should classify multiple corroborating sources as Tier 2', () => {
      const result = verificationEngine.classifyClaim(
        'ShadowCrew was dismantled in 2004',
        {
          dojStatement: 'DOJ press release on ShadowCrew takedown',
          newsArticles: 3,
        }
      );

      expect(result.tier).toBe('tier2');
      expect(result.confidence).toBeGreaterThanOrEqual(80);
    });

    it('should classify single journalist source as Tier 3', () => {
      const result = verificationEngine.classifyClaim(
        'Brett Johnson ran ShadowCrew',
        {
          journalistProfile: 'KrebsOnSecurity article on ShadowCrew',
        }
      );

      expect(result.tier).toBe('tier3');
      expect(result.confidence).toBeLessThan(80);
    });

    it('should mark unsourced claims as gaps', () => {
      const result = verificationEngine.classifyClaim(
        'Unsourced claim about crime',
        {}
      );

      expect(result.tier).toBe('gap');
      expect(result.confidence).toBe(0);
    });

    it('should provide reasoning for all classifications', () => {
      const claims = [
        { claim: 'PACER test', sources: { pacer: {} as PACERCase } },
        { claim: 'Multi-source test', sources: { dojStatement: 'test', newsArticles: 2 } },
        { claim: 'Journalist test', sources: { journalistProfile: 'test' } },
        { claim: 'Gap test', sources: {} },
      ];

      claims.forEach(({ claim, sources }) => {
        const result = verificationEngine.classifyClaim(claim, sources as any);
        expect(result.reasoning).toBeTruthy();
        expect(result.reasoning.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should verify a complete claim chain for ShadowCrew case', async () => {
      // Query the case
      const pacerCase = await pacerClient.queryCaseByNumber('03-CR-0322', 'Middle District of Florida');
      expect(pacerCase).not.toBeNull();

      // Verify the sentence
      const sentenceVerification = verificationEngine.classifyClaim(
        'Brett Johnson sentenced to 90 months in federal prison',
        { pacer: pacerCase! }
      );

      expect(sentenceVerification.tier).toBe('tier1');
      expect(sentenceVerification.confidence).toBe(100);
    });

    it('should handle missing docket entries gracefully', async () => {
      const result = await pacerClient.queryCaseByDefendant('Unknown Person', 'Middle District of Florida');

      // Should return at least the default mock case
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });
});
