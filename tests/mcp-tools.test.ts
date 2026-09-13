/**
 * MCP Tools Integration Tests
 *
 * Tests for MCP tool definitions and handlers
 */

import { UNDERWORLD_WRITER_TOOLS } from '../src/mcp-tools';
import { createCharacter } from '../src/index';

describe('MCP Tools', () => {
  describe('Tool Definitions', () => {
    it('should define all required tools', () => {
      expect(UNDERWORLD_WRITER_TOOLS).toBeDefined();
      expect(UNDERWORLD_WRITER_TOOLS.length).toBeGreaterThan(0);
    });

    it('should have underworld_create_character tool', () => {
      const tool = UNDERWORLD_WRITER_TOOLS.find(t => t.name === 'underworld_create_character');
      expect(tool).toBeDefined();
      expect(tool?.description).toContain('Create a detailed underworld character');
    });

    it('should have underworld_validate_character tool', () => {
      const tool = UNDERWORLD_WRITER_TOOLS.find(t => t.name === 'underworld_validate_character');
      expect(tool).toBeDefined();
      expect(tool?.description).toContain('Validate a character profile');
    });

    it('should have underworld_export_character tool', () => {
      const tool = UNDERWORLD_WRITER_TOOLS.find(t => t.name === 'underworld_export_character');
      expect(tool).toBeDefined();
      expect(tool?.description).toContain('Export character');
    });

    it('should have underworld_validate_relationships tool', () => {
      const tool = UNDERWORLD_WRITER_TOOLS.find(t => t.name === 'underworld_validate_relationships');
      expect(tool).toBeDefined();
      expect(tool?.description).toContain('Check relationship consistency');
    });
  });

  describe('Tool Schema Validation', () => {
    it('should define valid input schemas for all tools', () => {
      for (const tool of UNDERWORLD_WRITER_TOOLS) {
        expect(tool.inputSchema).toBeDefined();
        expect(tool.inputSchema.type).toBe('object');
        expect(tool.inputSchema.properties).toBeDefined();
      }
    });

    it('should have required fields in create_character schema', () => {
      const tool = UNDERWORLD_WRITER_TOOLS.find(t => t.name === 'underworld_create_character');
      expect(tool?.inputSchema.required).toContain('name');
      expect(tool?.inputSchema.required).toContain('origin');
      expect(tool?.inputSchema.required).toContain('motivation');
      expect(tool?.inputSchema.required).toContain('role');
      expect(tool?.inputSchema.required).toContain('faction');
    });
  });

  describe('Tool Handlers', () => {
    it('should have handler functions for all tools', () => {
      for (const tool of UNDERWORLD_WRITER_TOOLS) {
        expect(tool.handler).toBeDefined();
        expect(typeof tool.handler).toBe('function');
      }
    });

    it('underworld_create_character handler should process parameters correctly', async () => {
      const tool = UNDERWORLD_WRITER_TOOLS.find(t => t.name === 'underworld_create_character');

      const params = {
        name: 'Test Character',
        origin: 'Test origin story',
        motivation: 'Test motivation',
        role: 'Test Role',
        faction: 'Test Faction',
        storyArc: {
          act1: 'Act One',
          act2: 'Act Two',
          act3: 'Act Three',
        },
      };

      const result = await tool!.handler(params);

      expect(result).toBeDefined();
      expect(result.status).toBe('success');
      expect((result as any).character).toBeDefined();
      expect((result as any).summary).toBeDefined();
    });

    it('underworld_create_character handler should return character with correct properties', async () => {
      const tool = UNDERWORLD_WRITER_TOOLS.find(t => t.name === 'underworld_create_character');

      const params = {
        name: 'Lucifer Kane',
        origin: 'Former prosecutor turned crime lord',
        motivation: 'Build criminal empire',
        role: 'Crime Lord',
        faction: 'The Syndicate',
        storyArc: {
          act1: 'Rise',
          act2: 'Consolidate',
          act3: 'Fall',
        },
      };

      const result = await tool!.handler(params);

      expect((result as any).character.phase1.name).toBe('Lucifer Kane');
      expect((result as any).character.phase2.roleAndRank).toBe('Crime Lord');
      expect((result as any).character.phase2.factionAffiliation.primary).toBe('The Syndicate');
    });

    it('underworld_validate_character handler should handle character validation', async () => {
      const tool = UNDERWORLD_WRITER_TOOLS.find(t => t.name === 'underworld_validate_character');

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

      const result = await tool!.handler({ character });

      expect(result.status).toBe('success');
      expect((result as any).validation).toBeDefined();
    });

    it('underworld_export_character handler should export markdown', async () => {
      const tool = UNDERWORLD_WRITER_TOOLS.find(t => t.name === 'underworld_export_character');

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
          roleAndRank: 'Test Role',
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

      const result = await tool!.handler({ character });

      expect(result.status).toBe('success');
      expect((result as any).markdown).toBeDefined();
      expect(typeof (result as any).markdown).toBe('string');
      expect((result as any).markdown).toContain('Export Test');
    });

    it('underworld_validate_relationships handler should handle relationship validation', async () => {
      const tool = UNDERWORLD_WRITER_TOOLS.find(t => t.name === 'underworld_validate_relationships');

      const character1 = createCharacter(
        {
          name: 'Character 1',
          aliases: [],
          origin: 'Test',
          physicalCharacteristics: { appearance: 'Test', distinctiveFeatures: 'None' },
          background: 'Test',
          coreMotivation: 'Test',
        },
        {
          roleAndRank: 'Test',
          responsibilities: [],
          factionAffiliation: { primary: 'Faction A', allies: [], opposition: [] },
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

      const character2 = createCharacter(
        {
          name: 'Character 2',
          aliases: [],
          origin: 'Test',
          physicalCharacteristics: { appearance: 'Test', distinctiveFeatures: 'None' },
          background: 'Test',
          coreMotivation: 'Test',
        },
        {
          roleAndRank: 'Test',
          responsibilities: [],
          factionAffiliation: { primary: 'Faction B', allies: [], opposition: [] },
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

      const result = await tool!.handler({ character1, character2 });

      expect(result.status).toBe('success');
      expect((result as any).validation).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('create_character handler should handle errors gracefully', async () => {
      const tool = UNDERWORLD_WRITER_TOOLS.find(t => t.name === 'underworld_create_character');

      // Missing required fields
      const params = {
        name: 'Test',
        // Missing other required fields
      };

      const result = await tool!.handler(params);

      expect(result).toBeDefined();
      // Should still return a result, even if error
    });

    it('validate_character handler should handle invalid input', async () => {
      const tool = UNDERWORLD_WRITER_TOOLS.find(t => t.name === 'underworld_validate_character');

      const result = await tool!.handler({ character: {} });

      expect(result).toBeDefined();
      expect(result.status).toBe('success');
    });
  });
});
