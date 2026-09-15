# Underworld Writer: Use Cases Overview

The Underworld Writer Skill supports three distinct narrative use cases, each with specialized methodologies, workflows, and output formats. This document provides an overview; see each use case's dedicated documentation for detailed guidance.

## The Three Use Cases

### 1. **Fiction** — Imagined Underworld Narratives
**Primary audience:** Fantasy writers, creative storytellers, world-builders  
**Focus:** Mythological coherence, character consistency, narrative depth

Use the **Fiction methodology** when building entirely imagined underworld settings—characters, factions, magic systems, and hierarchies that exist only in your creative vision.

- **Entry point:** [Fiction Use Case Guide](./use-cases/fiction/README.md)
- **Methodology:** [Three-Phase Character Development](./use-cases/fiction/METHODOLOGY.md)
- **Templates:** Character profile templates, relationship maps, faction hierarchies
- **Output:** Story-ready character profiles, mythology documents, narrative arcs

---

### 2. **True Crime** — Fact-Verified Investigative Narratives
**Primary audience:** Podcasters, journalists, investigative writers  
**Focus:** Source verification, claim attribution, factual accuracy

Use the **True Crime methodology** when creating narratives grounded in court records, public documents, and journalistic research—where every claim must be traceable to primary or secondary sources.

- **Entry point:** [True Crime Use Case Guide](./use-cases/true-crime/README.md)
- **Skill documentation:** [Verification Workflow](./use-cases/true-crime/protocols/SKILL.md)
- **Core protocols:**
  - [Source-Tier Verification Engine](./use-cases/true-crime/protocols/verification-engine.md)
  - [Query Construction Guide](./use-cases/true-crime/protocols/query-construction-guide.md)
  - [Cross-Source Reconciliation](./use-cases/true-crime/protocols/cross-source-reconciliation.md)
  - [Escalation Protocols](./use-cases/true-crime/protocols/escalation-protocols.md)
- **Output:** Fact-checked scripts, sourced attributions, producer briefs, interview guides

---

### 3. **Podcast Production** — Episodic Series Development
**Primary audience:** Podcast producers, show runners, content teams  
**Focus:** Episode architecture, guest coordination, reproducible workflow

Use the **Podcast Production methodology** when creating episodic podcast series—managing multiple episodes within a branded series, coordinating guests, generating scripts, and producing accompanying materials.

- **Entry point:** [Podcast Production Use Case Guide](./use-cases/podcast-production/README.md)
- **Series framework:** [Building Branded Series](./use-cases/podcast-production/SERIES_FRAMEWORK.md)
- **Episode structure:** [Episode Development Workflow](./use-cases/podcast-production/EPISODE_DEVELOPMENT.md)
- **Guest coordination:** [Guest Script and Interview Prep](./use-cases/podcast-production/GUEST_COORDINATION.md)
- **Templates:** Series config, episode metadata, source worksheets, guest checklists
- **Output:** Complete episode directories with scripts, producer briefs, guest materials, recording guides

---

## Choosing Your Use Case

| If you are... | Use this | Focus on... |
|---|---|---|
| Writing fantasy underworld fiction | **Fiction** | Character coherence, mythology, world-building |
| Producing fact-checked true crime | **True Crime** | Source verification, attribution, fact-checking |
| Running a podcast series | **Podcast Production** | Episode architecture, guest coordination, reproducible workflow |
| Mixing approaches | See "Hybrid Workflows" below | Integration between use cases |

---

## Shared Infrastructure

All three use cases build on common foundations:

### Character Development
All use cases employ the **three-phase character methodology**:
1. **Foundation** — Identity, origin, core motivation
2. **Integration** — Role, relationships, resources
3. **Narrative Architecture** — Story arc, thematic elements, interaction points

### Podcast Scripting Engine
Fiction and True Crime both feed into the **podcast scripting engine** for audio production:
- Script generation with segment timing
- Producer briefs and talking points
- Guest scripts and interview guides
- Q&A windows and fact attribution

### Shared Templates
- Character profile templates
- Relationship mapping formats
- Editorial checklists
- Narrative structure outlines

---

## Hybrid Workflows

You can combine use cases:

### Fiction + Podcast Production
Create fictional underworld podcasts where character consistency matters more than factual accuracy.
- **Workflow:** Develop characters via Fiction methodology → Generate episodic scripts via Podcast Production framework
- **Example:** A dramatized anthology series with original underworld characters

### True Crime + Podcast Production
Create fact-checked investigative podcast series.
- **Workflow:** Verify facts via True Crime methodology → Organize into episodes via Podcast Production framework
- **Example:** "Insight Corruption" — Bay Area corruption cases in episodic format (see `output/insight-corruption/` for the full worked series)

### True Crime + Fiction
Create narratives that blend real cases with imaginative reconstruction.
- **Workflow:** Verify core facts via True Crime → Fill gaps via Fiction character development
- **Example:** Dramatized reconstructions of real criminal underworld operations

---

## Documentation Structure

```
docs/
├── USE_CASES_OVERVIEW.md          # This file
├── QUICK_START.md                 # Get started in 5 minutes
├── FAQ.md                          # Common questions
├── use-cases/
│   ├── fiction/
│   │   ├── README.md              # Fiction overview
│   │   ├── METHODOLOGY.md         # Three-phase approach
│   │   ├── TEMPLATES.md           # Character & world templates (planned)
│   │   └── EXAMPLES.md            # Sample characters & worlds (planned)
│   ├── true-crime/
│   │   ├── README.md              # True Crime overview
│   │   ├── SKILL.md               # Core verification workflow
│   │   ├── protocols/
│   │   │   ├── verification-engine.md
│   │   │   ├── query-construction-guide.md
│   │   │   ├── cross-source-reconciliation.md
│   │   │   └── escalation-protocols.md
│   │   └── EXAMPLES.md            # Sample fact-checking workflows (planned)
│   └── podcast-production/
│       ├── README.md              # Podcast overview
│       ├── SERIES_FRAMEWORK.md    # Building series & branding
│       ├── EPISODE_DEVELOPMENT.md # Episode workflow
│       ├── GUEST_COORDINATION.md  # Guest scripts & interviews
│       ├── TEMPLATES.md           # Series config, episode metadata (written)
│       └── EXAMPLES.md            # Example series setup (written)

└── SHARED/
    ├── character-development.md   # Three-phase methodology
    ├── podcast-scripting.md       # Script generation guide
    ├── templates/
    │   ├── character-profile.json
    │   ├── episode-config.json
    │   ├── series-config.json
    │   └── source-verification.csv
    └── GLOSSARY.md
```

---

## Getting Started

### For Fiction Writers
1. Read [Fiction Use Case Guide](./use-cases/fiction/README.md)
2. Review [Three-Phase Methodology](./use-cases/fiction/METHODOLOGY.md)
3. Use the character profile template to start building
4. Fiction-specific EXAMPLES.md is planned but not yet written; see [Podcast Production EXAMPLES.md](./use-cases/podcast-production/EXAMPLES.md) for a worked example in the meantime

### For True Crime Podcasters
1. Read [True Crime Use Case Guide](./use-cases/true-crime/README.md)
2. Learn the [Verification Workflow](./use-cases/true-crime/protocols/SKILL.md)
3. Work through [Query Construction](./use-cases/true-crime/protocols/query-construction-guide.md)
4. Reference [Escalation Protocols](./use-cases/true-crime/protocols/escalation-protocols.md) for unverified claims
5. True-crime-specific EXAMPLES.md is planned but not yet written; see [Podcast Production EXAMPLES.md](./use-cases/podcast-production/EXAMPLES.md) for a worked true-crime example series

### For Podcast Producers
1. Read [Podcast Production Use Case Guide](./use-cases/podcast-production/README.md)
2. Understand [Series Framework](./use-cases/podcast-production/SERIES_FRAMEWORK.md)
3. Follow [Episode Development Workflow](./use-cases/podcast-production/EPISODE_DEVELOPMENT.md)
4. Learn [Guest Coordination](./use-cases/podcast-production/GUEST_COORDINATION.md)
5. See [Podcast Examples](./use-cases/podcast-production/EXAMPLES.md) for setup samples

---

## Version and Support

- **Underworld Writer Version:** 2.0.6+
- **Skill Type:** MCP-compatible, CLI-available
- **Last Updated:** 2026-09-15
- **Questions?** See [FAQ.md](./FAQ.md) or check the [GLOSSARY.md](./GLOSSARY.md)

---

**Next:** Pick your use case above and dive into the dedicated documentation.
