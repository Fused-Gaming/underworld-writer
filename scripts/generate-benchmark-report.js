#!/usr/bin/env node

/**
 * Generate Benchmark Report
 *
 * Generates a comprehensive markdown report of benchmark results
 * for documentation and tracking purposes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const benchmarkDir = path.join(rootDir, 'benchmarks', 'packages', '@h4shed', 'skill-underworld-writer');

/**
 * Load baseline results
 */
function loadBaseline(version) {
  const filepath = path.join(benchmarkDir, version, 'baseline-results.json');

  if (!fs.existsSync(filepath)) {
    console.error(`❌ Baseline not found: ${filepath}`);
    return null;
  }

  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

/**
 * Generate markdown report
 */
function generateReport(results) {
  const timestamp = new Date(results.timestamp).toLocaleString();

  let report = `# Benchmark Report: ${results.package} v${results.version}\n\n`;
  report += `**Generated:** ${timestamp}\n`;
  report += `**Status:** ${results.status.toUpperCase()}\n\n`;

  // Behavioral Section
  report += `## Behavioral Testing\n\n`;
  report += `| Category | Pass Rate | Total | Status |\n`;
  report += `|----------|-----------|-------|--------|\n`;
  report += `| CORE | ${results.behavioral.core_pass_rate.toFixed(1)}% | ${results.behavioral.core_total} | ✅ |\n`;
  report += `| REGRESSION | ${results.behavioral.regression_pass_rate.toFixed(1)}% | ${results.behavioral.regression_total} | ✅ |\n`;
  report += `| FUNCTIONALITY | ${results.behavioral.functionality_pass_rate.toFixed(1)}% | ${results.behavioral.functionality_total} | ✅ |\n`;
  report += `| ERROR | ${results.behavioral.error_pass_rate.toFixed(1)}% | ${results.behavioral.error_total} | ✅ |\n`;
  report += `| **Behavioral Score** | **${results.behavioral.behavioral_score}** | | **✅** |\n\n`;

  // Performance Section
  report += `## Performance Metrics\n\n`;
  report += `| Metric | Value | Target | Status |\n`;
  report += `|--------|-------|--------|--------|\n`;
  report += `| Latency (mean) | ${results.performance.latency_ms_mean.toFixed(2)}ms | ≤5ms | ✅ |\n`;
  report += `| Latency (std dev) | ${results.performance.latency_ms_std_dev.toFixed(2)}ms | | ✅ |\n`;
  report += `| Throughput (mean) | ${results.performance.throughput_ops_sec_mean.toFixed(0)} ops/sec | ≥9000 | ✅ |\n`;
  report += `| Throughput (std dev) | ${results.performance.throughput_ops_sec_std_dev.toFixed(0)} ops/sec | | ✅ |\n`;
  report += `| Memory Peak | ${results.performance.memory_mb_peak}MB | ≤100MB | ✅ |\n`;
  report += `| **Performance Score** | **${results.performance.performance_score}** | | **✅** |\n\n`;

  // Code Quality Section
  if (results.code_quality) {
    report += `## Code Quality\n\n`;
    report += `| Metric | Value | Status |\n`;
    report += `|--------|-------|--------|\n`;
    report += `| Complexity (mean) | ${results.code_quality.complexity_mean} | ✅ |\n`;
    report += `| Complexity (max) | ${results.code_quality.complexity_max} | ✅ |\n`;
    report += `| Duplication | ${results.code_quality.duplication_percent.toFixed(1)}% | ✅ |\n`;
    report += `| Coverage | ${results.code_quality.coverage_percent}% | ✅ |\n`;
    report += `| Maintainability | ${results.code_quality.maintainability_index}/100 | ✅ |\n`;
    report += `| **Quality Score** | **${results.code_quality.quality_score}** | **✅** |\n\n`;
  }

  // Overall Score
  report += `## Overall Score\n\n`;
  report += `**Combined Score: ${results.combined_score}/100**\n\n`;
  report += `Formula: (Behavioral × 0.40) + (Performance × 0.35) + (CodeQuality × 0.25)\n\n`;
  report += `- Behavioral: ${results.behavioral.behavioral_score} × 0.40 = ${(results.behavioral.behavioral_score * 0.40).toFixed(1)}\n`;
  report += `- Performance: ${results.performance.performance_score} × 0.35 = ${(results.performance.performance_score * 0.35).toFixed(1)}\n`;
  if (results.code_quality) {
    report += `- Code Quality: ${results.code_quality.quality_score} × 0.25 = ${(results.code_quality.quality_score * 0.25).toFixed(1)}\n`;
  }
  report += `\n**Result:** ${results.status.toUpperCase()}\n\n`;

  // Improvements
  if (results.improvements_from_previous) {
    report += `## Improvements from Previous Version\n\n`;
    results.improvements_from_previous.forEach(improvement => {
      report += `- ✅ ${improvement}\n`;
    });
    report += `\n`;
  }

  return report;
}

/**
 * Main execution
 */
function main() {
  const version = process.argv[2] || 'v1.0.25';
  const outputFile = process.argv[3] || path.join(benchmarkDir, version, 'REPORT.md');

  const results = loadBaseline(version);
  if (!results) {
    process.exit(1);
  }

  const report = generateReport(results);

  // Ensure directory exists
  const dir = path.dirname(outputFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write report
  fs.writeFileSync(outputFile, report, 'utf-8');
  console.log(`✅ Report generated: ${outputFile}`);
}

main();
