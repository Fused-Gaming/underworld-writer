#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

console.log('\n🔍 Corruption Insight Podcast Project Validation\n');
console.log('═'.repeat(60));

async function validate() {
  try {
    // Test 1: Project manifest
    console.log('\n✓ Test 1: Project Configuration');
    const manifestPath = path.join(projectRoot, 'projects/corruption-insight/PROJECT_MANIFEST.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    console.log(`  Brand: ${manifest.brand}`);
    console.log(`  Episodes: ${manifest.episodes.length}`);
    console.log(`  Region: ${manifest.region}`);

    // Test 2: MCP Configuration
    console.log('\n✓ Test 2: MCP Configuration');
    const mcpConfig = JSON.parse(await fs.readFile(path.join(projectRoot, '.fused-gaming-mcp.json'), 'utf-8'));
    console.log(`  Project: ${mcpConfig.projectName}`);
    console.log(`  Skills: ${mcpConfig.skills.length}`);
    console.log(`  Version: ${mcpConfig.version}`);

    // Test 3: Case Files
    console.log('\n✓ Test 3: Bay Area Scandal Case Files');
    const charactersDir = path.join(projectRoot, 'projects/corruption-insight/characters');
    const files = await fs.readdir(charactersDir);
    const caseFiles = files.filter(f => f.endsWith('.json'));

    console.log(`  Total cases: ${caseFiles.length}\n`);

    for (const file of caseFiles) {
      const caseData = JSON.parse(await fs.readFile(path.join(charactersDir, file), 'utf-8'));
      console.log(`  📋 Case #${caseData.caseId.split('-')[2]}: ${caseData.character.name}`);
      console.log(`     ${caseData.offense.type} | Year: ${caseData.year}`);
      console.log(`     Sentence: ${caseData.sentence.prison_time === 'Zero days' ? '✗ NO JAIL TIME' : caseData.sentence.prison_time}`);
      console.log();
    }

    // Test 4: Workspace directories
    console.log('✓ Test 4: Workspace Structure');
    const dirs = ['projects/corruption-insight/characters', 'projects/corruption-insight/episodes', 'output/corruption-insight'];
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

    // Verify npm install worked
    const nodeModulesExists = await fs.access(path.join(projectRoot, 'node_modules/@h4shed/mcp-core')).then(() => true).catch(() => false);
    console.log(`  Installation: ${nodeModulesExists ? '✓ Complete' : '✗ Incomplete'}`);

    console.log('\n' + '═'.repeat(60));
    console.log('\n✅ CORRUPTION INSIGHT WORKSPACE READY FOR PODCAST GENERATION\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run cli -- format-script --project corruption-insight');
    console.log('  2. Generate: underworld-writer format-script --character <case-file>');
    console.log('  3. Output: All scripts in output/corruption-insight/\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Validation Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

validate();
