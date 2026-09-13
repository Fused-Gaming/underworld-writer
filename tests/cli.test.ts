/**
 * CLI Integration Tests
 *
 * Tests for command-line interface functionality
 */

import { createCharacter, generateCharacterSummary, exportCharacterAsMarkdown } from '../src/index';

describe('CLI Commands', () => {
  describe('Character Creation', () => {
    it('should create a basic character with minimal arguments', () => {
      const character = createCharacter(
        {
          name: 'Test Character',
          aliases: [],
          origin: 'Test origin',
          physicalCharacteristics: {
            appearance: 'Test appearance',
            distinctiveFeatures: 'None',
          },
          background: 'Test background',
          coreMotivation: 'Test motivation',
        },
        {
          roleAndRank: 'Test Role',
          responsibilities: [],
          factionAffiliation: {
            primary: 'Test Faction',
            allies: [],
            opposition: [],
          },
          powersAndAbilities: {
            abilities: [],
            limitations: [],
          },
          relationships: [],
          resources: {},
        },
        {
          mythologicalFoundation: 'Test mythology',
          hierarchiesAndConflicts: {
            internal: [],
            external: [],
            personal: [],
          },
          storyArc: {
            act1: 'Beginning',
            act2: 'Middle',
            act3: 'End',
          },
          thematicElements: [],
          interactionPoints: [],
        }
      );

      expect(character).toBeDefined();
      expect(character.phase1.name).toBe('Test Character');
      expect(character.phase1.origin).toBe('Test origin');
    });

    it('should create a character with complex faction relationships', () => {
      const character = createCharacter(
        {
          name: 'Lucifer Kane',
          aliases: ['The Crimson Judge'],
          origin: 'Former prosecutor turned crime lord',
          physicalCharacteristics: {
            appearance: 'Tall, imposing',
            distinctiveFeatures: 'Scarred left temple',
          },
          background: 'Corrupted by organized crime prosecution',
          coreMotivation: 'Build criminal empire',
        },
        {
          roleAndRank: 'Don of Eastern Syndicate',
          responsibilities: ['Territory management', 'Dispute resolution'],
          factionAffiliation: {
            primary: 'The Underworld Collective',
            allies: ['Russian Mafia'],
            opposition: ['Federal Task Force'],
          },
          powersAndAbilities: {
            abilities: ['Legal expertise', 'Strategic planning'],
            limitations: ['No direct combat', 'Political exposure'],
          },
          relationships: [
            { name: 'Detective Sarah Chen', type: 'enemy', description: 'Pursuing for 10 years' }
          ],
          resources: {
            territory: 'Downtown Chicago',
            followers: 250,
            wealth: '$50M',
          },
        },
        {
          mythologicalFoundation: 'Faustian bargain',
          hierarchiesAndConflicts: {
            internal: ['Loyalty vs ambition'],
            external: ['Police intervention'],
            personal: ['Moral deterioration'],
          },
          storyArc: {
            act1: 'Rise to power',
            act2: 'Consolidation',
            act3: 'Fall to prosecution',
          },
          thematicElements: ['Power corruption', 'Justice vs law'],
          interactionPoints: ['Recruit allies', 'Negotiate territory'],
        }
      );

      expect(character.phase2.factionAffiliation.primary).toBe('The Underworld Collective');
      expect(character.phase2.factionAffiliation.allies).toContain('Russian Mafia');
      expect(character.phase2.relationships.length).toBe(1);
    });
  });

  describe('Character Summary Generation', () => {
    it('should generate a valid summary string', () => {
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

      const summary = generateCharacterSummary(character);

      expect(summary).toBeDefined();
      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);
      expect(summary).toContain('Test');
    });

    it('should include key character details in summary', () => {
      const character = createCharacter(
        {
          name: 'Hades',
          aliases: ['Lord of the Underworld'],
          origin: 'Ancient mythology',
          physicalCharacteristics: { appearance: 'Dark robes', distinctiveFeatures: 'Pale skin' },
          background: 'Rules the underworld',
          coreMotivation: 'Maintain order in realm',
        },
        {
          roleAndRank: 'King',
          responsibilities: ['Rule underworld', 'Judge souls'],
          factionAffiliation: { primary: 'Olympian', allies: ['Persephone'], opposition: ['Hera'] },
          powersAndAbilities: { abilities: ['Immortality', 'Control over dead'], limitations: ['Cannot leave realm'] },
          relationships: [{ name: 'Persephone', type: 'ally', description: 'Wife' }],
          resources: { territory: 'Underworld', wealth: 'Immeasurable' },
        },
        {
          mythologicalFoundation: 'Greek mythology',
          hierarchiesAndConflicts: { internal: [], external: [], personal: [] },
          storyArc: { act1: 'Claim throne', act2: 'Rule', act3: 'Eternal reign' },
          thematicElements: ['Death', 'Power', 'Justice'],
          interactionPoints: [],
        }
      );

      const summary = generateCharacterSummary(character);

      expect(summary).toContain('Hades');
      expect(summary).toContain('King');
    });
  });

  describe('Character Export as Markdown', () => {
    it('should export character as valid markdown', () => {
      const character = createCharacter(
        {
          name: 'Test Character',
          aliases: [],
          origin: 'Test',
          physicalCharacteristics: { appearance: 'Test', distinctiveFeatures: 'None' },
          background: 'Test',
          coreMotivation: 'Test',
        },
        {
          roleAndRank: 'Test Role',
          responsibilities: [],
          factionAffiliation: { primary: 'Test Faction', allies: [], opposition: [] },
          powersAndAbilities: { abilities: ['Test ability'], limitations: [] },
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

      const markdown = exportCharacterAsMarkdown(character);

      expect(markdown).toBeDefined();
      expect(typeof markdown).toBe('string');
      expect(markdown).toContain('#');
      expect(markdown).toContain('Test Character');
    });

    it('should include all character sections in markdown', () => {
      const character = createCharacter(
        {
          name: 'Detailed Character',
          aliases: ['Alias1', 'Alias2'],
          origin: 'Complex origin',
          physicalCharacteristics: { appearance: 'Detailed appearance', distinctiveFeatures: 'Scar' },
          background: 'Complex background story',
          coreMotivation: 'Clear motivation',
        },
        {
          roleAndRank: 'Leader',
          responsibilities: ['Lead faction', 'Make decisions'],
          factionAffiliation: { primary: 'Main Faction', allies: ['Ally1'], opposition: ['Enemy1'] },
          powersAndAbilities: { abilities: ['Power1', 'Power2'], limitations: ['Limitation1'] },
          relationships: [{ name: 'John', type: 'ally', description: 'Close ally' }],
          resources: { territory: 'Land', wealth: 'Rich' },
        },
        {
          mythologicalFoundation: 'Based on mythology',
          hierarchiesAndConflicts: { internal: ['Internal conflict'], external: ['External threat'], personal: ['Personal struggle'] },
          storyArc: { act1: 'Act 1', act2: 'Act 2', act3: 'Act 3' },
          thematicElements: ['Theme1', 'Theme2'],
          interactionPoints: ['Point1', 'Point2'],
        }
      );

      const markdown = exportCharacterAsMarkdown(character);

      expect(markdown).toContain('Detailed Character');
      expect(markdown).toContain('Alias1');
      expect(markdown).toContain('Leader');
      expect(markdown).toContain('Main Faction');
    });

    it('should produce readable markdown with proper formatting', () => {
      const character = createCharacter(
        {
          name: 'Formatted Test',
          aliases: [],
          origin: 'Origin story',
          physicalCharacteristics: { appearance: 'Appearance', distinctiveFeatures: 'Features' },
          background: 'Background info',
          coreMotivation: 'Motivation',
        },
        {
          roleAndRank: 'Test Rank',
          responsibilities: [],
          factionAffiliation: { primary: 'Faction', allies: [], opposition: [] },
          powersAndAbilities: { abilities: [], limitations: [] },
          relationships: [],
          resources: {},
        },
        {
          mythologicalFoundation: 'Mythology',
          hierarchiesAndConflicts: { internal: [], external: [], personal: [] },
          storyArc: { act1: 'Start', act2: 'Middle', act3: 'End' },
          thematicElements: [],
          interactionPoints: [],
        }
      );

      const markdown = exportCharacterAsMarkdown(character);
      const lines = markdown.split('\n');

      expect(lines.length).toBeGreaterThan(5);
      expect(lines.some(line => line.startsWith('#'))).toBe(true);
    });
  });

  describe('CLI Error Handling', () => {
    it('should handle missing required arguments gracefully', () => {
      expect(() => {
        createCharacter(
          {
            name: '',
            aliases: [],
            origin: '',
            physicalCharacteristics: { appearance: '', distinctiveFeatures: '' },
            background: '',
            coreMotivation: '',
          },
          {
            roleAndRank: '',
            responsibilities: [],
            factionAffiliation: { primary: '', allies: [], opposition: [] },
            powersAndAbilities: { abilities: [], limitations: [] },
            relationships: [],
            resources: {},
          },
          {
            mythologicalFoundation: '',
            hierarchiesAndConflicts: { internal: [], external: [], personal: [] },
            storyArc: { act1: '', act2: '', act3: '' },
            thematicElements: [],
            interactionPoints: [],
          }
        );
      }).not.toThrow();
    });

    it('should validate character output is serializable to JSON', () => {
      const character = createCharacter(
        {
          name: 'Serializable',
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

      expect(() => {
        JSON.stringify(character);
      }).not.toThrow();
    });
  });
});
