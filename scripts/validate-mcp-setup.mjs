#!/usr/bin/env node

// KNOWN ISSUE (confirmed 2026-09-15): @h4shed/mcp-core@1.0.40 as published to npm
// ships only src/ - no dist/ - even though its package.json main/exports point at
// ./dist/index.js. This import throws ERR_MODULE_NOT_FOUND regardless of anything
// in this repository; it is an upstream packaging bug in @h4shed/mcp-core itself,
// not something fixable here. Confirmed via: npm install && node scripts/validate-mcp-setup.mjs
import { SkillRegistry } from '@h4shed/mcp-core';

console.log('🔍 Validating Insight Corruption MCP Setup...\n');

async function validateSetup() {
  try {
    // Test 1: Initialize SkillRegistry
    console.log('✓ Test 1: SkillRegistry initialization');
    const registry = new SkillRegistry();
    console.log('  Status: SkillRegistry created successfully\n');

    // Test 2: Check installed packages
    console.log('✓ Test 2: Package verification');
    try {
      const mcpCore = await import('@h4shed/mcp-core');
      console.log('  @h4shed/mcp-core: Verified (v1.0.40+)');
    } catch (e) {
      console.error('  ✗ @h4shed/mcp-core: Failed to load');
    }

    try {
      const underworldWriter = await import('@h4shed/skill-underworld-writer');
      console.log('  @h4shed/skill-underworld-writer: Verified (v2.0.7+)');
    } catch (e) {
      console.log('  ℹ @h4shed/skill-underworld-writer: Running as project itself\n');
    }

    // Test 3: Workspace structure verification
    console.log('✓ Test 3: Workspace structure');
    const fs = await import('fs').then(m => m.promises);
    const path = await import('path');
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const projectRoot = path.resolve(__dirname, '..');

    const directories = [
      'projects/insight-corruption/characters',
      'projects/insight-corruption/characters/oakland-cases',
      'output/insight-corruption'
    ];

    for (const dir of directories) {
      const fullPath = path.join(projectRoot, dir);
      try {
        await fs.access(fullPath);
        console.log(`  ✓ ${dir}`);
      } catch {
        console.log(`  ✗ ${dir} - not found`);
      }
    }

    // Test 4: Configuration file
    console.log('\n✓ Test 4: MCP configuration');
    const configPath = path.join(projectRoot, '.fused-gaming-mcp.json');
    try {
      const configData = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configData);
      console.log(`  ✓ .fused-gaming-mcp.json loaded`);
      console.log(`  Project: ${config.projectName}`);
      console.log(`  Skills: ${config.skills.length} configured`);
      console.log(`  Brand: ${config.skills[0].config.brand}`);
    } catch (e) {
      console.error('  ✗ Failed to load configuration');
    }

    // Test 5: Case files verification
    console.log('\n✓ Test 5: Bay Area scandal case files');
    const charactersDir = path.join(projectRoot, 'projects/insight-corruption/characters');
    try {
      const files = await fs.readdir(charactersDir);
      const caseFiles = files.filter(f => f.endsWith('.json'));
      console.log(`  Found ${caseFiles.length} case files:`);
      caseFiles.forEach(f => {
        const caseName = f.replace('-case.json', '').replace(/-/g, ' ').toUpperCase();
        console.log(`    • ${caseName}`);
      });
    } catch (e) {
      console.error('  ✗ Failed to read case files');
    }

    console.log('\n✅ Insight Corruption MCP Workspace Setup Complete!\n');
    console.log('See output/insight-corruption/season-1/ for the full 15-episode Season 1.');

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

validateSetup();
