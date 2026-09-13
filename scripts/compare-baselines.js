#!/usr/bin/env node

/**
 * Compare Benchmark Baselines
 *
 * Compares current benchmark results against baseline measurements
 * to detect performance regressions and improvements.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const benchmarkDir = path.join(rootDir, 'benchmarks', 'packages', '@h4shed', 'skill-underworld-writer');

/**
 * Load baseline results for a version
 */
function loadBaseline(version) {
  const filepath = path.join(benchmarkDir, version, 'baseline-results.json');

  if (!fs.existsSync(filepath)) {
    console.error(`❌ Baseline not found: ${filepath}`);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  } catch (error) {
    console.error(`❌ Failed to parse baseline: ${error.message}`);
    return null;
  }
}

/**
 * Compare two baseline results
 */
function compareResults(current, baseline) {
  console.log('\n📊 Benchmark Comparison Report\n');
  console.log(`Current:  v${current.version} (${new Date(current.timestamp).toLocaleDateString()})`);
  console.log(`Baseline: v${baseline.version} (${new Date(baseline.timestamp).toLocaleDateString()})\n`);

  console.log('Behavioral Scores:');
  console.log(`  CORE:          ${baseline.behavioral.core_pass_rate.toFixed(1)}% → ${current.behavioral.core_pass_rate.toFixed(1)}%`);
  console.log(`  REGRESSION:    ${baseline.behavioral.regression_pass_rate.toFixed(1)}% → ${current.behavioral.regression_pass_rate.toFixed(1)}%`);
  console.log(`  FUNCTIONALITY: ${baseline.behavioral.functionality_pass_rate.toFixed(1)}% → ${current.behavioral.functionality_pass_rate.toFixed(1)}%`);
  console.log(`  ERROR:         ${baseline.behavioral.error_pass_rate.toFixed(1)}% → ${current.behavioral.error_pass_rate.toFixed(1)}%`);
  console.log(`  Overall:       ${baseline.behavioral.behavioral_score} → ${current.behavioral.behavioral_score}\n`);

  console.log('Performance Metrics:');
  const latencyChange = current.performance.latency_ms_mean - baseline.performance.latency_ms_mean;
  const throughputChange = current.performance.throughput_ops_sec_mean - baseline.performance.throughput_ops_sec_mean;
  const memoryChange = current.performance.memory_mb_peak - baseline.performance.memory_mb_peak;

  console.log(`  Latency:     ${baseline.performance.latency_ms_mean.toFixed(2)}ms → ${current.performance.latency_ms_mean.toFixed(2)}ms (${latencyChange >= 0 ? '+' : ''}${latencyChange.toFixed(2)}ms)`);
  console.log(`  Throughput:  ${baseline.performance.throughput_ops_sec_mean.toFixed(0)} → ${current.performance.throughput_ops_sec_mean.toFixed(0)} ops/sec`);
  console.log(`  Memory:      ${baseline.performance.memory_mb_peak}MB → ${current.performance.memory_mb_peak}MB (${memoryChange >= 0 ? '+' : ''}${memoryChange}MB)\n`);

  console.log('Quality Scores:');
  console.log(`  Performance: ${baseline.performance.performance_score} → ${current.performance.performance_score}`);
  console.log(`  Combined:    ${baseline.combined_score} → ${current.combined_score}\n`);

  // Detect regressions
  const regressions = [];
  const improvements = [];

  if (current.behavioral.core_pass_rate < baseline.behavioral.core_pass_rate) {
    regressions.push(`CORE test pass rate declined: ${current.behavioral.core_pass_rate.toFixed(1)}%`);
  }
  if (latencyChange > 1.0) {
    regressions.push(`Latency increased by ${latencyChange.toFixed(2)}ms (>1ms threshold)`);
  }
  if (current.performance.performance_score < baseline.performance.performance_score) {
    regressions.push(`Performance score declined: ${current.performance.performance_score}`);
  }

  if (current.behavioral.behavioral_score > baseline.behavioral.behavioral_score) {
    improvements.push(`Behavioral score improved: +${current.behavioral.behavioral_score - baseline.behavioral.behavioral_score}`);
  }
  if (latencyChange < -0.5) {
    improvements.push(`Latency improved by ${Math.abs(latencyChange).toFixed(2)}ms`);
  }
  if (current.combined_score > baseline.combined_score) {
    improvements.push(`Combined score improved: +${current.combined_score - baseline.combined_score}`);
  }

  if (regressions.length > 0) {
    console.log('⚠️  Regressions Detected:');
    regressions.forEach(r => console.log(`  - ${r}`));
    console.log();
  }

  if (improvements.length > 0) {
    console.log('✅ Improvements:');
    improvements.forEach(i => console.log(`  - ${i}`));
    console.log();
  }

  if (regressions.length === 0 && improvements.length === 0) {
    console.log('✓ No significant changes detected\n');
  }

  // Overall status
  if (current.combined_score >= 90) {
    console.log(`✅ Overall Status: PASS (${current.combined_score}/100)\n`);
    return true;
  } else {
    console.log(`❌ Overall Status: FAIL (${current.combined_score}/100)\n`);
    return false;
  }
}

/**
 * Main comparison logic
 */
function main() {
  const targetVersion = process.argv[2] || 'v1.0.25';
  const baselineVersion = process.argv[3] || 'v1.0.24';

  console.log(`Comparing v${targetVersion} against v${baselineVersion}...\n`);

  const current = loadBaseline(targetVersion);
  const baseline = loadBaseline(baselineVersion);

  if (!current || !baseline) {
    process.exit(1);
  }

  const passed = compareResults(current, baseline);
  process.exit(passed ? 0 : 1);
}

main();
