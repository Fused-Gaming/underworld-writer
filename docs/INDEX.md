# Underworld Writer Documentation Index

**Complete reference guide for all Underworld Writer use cases and methodologies.**

---

## Quick Navigation

### Start Here
- [USE_CASES_OVERVIEW.md](./USE_CASES_OVERVIEW.md) — Overview of Fiction, True Crime, and Podcast Production use cases
- [QUICK_START.md](./QUICK_START.md) — Get started in 5 minutes (coming soon)
- [FAQ.md](./FAQ.md) — Frequently asked questions (coming soon)

### Use Cases
1. **[Fiction Use Case](./use-cases/fiction/README.md)** — Imagined underworld narratives
2. **[True Crime Use Case](./use-cases/true-crime/README.md)** — Fact-verified investigative narratives
3. **[Podcast Production Use Case](./use-cases/podcast-production/README.md)** — Episodic podcast series development

---

## Complete Documentation Structure

### Overview & Navigation
```
docs/
├── INDEX.md                          # THIS FILE
├── USE_CASES_OVERVIEW.md            # Overview of all three use cases
├── LENGTH_SPECIFICATIONS.md          # Length & format specifications (NEW)
├── QUICK_START.md                    # 5-minute quickstart (coming)
└── FAQ.md                            # Frequently asked questions (coming)
```

### Shared Resources
```
docs/shared/
├── character-development.md          # Three-phase methodology (all use cases)
├── podcast-scripting.md              # Script generation guide
├── editorial-checklist.md            # Editorial review standards
└── GLOSSARY.md                       # Terminology and definitions
```

### Fiction Use Case
```
docs/use-cases/fiction/
├── README.md                         # Fiction use case overview
├── METHODOLOGY.md                    # Three-phase character development
├── TEMPLATES.md                      # Character & world templates (planned, not yet written)
└── EXAMPLES.md                       # Sample characters & narrative worlds (planned, not yet written)
```

### True Crime Use Case
```
docs/use-cases/true-crime/
├── README.md                         # True Crime use case overview
├── SKILL.md                          # Core verification workflow (4-step process)
├── protocols/
│   ├── verification-engine.md        # Source-tier classification (Tier 1-4)
│   ├── query-construction-guide.md   # Research search strategies
│   ├── cross-source-reconciliation.md # Handling conflicting sources
│   └── escalation-protocols.md       # PACER, BOP, news archives
└── EXAMPLES.md                       # Sample fact-checking workflows (planned, not yet written)
```

### Podcast Production Use Case
```
docs/use-cases/podcast-production/
├── README.md                         # Podcast use case overview
├── SERIES_FRAMEWORK.md               # Series setup & branding
├── EPISODE_DEVELOPMENT.md            # Episode workflow & directory structure
├── GUEST_COORDINATION.md             # Guest scripts & interview prep
├── TEMPLATES.md                      # Configuration templates (written)
└── EXAMPLES.md                       # Real-world series examples (written)
```

---

## By Role

### If You're a **Fiction Writer**

1. Start: [Fiction README](./use-cases/fiction/README.md)
2. Learn: [Three-Phase Methodology](./use-cases/fiction/METHODOLOGY.md)
3. Review: fiction TEMPLATES.md (planned, not yet written)
4. Study: fiction EXAMPLES.md (planned, not yet written) - or see [Podcast Production EXAMPLES.md](./use-cases/podcast-production/EXAMPLES.md) for a worked example
5. Build: Create your character profile and world

### If You're a **Journalist or True Crime Podcaster**

1. Start: [True Crime README](./use-cases/true-crime/README.md)
2. Learn: [Verification Workflow](./use-cases/true-crime/protocols/SKILL.md) (4-step process)
3. Deep Dive: 
   - [Source Verification Engine](./use-cases/true-crime/protocols/verification-engine.md) — Tier 1-4 classification
   - [Query Construction Guide](./use-cases/true-crime/protocols/query-construction-guide.md) — Research strategies
   - [Cross-Source Reconciliation](./use-cases/true-crime/protocols/cross-source-reconciliation.md) — Conflicting sources
   - [Escalation Protocols](./use-cases/true-crime/protocols/escalation-protocols.md) — PACER, BOP, archives
4. Reference: true-crime EXAMPLES.md (planned, not yet written) - or see [Podcast Production EXAMPLES.md](./use-cases/podcast-production/EXAMPLES.md) for a worked true-crime example series
5. Execute: Verify facts for your investigation

### If You're a **Podcast Producer**

1. Start: [Podcast Production README](./use-cases/podcast-production/README.md)
2. Set Up Series: [Series Framework](./use-cases/podcast-production/SERIES_FRAMEWORK.md)
3. Develop Episodes: [Episode Development Workflow](./use-cases/podcast-production/EPISODE_DEVELOPMENT.md)
4. Coordinate Guests: [Guest Coordination Guide](./use-cases/podcast-production/GUEST_COORDINATION.md)
5. Use Templates: [Configuration Templates](./use-cases/podcast-production/TEMPLATES.md)
6. Learn: [Real-World Examples](./use-cases/podcast-production/EXAMPLES.md)
7. Execute: Create your series and episodes

### If You're Doing **Multiple Use Cases**

1. Read: [USE_CASES_OVERVIEW.md](./USE_CASES_OVERVIEW.md) — Hybrid workflows section
2. Start with primary use case (above)
3. Integrate secondary use cases as needed
4. See [Examples](./use-cases/podcast-production/EXAMPLES.md) for hybrid workflows (written)

---

## Core Concepts

### Three-Phase Character Development
Used across all use cases. See [character-development.md](./shared/character-development.md):

1. **Foundation** — Identity, origin, core motivation
2. **Integration** — Role, relationships, resources
3. **Narrative Architecture** — Story arc, thematic elements, conflicts

### Four-Step Verification Workflow (True Crime)
From [SKILL.md](./use-cases/true-crime/protocols/SKILL.md):

1. **Source-Tier Triage** — Classify evidence quality (Tier 1-4)
2. **Query Construction** — Targeted research strategies
3. **Cross-Source Reconciliation** — Handle conflicting sources
4. **Escalation** — PACER, BOP, news archives for gaps

### Podcast Production Workflow
From [Episode Development](./use-cases/podcast-production/EPISODE_DEVELOPMENT.md):

1. **Initialize Episode** — Create directory structure and config
2. **Research & Sources** — Gather and verify materials
3. **Script Generation** — Create podcast scripts from character/case data
4. **Producer Materials** — Generate briefs and talking points
5. **Guest Coordination** — Prepare guests and interview materials
6. **Recording** — Record narration and guest interviews
7. **Post-Production** — Edit, review, approve
8. **Distribution** — Publish and promote

---

## File Organization

### How Documentation is Organized

**By Use Case:**
- Each use case has its own directory (`fiction/`, `true-crime/`, `podcast-production/`)
- Start with the `README.md` in each directory

**By Workflow Phase:**
- Skill documentation shows the **what and why** (theory)
- Methodology docs show the **how** (practice)
- Templates and examples show **real application**

**By Role:**
- See "By Role" section above to find your path

---

## Key Files to Bookmark

| Task | File | Use Case |
|------|------|----------|
| Build fictional character | [METHODOLOGY.md](./use-cases/fiction/METHODOLOGY.md) | Fiction |
| Define narrative word/page count | [LENGTH_SPECIFICATIONS.md](./LENGTH_SPECIFICATIONS.md) | All |
| Specify podcast episode length | [LENGTH_SPECIFICATIONS.md](./LENGTH_SPECIFICATIONS.md) | Podcast |
| Plan sponsor breaks | [LENGTH_SPECIFICATIONS.md](./LENGTH_SPECIFICATIONS.md) | Podcast |
| Verify a fact for true crime | [SKILL.md](./use-cases/true-crime/protocols/SKILL.md) | True Crime |
| Set up a podcast series | [SERIES_FRAMEWORK.md](./use-cases/podcast-production/SERIES_FRAMEWORK.md) | Podcast |
| Create an episode | [EPISODE_DEVELOPMENT.md](./use-cases/podcast-production/EPISODE_DEVELOPMENT.md) | Podcast |
| Prep a guest interview | [GUEST_COORDINATION.md](./use-cases/podcast-production/GUEST_COORDINATION.md) | Podcast |
| Classify sources | [verification-engine.md](./use-cases/true-crime/protocols/verification-engine.md) | True Crime |
| Construct search queries | [query-construction-guide.md](./use-cases/true-crime/protocols/query-construction-guide.md) | True Crime |
| Handle conflicting sources | [cross-source-reconciliation.md](./use-cases/true-crime/protocols/cross-source-reconciliation.md) | True Crime |

---

## Terminology

See [GLOSSARY.md](./GLOSSARY.md) for definitions of key terms used across all use cases.

Common terms:
- **Tier** — Source classification (Tier 1-4) for true crime
- **Phase** — Character development stage (Phase 1-3) for fiction
- **Episode** — Single podcast installment
- **Series** — Collection of episodes with shared branding
- **Season** — Episodes grouped together (Season 1, 2, etc.)
- **Verification Status** — Whether facts are Tier 1, mixed, etc.

---

## Updates and Changes

**Last Updated:** 2026-09-15  
**Underworld Writer Version:** 2.0.6+  
**Skill Type:** MCP-compatible, CLI-available

### Recent Additions
- Podcast Production use case documentation (complete)
- Series Framework and Episode Development guides
- Guest Coordination guide for interviews

### Coming Soon
- Quick Start guide (5 minutes to first episode)
- FAQ and troubleshooting
- Real-world example walkthroughs
- Template library and examples
- Character profile template generator

---

## Getting Help

### Questions?

1. **Check FAQ.md** — Common issues and solutions
2. **Review Examples** — See real-world setups in each use case's EXAMPLES.md
3. **Check Glossary** — Terminology definitions
4. **Read Related Section** — Cross-references suggest connected docs

### Still Stuck?

- Re-read the README.md for your use case
- Review the step-by-step workflow sections
- Look at template examples
- Check if there's a checklist for your task

---

## Quick Links by Task

### "I want to..."

- **...create a fictional underworld character** → [Fiction README](./use-cases/fiction/README.md)
- **...verify a fact for a true crime podcast** → [True Crime SKILL](./use-cases/true-crime/protocols/SKILL.md)
- **...set up a new podcast series** → [Series Framework](./use-cases/podcast-production/SERIES_FRAMEWORK.md)
- **...develop an episode for my podcast** → [Episode Development](./use-cases/podcast-production/EPISODE_DEVELOPMENT.md)
- **...prepare a guest for interview** → [Guest Coordination](./use-cases/podcast-production/GUEST_COORDINATION.md)
- **...generate a podcast script** → [Podcast Scripting](./shared/podcast-scripting.md)
- **...understand the three-phase methodology** → [Character Development](./shared/character-development.md)
- **...see an example of fact-checking in action** → true-crime EXAMPLES.md (planned, not yet written)
- **...see a real podcast series setup** → [Podcast Examples](./use-cases/podcast-production/EXAMPLES.md) (written - two complete example series)

---

**Start with your use case above, or read [USE_CASES_OVERVIEW.md](./USE_CASES_OVERVIEW.md) to learn which one fits your project.**
