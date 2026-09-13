/**
 * SolarWinds Supply Chain Attack - Podcast Episode Generator
 *
 * Real-world example demonstrating podcast script generation for
 * the SolarWinds/SUNBURST supply chain compromise
 */

import { ScriptGenerator } from '../src/podcast-script-generator.js';
import { CharacterForPodcast, PACERCaseData } from '../src/podcast-types.js';
import * as fs from 'fs';

// Load the SolarWinds character profile
const characterPath = './examples/solarwinds-case-character.json';
const character: CharacterForPodcast = JSON.parse(
  fs.readFileSync(characterPath, 'utf-8')
);

// Case data for SolarWinds compromise
const solarwindsCase: PACERCaseData = {
  caseNumber: 'SUNBURST-2020-001',
  title: 'SolarWinds Software Supply Chain Compromise Investigation',
  court: 'U.S. Intelligence Community Attribution Assessment',
  filedDate: '2020-12-13',
  status: 'open',
  defendants: ['APT29', 'SVR'],
  charges: [
    'Cyber espionage against U.S. government',
    'Unauthorized access to federal networks',
    'Supply chain compromise',
    'Intelligence gathering'
  ],
  outcome: 'Ongoing U.S. Government Response - Sanctions imposed December 2020, Operation exposed but compromises persist. Legacy access remains a concern for all affected organizations.'
};

/**
 * Generate SolarWinds podcast episode
 */
export function generateSolarWindsEpisode() {
  const generator = new ScriptGenerator(
    character,
    {
      format: 'two-part',
      includeAttribution: true,
      includeSpeakerLabels: true,
      conversationalTone: true,
      targetAudience: 'podcast-audience'
    },
    solarwindsCase
  );

  // Generate all components
  const script = generator.generateScript();
  const producerBrief = generator.createProducerBrief();
  const guestScript = generator.createGuestScript();

  // Create output directory
  if (!fs.existsSync('./output/solarwinds-episode')) {
    fs.mkdirSync('./output/solarwinds-episode', { recursive: true });
  }

  // Save podcast script
  fs.writeFileSync(
    './output/solarwinds-episode/full-podcast-script.md',
    formatScriptAsMarkdown(script, character)
  );

  // Save producer brief
  fs.writeFileSync(
    './output/solarwinds-episode/producer-brief.md',
    formatProducerBriefAsMarkdown(producerBrief)
  );

  // Save guest script
  fs.writeFileSync(
    './output/solarwinds-episode/guest-handoff.md',
    formatGuestScriptAsMarkdown(guestScript)
  );

  // Save raw JSON for further processing
  fs.writeFileSync(
    './output/solarwinds-episode/script-data.json',
    JSON.stringify(script, null, 2)
  );

  console.log(`\n✅ SolarWinds Episode Generated Successfully!\n`);
  console.log(`📁 Output Files:`);
  console.log(`   - full-podcast-script.md (for podcast producers)`);
  console.log(`   - producer-brief.md (for episode planning)`);
  console.log(`   - guest-handoff.md (for guest interview preparation)`);
  console.log(`   - script-data.json (structured data)`);
  console.log(`\n📊 Episode Statistics:`);
  console.log(`   Format: Two-part episode`);
  console.log(`   Total Duration: ${script.episodes.reduce((sum, e) => sum + e.duration, 0)} minutes`);
  console.log(`   Part 1: ${script.episodes[0].duration} minutes`);
  console.log(`   Part 2: ${script.episodes[1].duration} minutes`);
  console.log(`   Q&A Windows: ${script.qaWindows.length}`);
  console.log(`   Missing Facts Flagged: ${script.missingFacts.length}`);
  console.log(`   Fact Attributions: ${script.attributions.length}`);
  console.log(`   Verification Status: ${script.metadata.verificationStatus}\n`);
}

function formatScriptAsMarkdown(script: any, character: CharacterForPodcast): string {
  let md = `# ${script.title}\n\n`;
  md += `**Format:** Two-Part Episode\n`;
  md += `**Total Duration:** ${script.episodes.reduce((sum: number, e: any) => sum + e.duration, 0)} minutes\n`;
  md += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;

  md += `---\n\n`;

  script.episodes.forEach((episode: any, idx: number) => {
    md += `## Part ${episode.partNumber}: ${episode.openingHook}\n\n`;
    md += `**Duration:** ${episode.duration} minutes\n\n`;

    episode.segments.forEach((segment: any) => {
      md += `### ${segment.title}\n\n`;
      md += `${segment.text}\n\n`;

      if (segment.pausePoints && segment.pausePoints.length > 0) {
        md += `**[PAUSE]** - ${segment.pausePoints[0]}\n\n`;
      }

      if (segment.adlibNotes && segment.adlibNotes.length > 0) {
        md += `> *Producer Note: ${segment.adlibNotes[0]}*\n\n`;
      }
    });

    md += `**Closing:** ${episode.closingStatement}\n\n`;
    md += `---\n\n`;
  });

  md += `## Q&A Windows\n\n`;
  script.qaWindows.forEach((qa: any) => {
    md += `### ${qa.topic}\n`;
    md += `**When:** ~${qa.timeMarker}\n`;
    md += `**Suggested Questions:**\n`;
    qa.suggestedQuestions.forEach((q: string) => {
      md += `- ${q}\n`;
    });
    md += `\n`;
  });

  md += `## Fact Attributions\n\n`;
  script.attributions.forEach((attr: any) => {
    const tierLabel = `Tier ${attr.tier}`;
    md += `- **${attr.claim}** (${tierLabel}: ${attr.source})\n`;
  });

  return md;
}

function formatProducerBriefAsMarkdown(brief: any): string {
  let md = `# Producer Brief\n\n`;
  md += `**Episode:** ${brief.episodeTitle}\n`;
  md += `**Character:** ${brief.characterName}\n`;
  md += `**Duration:** ${brief.duration}\n\n`;

  md += `## Summary\n${brief.summary}\n\n`;

  md += `## Key Facts\n`;
  brief.keyFacts.forEach((fact: string) => {
    md += `- ${fact}\n`;
  });

  md += `\n## Talking Points for Guest\n`;
  brief.talkingPoints.forEach((point: string) => {
    md += `- ${point}\n`;
  });

  md += `\n## Verification Status\n`;
  md += `- Tier 1 (Federal Records): ${brief.verificationStatus.tier1Count}\n`;
  md += `- Tier 2 (Multiple Sources): ${brief.verificationStatus.tier2Count}\n`;
  md += `- Tier 3 (Single Source): ${brief.verificationStatus.tier3Count}\n`;
  md += `- Tier 4 (Character): ${brief.verificationStatus.tier4Count}\n`;
  md += `- **Overall Status:** ${brief.verificationStatus.overall}\n`;

  md += `\n## Recording Notes\n`;
  brief.recordingNotes.forEach((note: string) => {
    md += `- ${note}\n`;
  });

  return md;
}

function formatGuestScriptAsMarkdown(guestScript: any): string {
  let md = `# Guest Handoff Script\n\n`;
  md += `**Episode:** ${guestScript.title}\n`;
  md += `**Format:** ${guestScript.format === 'two-part' ? 'Two Parts' : 'Single Episode'}\n`;
  md += `**Expected Runtime:** ${guestScript.expectedRuntime} minutes per part\n\n`;

  md += `## Background Information\n${guestScript.backgroundInfo}\n\n`;

  md += `## Discussion Topics\n`;
  guestScript.discussionTopics.forEach((topic: string) => {
    md += `- ${topic}\n`;
  });

  md += `\n## Script\n`;
  guestScript.parts.forEach((part: any) => {
    md += `### Part ${part.partNumber}\n`;
    part.segments.forEach((segment: any) => {
      md += `**${segment.speaker.toUpperCase()}:**\n`;
      md += `${segment.text}\n\n`;

      if (segment.pausePoint) {
        md += `[PAUSE FOR GUEST RESPONSE]\n\n`;
      }

      if (segment.adlibNote) {
        md += `*Producer: ${segment.adlibNote}*\n\n`;
      }

      if (segment.questionPrompt) {
        md += `**Ask:** "${segment.questionPrompt}"\n\n`;
      }
    });
  });

  return md;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSolarWindsEpisode();
}

export { generateSolarWindsEpisode };
