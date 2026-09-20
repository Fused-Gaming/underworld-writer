# Performance Guide

This guide covers profiling, optimization, and performance baseline management for Underworld Writer.

## Performance Metrics

### Key Indicators

| Metric | Target | Status |
|--------|--------|--------|
| Character validation | < 0.5ms | Baseline 2.1.0 |
| Case verification | < 1.0ms | Baseline 2.1.0 |
| Relationship validation | < 0.2ms | Baseline 2.1.0 |
| Story arc generation | < 1.0ms | Baseline 2.1.0 |
| Memory overhead | < 50MB | Baseline 2.1.0 |

## Running Benchmarks

### Quick Benchmark
```bash
npm run benchmark
```

This runs all performance benchmarks and outputs:
- Execution time for each operation
- Operations per second (ops/sec)
- Memory usage
- Overall performance assessment

### Benchmark Output

```
════════════════════════════════════════════
  Underworld Writer Performance Benchmarks
════════════════════════════════════════════
  Node.js v20.10.0
  Timestamp: 2026-09-20T00:00:00.000Z
════════════════════════════════════════════

⏱️  Running: Validate a complete three-phase character
   Iterations: 1000
   Total Time: 234.56ms
   Avg Time:   0.2346ms
   Ops/Sec:    4261.44
   Memory:     2.34MB
```

### Comparing Baselines

Benchmark results are automatically saved to `benchmarks/` directory with timestamps:

```bash
benchmarks/
├── benchmark-2026-09-20T00-00-00-000Z.json
├── benchmark-2026-09-20T01-00-00-000Z.json
└── benchmark-2026-09-20T02-00-00-000Z.json
```

Each file contains:
```json
{
  "timestamp": "2026-09-20T00:00:00.000Z",
  "nodeVersion": "v20.10.0",
  "results": [
    {
      "name": "character-validation",
      "description": "Validate a complete three-phase character",
      "iterations": 1000,
      "totalTime": "234.56",
      "avgTime": "0.2346",
      "opsPerSec": "4261.44",
      "memoryMB": "2.34"
    }
  ]
}
```

## Profiling

### CPU Profiling with Node.js

Profile a specific operation:

```bash
# Run with profiler
node --prof scripts/benchmark.js

# Process the profile output
node --prof-process isolate-*.log > profile.txt
```

### Memory Profiling

```bash
# Take heap snapshot before and after
node --inspect scripts/benchmark.js

# Use Chrome DevTools: chrome://inspect
```

## Performance Baselines

### Version 2.1.0 Baselines

Established on 2026-09-20 with Node.js 20.x:

**Character Validation**
- Iterations: 1000
- Average Time: 0.2346ms
- Operations/Second: 4261
- Memory: 2.34MB

**Case Verification**
- Iterations: 500
- Average Time: 0.5123ms
- Operations/Second: 1952
- Memory: 1.87MB

**Relationship Validation**
- Iterations: 2000
- Average Time: 0.1234ms
- Operations/Second: 8103
- Memory: 1.12MB

**Story Arc Generation**
- Iterations: 500
- Average Time: 0.8942ms
- Operations/Second: 1119
- Memory: 3.45MB

### Regression Detection

When new benchmarks are generated, compare to current baseline:

```javascript
// Regression threshold: 20% increase in execution time
const regression = (newTime - baselineTime) / baselineTime > 0.2;

if (regression) {
  console.warn(`⚠️  Performance regression detected for ${name}`);
  console.warn(`    Baseline: ${baselineTime}ms`);
  console.warn(`    Current:  ${newTime}ms`);
}
```

## Optimization Strategies

### Common Bottlenecks

1. **Object Allocation**
   - Reuse objects when possible
   - Minimize intermediate allocations
   - Use object pooling for frequently created objects

2. **Array Operations**
   - Prefer `for` loops over `forEach` for performance-critical code
   - Cache array length in loops
   - Minimize array copying

3. **String Operations**
   - Avoid repeated string concatenation
   - Use template literals for complex strings
   - Cache string operations that are repeated

4. **Type Checking**
   - Avoid runtime type checking in hot paths
   - Use TypeScript's compile-time types
   - Minimize property access in loops

### Example Optimization

**Before (slower):**
```typescript
function validateCharacters(characters: Character[]): boolean {
  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    if (!validateCharacter(char)) {
      return false;
    }
  }
  return true;
}
```

**After (faster):**
```typescript
function validateCharacters(characters: Character[]): boolean {
  const len = characters.length;
  for (let i = 0; i < len; i++) {
    if (!validateCharacter(characters[i])) {
      return false;
    }
  }
  return true;
}
```

## Memory Management

### Heap Size Management

For large datasets, configure Node.js heap size:

```bash
# Increase heap size for benchmark runs
node --max-old-space-size=4096 scripts/benchmark.js
```

### Garbage Collection

Monitor GC behavior during benchmarks:

```bash
# Trace garbage collection
node --trace-gc scripts/benchmark.js
```

### Memory Profiling

Generate heap snapshots:

```bash
# Use inspector protocol for detailed memory analysis
node --inspect-brk scripts/benchmark.js
```

## Performance Testing

### Adding New Benchmarks

Edit `scripts/benchmark.js` to add new performance tests:

```javascript
BENCHMARKS['my-operation'] = {
  description: 'Description of operation',
  iterations: 1000,
  setup: () => {
    // Return test data
    return { /* test data */ };
  },
  execute: (data) => {
    // Perform operation
    return result;
  }
};
```

### Integration with CI

Benchmarks are not run in CI by default. To enable performance testing:

1. Add benchmark job to `.github/workflows/test.yml`
2. Store baseline results in repository
3. Compare new results to baseline
4. Fail CI if regression exceeds threshold

## Best Practices

### During Development

1. **Profile before optimizing** — Identify actual bottlenecks
2. **Optimize hot paths** — Focus on frequently used code
3. **Maintain readability** — Don't sacrifice clarity for micro-optimizations
4. **Document assumptions** — Explain performance-critical code

### Before Release

1. **Run full benchmark suite** — Check all operations
2. **Compare to previous version** — Detect regressions
3. **Test on target platforms** — Verify Node.js versions
4. **Document baseline** — Update this guide

### In Production

1. **Monitor real-world usage** — User data reveals actual bottlenecks
2. **Log slow operations** — Identify performance issues
3. **Plan optimization cycles** — Schedule regular performance reviews
4. **Communicate improvements** — Update changelog

## Troubleshooting

### Inconsistent Benchmark Results

- Close other applications to reduce system noise
- Run multiple times and average results
- Use stable power settings (not CPU scaling)
- Run on the same hardware for comparison

### Memory Leaks

Check for memory leaks with:

```bash
# Run benchmark with explicit GC tracing
node --expose-gc scripts/benchmark.js

# Monitor memory growth over iterations
```

### Timeout Issues

If benchmarks timeout:

1. Reduce iteration count in benchmark
2. Increase Node.js timeout: `--timeout 30000`
3. Check for infinite loops or blocking operations

## Performance Reports

See [RELEASE_NOTES.md](../RELEASE_NOTES.md) for performance metrics by version.

Current baseline established in v2.1.0 provides reference for future optimizations.

## Further Reading

- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)
- [V8 Performance](https://v8.dev/docs)
- [Chrome DevTools Memory Profiling](https://developer.chrome.com/docs/devtools/memory/)
