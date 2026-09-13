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

- [ ] **Performance Benchmarks**
  - [ ] Single-episode generation: < 50ms
  - [ ] Two-part episode generation: < 100ms
  - [ ] PDF export: < 200ms
  - [ ] Guest handoff formatting: < 30ms
  - [ ] Stress test: 50 concurrent script generations

- [ ] **Manual QA**
  - [ ] Generated scripts read naturally (read aloud)
  - [ ] Fact attribution is accurate and visible
  - [ ] Guest script is interview-ready (tested with actual producer)
  - [ ] Q&A windows align with logical dialogue moments
  - [ ] Missing fact windows highlight genuine verification gaps
  - [ ] PDF formatting matches podcast production standards
  - [ ] No broken source citations

### Phase 5: Documentation

- [ ] **README Updates**
  - [ ] New "Podcast Scripting Engine" section
  - [ ] Code examples: single + two-part generation
  - [ ] Output format documentation with samples
  - [ ] Producer workflow guide
  - [ ] Guest handoff preparation steps

- [ ] **API Documentation**
  - [ ] ScriptGenerator class API (methods, parameters, return types)
  - [ ] ScriptOutput interface documentation
  - [ ] ProducerBrief, GuestScript interfaces
  - [ ] QAWindow and MissingFactWindow documentation
  - [ ] Error handling and validation rules

- [ ] **Tutorial/Guide**
  - [ ] "5-Minute Quick Start" for producers
  - [ ] Step-by-step: character → script → guest prep
  - [ ] Example output (single-episode sample)
  - [ ] Example output (two-part episode sample)
  - [ ] Troubleshooting common issues

- [ ] **Release Notes**
  - [ ] Feature overview and use cases
  - [ ] Target audience (podcasters, journalists)
  - [ ] Known limitations and roadmap
  - [ ] Breaking changes (if any)
  - [ ] Migration guide (if updating from v2.0.5)

### Phase 6: CLI & MCP Integration

- [ ] **CLI Commands**
  - [ ] `underworld-writer generate-script` — Create episode script
  - [ ] `underworld-writer generate-guest-handoff` — Producer materials
  - [ ] `underworld-writer format-script` — Apply formatting/PDF export
  - [ ] `underworld-writer validate-script` — Verify facts and structure
  - [ ] Each command includes `--format single|two-part` option

- [ ] **MCP Tools**
  - [ ] New MCP tool: `underworld_generate_episode_script`
  - [ ] Accepts character + case data, returns formatted script
  - [ ] New MCP tool: `underworld_create_guest_handoff`
  - [ ] New MCP tool: `underworld_identify_qa_windows`
  - [ ] New MCP tool: `underworld_flag_missing_facts`
  - [ ] Integration tests with Claude AI

- [ ] **Plugin Manifest**
  - [ ] Updated plugin.json with new tool definitions
  - [ ] All tools listed with correct input/output schemas
  - [ ] Version bumped to 2.0.6

### Phase 7: Version & Package Updates

- [ ] **package.json**
  - [ ] Version bumped to 2.0.6
  - [ ] New dependencies for PDF generation (if used)
  - [ ] Updated description to mention podcast scripting

- [ ] **TypeScript Types**
  - [ ] ScriptGenerator class with full type safety
  - [ ] ScriptOutput, ProducerBrief, GuestScript interfaces
  - [ ] QAWindow, MissingFactWindow types
  - [ ] ScriptConfig and formatting options
  - [ ] No `any` types; strict mode compliance

- [ ] **Build & Distribution**
  - [ ] TypeScript compilation succeeds without errors
  - [ ] ESM modules properly exported
  - [ ] Dist folder generated with correct structure
  - [ ] CLI binary works via npx
  - [ ] No unused dependencies

---

## 📊 Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| Unit Tests Passing | 30+ | ❌ Pending |
| Integration Tests Passing | 10+ | ❌ Pending |
| Performance (script generation) | < 50ms | ❌ Pending |
| Documentation Complete | 100% | ❌ Pending |
| CLI Commands Functional | 5/5 | ❌ Pending |
| MCP Tools Functional | 4/4 | ❌ Pending |
| Producer-Ready Scripts | ✓ Tested | ❌ Pending |
| Guest Handoff Format | ✓ Tested | ❌ Pending |
| PDF Export | ✓ Tested | ❌ Pending |

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

**Release Target**: September 27, 2026  
**Branch**: `feature/podcast-scripting-engine`  
**Baseline Commit**: de08b2d
