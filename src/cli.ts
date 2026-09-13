#!/usr/bin/env node

/**
 * Underworld Writer CLI
 *
 * Command-line interface for character creation and narrative development
 */

import { createCharacter, generateCharacterSummary, exportCharacterAsMarkdown } from './index.js';

const args = process.argv.slice(2);
const command = args[0];

function printUsage() {
  console.log(`
🌑 Underworld Writer CLI

Usage:
  underworld-writer [command] [options]

Commands:
  create                 Create a new character
  summary <character>    Generate character summary
  export <character>     Export character as markdown
  help                   Show this help message

Examples:
  underworld-writer create --name "Hades" --role "Lord of the Underworld"
  underworld-writer summary --file character.json
  underworld-writer export --file character.json

Options:
  --name <string>        Character name
  --role <string>        Character role
  --faction <string>     Faction affiliation
  --file <path>          Path to character JSON file
  --output <path>        Output file path (for export)
  --help                 Show help for command
`);
}

async function main() {
  if (!command || command === 'help' || command === '--help') {
    printUsage();
    process.exit(0);
  }

  try {
    switch (command) {
      case 'create': {
        console.log('📝 Creating new underworld character...\n');

        // Parse arguments
        const nameArg = args.find((arg, i) => arg === '--name' && args[i + 1]);
        const roleArg = args.find((arg, i) => arg === '--role' && args[i + 1]);
        const factionArg = args.find((arg, i) => arg === '--faction' && args[i + 1]);

        const name = nameArg ? args[args.indexOf(nameArg) + 1] : 'Unknown Character';
        const role = roleArg ? args[args.indexOf(roleArg) + 1] : 'Inhabitant';
        const faction = factionArg ? args[args.indexOf(factionArg) + 1] : 'Independent';

        const character = createCharacter(
          {
            name,
            aliases: [],
            origin: `A mysterious figure from the underworld`,
            physicalCharacteristics: {
              appearance: 'To be developed',
              distinctiveFeatures: 'To be developed',
            },
            background: `Background of ${name}`,
            coreMotivation: 'To be determined',
          },
          {
            roleAndRank: role,
            responsibilities: [],
            factionAffiliation: {
              primary: faction,
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
            storyArc: {
              act1: 'Emergence',
              act2: 'Conflict',
              act3: 'Resolution',
            },
            thematicElements: [],
            interactionPoints: [],
          }
        );

        console.log(generateCharacterSummary(character));
        console.log('\n✅ Character created successfully!\n');
        console.log(JSON.stringify(character, null, 2));
        break;
      }

      case 'summary': {
        console.log('📊 Generating character summary...\n');
        const fileArg = args.find((arg, i) => arg === '--file' && args[i + 1]);
        if (!fileArg) {
          console.error('Error: --file argument required');
          printUsage();
          process.exit(1);
        }

        const filePath = args[args.indexOf(fileArg) + 1];
        const { readFileSync } = await import('fs');

        try {
          const data = JSON.parse(readFileSync(filePath, 'utf-8'));
          const summary = generateCharacterSummary(data);
          console.log(summary);
        } catch (error) {
          console.error(`Error reading file: ${filePath}`);
          process.exit(1);
        }
        break;
      }

      case 'export': {
        console.log('📄 Exporting character...\n');
        const fileArg = args.find((arg, i) => arg === '--file' && args[i + 1]);
        if (!fileArg) {
          console.error('Error: --file argument required');
          printUsage();
          process.exit(1);
        }

        const filePath = args[args.indexOf(fileArg) + 1];
        const outputArg = args.find((arg, i) => arg === '--output' && args[i + 1]);
        const outputPath = outputArg ? args[args.indexOf(outputArg) + 1] : 'character.md';

        const { readFileSync, writeFileSync } = await import('fs');

        try {
          const data = JSON.parse(readFileSync(filePath, 'utf-8'));
          const markdown = exportCharacterAsMarkdown(data);
          writeFileSync(outputPath, markdown);
          console.log(`✅ Character exported to: ${outputPath}\n`);
        } catch (error) {
          console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          process.exit(1);
        }
        break;
      }

      default:
        console.error(`Unknown command: ${command}`);
        printUsage();
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
