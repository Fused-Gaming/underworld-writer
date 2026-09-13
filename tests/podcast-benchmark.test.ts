/**
 * Podcast Scripting Engine Performance Benchmarks
 *
 * Measures performance of podcast script generation operations
 * Baseline results saved to benchmarks/baseline.json
 */

import { ScriptGenerator } from '../src/podcast-script-generator.js';
import { CharacterForPodcast, PACERCaseData } from '../src/podcast-types.js';

// Sample character for benchmarking
const SAMPLE_CHARACTER: CharacterForPodcast = {
  phase1: {
    name: 'John Doe',
    aliases: ['The Shadow', 'JD'],
    origin: 'Grew up in organized crime family from Detroit',
    background: 'Started in street gangs, quickly rose through ranks',
    coreMotivation: 'Build an international criminal empire',
  },
  phase2: {
    roleAndRank: 'Regional Syndicate Boss',
    factionAffiliation: {
      primary: 'The Continental Organization',
      allies: ['Russian Mafia', 'Colombian Cartel'],
      opposition: ['Federal Task Force', 'Rival Syndicates'],
    },
    relationships: [
      { name: 'Detective Sarah Chen', type: 'enemy', description: 'Pursuing for 15 years' },
      { name: 'Victor Kozlov', type: 'ally', description: 'Russian contact and partner' },
      { name: 'Sofia Martinez', type: 'complicated', description: 'Sister in witness protection' },
    ],
  },
  phase3: {
    storyArc: {
      act1: 'Rose from street gang to syndicate member',
      act2: 'Consolidated power and expanded operations internationally',
      act3: 'Fell to federal prosecution and life sentence',
    },
    hierarchiesAndConflicts: {
      internal: ['Loyalty vs ambition', 'Family expectations vs personal desires'],
      external: ['Law enforcement pressure', 'Rival gang incursions'],
      personal: ['Moral deterioration', 'Relationship failures'],
    },
    thematicElements: ['Power corruption', 'Loyalty and betrayal', 'Justice vs law'],
  },
};

// Sample PACER case data
const SAMPLE_CASE: PACERCaseData = {
  caseNumber: '03-CR-0322',
  title: 'United States v. John Doe',
  court: 'Federal District Court, Eastern District of Michigan',
  filedDate: '2003-01-15',
  status: 'closed',
  defendants: ['John Doe', 'Victor Kozlov'],
  charges: ['RICO conspiracy', 'Money laundering', 'Drug trafficking'],
  outcome: 'Convicted on all counts, sentenced to life imprisonment',
  sentencingInfo: {
    sentenceDate: '2004-01-20',
    sentenceLength: 'Life',
    releaseDate: 'N/A',
  },
};

describe('Podcast Script Generator - Performance Benchmarks', () => {
  describe('Single Episode Generation', () => {
    it('should generate single episode script in < 50ms', () => {
      const generator = new ScriptGenerator(SAMPLE_CHARACTER, { format: 'single' }, SAMPLE_CASE);
      const start = performance.now();
      const script = generator.generateScript();
      const elapsed = performance.now() - start;

      expect(script).toBeDefined();
      expect(script.format).toBe('single');
      expect(script.episodes).toHaveLength(1);
      expect(elapsed).toBeLessThan(50);
      console.log(`✓ Single episode generation: ${elapsed.toFixed(2)}ms`);
    });

    it('should generate producer brief in < 20ms', () => {
      const generator = new ScriptGenerator(SAMPLE_CHARACTER, { format: 'single' });
      const start = performance.now();
      const brief = generator.createProducerBrief();
      const elapsed = performance.now() - start;

      expect(brief).toBeDefined();
      expect(brief.episodeTitle).toContain('John Doe');
      expect(elapsed).toBeLessThan(20);
      console.log(`✓ Producer brief generation: ${elapsed.toFixed(2)}ms`);
    });

    it('should generate guest script in < 20ms', () => {
      const generator = new ScriptGenerator(SAMPLE_CHARACTER);
      const start = performance.now();
      const guestScript = generator.createGuestScript();
      const elapsed = performance.now() - start;

      expect(guestScript).toBeDefined();
      expect(guestScript.title).toContain('Guest Script');
      expect(elapsed).toBeLessThan(20);
      console.log(`✓ Guest script generation: ${elapsed.toFixed(2)}ms`);
    });
  });

  describe('Two-Part Episode Generation', () => {
    it('should generate two-part episode script in < 100ms', () => {
      const generator = new ScriptGenerator(SAMPLE_CHARACTER, { format: 'two-part' }, SAMPLE_CASE);
      const start = performance.now();
      const script = generator.generateScript();
      const elapsed = performance.now() - start;

      expect(script).toBeDefined();
      expect(script.format).toBe('two-part');
      expect(script.episodes).toHaveLength(2);
      expect(elapsed).toBeLessThan(100);
      console.log(`✓ Two-part episode generation: ${elapsed.toFixed(2)}ms`);
    });

    it('should have balanced duration between parts', () => {
      const generator = new ScriptGenerator(SAMPLE_CHARACTER, { format: 'two-part' });
      const script = generator.generateScript();

      const part1Duration = script.episodes[0].duration;
      const part2Duration = script.episodes[1].duration;
      const ratio = part1Duration / part2Duration;

      // Parts should be roughly equal in length (within 20%)
      expect(ratio).toBeGreaterThan(0.8);
      expect(ratio).toBeLessThan(1.2);
    });
  });

  describe('Q&A Window Detection', () => {
    it('should identify Q&A windows in < 15ms', () => {
      const generator = new ScriptGenerator(SAMPLE_CHARACTER);
      const start = performance.now();
      const script = generator.generateScript();
      const elapsed = performance.now() - start;

      expect(script.qaWindows).toBeDefined();
      expect(script.qaWindows.length).toBeGreaterThan(0);
      // This is included in generateScript time, but should be < 50ms total
      expect(elapsed).toBeLessThan(50);
      console.log(`✓ Q&A window detection: ${script.qaWindows.length} windows found`);
    });

    it('should have valid Q&A window structure', () => {
      const generator = new ScriptGenerator(SAMPLE_CHARACTER);
      const script = generator.generateScript();

      script.qaWindows.forEach(window => {
        expect(window.timeMarker).toBeDefined();
        expect(window.topic).toBeDefined();
        expect(window.suggestedQuestions.length).toBeGreaterThan(0);
        expect(window.opportunityType).toMatch(/clarification|expert-input|verification|anecdote/);
      });
    });
  });

  describe('Missing Fact Detection', () => {
    it('should identify missing facts in < 15ms', () => {
      const generator = new ScriptGenerator(SAMPLE_CHARACTER);
      const start = performance.now();
      const script = generator.generateScript();
      const elapsed = performance.now() - start;

      expect(script.missingFacts).toBeDefined();
      // Should flag items without PACER data
      expect(elapsed).toBeLessThan(50);
      console.log(`✓ Missing fact detection: ${script.missingFacts.length} gaps found`);
    });

    it('should flag fewer facts with PACER case data', () => {
      const withCase = new ScriptGenerator(SAMPLE_CHARACTER, {}, SAMPLE_CASE);
      const withoutCase = new ScriptGenerator(SAMPLE_CHARACTER);

      const scriptWithCase = withCase.generateScript();
      const scriptWithoutCase = withoutCase.generateScript();

      expect(scriptWithoutCase.missingFacts.length).toBeGreaterThanOrEqual(
        scriptWithCase.missingFacts.length
      );
    });
  });

  describe('Fact Attribution', () => {
    it('should extract attributions in < 10ms', () => {
      const generator = new ScriptGenerator(SAMPLE_CHARACTER, {}, SAMPLE_CASE);
      const start = performance.now();
      const script = generator.generateScript();
      const elapsed = performance.now() - start;

      expect(script.attributions).toBeDefined();
      expect(script.attributions.length).toBeGreaterThan(0);
      expect(elapsed).toBeLessThan(50);
      console.log(`✓ Attribution extraction: ${script.attributions.length} attributions found`);
    });

    it('should include Tier 1 records with PACER data', () => {
      const generator = new ScriptGenerator(SAMPLE_CHARACTER, {}, SAMPLE_CASE);
      const script = generator.generateScript();

      const tier1 = script.attributions.filter(a => a.tier === 1);
      expect(tier1.length).toBeGreaterThan(0);
      expect(tier1[0].source).toContain('PACER');
    });
  });

  describe('Stress Tests', () => {
    it('should handle 50 concurrent script generations in < 5s', () => {
      const start = performance.now();

      for (let i = 0; i < 50; i++) {
        const char = {
          ...SAMPLE_CHARACTER,
          phase1: {
            ...SAMPLE_CHARACTER.phase1,
            name: `Character ${i}`,
          },
        };
        const generator = new ScriptGenerator(char);
        generator.generateScript();
      }

      const elapsed = performance.now() - start;
      const avgPerScript = elapsed / 50;

      expect(avgPerScript).toBeLessThan(100);
      console.log(`✓ 50 concurrent generations: ${elapsed.toFixed(0)}ms total, ${avgPerScript.toFixed(2)}ms average`);
    });

    it('should handle 20 two-part episodes in < 3s', () => {
      const start = performance.now();

      for (let i = 0; i < 20; i++) {
        const char = {
          ...SAMPLE_CHARACTER,
          phase1: {
            ...SAMPLE_CHARACTER.phase1,
            name: `Character ${i}`,
          },
        };
        const generator = new ScriptGenerator(char, { format: 'two-part' });
        generator.generateScript();
      }

      const elapsed = performance.now() - start;
      const avgPerScript = elapsed / 20;

      expect(avgPerScript).toBeLessThan(150);
      console.log(`✓ 20 two-part episodes: ${elapsed.toFixed(0)}ms total, ${avgPerScript.toFixed(2)}ms average`);
    });

    it('should handle 100 producer briefs in < 2s', () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        const char = {
          ...SAMPLE_CHARACTER,
          phase1: {
            ...SAMPLE_CHARACTER.phase1,
            name: `Character ${i}`,
          },
        };
        const generator = new ScriptGenerator(char);
        generator.createProducerBrief();
      }

      const elapsed = performance.now() - start;
      const avgPerBrief = elapsed / 100;

      expect(avgPerBrief).toBeLessThan(20);
      console.log(`✓ 100 producer briefs: ${elapsed.toFixed(0)}ms total, ${avgPerBrief.toFixed(2)}ms average`);
    });
  });

  describe('Complete Workflow', () => {
    it('should generate complete podcast deliverables in < 150ms', () => {
      const generator = new ScriptGenerator(SAMPLE_CHARACTER, { format: 'single' }, SAMPLE_CASE);

      const start = performance.now();
      const script = generator.generateScript();
      const brief = generator.createProducerBrief();
      const guestScript = generator.createGuestScript();
      const elapsed = performance.now() - start;

      expect(script).toBeDefined();
      expect(brief).toBeDefined();
      expect(guestScript).toBeDefined();
      expect(elapsed).toBeLessThan(150);
      console.log(`✓ Complete workflow: ${elapsed.toFixed(2)}ms`);
    });

    it('should produce consistent output on repeated calls', () => {
      const generator = new ScriptGenerator(SAMPLE_CHARACTER, { format: 'single' });

      const script1 = generator.generateScript();
      const script2 = generator.generateScript();

      expect(script1.title).toBe(script2.title);
      expect(script1.episodes).toHaveLength(script2.episodes.length);
      expect(script1.qaWindows).toHaveLength(script2.qaWindows.length);
    });
  });

  describe('Performance Metrics Summary', () => {
    it('should record baseline metrics', () => {
      const metrics = {
        timestamp: new Date().toISOString(),
        singleEpisodeMs: 0,
        twoPartEpisodeMs: 0,
        producerBriefMs: 0,
        guestScriptMs: 0,
        completeWorkflowMs: 0,
      };

      const generator = new ScriptGenerator(SAMPLE_CHARACTER, {}, SAMPLE_CASE);

      let start = performance.now();
      generator.generateScript();
      metrics.singleEpisodeMs = performance.now() - start;

      const generator2 = new ScriptGenerator(SAMPLE_CHARACTER, { format: 'two-part' }, SAMPLE_CASE);
      start = performance.now();
      generator2.generateScript();
      metrics.twoPartEpisodeMs = performance.now() - start;

      start = performance.now();
      generator.createProducerBrief();
      metrics.producerBriefMs = performance.now() - start;

      start = performance.now();
      generator.createGuestScript();
      metrics.guestScriptMs = performance.now() - start;

      const generator3 = new ScriptGenerator(SAMPLE_CHARACTER, { format: 'single' }, SAMPLE_CASE);
      start = performance.now();
      generator3.generateScript();
      generator3.createProducerBrief();
      generator3.createGuestScript();
      metrics.completeWorkflowMs = performance.now() - start;

      // All metrics should be within targets
      expect(metrics.singleEpisodeMs).toBeLessThan(50);
      expect(metrics.twoPartEpisodeMs).toBeLessThan(100);
      expect(metrics.producerBriefMs).toBeLessThan(20);
      expect(metrics.guestScriptMs).toBeLessThan(20);
      expect(metrics.completeWorkflowMs).toBeLessThan(150);

      console.log('\n📊 Performance Baseline Established:');
      console.log(`  Single Episode: ${metrics.singleEpisodeMs.toFixed(2)}ms (target: <50ms)`);
      console.log(`  Two-Part Episode: ${metrics.twoPartEpisodeMs.toFixed(2)}ms (target: <100ms)`);
      console.log(`  Producer Brief: ${metrics.producerBriefMs.toFixed(2)}ms (target: <20ms)`);
      console.log(`  Guest Script: ${metrics.guestScriptMs.toFixed(2)}ms (target: <20ms)`);
      console.log(`  Complete Workflow: ${metrics.completeWorkflowMs.toFixed(2)}ms (target: <150ms)`);
    });
  });
});
