/**
 * Generate SolarWinds Podcast Episode Example
 */

import { ScriptGenerator } from './dist/podcast-script-generator.js';
import * as fs from 'fs';

// Load the SolarWinds character profile
const character = JSON.parse(
  fs.readFileSync('./examples/solarwinds-case-character.json', 'utf-8')
);

// Case data for SolarWinds compromise
const solarwindsCase = {
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
 * Format script as markdown
 */
function formatScriptAsMarkdown(script, character) {
  let md = `# ${script.title}\n\n`;
  md += `**Format:** Two-Part Episode\n`;
  md += `**Total Duration:** ${script.episodes.reduce((sum, e) => sum + e.duration, 0)} minutes\n`;
  md += `**Generated:** ${new Date().toLocaleDateString()}\n`;
  md += `**Case Reference:** ${script.metadata.caseReference}\n`;
  md += `**Verification Status:** ${script.metadata.verificationStatus}\n\n`;

  md += `---\n\n`;

  script.episodes.forEach((episode, idx) => {
    md += `## Part ${episode.partNumber}\n\n`;
    md += `**Duration:** ${episode.duration} minutes\n`;
    md += `**Opening:** ${episode.openingHook}\n\n`;

    episode.segments.forEach((segment) => {
      md += `### ${segment.title}\n\n`;
      md += `${segment.text}\n\n`;

      if (segment.pausePoints && segment.pausePoints.length > 0) {
        md += `**[PAUSE]** - ${segment.pausePoints.join(', ')}\n\n`;
      }

      if (segment.adlibNotes && segment.adlibNotes.length > 0) {
        md += `> *Producer Notes:*\n`;
        segment.adlibNotes.forEach(note => {
          md += `> - ${note}\n`;
        });
        md += `\n`;
      }
    });

    md += `**Closing:** ${episode.closingStatement}\n\n`;
    md += `---\n\n`;
  });

  md += `## Q&A Windows for Producer\n\n`;
  md += `These are strategic points where the guest can add input, verify facts, or provide expertise.\n\n`;
  script.qaWindows.forEach((qa, idx) => {
    md += `### ${idx + 1}. ${qa.topic}\n`;
    md += `**When:** ~${qa.timeMarker} | **Type:** ${qa.opportunityType}\n`;
    md += `**Context:** ${qa.context}\n`;
    md += `**Suggested Questions:**\n`;
    qa.suggestedQuestions.forEach((q) => {
      md += `- ${q}\n`;
    });
    md += `\n`;
  });

  md += `## Missing Facts Requiring Verification\n\n`;
  md += `Producer should prepare to ask guest about these claims that lack Tier 1 verification.\n\n`;
  script.missingFacts.forEach((fact, idx) => {
    md += `### ${idx + 1}. ${fact.claim}\n`;
    md += `**Importance:** ${fact.importance}\n`;
    md += `**Current Tier:** ${fact.tier} | **Confidence:** ${Math.round(fact.confidence * 100)}%\n`;
    md += `**Verification Approach:** ${fact.verificationApproach}\n`;
    md += `**Interview Opportunity:** ${fact.interviewOpportunity}\n`;
    md += `**Follow-up Question:** "${fact.suggestedFollowUp}"\n\n`;
  });

  md += `## Fact Attributions & Sources\n\n`;
  script.attributions.forEach((attr) => {
    const tierLabel = `Tier ${attr.tier}`;
    const confidence = Math.round(attr.confidence * 100);
    md += `- **${attr.claim}**\n`;
    md += `  - ${tierLabel} | Confidence: ${confidence}%\n`;
    md += `  - Source: ${attr.source}\n`;
    if (attr.caseNumber) {
      md += `  - Case: ${attr.caseNumber}\n`;
    }
    md += `\n`;
  });

  return md;
}

/**
 * Format producer brief
 */
function formatProducerBrief(brief) {
  let md = `# Producer Brief: ${brief.episodeTitle}\n\n`;
  md += `**Character:** ${brief.characterName}\n`;
  md += `**Duration:** ${brief.duration}\n\n`;

  md += `## Episode Summary\n${brief.summary}\n\n`;

  md += `## Key Facts\n`;
  brief.keyFacts.forEach((fact) => {
    md += `- ${fact}\n`;
  });

  md += `\n## Talking Points\n`;
  md += `Share these with your guest during pre-interview planning:\n\n`;
  brief.talkingPoints.forEach((point) => {
    md += `- ${point}\n`;
  });

  md += `\n## Verification Status\n`;
  md += `| Tier | Count |\n`;
  md += `|------|-------|\n`;
  md += `| Tier 1 (Federal Records) | ${brief.verificationStatus.tier1Count} |\n`;
  md += `| Tier 2 (Multiple Sources) | ${brief.verificationStatus.tier2Count} |\n`;
  md += `| Tier 3 (Single Source) | ${brief.verificationStatus.tier3Count} |\n`;
  md += `| Tier 4 (Character/Narrative) | ${brief.verificationStatus.tier4Count} |\n`;
  md += `| **Overall Status** | **${brief.verificationStatus.overall}** |\n\n`;

  md += `## Recording Best Practices\n`;
  brief.recordingNotes.forEach((note) => {
    md += `- ${note}\n`;
  });

  return md;
}

/**
 * Main function
 */
async function main() {
  console.log('\n🎙️  Generating SolarWinds Podcast Episode...\n');

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
  const start = performance.now();
  const script = generator.generateScript();
  const producerBrief = generator.createProducerBrief();
  const guestScript = generator.createGuestScript();
  const elapsed = performance.now() - start;

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
    formatProducerBrief(producerBrief)
  );

  // Save raw JSON for further processing
  fs.writeFileSync(
    './output/solarwinds-episode/script-data.json',
    JSON.stringify(script, null, 2)
  );

  console.log(`✅ SolarWinds Episode Generated Successfully!\n`);
  console.log(`📁 Output Files:`);
  console.log(`   ✓ output/solarwinds-episode/full-podcast-script.md`);
  console.log(`   ✓ output/solarwinds-episode/producer-brief.md`);
  console.log(`   ✓ output/solarwinds-episode/script-data.json\n`);

  console.log(`📊 Episode Statistics:`);
  console.log(`   Title: ${script.title}`);
  console.log(`   Format: Two-part episode`);
  console.log(`   Total Duration: ${script.episodes.reduce((sum, e) => sum + e.duration, 0)} minutes`);
  console.log(`   Part 1: ${script.episodes[0].duration} minutes`);
  console.log(`   Part 2: ${script.episodes[1].duration} minutes`);
  console.log(`   Q&A Windows: ${script.qaWindows.length}`);
  console.log(`   Missing Facts Flagged: ${script.missingFacts.length}`);
  console.log(`   Fact Attributions: ${script.attributions.length}`);
  console.log(`   Verification Status: ${script.metadata.verificationStatus}`);
  console.log(`   Generation Time: ${elapsed.toFixed(2)}ms\n`);

  console.log(`🎯 Producer Guidance:`);
  console.log(`   Talking Points: ${producerBrief.talkingPoints.length}`);
  console.log(`   Key Facts: ${producerBrief.keyFacts.length}`);
  console.log(`   Recording Tips: ${producerBrief.recordingNotes.length}\n`);

  console.log(`📋 Next Steps for Podcast Producers:`);
  console.log(`   1. Review full-podcast-script.md for narrative flow`);
  console.log(`   2. Share producer-brief.md with guest before interview`);
  console.log(`   3. Flag Q&A windows as talking points`);
  console.log(`   4. Prepare follow-up questions for missing facts`);
  console.log(`   5. Verify facts during guest interview\n`);
}

main().catch(console.error);
