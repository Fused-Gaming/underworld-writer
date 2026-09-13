# Underworld Writer Benchmarks

Performance and correctness benchmarks for the Underworld Writer skill using the Definition of Done (DoD) framework.

## Overview

The benchmark suite measures:

1. **Behavioral Correctness** — Test pass rates across CORE, REGRESSION, FUNCTIONALITY, and ERROR categories
2. **Performance Metrics** — Latency, throughput, and memory usage
3. **Code Quality** — Complexity, duplication, coverage, and maintainability

## Directory Structure

```
benchmarks/
├── README.md                    # This file
├── utilities/
│   └── benchmark-runner.ts      # Benchmark execution and scoring
└── packages/
    └── @h4shed/
        └── skill-underworld-writer/
            └── v1.0.25/
                └── baseline-results.json   # Baseline measurements
```

## Running Benchmarks

### From Main Repository

```bash
# Run benchmarks (requires npm run build first)
npm run benchmark

# Or directly with ts-node
npx ts-node benchmarks/utilities/benchmark-runner.ts
```

### Benchmark Categories

#### CORE Tests (Pass Rate ≥95% required)
- Character creation and initialization
- Character validation completeness
- Summary generation accuracy
- Markdown export correctness
- Relationship validation

**Current Status:** ✅ 100% pass rate

#### REGRESSION Tests (Pass Rate ≥90% required)
- Backward compatibility checks
- Previous feature integrity
- Edge case handling
- Performance regression detection

**Current Status:** ✅ 100% pass rate

#### FUNCTIONALITY Tests (Pass Rate ≥85% required)
- New feature validation
- Dual-use scenario support (fiction + true crime)
- PACER API integration
- Multi-character relationship logic
- Markdown export with attribution

**Current Status:** ✅ 100% pass rate

#### ERROR Tests (Pass Rate ≥80% required)
- Exception handling
- Input validation
- Error message clarity
- Graceful degradation

**Current Status:** ✅ 100% pass rate

## Performance Metrics

### Current Baseline (v1.0.25)

```json
{
  "latency_ms_mean": 2.5,
  "latency_ms_std_dev": 0.3,
  "throughput_ops_sec_mean": 9500,
  "throughput_ops_sec_std_dev": 450,
  "memory_mb_peak": 55
}
```

### Performance Targets

- **Latency:** ≤5ms average (current: 2.5ms ✅)
- **Throughput:** ≥9000 ops/sec (current: 9500 ops/sec ✅)
- **Memory:** ≤100MB peak (current: 55MB ✅)

## Scoring Formula

```
Combined Score = (Behavioral × 0.40) + (Performance × 0.35) + (CodeQuality × 0.25)

Pass Threshold: ≥90%
```

### Current Scores

- **Behavioral:** 100 (perfect test pass rates)
- **Performance:** 98 (excellent latency and throughput)
- **Code Quality:** 92 (high maintainability and coverage)
- **Combined:** 97 ✅ **PASS**

## Baseline Results

Baseline measurements are stored in version-specific directories:

- `v1.0.24/baseline-results.json` — Original migration baseline
- `v1.0.25/baseline-results.json` — Current version with dual-use support

Each file contains:
- Package and version information
- Timestamp of measurement
- All three benchmark categories (behavioral, performance, code quality)
- Combined score and pass/fail status
- Improvement notes from previous version

## Improvements in v1.0.25

Compared to v1.0.24:

- ✅ **Behavioral:** +2% (added dual-use tests)
- ✅ **Performance:** +1% (optimized character creation)
- ✅ **Code Quality:** Reduced duplication from 2.5% to 1.8%
- ✅ **Test Coverage:** Increased from 85% to 88%
- ✅ **Maintainability:** Improved from 80 to 82

## Integration with CI/CD

The benchmark suite integrates with GitHub Actions:

```yaml
- name: Run Benchmarks
  run: npm run benchmark

- name: Compare Against Baseline
  run: npm run benchmark:compare v1.0.25
```

## Adding New Benchmarks

To add new benchmark tests:

1. **Add test in `benchmark-runner.ts`:**
   ```typescript
   async function runMyNewTest(): Promise<BehavioralResults> {
     const tests: TestResult[] = [];
     // ... implement test
     return {
       category: 'CATEGORY',
       passed: /* count */,
       total: /* count */,
       passRate: (passed / total) * 100,
       tests,
     };
   }
   ```

2. **Update scoring in `runBenchmark()`:**
   ```typescript
   const myTestResults = await runMyNewTest();
   // ... include in combined score calculation
   ```

3. **Update baseline results:**
   ```bash
   npm run benchmark > benchmarks/packages/@h4shed/skill-underworld-writer/v1.0.25/baseline-results.json
   ```

## Troubleshooting

### Benchmark Failures

If benchmarks fail:

1. **Check system resources:** Performance tests may be sensitive to CPU/memory load
2. **Verify build:** Run `npm run build` before benchmarking
3. **Clear cache:** `npm run clean && npm install`
4. **Check dependencies:** Ensure all dev dependencies are installed

### Performance Regressions

If performance score drops:

1. **Profile the code:** Use Node.js built-in profiler
   ```bash
   node --prof dist/benchmarks/utilities/benchmark-runner.js
   ```

2. **Compare against baseline:** Review changes since last benchmark run

3. **Optimize:** Profile results will indicate bottlenecks

## Resources

- [Definition of Done Framework](../../docs/DEFINITION_OF_DONE.md)
- [Benchmark Utils Package](../../packages/benchmark-utils)
- [Performance Optimization Guide](../../docs/PERFORMANCE_OPTIMIZATION.md)

## Support

For questions about benchmarks, see:
- [GitHub Issues](https://github.com/Fused-Gaming/underworld-writer/issues)
- [Discussions](https://github.com/Fused-Gaming/underworld-writer/discussions)
