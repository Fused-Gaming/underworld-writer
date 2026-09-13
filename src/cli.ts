#!/usr/bin/env node

/**
 * Underworld Writer CLI
 *
 * Command-line interface for character creation, narrative development,
 * and podcast script generation for true crime producers
 */

import { createCharacter, generateCharacterSummary, exportCharacterAsMarkdown } from './index.js';
import { ScriptGenerator } from './podcast-script-generator.js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

const args = process.argv.slice(2);
const command = args[0];

function printUsage() {
  console.log(`
🌑 Underworld Writer CLI

Usage:
  underworld-writer [command] [options]

Character Commands:
  create                 Create a new character
  summary <character>    Generate character summary
  export <character>     Export character as markdown

Podcast Commands:
  generate-script        Generate podcast episode script
  generate-guest-handoff Create guest interview preparation materials
  format-script          Format and validate podcast script
  validate-script        Validate script structure and content
  benchmark              Run performance benchmarks

Global:
  help                   Show this help message

Examples:
  underworld-writer create --name "Hades" --role "Lord of the Underworld"
  underworld-writer generate-script --character character.json --format two-part --output script.md
  underworld-writer generate-guest-handoff --character character.json --output guest/
  underworld-writer benchmark

Options:
  --name <string>        Character name
  --role <string>        Character role
  --faction <string>     Faction affiliation
  --file <path>          Path to character JSON file
  --character <path>     Path to character JSON file (podcast commands)
  --case <path>          Path to PACER case data JSON file
  --format <string>      Episode format: single or two-part
  --output <path>        Output file path (for export/script)
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

      case 'generate-script': {
        console.log('🎙️  Generating podcast episode script...\n');

        const characterArg = args.find((arg, i) => arg === '--character' && args[i + 1]);
        const caseArg = args.find((arg, i) => arg === '--case' && args[i + 1]);
        const formatArg = args.find((arg, i) => arg === '--format' && args[i + 1]);
        const outputArg = args.find((arg, i) => arg === '--output' && args[i + 1]);

        if (!characterArg) {
          console.error('Error: --character argument required');
          printUsage();
          process.exit(1);
        }

        const characterPath = args[args.indexOf(characterArg) + 1];
        const casePath = caseArg ? args[args.indexOf(caseArg) + 1] : undefined;
        const format = formatArg ? args[args.indexOf(formatArg) + 1] : 'two-part';
        const outputPath = outputArg ? args[args.indexOf(outputArg) + 1] : 'generated-script.md';

        try {
          const character = JSON.parse(readFileSync(characterPath, 'utf-8'));
          const caseData = casePath ? JSON.parse(readFileSync(casePath, 'utf-8')) : undefined;

          const generator = new ScriptGenerator(character, { format: format as 'single' | 'two-part' }, caseData);
          const script = generator.generateScript();

          let output = `# ${script.title}\n\n`;
          output += `**Format:** ${script.format === 'single' ? 'Single Episode' : 'Two-Part Episode'}\n`;
          output += `**Total Duration:** ${script.episodes.reduce((sum, e) => sum + e.duration, 0)} minutes\n`;
          output += `**Generated:** ${new Date().toLocaleDateString()}\n`;
          if (script.metadata.caseReference) {
            output += `**Case Reference:** ${script.metadata.caseReference}\n`;
          }
          output += `**Verification Status:** ${script.metadata.verificationStatus}\n\n---\n\n`;

          script.episodes.forEach((episode) => {
            output += `## Part ${episode.partNumber}\n\n`;
            output += `**Duration:** ${episode.duration} minutes\n\n`;
            episode.segments.forEach((segment) => {
              output += `### ${segment.title}\n\n${segment.text}\n\n`;
              if (segment.pausePoints?.length) {
                output += `**[PAUSE]** - ${segment.pausePoints.join(', ')}\n\n`;
              }
            });
            output += `**Closing:** ${episode.closingStatement}\n\n---\n\n`;
          });

          const dir = dirname(resolve(outputPath));
          mkdirSync(dir, { recursive: true });
          writeFileSync(resolve(outputPath), output);

          console.log(`✅ Episode script generated successfully!`);
          console.log(`📁 Output: ${resolve(outputPath)}\n`);
          console.log(`📊 Statistics:`);
          console.log(`   Title: ${script.title}`);
          console.log(`   Format: ${format}`);
          console.log(`   Duration: ${script.episodes.reduce((sum, e) => sum + e.duration, 0)} minutes`);
          console.log(`   Q&A Windows: ${script.qaWindows.length}`);
          console.log(`   Missing Facts: ${script.missingFacts.length}\n`);
        } catch (error) {
          console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          process.exit(1);
        }
        break;
      }

      case 'generate-guest-handoff': {
        console.log('📋 Generating guest handoff materials...\n');

        const characterArg = args.find((arg, i) => arg === '--character' && args[i + 1]);
        const outputArg = args.find((arg, i) => arg === '--output' && args[i + 1]);

        if (!characterArg) {
          console.error('Error: --character argument required');
          printUsage();
          process.exit(1);
        }

        const characterPath = args[args.indexOf(characterArg) + 1];
        const outputDir = outputArg ? args[args.indexOf(outputArg) + 1] : 'guest-handoff/';

        try {
          const character = JSON.parse(readFileSync(characterPath, 'utf-8'));
          const generator = new ScriptGenerator(character, { format: 'two-part' });

          const producerBrief = generator.createProducerBrief();
          const guestScript = generator.createGuestScript();

          mkdirSync(outputDir, { recursive: true });

          let briefMd = `# Producer Brief: ${producerBrief.episodeTitle}\n\n`;
          briefMd += `**Character:** ${producerBrief.characterName}\n`;
          briefMd += `**Duration:** ${producerBrief.duration}\n\n`;
          briefMd += `## Summary\n${producerBrief.summary}\n\n`;
          briefMd += `## Key Facts\n`;
          producerBrief.keyFacts.forEach(f => briefMd += `- ${f}\n`);
          briefMd += `\n## Talking Points\n`;
          producerBrief.talkingPoints.forEach(p => briefMd += `- ${p}\n`);
          briefMd += `\n## Recording Notes\n`;
          producerBrief.recordingNotes.forEach(n => briefMd += `- ${n}\n`);

          writeFileSync(`${outputDir}/producer-brief.md`, briefMd);
          writeFileSync(`${outputDir}/script-data.json`, JSON.stringify({ producerBrief, guestScript }, null, 2));

          console.log(`✅ Guest handoff materials generated!\n`);
          console.log(`📁 Output Directory: ${resolve(outputDir)}`);
          console.log(`   ✓ producer-brief.md`);
          console.log(`   ✓ script-data.json\n`);
          console.log(`🎯 Ready for guest preparation!\n`);
        } catch (error) {
          console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          process.exit(1);
        }
        break;
      }

      case 'validate-script': {
        console.log('✓ Validating podcast script...\n');

        const characterArg = args.find((arg, i) => arg === '--character' && args[i + 1]);

        if (!characterArg) {
          console.error('Error: --character argument required');
          printUsage();
          process.exit(1);
        }

        const characterPath = args[args.indexOf(characterArg) + 1];

        try {
          const character = JSON.parse(readFileSync(characterPath, 'utf-8'));
          const generator = new ScriptGenerator(character);
          const script = generator.generateScript();

          console.log(`📋 Script Validation Results:\n`);
          console.log(`✓ Character loaded: ${script.metadata.characterName}`);
          console.log(`✓ Format: ${script.format}`);
          console.log(`✓ Episodes: ${script.episodes.length}`);
          console.log(`✓ Total segments: ${script.episodes.reduce((sum, e) => sum + e.segments.length, 0)}`);
          console.log(`✓ Q&A Windows: ${script.qaWindows.length}`);
          console.log(`✓ Fact Attributions: ${script.attributions.length}`);
          console.log(`✓ Verification Status: ${script.metadata.verificationStatus}\n`);
          console.log(`✅ Script validation passed!\n`);
        } catch (error) {
          console.error(`❌ Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          process.exit(1);
        }
        break;
      }

      case 'format-script': {
        console.log('📄 Formatting podcast script for producers and guests...\n');

        const characterArg = args.find((arg, i) => arg === '--character' && args[i + 1]);
        const caseArg = args.find((arg, i) => arg === '--case' && args[i + 1]);
        const outputArg = args.find((arg, i) => arg === '--output' && args[i + 1]);

        if (!characterArg) {
          console.error('Error: --character argument required');
          printUsage();
          process.exit(1);
        }

        const characterPath = args[args.indexOf(characterArg) + 1];
        const casePath = caseArg ? args[args.indexOf(caseArg) + 1] : undefined;
        const outputDir = outputArg ? args[args.indexOf(outputArg) + 1] : 'podcast-output/';

        try {
          const character = JSON.parse(readFileSync(characterPath, 'utf-8'));
          const caseData = casePath ? JSON.parse(readFileSync(casePath, 'utf-8')) : undefined;

          const generator = new ScriptGenerator(character, { format: 'two-part' }, caseData);
          const script = generator.generateScript();
          const producerBrief = generator.createProducerBrief();
          const guestScript = generator.createGuestScript();

          mkdirSync(outputDir, { recursive: true });

          // Format full podcast script
          let fullScript = `# ${script.title}\n\n`;
          fullScript += `**Format:** Two-Part Episode\n`;
          fullScript += `**Total Duration:** ${script.episodes.reduce((sum, e) => sum + e.duration, 0)} minutes\n`;
          fullScript += `**Generated:** ${new Date().toLocaleDateString()}\n`;
          if (script.metadata.caseReference) {
            fullScript += `**Case Reference:** ${script.metadata.caseReference}\n`;
          }
          fullScript += `**Verification Status:** ${script.metadata.verificationStatus}\n\n---\n\n`;

          script.episodes.forEach((episode) => {
            fullScript += `## Part ${episode.partNumber}\n\n`;
            fullScript += `**Duration:** ${episode.duration} minutes\n`;
            fullScript += `**Opening:** ${episode.openingHook}\n\n`;

            episode.segments.forEach((segment) => {
              fullScript += `### ${segment.title}\n\n`;
              fullScript += `${segment.text}\n\n`;
              if (segment.pausePoints?.length) {
                fullScript += `**[PAUSE]** - ${segment.pausePoints.join(', ')}\n\n`;
              }
              if (segment.adlibNotes?.length) {
                fullScript += `> *Producer Notes:*\n`;
                segment.adlibNotes.forEach(note => {
                  fullScript += `> - ${note}\n`;
                });
                fullScript += `\n`;
              }
            });
            fullScript += `**Closing:** ${episode.closingStatement}\n\n---\n\n`;
          });

          // Q&A Windows
          fullScript += `## Q&A Windows for Producer\n\n`;
          fullScript += `These are strategic points where the guest can add input, verify facts, or provide expertise.\n\n`;
          script.qaWindows.forEach((qa, idx) => {
            fullScript += `### ${idx + 1}. ${qa.topic}\n`;
            fullScript += `**When:** ~${qa.timeMarker} | **Type:** ${qa.opportunityType}\n`;
            fullScript += `**Context:** ${qa.context}\n`;
            fullScript += `**Suggested Questions:**\n`;
            qa.suggestedQuestions.forEach((q) => {
              fullScript += `- ${q}\n`;
            });
            fullScript += `\n`;
          });

          // Missing Facts
          fullScript += `## Missing Facts Requiring Verification\n\n`;
          fullScript += `Producer should prepare to ask guest about these claims that lack Tier 1 verification.\n\n`;
          if (script.missingFacts.length === 0) {
            fullScript += `*(No missing facts requiring verification)*\n\n`;
          } else {
            script.missingFacts.forEach((fact, idx) => {
              fullScript += `### ${idx + 1}. ${fact.claim}\n`;
              fullScript += `**Importance:** ${fact.importance}\n`;
              fullScript += `**Current Tier:** ${fact.tier} | **Confidence:** ${Math.round(fact.confidence * 100)}%\n`;
              fullScript += `**Verification Approach:** ${fact.verificationApproach}\n`;
              fullScript += `**Interview Opportunity:** ${fact.interviewOpportunity}\n`;
              fullScript += `**Follow-up Question:** "${fact.suggestedFollowUp}"\n\n`;
            });
          }

          // Fact Attributions
          fullScript += `## Fact Attributions & Sources\n\n`;
          script.attributions.forEach((attr) => {
            const tierLabel = `Tier ${attr.tier}`;
            const confidence = Math.round(attr.confidence * 100);
            fullScript += `- **${attr.claim}**\n`;
            fullScript += `  - ${tierLabel} | Confidence: ${confidence}%\n`;
            fullScript += `  - Source: ${attr.source}\n`;
            if (attr.caseNumber) {
              fullScript += `  - Case: ${attr.caseNumber}\n`;
            }
            fullScript += `\n`;
          });

          // Format producer brief
          let producerBriefMd = `# Producer Brief: ${producerBrief.episodeTitle}\n\n`;
          producerBriefMd += `**Character:** ${producerBrief.characterName}\n`;
          producerBriefMd += `**Duration:** ${producerBrief.duration}\n\n`;

          producerBriefMd += `## Episode Summary\n${producerBrief.summary}\n\n`;

          producerBriefMd += `## Key Facts\n`;
          producerBrief.keyFacts.forEach((fact) => {
            producerBriefMd += `- ${fact}\n`;
          });

          producerBriefMd += `\n## Talking Points\n`;
          producerBriefMd += `Share these with your guest during pre-interview planning:\n\n`;
          producerBrief.talkingPoints.forEach((point) => {
            producerBriefMd += `- ${point}\n`;
          });

          producerBriefMd += `\n## Verification Status\n`;
          producerBriefMd += `| Tier | Count |\n`;
          producerBriefMd += `|------|-------|\n`;
          producerBriefMd += `| Tier 1 (Federal Records) | ${producerBrief.verificationStatus.tier1Count} |\n`;
          producerBriefMd += `| Tier 2 (Multiple Sources) | ${producerBrief.verificationStatus.tier2Count} |\n`;
          producerBriefMd += `| Tier 3 (Single Source) | ${producerBrief.verificationStatus.tier3Count} |\n`;
          producerBriefMd += `| Tier 4 (Character/Narrative) | ${producerBrief.verificationStatus.tier4Count} |\n`;
          producerBriefMd += `| **Overall Status** | **${producerBrief.verificationStatus.overall}** |\n\n`;

          producerBriefMd += `## Recording Best Practices\n`;
          producerBrief.recordingNotes.forEach((note) => {
            producerBriefMd += `- ${note}\n`;
          });

          // Format guest handoff
          let guestHandoffMd = `# Guest Handoff: ${guestScript.title}\n\n`;
          guestHandoffMd += `**Episode Format:** ${guestScript.format === 'two-part' ? 'Two Parts' : 'Single Episode'}\n`;
          guestHandoffMd += `**Expected Runtime:** ${guestScript.expectedRuntime} minutes per part\n\n`;

          guestHandoffMd += `## Background Information\n${guestScript.backgroundInfo}\n\n`;

          guestHandoffMd += `## Discussion Topics\n`;
          guestScript.discussionTopics.forEach((topic) => {
            guestHandoffMd += `- ${topic}\n`;
          });

          guestHandoffMd += `\n## Script Outline\n`;
          guestScript.parts.forEach((part) => {
            guestHandoffMd += `### Part ${part.partNumber}\n`;
            part.segments.forEach((segment) => {
              guestHandoffMd += `**${segment.speaker.toUpperCase()}:**\n`;
              guestHandoffMd += `${segment.text}\n\n`;

              if (segment.pausePoint) {
                guestHandoffMd += `[PAUSE FOR GUEST RESPONSE]\n\n`;
              }

              if (segment.adlibNote) {
                guestHandoffMd += `*Producer: ${segment.adlibNote}*\n\n`;
              }

              if (segment.questionPrompt) {
                guestHandoffMd += `**Ask:** "${segment.questionPrompt}"\n\n`;
              }
            });
          });

          // Write files
          writeFileSync(`${outputDir}/full-podcast-script.md`, fullScript);
          writeFileSync(`${outputDir}/producer-brief.md`, producerBriefMd);
          writeFileSync(`${outputDir}/guest-handoff.md`, guestHandoffMd);
          writeFileSync(`${outputDir}/script-data.json`, JSON.stringify({ script, producerBrief, guestScript }, null, 2));

          console.log(`✅ Podcast materials formatted successfully!\n`);
          console.log(`📁 Output Directory: ${resolve(outputDir)}\n`);
          console.log(`📄 Generated Files:`);
          console.log(`   ✓ full-podcast-script.md (${script.episodes.reduce((sum, e) => sum + e.segments.length, 0)} segments)`);
          console.log(`   ✓ producer-brief.md (${producerBrief.keyFacts.length} key facts)`);
          console.log(`   ✓ guest-handoff.md (${guestScript.parts.length} parts)`);
          console.log(`   ✓ script-data.json (structured data)\n`);
          console.log(`🎯 Ready for podcast production!\n`);
        } catch (error) {
          console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          process.exit(1);
        }
        break;
      }

      case 'benchmark': {
        console.log('⏱️  Running performance benchmarks...\n');

        try {
          // Sample character for benchmarking
          const sampleCharacter = {
            phase1: {
              name: 'Benchmark Subject',
              aliases: ['BS1', 'BS2'],
              origin: 'Test origin',
              background: 'Test background',
              coreMotivation: 'Test motivation'
            },
            phase2: {
              roleAndRank: 'Test Rank',
              factionAffiliation: {
                primary: 'Test Faction',
                allies: ['Ally1'],
                opposition: ['Enemy1']
              },
              relationships: []
            },
            phase3: {
              storyArc: { act1: 'Act 1', act2: 'Act 2', act3: 'Act 3' },
              hierarchiesAndConflicts: {
                internal: [],
                external: [],
                personal: []
              },
              thematicElements: []
            }
          };

          const benchmarks: any = {};

          // Single episode benchmark
          const start1 = performance.now();
          new ScriptGenerator(sampleCharacter, { format: 'single' }).generateScript();
          benchmarks['Single Episode'] = (performance.now() - start1).toFixed(2);

          // Two-part episode benchmark
          const start2 = performance.now();
          new ScriptGenerator(sampleCharacter, { format: 'two-part' }).generateScript();
          benchmarks['Two-Part Episode'] = (performance.now() - start2).toFixed(2);

          // Producer brief benchmark
          const gen = new ScriptGenerator(sampleCharacter);
          const start3 = performance.now();
          gen.createProducerBrief();
          benchmarks['Producer Brief'] = (performance.now() - start3).toFixed(2);

          // Guest script benchmark
          const start4 = performance.now();
          gen.createGuestScript();
          benchmarks['Guest Script'] = (performance.now() - start4).toFixed(2);

          console.log(`📊 Performance Benchmarks:\n`);
          Object.entries(benchmarks).forEach(([name, time]) => {
            console.log(`  ${name}: ${time}ms`);
          });
          console.log(`\n✅ Benchmarks complete!\n`);
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
