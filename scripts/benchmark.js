#!/usr/bin/env node

/**
 * Performance Benchmarking Utility
 * Measures execution time and memory usage for core operations, including
 * the podcast workspace contract introduced in 2.2.0.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');

const registryFixture = {
  schemaVersion: '1.0',
  series: [
    {
      slug: 'insight-corruption',
      title: 'Insight Corruption',
      sourceRoot: 'projects/insight-corruption',
      outputRoot: 'output/insight-corruption',
      status: 'complete',
      seasons: [1]
    }
  ]
};

// Benchmark configuration
const BENCHMARKS = {
  'character-validation': {
    description: 'Validate a complete three-phase character',
    iterations: 1000,
    setup: () => ({
      name: 'Test Character',
      origin: 'Test origin story',
      aliases: ['Alias1'],
      physicalCharacteristics: {
        appearance: 'Distinctive appearance',
        distinctiveFeatures: ['Scar', 'Tattoo']
      },
      background: 'Character background',
      coreMotivation: 'Core motivation',
      roleAndRank: 'Leader',
      factionAffiliation: {
        primary: 'Shadow Guild',
        allies: ['Trade Coalition'],
        opposition: ['Royal Guard']
      },
      powersAndAbilities: {
        abilities: ['Strategic Mind', 'Combat Training'],
        limitations: ['Age-related fatigue']
      }
    }),
    execute: (data) => data.name && data.physicalCharacteristics && data.roleAndRank
  },

  'case-verification': {
    description: 'Verify a criminal case through all tiers',
    iterations: 500,
    setup: () => ({
      caseNumber: '2020-CR-12345',
      defendant: 'Defendant Name',
      filedDate: '2020-01-15',
      jurisdiction: 'Federal',
      charges: ['Wire fraud', 'Money laundering'],
      tier1Facts: [
        { type: 'Federal Record', source: 'PACER', fact: 'Defendant sentenced to 5 years' }
      ],
      tier2Facts: [
        { type: 'Multiple Sources', sources: ['Court filing', 'News article', 'Transcript'], fact: 'Conspiracy involved 10 members' }
      ],
      tier3Facts: [
        { type: 'Single Source', source: 'Credible news article', fact: 'Defendant had prior criminal history' }
      ]
    }),
    execute: (data) => data.caseNumber && data.tier1Facts.length > 0 && data.tier2Facts.length > 0
  },

  'relationship-validation': {
    description: 'Validate bidirectional character relationships',
    iterations: 2000,
    setup: () => ({
      char1: {
        name: 'Character A',
        relationships: [
          { targetCharacter: 'Character B', relationshipType: 'ally', tension: 'low' }
        ]
      },
      char2: {
        name: 'Character B',
        relationships: [
          { targetCharacter: 'Character A', relationshipType: 'ally', tension: 'low' }
        ]
      }
    }),
    execute: (data) => {
      const rel1 = data.char1.relationships.find(r => r.targetCharacter === 'Character B');
      const rel2 = data.char2.relationships.find(r => r.targetCharacter === 'Character A');
      return rel1 && rel2 && rel1.relationshipType === rel2.relationshipType;
    }
  },

  'story-arc-generation': {
    description: 'Generate a three-act narrative structure',
    iterations: 500,
    setup: () => ({
      act1: 'Introduction and inciting incident',
      act2: 'Rising action and complications',
      act3: 'Resolution and consequences',
      scenes: [
        { title: 'Opening', description: 'Character introduction' },
        { title: 'Inciting Incident', description: 'Event changes everything' },
        { title: 'Midpoint', description: 'Stakes are raised' },
        { title: 'Climax', description: 'Final confrontation' },
        { title: 'Resolution', description: 'Consequences unfold' }
      ]
    }),
    execute: (data) => data.act1 && data.act2 && data.act3 && data.scenes.length >= 5
  },

  'workspace-registry-lookup': {
    description: 'Resolve a registered podcast series from the canonical registry',
    iterations: 5000,
    setup: () => registryFixture,
    execute: (data) => data.series.find((series) => series.slug === 'insight-corruption')?.outputRoot === 'output/insight-corruption'
  },

  'workspace-path-construction': {
    description: 'Construct a canonical season/episode output path',
    iterations: 10000,
    setup: () => ({ slug: 'insight-corruption', season: 2, episode: 3 }),
    execute: ({ slug, season, episode }) => path.posix.join('output', slug, `season-${season}`, `episode-${episode}`)
  },

  'workspace-config-validation': {
    description: 'Validate generated episode scaffold metadata',
    iterations: 5000,
    setup: () => ({
      schemaVersion: '1.0',
      generator: { name: '@h4shed/skill-underworld-writer', version: '2.2.0' },
      seriesSlug: 'insight-corruption',
      seasonNumber: 2,
      episodeNumber: 3,
      status: 'planned'
    }),
    execute: (data) => Boolean(
      data.schemaVersion &&
      data.generator?.version === '2.2.0' &&
      data.seriesSlug &&
      Number.isInteger(data.seasonNumber) &&
      Number.isInteger(data.episodeNumber)
    )
  }
};

class BenchmarkRunner {
  constructor() {
    this.results = [];
  }

  run(name, benchmark) {
    console.log(`\n⏱️  Running: ${benchmark.description}`);

    const warmupData = benchmark.setup();
    for (let i = 0; i < 10; i++) benchmark.execute(warmupData);

    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed;
    let passed = true;

    for (let i = 0; i < benchmark.iterations; i++) {
      const data = benchmark.setup();
      if (!benchmark.execute(data)) passed = false;
    }

    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;
    const totalTime = endTime - startTime;
    const avgTime = totalTime / benchmark.iterations;
    const memoryUsed = (endMemory - startMemory) / 1024 / 1024;

    const result = {
      name,
      description: benchmark.description,
      iterations: benchmark.iterations,
      passed,
      totalTime: totalTime.toFixed(2),
      avgTime: avgTime.toFixed(4),
      opsPerSec: (1000 / avgTime).toFixed(2),
      memoryMB: memoryUsed.toFixed(2)
    };

    this.results.push(result);

    console.log(`   Iterations: ${benchmark.iterations}`);
    console.log(`   Result:     ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`   Total Time: ${totalTime.toFixed(2)}ms`);
    console.log(`   Avg Time:   ${avgTime.toFixed(4)}ms`);
    console.log(`   Ops/Sec:    ${result.opsPerSec}`);
    console.log(`   Memory:     ${memoryUsed.toFixed(2)}MB`);
  }

  runAll() {
    console.log('════════════════════════════════════════════');
    console.log('  Underworld Writer Performance Benchmarks');
    console.log('════════════════════════════════════════════');
    console.log(`  Package: 2.2.0`);
    console.log(`  Node.js ${process.version}`);
    console.log(`  Timestamp: ${new Date().toISOString()}`);
    console.log('════════════════════════════════════════════');

    for (const [name, benchmark] of Object.entries(BENCHMARKS)) this.run(name, benchmark);

    this.printSummary();
    this.saveResults();

    if (this.results.some((result) => !result.passed)) process.exitCode = 1;
  }

  printSummary() {
    console.log('\n════════════════════════════════════════════');
    console.log('  BENCHMARK SUMMARY');
    console.log('════════════════════════════════════════════\n');

    const table = [
      ['Benchmark', 'Pass', 'Avg Time (ms)', 'Ops/Sec', 'Memory (MB)'],
      ['─────────────────────────', '────', '─────────────────', '──────────', '───────────']
    ];

    for (const result of this.results) {
      table.push([
        result.name,
        result.passed ? 'yes' : 'no',
        result.avgTime,
        result.opsPerSec,
        result.memoryMB
      ]);
    }

    for (const row of table) {
      console.log(`  ${row[0].padEnd(29)} ${row[1].padStart(4)} ${row[2].padStart(15)} ${row[3].padStart(10)} ${row[4].padStart(11)}`);
    }

    const avgOpTime = this.results.reduce((sum, r) => sum + parseFloat(r.avgTime), 0) / this.results.length;
    console.log('\n════════════════════════════════════════════');
    console.log(`\n📊 Overall Performance Metrics:`);
    console.log(`   Average operation time: ${avgOpTime.toFixed(4)}ms`);
    console.log(`   Total memory usage: ${this.results.reduce((sum, r) => sum + parseFloat(r.memoryMB), 0).toFixed(2)}MB`);
    console.log(`   Functional checks: ${this.results.filter((r) => r.passed).length}/${this.results.length} passed\n`);

    if (avgOpTime < 0.5) console.log('✅ Performance: EXCELLENT (< 0.5ms average)');
    else if (avgOpTime < 1) console.log('✅ Performance: GOOD (< 1ms average)');
    else if (avgOpTime < 5) console.log('⚠️  Performance: ACCEPTABLE (< 5ms average)');
    else console.log('❌ Performance: NEEDS OPTIMIZATION (> 5ms average)');
  }

  saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `benchmark-${timestamp}.json`;
    const filepath = path.join(__dirname, '../benchmarks', filename);
    const benchmarksDir = path.dirname(filepath);
    if (!fs.existsSync(benchmarksDir)) fs.mkdirSync(benchmarksDir, { recursive: true });

    const output = {
      packageVersion: '2.2.0',
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      results: this.results
    };

    fs.writeFileSync(filepath, JSON.stringify(output, null, 2));
    console.log(`\n📁 Results saved to: ${filepath}`);
  }
}

const runner = new BenchmarkRunner();
runner.runAll();

export { BenchmarkRunner, BENCHMARKS };
