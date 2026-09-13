/**
 * MCP Tool Registration for Underworld Writer
 *
 * Exports tool definitions for registration with MCP framework
 * for integration with Claude MCP ecosystem
 */

import type {
  UnderWorldCharacter,
} from './index.js';

import {
  createCharacter,
  validateCharacter,
  generateCharacterSummary,
  validateRelationships,
  exportCharacterAsMarkdown,
} from './index.js';

/**
 * Tool definitions for underworld writer functionality
 */
export const UNDERWORLD_WRITER_TOOLS = [
  {
    name: 'underworld_create_character',
    description: 'Create a detailed underworld character profile with three-phase methodology',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Character name' },
        origin: { type: 'string', description: 'Character origin story' },
        motivation: { type: 'string', description: 'Core motivation driving the character' },
        role: { type: 'string', description: 'Role in the underworld' },
        faction: { type: 'string', description: 'Primary faction affiliation' },
        storyArc: {
          type: 'object',
          properties: {
            act1: { type: 'string' },
            act2: { type: 'string' },
            act3: { type: 'string' },
          },
          description: 'Three-act story arc',
        },
      },
      required: ['name', 'origin', 'motivation', 'role', 'faction', 'storyArc'],
    },
    handler: async (params: any) => {
      try {
        const character = createCharacter(
          {
            name: params.name,
            aliases: [],
            origin: params.origin,
            physicalCharacteristics: {
              appearance: 'To be developed',
              distinctiveFeatures: 'To be developed',
            },
            background: params.origin,
            coreMotivation: params.motivation,
          },
          {
            roleAndRank: params.role,
            responsibilities: [],
            factionAffiliation: {
              primary: params.faction,
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
            mythologicalFoundation: '',
            hierarchiesAndConflicts: {
              internal: [],
              external: [],
              personal: [],
            },
            storyArc: params.storyArc,
            thematicElements: [],
            interactionPoints: [],
          }
        );

        return {
          status: 'success',
          character,
          summary: generateCharacterSummary(character),
        };
      } catch (error) {
        return {
          status: 'error',
          message: error instanceof Error ? error.message : 'Failed to create character',
        };
      }
    },
  },
  {
    name: 'underworld_validate_character',
    description: 'Validate a character profile for completeness and consistency',
    inputSchema: {
      type: 'object',
      properties: {
        character: { type: 'object', description: 'Character profile to validate' },
      },
      required: ['character'],
    },
    handler: async (params: any) => {
      try {
        const result = validateCharacter(params.character as Partial<UnderWorldCharacter>);
        return { status: 'success', validation: result };
      } catch (error) {
        return { status: 'error', message: error instanceof Error ? error.message : 'Validation failed' };
      }
    },
  },
  {
    name: 'underworld_export_character',
    description: 'Export character profile as formatted markdown documentation',
    inputSchema: {
      type: 'object',
      properties: {
        character: { type: 'object', description: 'Character profile to export' },
      },
      required: ['character'],
    },
    handler: async (params: any) => {
      try {
        const markdown = exportCharacterAsMarkdown(params.character as UnderWorldCharacter);
        return { status: 'success', markdown };
      } catch (error) {
        return { status: 'error', message: error instanceof Error ? error.message : 'Export failed' };
      }
    },
  },
  {
    name: 'underworld_validate_relationships',
    description: 'Check relationship consistency between two characters',
    inputSchema: {
      type: 'object',
      properties: {
        character1: { type: 'object', description: 'First character profile' },
        character2: { type: 'object', description: 'Second character profile' },
      },
      required: ['character1', 'character2'],
    },
    handler: async (params: any) => {
      try {
        const result = validateRelationships(
          params.character1 as UnderWorldCharacter,
          params.character2 as UnderWorldCharacter
        );
        return { status: 'success', validation: result };
      } catch (error) {
        return { status: 'error', message: error instanceof Error ? error.message : 'Relationship validation failed' };
      }
    },
  },
];

/**
 * Register all underworld writer tools with an MCP orchestrator
 */
export async function registerUnderWorldWriterTools(orchestrator: any): Promise<void> {
  for (const tool of UNDERWORLD_WRITER_TOOLS) {
    orchestrator.registerTool(tool.name, tool.description, tool.inputSchema, tool.handler);
  }
}

export default {
  UNDERWORLD_WRITER_TOOLS,
  registerUnderWorldWriterTools,
};
