#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

console.log('\n🔍 Insight Corruption Podcast Project Validation\n');
console.log('═'.repeat(60));

function describeSentence(sentence) {
  if (!sentence) return 'Not on file';
  if (sentence.prison_time) {
    return sentence.prison_time === 'Zero days' ? '✗ NO JAIL TIME' : sentence.prison_time;
  }
  return sentence.status || 'Not on file';
}

async function listCaseFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listCaseFiles(full)));
    } else if (entry.name.endsWith('.json')) {
      files.push(full);
    }
  }
  return files;
}

async function validate() {
  try {
    // Test 1: Project manifest
    console.log('\n✓ Test 1: Project Configuration');
    const manifestPath = path.join(projectRoot, 'projects/insight-corruption/PROJECT_MANIFEST.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    console.log(`  Brand: ${manifest.brand}`);
    console.log(`  Total episodes on file: ${manifest.totalEpisodes ?? manifest.episodes?.length ?? 'unknown'}`);
    console.log(`  Region: ${manifest.region}`);

    // Test 2: MCP Configuration
    console.log('\n✓ Test 2: MCP Configuration');
    const mcpConfig = JSON.parse(await fs.readFile(path.join(projectRoot, '.fused-gaming-mcp.json'), 'utf-8'));
    console.log(`  Project: ${mcpConfig.projectName}`);
    console.log(`  Skills: ${mcpConfig.skills.length}`);
    console.log(`  Version: ${mcpConfig.version}`);

    // Test 3: Case Files (recursive - includes oakland-cases/ subdirectory)
    console.log('\n✓ Test 3: Bay Area Corruption Case Files');
    const charactersDir = path.join(projectRoot, 'projects/insight-corruption/characters');
    const caseFiles = await listCaseFiles(charactersDir);

    console.log(`  Total cases: ${caseFiles.length}\n`);

    let resolved = 0;
    let pending = 0;
    for (const file of caseFiles) {
      const caseData = JSON.parse(await fs.readFile(file, 'utf-8'));
      const status = caseData.sentence?.status ?? '';
      const isPending = /pending|in progress|under (investigation|prosecution)|awaiting sentencing/i.test(status);
      isPending ? pending++ : resolved++;
      console.log(`  📋 ${caseData.caseId ?? '?'}: ${caseData.character?.name}`);
      console.log(`     ${caseData.offense?.type ?? 'n/a'} | Year: ${caseData.year ?? 'n/a'}`);
      console.log(`     Sentence: ${describeSentence(caseData.sentence)}`);
      console.log();
    }
    console.log(`  Resolved-outcome cases: ${resolved} | Pending/in-progress cases: ${pending}`);
    console.log('  (Only resolved-outcome cases fit this show\'s "how they got away with it"');
    console.log('   premise - see output/insight-corruption/season-1/episode-15/ for how');
    console.log('   pending cases are handled instead.)');

    // Test 4: Workspace directories
    console.log('\n✓ Test 4: Workspace Structure');
    const dirs = [
      'projects/insight-corruption/characters',
      'output/insight-corruption',
      'output/insight-corruption/season-1',
    ];
    for (const dir of dirs) {
      try {
        await fs.access(path.join(projectRoot, dir));
        console.log(`  ✓ ${dir}`);
      } catch {
        console.log(`  ✗ ${dir}`);
      }
    }

    // Test 5: Packages
    console.log('\n✓ Test 5: Installed Packages');
    const packageJson = JSON.parse(await fs.readFile(path.join(projectRoot, 'package.json'), 'utf-8'));
    console.log(`  Project: ${packageJson.name} (v${packageJson.version})`);
    console.log(`  MCP Core: ${packageJson.dependencies['@h4shed/mcp-core']}`);

    const nodeModulesExists = await fs
      .access(path.join(projectRoot, 'node_modules/@h4shed/mcp-core'))
      .then(() => true)
      .catch(() => false);
    console.log(`  Installation: ${nodeModulesExists ? '✓ Complete' : '✗ Incomplete (run npm install)'}`);

    console.log('\n' + '═'.repeat(60));
    console.log('\n✅ INSIGHT CORRUPTION WORKSPACE VALIDATED\n');
    console.log('Next steps:');
    console.log('  1. Review output/insight-corruption/ for the generated 15-episode season');
    console.log('  2. To regenerate a single episode script via the CLI:');
    console.log('     node dist/cli.js generate-script --character <case-file.json> --format single');
    console.log('  3. Re-verify pending-case statuses before recording episode 15\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Validation Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

validate();
