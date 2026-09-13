# Podcast Scripting Engine v2.0.6 - Definition of Done

## 🎙️ Feature Overview

Enable true crime podcasters to generate production-ready, fact-checked episode scripts from underworld character narratives and PACER court records. Scripts support both **single-episode** and **two-part episode** formats with built-in Q&A insertion points for guest interviews.

### Target Deliverable Format

Producers receive:
1. **Producer's Brief** — Episode summary, key facts, guest talking points
2. **Fact-Checked Script** — Narrative segments with source attribution
3. **Guest Handoff** — Formatted dialogue prompts for interview preparation
4. **Q&A Windows** — Marked sections for guest Q&A and claim verification
5. **Interview Guide** — Missing facts, verification opportunities, follow-up questions

---

## 📋 Definition of Done Checklist

### Phase 1: Script Generation Engine

- [ ] **ScriptGenerator class** — Core orchestration for episode generation
  - [ ] Accepts UnderWorldCharacter + episode format (single|two-part)
  - [ ] Accepts optional PACER case data for fact verification
  - [ ] Validates input completeness before generation
  - [ ] Returns structured ScriptOutput object

- [ ] **Single Episode Format**
  - [ ] Act structure: Opening → Character Foundation → Integration → Narrative Arc → Closing
  - [ ] ~8-12 minute read length (typical podcast segment)
  - [ ] Built-in transitions between segments
  - [ ] Natural speaking patterns (not overly formal)
  - [ ] Returns ScriptOutput with `format: 'single'`

- [ ] **Two-Part Episode Format**
  - [ ] Part 1: Character Foundation + Underworld Integration + Act 1 climax
  - [ ] Part 2: Conflict escalation + Act 2/3 + Resolution
  - [ ] ~6-8 minute read per part (manageable segments)
  - [ ] Recap segment for Part 2 opening
  - [ ] Cliffhanger or hook between parts
  - [ ] Returns ScriptOutput with `format: 'two-part'` and separate parts

- [ ] **Fact Attribution System**
  - [ ] Inline source markers: `[Tier X: Federal Record]` or `[Tier X: Unverified]`
  - [ ] Tier 1-4 classification from VerificationEngine
  - [ ] Footnotes section with full source citations
  - [ ] Producer notes on verification status

### Phase 2: Guest Handoff Format

- [ ] **Producer's Brief** (1-2 pages)
  - [ ] Episode title and theme
  - [ ] Character overview (background, role, key conflicts)
  - [ ] 3-5 key facts to emphasize
  - [ ] Guest talking points (questions to ask)
  - [ ] Verification status for sensitive claims

- [ ] **Guest Script** (formatted for dialogue)
  - [ ] Speaker labels for producer/guest transitions
  - [ ] Dialogue prompts instead of full narrator script
  - [ ] Conversational tone (questions, not monologue)
  - [ ] Natural pause points marked `[PAUSE]`
  - [ ] Ad-lib encouragement notes for guest response
  - [ ] Font/formatting suitable for printed materials

- [ ] **Supplementary Materials**
  - [ ] One-page character cheat sheet (appearance, key relationships, abilities)
  - [ ] Timeline visualization (story arc progression)
  - [ ] Faction/relationship diagram (for reference)
  - [ ] Print-ready PDF export option

### Phase 3: Q&A & Interview Windows

- [ ] **Q&A Insertion Points**
  - [ ] Auto-identified moments in script for guest input
  - [ ] Marked with `[Q&A: TOPIC]` labels
  - [ ] Linked to specific character details or claims
  - [ ] Suggested follow-up questions provided

- [ ] **Missing Fact Windows**
  - [ ] Identified claims lacking Tier 1 verification
  - [ ] Marked with `[VERIFY: CLAIM]` tags
  - [ ] Producer notes suggest verification approaches
  - [ ] Interview follow-up prompts for guests
  - [ ] Opportunity to add guest expertise or anecdotes

- [ ] **Fact-Checking Workflow**
  - [ ] Producers can flag claims during interview prep
  - [ ] Script supports inline claim editing during recording
  - [ ] Real-time verification status updates
  - [ ] Post-recording claim validation

### Phase 4: Testing & Quality Assurance

- [ ] **Unit Tests** (minimum 30 tests)
  - [ ] ScriptGenerator initialization and validation
  - [ ] Single-episode generation (format, length, structure)
  - [ ] Two-part episode generation (both parts, recap, cliffhanger)
  - [ ] Fact attribution and tier classification
  - [ ] Guest handoff format generation
  - [ ] Q&A insertion point identification
  - [ ] Missing fact detection and reporting
  - [ ] Error handling (incomplete data, invalid format)
  - [ ] Edge cases (minimal character data, no PACER records)

- [ ] **Integration Tests** (minimum 10 tests)
  - [ ] End-to-end script generation workflow
  - [ ] Script + guest handoff + producer brief together
  - [ ] PACER integration with real case data (mock)
  - [ ] PDF export with proper formatting
  - [ ] Character validation + script generation chain
  - [ ] Multi-part episode continuity verification

- [ ] **Performance Benchmarks** (separate benchmark.test.ts file)
  - [ ] Single-episode generation: < 50ms baseline established
  - [ ] Two-part episode generation: < 100ms baseline established
  - [ ] PDF export: < 200ms baseline established
  - [ ] Guest handoff formatting: < 30ms baseline established
  - [ ] Q&A window detection: < 15ms baseline established
  - [ ] Stress test: 50 concurrent script generations < 5s total
  - [ ] Stress test: 100 PDF exports < 20s total
  - [ ] Benchmark baselines committed to `benchmarks/baseline.json`
  - [ ] Performance regression detection (compare against baseline)
  - [ ] Memory usage tracking for large character datasets

- [ ] **Manual QA**
  - [ ] Generated scripts read naturally (read aloud)
  - [ ] Fact attribution is accurate and visible
  - [ ] Guest script is interview-ready (tested with actual producer)
  - [ ] Q&A windows align with logical dialogue moments
  - [ ] Missing fact windows highlight genuine verification gaps
  - [ ] PDF formatting matches podcast production standards
  - [ ] No broken source citations

### Phase 5: Documentation

- [ ] **README.md Main Updates**
  - [ ] Add "Podcast Scripting Engine (v2.0.6)" section after intro
  - [ ] Add "Quick Start" subsection:
    - [ ] `npx underworld-writer generate-script --help`
    - [ ] Single-episode example command
    - [ ] Two-part episode example command
  - [ ] Add "Features" section listing podcast capabilities
  - [ ] Add "Use Cases" section (Darknet Diaries, Court Junkie, etc.)
  - [ ] Add "CLI Commands" section with all 5 commands documented
  - [ ] Add "MCP Tools for Claude AI" section with 4 tools listed
  - [ ] Add "Output Formats" section with sample script excerpts
  - [ ] Add "Performance" section with benchmark table (from benchmarks)
  - [ ] Link to `PODCASTING_DoD.md` for detailed specification

- [ ] **API Documentation** (docs/api.md new file)
  - [ ] ScriptGenerator class API
    - [ ] Constructor signature
    - [ ] `generateScript(character, options)` method
    - [ ] `createGuestHandoff(script)` method
    - [ ] `identifyQAWindows(script)` method
    - [ ] `flagMissingFacts(script, tier?)` method
  - [ ] ScriptOutput interface with all properties documented
  - [ ] ProducerBrief, GuestScript interfaces
  - [ ] QAWindow and MissingFactWindow documentation
  - [ ] Error types and validation rules
  - [ ] TypeScript usage examples

- [ ] **Tutorial/Guide** (docs/quick-start.md new file)
  - [ ] "5-Minute Quick Start" for producers
  - [ ] Prerequisites (Node.js 18+, npx)
  - [ ] Step 1: Character file format (JSON example)
  - [ ] Step 2: Generate single-episode script (command + output sample)
  - [ ] Step 3: Generate two-part episode (command + output sample)
  - [ ] Step 4: Create guest handoff materials (command + sample)
  - [ ] Step 5: Identify Q&A windows (command + sample)
  - [ ] Step 6: Find missing facts (command + sample)
  - [ ] Example output samples (single-episode excerpt)
  - [ ] Example output samples (two-part episode excerpt)
  - [ ] Troubleshooting section:
    - [ ] "Script is too short/long" solutions
    - [ ] "Missing facts not detected" solutions
    - [ ] "PDF export failed" solutions
    - [ ] "Q&A windows not appearing" solutions

- [ ] **Release Notes** (RELEASE_NOTES_v2.0.6.md new file)
  - [ ] Title: "Underworld Writer v2.0.6 — Podcast Scripting Engine"
  - [ ] Release date: September 27, 2026
  - [ ] Status: Production Ready
  - [ ] Feature overview and use cases
  - [ ] Target audience (podcasters, journalists, documentary makers)
  - [ ] Major features (7 phases with checkmarks)
  - [ ] Test coverage (40+ tests with baseline benchmarks)
  - [ ] Performance metrics table
  - [ ] Known limitations:
    - [ ] OIDC token for npm publish still pending
    - [ ] Live PACER API (planned v2.0.7)
    - [ ] Bureau of Prisons integration (planned v2.1.0)
  - [ ] Breaking changes (none from v2.0.5)
  - [ ] Migration guide (if any)
  - [ ] Upgrade instructions
  - [ ] Roadmap for v2.0.7 and v2.1.0

### Phase 6: CLI & MCP Integration

- [ ] **CLI Executable Setup**
  - [ ] `cli.ts` file implements all commands (src/cli.ts)
  - [ ] Shebang line: `#!/usr/bin/env node`
  - [ ] Package.json bin entry: `"underworld-writer": "./dist/cli.js"`
  - [ ] Dist bin file executable permissions set (755)
  - [ ] `npx underworld-writer --help` works without installation
  - [ ] Each command has full help text and usage examples
  - [ ] Error messages are user-friendly and actionable

- [ ] **CLI Commands** (via `npx underworld-writer` or direct binary)
  - [ ] `npx underworld-writer generate-script [options]` — Create episode script
    - [ ] `--character <file>` — JSON character file
    - [ ] `--pacer-case <casenum>` — Optional PACER data
    - [ ] `--format single|two-part` — Episode format
    - [ ] `--output <file>` — Output script file
    - [ ] `--json` — JSON output mode
  - [ ] `npx underworld-writer generate-guest-handoff [options]` — Producer materials
  - [ ] `npx underworld-writer format-script [options]` — Apply formatting/PDF export
    - [ ] `--input <file>` — Input script
    - [ ] `--output-pdf <file>` — PDF export path
    - [ ] `--print-ready` — Printer-optimized formatting
  - [ ] `npx underworld-writer validate-script [options]` — Verify facts and structure
  - [ ] `npx underworld-writer benchmark` — Run performance tests and compare baselines

- [ ] **MCP Tools** (4 new tools for Claude AI)
  - [ ] New MCP tool: `underworld_generate_episode_script`
    - [ ] Input: character object + episode format + optional PACER data
    - [ ] Output: script object with text + metadata
    - [ ] Error handling for malformed input
  - [ ] New MCP tool: `underworld_create_guest_handoff`
    - [ ] Input: script object
    - [ ] Output: producer brief + guest script + materials
  - [ ] New MCP tool: `underworld_identify_qa_windows`
    - [ ] Input: script object
    - [ ] Output: array of Q&A insertion points with context
  - [ ] New MCP tool: `underworld_flag_missing_facts`
    - [ ] Input: script object + optional source tier threshold
    - [ ] Output: array of unverified claims with suggestions
  - [ ] Integration tests with Claude AI (mcp-tools.test.ts)

- [ ] **Plugin Manifest Updates**
  - [ ] Updated plugin.json with new tool definitions
  - [ ] All 4 tools listed with correct input/output schemas
  - [ ] CLI entry: `"cli": "./dist/cli.js"`
  - [ ] Version updated to 2.0.6
  - [ ] Skills section includes podcast scripting engine
  - [ ] Tools section includes all 4 new MCP tools
  - [ ] Capabilities section lists new features

### Phase 7: Version & Package Updates

- [ ] **Version Control**
  - [ ] package.json version: 2.0.6
  - [ ] src/index.ts skill version: 2.0.6
  - [ ] plugin.json version: 2.0.6
  - [ ] All version references aligned
  - [ ] Git tags: `git tag v2.0.6` after merge
  - [ ] CHANGELOG.md entry for v2.0.6

- [ ] **package.json Updates**
  - [ ] `"version": "2.0.6"`
  - [ ] `"description"` updated: "...podcast scripting engine for true crime..."
  - [ ] `"bin": { "underworld-writer": "./dist/cli.js" }` — npx executable
  - [ ] `"scripts"` section updated with new commands:
    - [ ] `"generate-script": "underworld-writer generate-script"`
    - [ ] `"benchmark": "jest benchmarks/ --testNamePattern=benchmark"`
    - [ ] Keep existing: build, dev, cli, test, test:watch, test:coverage
  - [ ] Dependencies: add PDF generation library if needed (e.g., `pdfkit`)
  - [ ] No removal of existing dependencies
  - [ ] Ensure @h4shed dependencies remain at tested versions

- [ ] **plugin.json Updates**
  - [ ] Version: 2.0.6
  - [ ] Add skills array with podcast scripting engine
  - [ ] Add tools array with 4 new MCP tools
  - [ ] Add CLI entry: `"cli": "./dist/cli.js"`
  - [ ] Update capabilities with supported features
  - [ ] License field: Apache-2.0
  - [ ] Author: Fused Gaming

- [ ] **TypeScript Types** (src/podcast-types.ts new file)
  - [ ] ScriptGenerator class with full type safety
  - [ ] ScriptOutput interface (format, text, metadata, parts)
  - [ ] ProducerBrief interface (title, summary, keyFacts, talkingPoints)
  - [ ] GuestScript interface (speakers, segments, pausePoints, adlibNotes)
  - [ ] QAWindow interface (lineNumber, topic, context, suggestedQuestions)
  - [ ] MissingFactWindow interface (claim, tier, confidence, verificationApproach)
  - [ ] ScriptConfig interface (format, includeAttribution, includeTimecodes)
  - [ ] No `any` types; strict mode compliance
  - [ ] Full JSDoc comments on all types

- [ ] **Build & Distribution**
  - [ ] TypeScript compilation: `npm run build` succeeds without errors
  - [ ] ESM modules properly exported in tsconfig.json
  - [ ] Dist folder structure:
    - [ ] `dist/index.js` (skill definition)
    - [ ] `dist/cli.js` (CLI executable)
    - [ ] `dist/mcp-tools.js` (MCP tool definitions)
    - [ ] `dist/podcast-script-generator.js` (core engine)
    - [ ] `dist/podcast-types.js` (TypeScript interfaces)
  - [ ] CLI binary works via `npx underworld-writer --help`
  - [ ] All exports properly declared in package.json
  - [ ] No unused dependencies or dead code
  - [ ] ESM imports work correctly (no CommonJS conflicts)

---

## 📊 Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| Unit Tests Passing | 30+ | ❌ Pending |
| Integration Tests Passing | 10+ | ❌ Pending |
| Benchmark Tests | 10+ with baseline | ❌ Pending |
| Performance (script generation) | < 50ms | ❌ Pending |
| Performance (two-part episode) | < 100ms | ❌ Pending |
| Performance (PDF export) | < 200ms | ❌ Pending |
| Benchmark Baselines Established | Yes | ❌ Pending |
| Documentation Complete | 100% (3 docs) | ❌ Pending |
| CLI Commands Functional | 5/5 | ❌ Pending |
| npx Executable Working | Yes | ❌ Pending |
| MCP Tools Functional | 4/4 | ❌ Pending |
| Plugin Manifest Updated | v2.0.6 | ❌ Pending |
| package.json Updated | v2.0.6 + bin | ❌ Pending |
| Version Alignment | All 2.0.6 | ❌ Pending |
| Producer-Ready Scripts | ✓ Tested | ❌ Pending |
| Guest Handoff Format | ✓ Tested | ❌ Pending |
| PDF Export | ✓ Tested | ❌ Pending |
| README Updated | Main sections added | ❌ Pending |

---

## 🛠️ CLI Implementation Details

### Command Structure
Each command follows this pattern:
```bash
npx underworld-writer <command> [options]
```

### Available Commands

1. **generate-script** — Create episode scripts from characters
   - Required: `--character <file.json>`
   - Optional: `--pacer-case <casenum>`, `--format single|two-part`, `--output <file>`, `--json`
   - Output: Formatted script text or JSON

2. **generate-guest-handoff** — Create producer materials
   - Required: `--character <file.json>`
   - Optional: `--output-dir <path>`, `--format pdf|markdown`, `--print-ready`
   - Output: Producer brief, guest script, character sheet

3. **format-script** — Apply formatting and export
   - Required: `--input <script.txt>`
   - Optional: `--output-pdf <file>`, `--output-markdown <file>`, `--print-ready`
   - Output: Formatted/exported files

4. **validate-script** — Verify facts and structure
   - Required: `--input <script.txt>`
   - Optional: `--pacer-case <casenum>`, `--tier-threshold 1-4`, `--json`
   - Output: Validation report with issues and suggestions

5. **benchmark** — Run performance tests against baseline
   - Optional: `--compare <baseline.json>`, `--save <baseline.json>`
   - Output: Performance metrics table

### CLI Help System
- [ ] Each command has: `--help` or `-h` flag
- [ ] Global help: `npx underworld-writer --help` or `npx underworld-writer -h`
- [ ] Version: `npx underworld-writer --version` or `npx underworld-writer -v`
- [ ] Examples: `npx underworld-writer <command> --examples`

### Error Handling
- [ ] Clear error messages (missing required args, invalid formats)
- [ ] Exit codes: 0 (success), 1 (validation error), 2 (not found), 127 (runtime error)
- [ ] Suggestions for common mistakes

---

## 📖 README.md Update Sections

### Main README Sections to Add

1. **Podcast Scripting Engine** (after intro)
   - Feature overview with use case examples
   - Links to podcast series (Darknet Diaries, Court Junkie, etc.)

2. **Quick Start** (before Features)
   ```bash
   npx underworld-writer generate-script --character my-character.json
   ```

3. **CLI Commands** (new major section)
   - All 5 commands listed with examples
   - Each command with required/optional args
   - Sample output shown

4. **MCP Tools for Claude AI** (new section)
   - 4 tools listed and described
   - How to register in Claude AI
   - Example usage

5. **Output Formats** (new section)
   - Script format explanation
   - Guest handoff structure
   - Producer brief layout
   - Sample excerpts

6. **Performance & Benchmarks** (new section)
   - Benchmark table from benchmarks/baseline.json
   - System requirements
   - Performance tips

7. **Links & References** (update existing)
   - Link to PODCASTING_DoD.md
   - Link to docs/quick-start.md
   - Link to docs/api.md
   - Link to RELEASE_NOTES_v2.0.6.md

---

## 🎯 Priority Sequence

1. **Script Generation Engine** (Phase 1) — Core functionality
2. **Guest Handoff Format** (Phase 2) — Producer deliverable
3. **Q&A Windows** (Phase 3) — Interview optimization
4. **Testing & Benchmarks** (Phase 4) — Quality gates
5. **Documentation** (Phase 5) — User enablement
6. **CLI & MCP** (Phase 6) — Integration & accessibility
7. **Version & Release** (Phase 7) — Production readiness

---

## 📝 Notes for Implementation

### Script Generation Philosophy
- **Conversational over formal** — Scripts should sound like expert discussion, not documentary voiceover
- **Producer-centric** — Every output format optimizes for producer workflow
- **Fact-first** — Attribution and verification status visible throughout
- **Guest-friendly** — Prompts encourage guest expertise, not just recitation

### Tier-Based Fact Presentation
- **Tier 1** (Federal Records): "According to PACER records..."
- **Tier 2** (Multiple Sources): "Reported by multiple sources..."
- **Tier 3** (Single Source): "One source reports..."
- **Tier 4** (Character-Only): "Character background indicates..."

### Q&A Window Strategy
- Insert where guest would naturally have questions
- Prioritize missing verifications
- Include follow-up prompts that advance narrative
- Encourage guest to add personal anecdotes

---

## 📌 Definition of Done Verification

Before marking this feature complete:

- [ ] All test suites pass (unit + integration + benchmark)
- [ ] Code review approved (if applicable)
- [ ] Documentation reviewed by producer/user
- [ ] Sample scripts validated by test audience
- [ ] Performance benchmarks meet targets
- [ ] CLI/MCP tools tested end-to-end
- [ ] Version bumped and release notes drafted
- [ ] PR merged to main with merge commit
- [ ] GitHub release tag created (v2.0.6)

---

## 🚀 Post-Release Roadmap

### v2.0.7 — Interview Recording Support
- Real-time fact verification during recording
- Transcript alignment with script
- Post-interview fact-checking batch

### v2.1.0 — Advanced Narrative Features
- Co-conspirator network visualization
- Multi-character episode coordination
- Factual web of relationships

### v2.2.0 — Bureau of Prisons Integration
- Inmate locator queries
- Sentence timeline verification
- Release prediction tracking

---

## 📁 Files to Create/Modify

### New Files (Create)
- [ ] `src/podcast-script-generator.ts` — Core ScriptGenerator class (300-400 LOC)
- [ ] `src/podcast-guest-handoff.ts` — Guest handoff generation (200-300 LOC)
- [ ] `src/podcast-types.ts` — TypeScript interfaces and types (150-200 LOC)
- [ ] `src/cli.ts` — CLI command handler (400-500 LOC)
- [ ] `tests/podcast-script.test.ts` — Unit tests (30+ tests, 600+ LOC)
- [ ] `tests/podcast-integration.test.ts` — Integration tests (10+ tests, 400+ LOC)
- [ ] `tests/podcast-benchmark.test.ts` — Benchmark tests (10+ tests, 300+ LOC)
- [ ] `benchmarks/baseline.json` — Performance baseline data
- [ ] `docs/quick-start.md` — Quick start guide (2000+ words)
- [ ] `docs/api.md` — API documentation (1500+ words)
- [ ] `RELEASE_NOTES_v2.0.6.md` — Release notes
- [ ] `examples/sample-character.json` — Example character file
- [ ] `examples/sample-script-output.md` — Example script output

### Modified Files (Update)
- [ ] `package.json` — Version 2.0.6, bin entry, scripts, dependencies
- [ ] `src/index.ts` — Export podcast generator in skill definition
- [ ] `src/mcp-tools.ts` — Add 4 new MCP tool definitions
- [ ] `plugin.json` — Version 2.0.6, tools, skills, CLI entry
- [ ] `README.md` — Add podcast scripting sections
- [ ] `tsconfig.json` — Ensure podcast types properly exported

### Build & Distribution
- [ ] `dist/podcast-script-generator.js` (compiled from src/podcast-script-generator.ts)
- [ ] `dist/podcast-types.js` (compiled from src/podcast-types.ts)
- [ ] `dist/cli.js` (compiled from src/cli.ts, executable)
- [ ] `dist/mcp-tools.js` (updated with new tools)
- [ ] `dist/index.js` (updated with podcast exports)

---

## ✅ Verification Checklist (Before PR Merge)

- [ ] All new TypeScript files compile without errors
- [ ] All tests pass: `npm test`
- [ ] Benchmark baselines established: `npm run benchmark -- --save`
- [ ] CLI works: `npx underworld-writer --help`
- [ ] All 5 CLI commands accessible and functional
- [ ] MCP tools register and load successfully
- [ ] plugin.json validates against schema
- [ ] package.json has version 2.0.6 everywhere
- [ ] dist/ folder fully built and current
- [ ] No unused dependencies
- [ ] No TypeScript errors with strict mode
- [ ] README updated with podcast sections
- [ ] All documentation files created and complete
- [ ] No console.log or debug code left in
- [ ] Performance benchmarks meet targets
- [ ] No merge conflicts with main branch

---

**Release Target**: September 27, 2026  
**Branch**: `feature/podcast-scripting-engine`  
**Baseline Commit**: de08b2d (init) + 7e818af (DoD)
