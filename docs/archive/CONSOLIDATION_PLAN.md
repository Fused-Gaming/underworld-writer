# v2.1.0 Consolidation Plan - Implementation Guide

## Overview

This document outlines the implementation roadmap to consolidate v2.0.0 into a production-ready v2.1.0 release with real testing, CI/CD, and documentation validation.

**Timeline:** 2-3 weeks  
**Effort:** Parallel workstreams possible  
**Risk:** LOW (consolidation only, no new features)

---

## Workstream 1: Testing Infrastructure

### 1.1 Setup Jest Testing Framework

**Files to create:**
- `jest.config.js` - Jest configuration
- `test/core.test.ts` - Core functionality tests
- `test/fiction.test.ts` - Fiction methodology tests
- `test/true-crime.test.ts` - True crime methodology tests

**Installation:**
```bash
npm install --save-dev jest @types/jest ts-jest @babel/preset-typescript
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**jest.config.js:**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: { lines: 85, functions: 85, branches: 75, statements: 85 }
  }
};
```

### 1.2 Core Test Suites

**test/core.test.ts:**
- Module import tests
- Skill export validation
- Configuration validation
- Documentation file existence checks

**test/fiction.test.ts:**
- Fiction methodology structure validation
- Phase 1 (Foundation) requirements
- Phase 2 (Underworld Integration) requirements
- Phase 3 (Narrative Architecture) requirements
- Example file validation

**test/true-crime.test.ts:**
- True crime 6-step methodology validation
- Verification tier classification (Tier 1-4)
- Query construction patterns
- Cross-source reconciliation logic
- Escalation protocol validation
- Case study example validation

**test/integration/:**
- End-to-end fiction workflow
- End-to-end true crime workflow
- Cross-methodology switching

### 1.3 Test Data & Fixtures

**test/fixtures/**
```
├── fiction/
│   ├── character-profile.json
│   ├── narrative-scene.json
│   └── complete-story.json
├── true-crime/
│   ├── tier-1-source.json
│   ├── tier-2-source.json
│   ├── tier-3-source.json
│   ├── tier-4-source.json
│   ├── claim-reconciliation.json
│   └── escalation-case.json
└── shared/
    ├── editorial-checklist.json
    └── author-note.json
```

---

## Workstream 2: CI/CD Pipeline

### 2.1 GitHub Actions Workflow

**File:** `.github/workflows/test.yml`

```yaml
name: Test & Validate

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
      
      - name: Test
        run: npm run test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
      
      - name: Validate documentation
        run: npm run docs:validate
      
      - name: Benchmark
        run: npm run benchmark
```

### 2.2 Linting Configuration

**File:** `.eslintrc.json`
```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

---

## Workstream 3: Documentation Audit & Enhancement

### 3.1 Documentation Review Checklist

**Primary Files (Review for clarity):**
- [ ] README.md - Verify all links work
- [ ] SKILL.md - Quick navigation test
- [ ] INDEX.md - Completeness check
- [ ] SAMPLE_DATA.md - Example validity

**Fiction Methodology:**
- [ ] `use-cases/fiction/METHODOLOGY.md` - Phase completeness
- [ ] `examples/chapter-source-audit.md` - Run-through validation
- [ ] `examples/claim-verification-walkthrough.md` - Test flow
- [ ] `examples/gap-escalation-case-study.md` - End-to-end review

**True Crime Protocols:**
- [ ] `use-cases/true-crime/protocols/SKILL.md` - Entry point clarity
- [ ] `use-cases/true-crime/protocols/verification-engine.md` - Tier system
- [ ] `use-cases/true-crime/protocols/query-construction-guide.md` - Patterns
- [ ] `use-cases/true-crime/protocols/cross-source-reconciliation.md` - Logic
- [ ] `use-cases/true-crime/protocols/escalation-protocols.md` - PACER/BOP access

**Shared Resources:**
- [ ] `shared/character-template.md` - Template completeness
- [ ] `shared/narrative-architecture.md` - Scene structure guide
- [ ] `shared/editorial-checklist.md` - Pre-submission audit
- [ ] `shared/author-note-conventions.md` - Disclosure templates

### 3.2 New Documentation Files

**File:** `docs/GETTING_STARTED.md`
```markdown
# Getting Started with Underworld Writer

## Quick Choice
- **Fiction writer?** → [Fiction Methodology](../use-cases/fiction/METHODOLOGY.md)
- **True Crime writer?** → [True Crime Guide](../use-cases/true-crime/protocols/SKILL.md)

## Features at a Glance
- Dual-methodology system
- Structured 3-phase (fiction) or 6-step (true crime) approach
- Sourcing verification for factual narratives
- Character development templates
- Editorial review checklists

## Installation
```bash
npm install @h4shed/skill-underworld-writer
```

## First Example
See `examples/` for complete walkthroughs...
```

**File:** `docs/RELEASE_NOTES.md`
```markdown
# Release Notes

## v2.1.0 (TBD)
### Testing & Consolidation Release
- Real test suite (Jest, 90%+ coverage)
- CI/CD pipeline (GitHub Actions)
- Performance benchmarks (actual metrics)
- Documentation audit (peer-reviewed)
- Production-ready release

### What changed from v2.0.0?
- Added: `test/` directory with comprehensive test suites
- Added: `.github/workflows/test.yml` CI/CD pipeline
- Added: Performance benchmark tooling
- Improved: Documentation clarity and examples
- Fixed: Zero regressions (100% backward compatible)

## v2.0.0
### Dual-Methodology Release
- True crime methodology (6-step protocol)
- Fiction methodology (3-phase system)
- 5 specialized sub-protocols
- 3 worked examples
- Full backward compatibility with v1.0.24
```

**File:** `docs/CONTRIBUTING.md`
```markdown
# Contributing Guidelines

## Before Starting
1. Read VERSION_ANALYSIS.md to understand the roadmap
2. Check CONSOLIDATION_PLAN.md for ongoing work
3. Review existing examples in `examples/` and `use-cases/`

## Making Changes
- Keep fiction and true crime methodologies separate
- Test all changes with `npm test`
- Update relevant documentation
- Follow the editorial checklist before submitting

## Testing Requirements
- All tests pass: `npm run test`
- No regressions: `npm run test -- --coverage`
- Documentation builds: `npm run docs:validate`

## Release Process
See RELEASE_PROCESS.md for publishing guidelines
```

---

## Workstream 4: Performance & Optimization

### 4.1 Real Benchmarking

**File:** `scripts/benchmark.js`

```javascript
#!/usr/bin/env node

const { performance } = require('perf_hooks');
const fs = require('fs');

async function runBenchmarks() {
  const results = {
    timestamp: new Date().toISOString(),
    version: require('../package.json').version,
    benchmarks: []
  };

  // Benchmark 1: Module load time
  const loadStart = performance.now();
  const skill = require('../src/index.js');
  const loadTime = performance.now() - loadStart;
  results.benchmarks.push({
    name: 'module_load_time_ms',
    value: loadTime,
    unit: 'ms'
  });

  // Benchmark 2: Export availability
  const exportStart = performance.now();
  const exported = Object.keys(skill);
  const exportTime = performance.now() - exportStart;
  results.benchmarks.push({
    name: 'export_enumeration_ms',
    value: exportTime,
    unit: 'ms',
    exports_found: exported.length
  });

  // Benchmark 3: Documentation file count
  const docs = fs.readdirSync('./use-cases', { recursive: true });
  results.benchmarks.push({
    name: 'documentation_files',
    value: docs.length,
    unit: 'count'
  });

  // Benchmark 4: Build size
  const buildStats = fs.statSync('./dist/index.js');
  results.benchmarks.push({
    name: 'build_size_bytes',
    value: buildStats.size,
    unit: 'bytes',
    size_kb: (buildStats.size / 1024).toFixed(2)
  });

  // Save results
  fs.writeFileSync(
    './benchmarks/run-results.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('Benchmarks complete:', results.benchmarks);
  return results;
}

runBenchmarks().catch(console.error);
```

### 4.2 Performance Targets

**Target Metrics:**
- Module load: < 5ms
- Export enumeration: < 2ms
- Build size: < 100KB (minified)
- Test suite execution: < 10s
- TypeScript compilation: < 5s

**Baseline (v2.0.0):** To be established in v2.1.0  
**Regression threshold:** ±10% variance allowed

---

## Workstream 5: Package.json Updates

### 5.1 Updated Scripts

```json
{
  "name": "@h4shed/skill-underworld-writer",
  "version": "2.1.0",
  "scripts": {
    "build": "tsc --project tsconfig.json",
    "dev": "tsc --project tsconfig.json --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/ test/",
    "lint:fix": "eslint src/ test/ --fix",
    "benchmark": "node scripts/benchmark.js",
    "docs:validate": "node scripts/validate-docs.js",
    "prepublishOnly": "npm run lint && npm run build && npm run test:coverage"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^20.12.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.3.2"
  }
}
```

---

## Implementation Checklist

### Week 1: Foundation
- [ ] Set up Jest configuration
- [ ] Create core test suite
- [ ] Add GitHub Actions workflow
- [ ] Set up ESLint
- [ ] Create test fixtures

### Week 2: Testing & Validation
- [ ] Implement all test suites
- [ ] Run documentation validation
- [ ] Execute performance benchmarks
- [ ] Update test results in VERSION.json
- [ ] Fix any test failures

### Week 3: Polish & Release
- [ ] Documentation audit complete
- [ ] All benchmarks baseline established
- [ ] Bump version to 2.1.0
- [ ] Create RELEASE_NOTES.md
- [ ] Run full CI/CD pipeline
- [ ] Tag v2.1.0 release

---

## Success Criteria

### Testing ✓
- [ ] Jest suite: 90%+ coverage
- [ ] All tests: PASS
- [ ] Integration tests: Both methodologies validated
- [ ] Zero regressions vs v2.0.0

### Documentation ✓
- [ ] All files peer-reviewed
- [ ] Examples run end-to-end
- [ ] Links validated
- [ ] Cross-references complete

### CI/CD ✓
- [ ] GitHub Actions workflow active
- [ ] Multi-version Node.js testing (18.x, 20.x)
- [ ] Automated lint/build/test
- [ ] Coverage reporting enabled

### Performance ✓
- [ ] Benchmarks established
- [ ] No regression vs v2.0.0
- [ ] Build size < 100KB
- [ ] Load time < 5ms

---

## Version Bump Trigger

After all checkmarks complete → Bump version in:
1. `package.json` → 2.1.0
2. `VERSION.json` → 2.1.0
3. Create git tag: `v2.1.0`
4. Push with release notes

---

## Post-Release (v3.0.0 Planning)

Once v2.1.0 is stable, consider feature work for v3.0.0:

**Potential Features:**
- AI-assisted source discovery
- Real-time PACER integration
- Automated tier classification
- Interview transcript management
- Timeline/relationship visualization
- Collaborative editing support

---

## Contact & Questions

For questions on implementation, refer to:
- `VERSION_ANALYSIS.md` - Strategic overview
- `SKILL.md` - Skill documentation
- `examples/` - Working walkthroughs

---

**Last updated:** 2026-09-13  
**Next review:** After v2.1.0 release planning begins
