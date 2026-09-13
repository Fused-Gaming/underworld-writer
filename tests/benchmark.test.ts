/**
 * Performance Benchmarks
 *
 * Measures performance of core underworld-writer operations
 */

import {
  createCharacter,
  validateCharacter,
  generateCharacterSummary,
  exportCharacterAsMarkdown,
  validateRelationships
} from '../src/index';
import { PACERClient, VerificationEngine } from '../src/pacer-integration';
import { AssetValidator } from '../src/asset-validation';

describe('Performance Benchmarks', () => {
  describe('Character Operations', () => {
    it('should create character in < 5ms', () => {
      const start = performance.now();

      const character = createCharacter(
        {
          name: 'Benchmark Character',
          aliases: [],
          origin: 'Test',
          physicalCharacteristics: { appearance: 'Test', distinctiveFeatures: 'None' },
          background: 'Test',
          coreMotivation: 'Test',
        },
        {
          roleAndRank: 'Test Role',
          responsibilities: ['Task1', 'Task2'],
          factionAffiliation: { primary: 'Test', allies: ['A1'], opposition: ['O1'] },
          powersAndAbilities: { abilities: ['P1'], limitations: ['L1'] },
          relationships: [{ name: 'Rel1', type: 'ally', description: 'Test' }],
          resources: { territory: 'Land', wealth: 'Money' },
        },
        {
          mythologicalFoundation: 'Mythology',
          hierarchiesAndConflicts: { internal: ['I1'], external: ['E1'], personal: ['P1'] },
          storyArc: { act1: 'A1', act2: 'A2', act3: 'A3' },
          thematicElements: ['T1', 'T2'],
          interactionPoints: ['IP1', 'IP2'],
        }
      );

      const elapsed = performance.now() - start;

      expect(character).toBeDefined();
      expect(elapsed).toBeLessThan(5);
    });

    it('should validate character in < 5ms', () => {
      const character = createCharacter(
        {
          name: 'Test',
          aliases: [],
          origin: 'Test',
          physicalCharacteristics: { appearance: 'Test', distinctiveFeatures: 'None' },
          background: 'Test',
          coreMotivation: 'Test',
        },
        {
          roleAndRank: 'Test',
          responsibilities: [],
          factionAffiliation: { primary: 'Test', allies: [], opposition: [] },
          powersAndAbilities: { abilities: [], limitations: [] },
          relationships: [],
          resources: {},
        },
        {
          mythologicalFoundation: 'Test',
          hierarchiesAndConflicts: { internal: [], external: [], personal: [] },
          storyArc: { act1: 'Test', act2: 'Test', act3: 'Test' },
          thematicElements: [],
          interactionPoints: [],
        }
      );

      const start = performance.now();
      const result = validateCharacter(character);
      const elapsed = performance.now() - start;

      expect(result).toBeDefined();
      expect(elapsed).toBeLessThan(5);
    });

    it('should generate summary in < 3ms', () => {
      const character = createCharacter(
        {
          name: 'Summary Test',
          aliases: ['Alias1'],
          origin: 'Origin',
          physicalCharacteristics: { appearance: 'Appearance', distinctiveFeatures: 'Features' },
          background: 'Background',
          coreMotivation: 'Motivation',
        },
        {
          roleAndRank: 'Role',
          responsibilities: [],
          factionAffiliation: { primary: 'Faction', allies: [], opposition: [] },
          powersAndAbilities: { abilities: [], limitations: [] },
          relationships: [],
          resources: {},
        },
        {
          mythologicalFoundation: 'Mythology',
          hierarchiesAndConflicts: { internal: [], external: [], personal: [] },
          storyArc: { act1: 'Act1', act2: 'Act2', act3: 'Act3' },
          thematicElements: [],
          interactionPoints: [],
        }
      );

      const start = performance.now();
      const summary = generateCharacterSummary(character);
      const elapsed = performance.now() - start;

      expect(summary).toBeDefined();
      expect(elapsed).toBeLessThan(3);
    });

    it('should export markdown in < 10ms', () => {
      const character = createCharacter(
        {
          name: 'Export Test',
          aliases: [],
          origin: 'Test',
          physicalCharacteristics: { appearance: 'Test', distinctiveFeatures: 'None' },
          background: 'Test',
          coreMotivation: 'Test',
        },
        {
          roleAndRank: 'Test',
          responsibilities: [],
          factionAffiliation: { primary: 'Test', allies: [], opposition: [] },
          powersAndAbilities: { abilities: [], limitations: [] },
          relationships: [],
          resources: {},
        },
        {
          mythologicalFoundation: 'Test',
          hierarchiesAndConflicts: { internal: [], external: [], personal: [] },
          storyArc: { act1: 'Test', act2: 'Test', act3: 'Test' },
          thematicElements: [],
          interactionPoints: [],
        }
      );

      const start = performance.now();
      const markdown = exportCharacterAsMarkdown(character);
      const elapsed = performance.now() - start;

      expect(markdown).toBeDefined();
      expect(elapsed).toBeLessThan(10);
    });

    it('should validate relationships in < 5ms', () => {
      const char1 = createCharacter(
        {
          name: 'Char1',
          aliases: [],
          origin: 'Test',
          physicalCharacteristics: { appearance: 'Test', distinctiveFeatures: 'None' },
          background: 'Test',
          coreMotivation: 'Test',
        },
        {
          roleAndRank: 'Test',
          responsibilities: [],
          factionAffiliation: { primary: 'Faction1', allies: [], opposition: [] },
          powersAndAbilities: { abilities: [], limitations: [] },
          relationships: [],
          resources: {},
        },
        {
          mythologicalFoundation: 'Test',
          hierarchiesAndConflicts: { internal: [], external: [], personal: [] },
          storyArc: { act1: 'Test', act2: 'Test', act3: 'Test' },
          thematicElements: [],
          interactionPoints: [],
        }
      );

      const char2 = createCharacter(
        {
          name: 'Char2',
          aliases: [],
          origin: 'Test',
          physicalCharacteristics: { appearance: 'Test', distinctiveFeatures: 'None' },
          background: 'Test',
          coreMotivation: 'Test',
        },
        {
          roleAndRank: 'Test',
          responsibilities: [],
          factionAffiliation: { primary: 'Faction2', allies: [], opposition: [] },
          powersAndAbilities: { abilities: [], limitations: [] },
          relationships: [],
          resources: {},
        },
        {
          mythologicalFoundation: 'Test',
          hierarchiesAndConflicts: { internal: [], external: [], personal: [] },
          storyArc: { act1: 'Test', act2: 'Test', act3: 'Test' },
          thematicElements: [],
          interactionPoints: [],
        }
      );

      const start = performance.now();
      const result = validateRelationships(char1, char2);
      const elapsed = performance.now() - start;

      expect(result).toBeDefined();
      expect(elapsed).toBeLessThan(5);
    });
  });

  describe('PACER Integration', () => {
    it('should query PACER case in < 10ms (mock mode)', async () => {
      const client = new PACERClient();

      const start = performance.now();
      const result = await client.queryCaseByNumber('03-CR-0322', 'Middle District of Florida');
      const elapsed = performance.now() - start;

      expect(result).toBeDefined();
      expect(elapsed).toBeLessThan(10);
    });

    it('should classify claim in < 5ms', () => {
      const engine = new VerificationEngine();

      const start = performance.now();
      const result = engine.classifyClaim(
        'Brett Johnson served 90 months in federal prison',
        {
          pacer: {
            caseNumber: '03-CR-0322',
            title: 'United States v. Brett Johnson',
            district: 'Middle District of Florida',
            filedDate: '2003-01-15',
            status: 'closed',
            defendants: ['Brett Johnson'],
            docketEntries: [],
            sentencingInfo: {
              sentenceDate: '2004-01-20',
              sentenceLength: '90 months',
              releaseDate: '2007-10-08',
            },
          },
          dojStatement: 'Federal prosecution document',
          newsArticles: 5,
        }
      );
      const elapsed = performance.now() - start;

      expect(result).toBeDefined();
      expect(elapsed).toBeLessThan(5);
    });
  });

  describe('Asset Validation', () => {
    it('should validate asset in < 5ms', async () => {
      const validator = new AssetValidator();

      const start = performance.now();
      const result = await validator.validateAsset({
        path: 'assets/test.svg',
        license: 'svgrepo-free',
        attribution: 'Test Author',
        usage: 'package-icon',
      });
      const elapsed = performance.now() - start;

      expect(result).toBeDefined();
      expect(elapsed).toBeLessThan(5);
    });

    it('should get attribution string in < 2ms', () => {
      const validator = new AssetValidator();

      const start = performance.now();
      const attribution = validator.getAttributionString({
        path: 'assets/test.svg',
        license: 'svgrepo-free',
        attribution: 'Test',
        usage: 'package-icon',
      });
      const elapsed = performance.now() - start;

      expect(attribution).toBeDefined();
      expect(elapsed).toBeLessThan(2);
    });
  });

  describe('Stress Tests', () => {
    it('should handle 100 character creations', () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        createCharacter(
          {
            name: `Character ${i}`,
            aliases: [],
            origin: 'Test',
            physicalCharacteristics: { appearance: 'Test', distinctiveFeatures: 'None' },
            background: 'Test',
            coreMotivation: 'Test',
          },
          {
            roleAndRank: `Role ${i}`,
            responsibilities: [],
            factionAffiliation: { primary: 'Test', allies: [], opposition: [] },
            powersAndAbilities: { abilities: [], limitations: [] },
            relationships: [],
            resources: {},
          },
          {
            mythologicalFoundation: 'Test',
            hierarchiesAndConflicts: { internal: [], external: [], personal: [] },
            storyArc: { act1: 'Test', act2: 'Test', act3: 'Test' },
            thematicElements: [],
            interactionPoints: [],
          }
        );
      }

      const elapsed = performance.now() - start;
      const avgPerChar = elapsed / 100;

      expect(avgPerChar).toBeLessThan(2);
    });

    it('should handle 50 asset validations', async () => {
      const validator = new AssetValidator();

      const start = performance.now();

      for (let i = 0; i < 50; i++) {
        await validator.validateAsset({
          path: `assets/test${i}.svg`,
          license: 'svgrepo-free',
          attribution: `Author ${i}`,
          usage: 'package-icon',
        });
      }

      const elapsed = performance.now() - start;
      const avgPerValidation = elapsed / 50;

      expect(avgPerValidation).toBeLessThan(1);
    });
  });
});
