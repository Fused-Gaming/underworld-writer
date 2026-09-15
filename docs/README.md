# Underworld Writer Documentation

**Complete reference for narrative development, fact-checking, and podcast production across three specialized use cases.**

---

## 🎯 Start Here

### What is Underworld Writer?

Underworld Writer is an MCP skill that provides structured methodologies for:

1. **Fiction** — Building imagined underworld characters and worlds
2. **True Crime** — Fact-checking investigative narratives with rigorous source verification
3. **Podcast Production** — Creating episodic podcast series with consistent branding and workflow

Each use case includes methodology, protocols, templates, and examples.

---

## 📚 Core Guides

### 📏 Length & Format Specifications (All Use Cases)
**Define narrative and podcast lengths with precision**

- 📖 [LENGTH_SPECIFICATIONS.md](./LENGTH_SPECIFICATIONS.md) — Word counts, page counts, episode minutes, sponsor breaks
- Covers books, chapters, novellas, and podcast episodes
- Helper functions for time/word conversions
- Production time estimation and constraint management

---

## 📚 Choose Your Path

### 1. Fiction Writers
**Create imagined underworld characters and worlds**

- 📖 [Fiction Use Case Guide](./use-cases/fiction/README.md)
- 🔗 [Three-Phase Character Development](./use-cases/fiction/METHODOLOGY.md)
- 📝 Templates & Examples (coming soon)

### 2. True Crime & Investigative Journalists
**Verify facts and build case narratives**

- 📖 [True Crime Use Case Guide](./use-cases/true-crime/README.md)
- 🔗 [4-Step Verification Workflow](./use-cases/true-crime/protocols/SKILL.md)
- 📊 [Source Verification Engine](./use-cases/true-crime/protocols/verification-engine.md)
- 🔍 [Query Construction Guide](./use-cases/true-crime/protocols/query-construction-guide.md)
- ⚖️ [Cross-Source Reconciliation](./use-cases/true-crime/protocols/cross-source-reconciliation.md)
- 🚀 [Escalation Protocols](./use-cases/true-crime/protocols/escalation-protocols.md)
- 📋 Examples (coming soon)

### 3. Podcast Producers
**Build and scale episodic podcast series**

- 📖 [Podcast Production Guide](./use-cases/podcast-production/README.md)
- 🏗️ [Series Framework & Branding](./use-cases/podcast-production/SERIES_FRAMEWORK.md)
- 📺 [Episode Development Workflow](./use-cases/podcast-production/EPISODE_DEVELOPMENT.md)
- 🎤 [Guest Coordination & Interview Prep](./use-cases/podcast-production/GUEST_COORDINATION.md)
- 📋 Templates & Examples (coming soon)

---

## 🔗 Complete Documentation Index

See [INDEX.md](./INDEX.md) for a comprehensive map of all documentation.

---

## 🚀 Quick Start (5 Minutes)

### For Fiction Writers
1. Read [Fiction README](./use-cases/fiction/README.md)
2. Review [Three-Phase Methodology](./use-cases/fiction/METHODOLOGY.md)
3. Use the character profile template to start building

### For True Crime Producers
1. Read [True Crime README](./use-cases/true-crime/README.md)
2. Learn the [4-Step Verification Workflow](./use-cases/true-crime/protocols/SKILL.md)
3. Apply to your first claim

### For Podcast Producers
1. Read [Podcast Production README](./use-cases/podcast-production/README.md)
2. Set up series using [Series Framework](./use-cases/podcast-production/SERIES_FRAMEWORK.md)
3. Create first episode with [Episode Development](./use-cases/podcast-production/EPISODE_DEVELOPMENT.md)

---

## 📋 Documentation Structure

```
docs/
├── README.md                           # This file
├── INDEX.md                            # Complete documentation index
├── USE_CASES_OVERVIEW.md               # Overview of all three use cases
├── QUICK_START.md                      # 5-minute quickstart guides
├── FAQ.md                              # Frequently asked questions
│
├── use-cases/
│   ├── fiction/
│   │   ├── README.md                   # Fiction overview
│   │   └── METHODOLOGY.md              # Three-phase character development
│   │
│   ├── true-crime/
│   │   ├── README.md                   # True Crime overview
│   │   └── protocols/
│   │       ├── SKILL.md                # 4-step verification workflow
│   │       ├── verification-engine.md  # Tier 1-4 source classification
│   │       ├── query-construction-guide.md
│   │       ├── cross-source-reconciliation.md
│   │       └── escalation-protocols.md
│   │
│   └── podcast-production/
│       ├── README.md                   # Podcast overview
│       ├── SERIES_FRAMEWORK.md         # Series setup & branding
│       ├── EPISODE_DEVELOPMENT.md      # Episode workflow
│       └── GUEST_COORDINATION.md       # Guest scripts & interview prep
│
└── shared/
    ├── character-development.md        # Three-phase methodology
    ├── podcast-scripting.md            # Script generation guide
    └── GLOSSARY.md                     # Terminology & definitions
```

---

## 🎯 By Task

### "I want to..."

| Task | Document | Use Case |
|------|----------|----------|
| Build a fictional underworld character | [METHODOLOGY.md](./use-cases/fiction/METHODOLOGY.md) | Fiction |
| Verify a fact for true crime | [SKILL.md](./use-cases/true-crime/protocols/SKILL.md) | True Crime |
| Classify a source tier | [verification-engine.md](./use-cases/true-crime/protocols/verification-engine.md) | True Crime |
| Search for evidence | [query-construction-guide.md](./use-cases/true-crime/protocols/query-construction-guide.md) | True Crime |
| Handle conflicting sources | [cross-source-reconciliation.md](./use-cases/true-crime/protocols/cross-source-reconciliation.md) | True Crime |
| Find PACER records | [escalation-protocols.md](./use-cases/true-crime/protocols/escalation-protocols.md) | True Crime |
| Set up a podcast series | [SERIES_FRAMEWORK.md](./use-cases/podcast-production/SERIES_FRAMEWORK.md) | Podcast |
| Create an episode | [EPISODE_DEVELOPMENT.md](./use-cases/podcast-production/EPISODE_DEVELOPMENT.md) | Podcast |
| Prep a guest interview | [GUEST_COORDINATION.md](./use-cases/podcast-production/GUEST_COORDINATION.md) | Podcast |
| Generate podcast scripts | [Podcast Scripting Guide](./shared/podcast-scripting.md) | All |

---

## 🔑 Core Concepts

### Three-Phase Character Development
Used across **Fiction**, **True Crime**, and **Podcast Production**:

1. **Foundation** — Identity, origin, core motivation
2. **Integration** — Role, relationships, resources within system
3. **Narrative Architecture** — Story arc, themes, connections

See [character-development.md](./shared/character-development.md) for full details.

### Four-Step Verification Workflow
**True Crime only**, for fact-checking narratives:

1. **Source-Tier Triage** — Classify evidence quality (Tier 1-4)
2. **Query Construction** — Targeted research strategies
3. **Cross-Source Reconciliation** — Handle conflicting sources
4. **Escalation** — PACER, BOP, archives for persistent gaps

See [SKILL.md](./use-cases/true-crime/protocols/SKILL.md) for full details.

### Podcast Episode Structure
**Podcast Production only**, for organized series development:

- **Series Config** — Branding, producer info, themes
- **Episode Config** — Title, description, metadata, sources
- **Directory Structure** — Scripts, assets, briefs, reviews, archived
- **Workflow Phases** — Research → Script → Record → Edit → Publish

See [SERIES_FRAMEWORK.md](./use-cases/podcast-production/SERIES_FRAMEWORK.md) and [EPISODE_DEVELOPMENT.md](./use-cases/podcast-production/EPISODE_DEVELOPMENT.md) for full details.

---

## 🎤 Hybrid Workflows

### Fiction + Podcast Production
Create fictional podcast series with consistent character development:

```
Character development (Fiction) → Episode structure (Podcast) → Recording
```

### True Crime + Podcast Production
Create fact-checked investigative podcast series:

```
Fact verification (True Crime) → Episode structure (Podcast) → Recording
```

### True Crime + Fiction
Blend real cases with imagined reconstruction:

```
Fact verification (True Crime) → Research gaps (True Crime) → Narrative building (Fiction)
```

See [USE_CASES_OVERVIEW.md](./USE_CASES_OVERVIEW.md) for more hybrid examples.

---

## 📖 How to Read This Documentation

### If You're New
1. Start with this README
2. Choose your use case above
3. Read that use case's README
4. Follow the linked guides in order

### If You're Looking for Something Specific
1. Check the task list above ("I want to...")
2. Or search INDEX.md for keywords
3. Or read the use case README and follow the structure

### If You're Referencing While Working
1. Bookmark INDEX.md
2. Bookmark your use case README
3. Keep specific guides open as needed

---

## ❓ Questions?

1. **Frequently asked?** → Check [FAQ.md](./FAQ.md) (coming soon)
2. **Don't understand a term?** → Check [GLOSSARY.md](./shared/GLOSSARY.md) (coming soon)
3. **Looking for something specific?** → Check [INDEX.md](./INDEX.md)
4. **Want to see it in practice?** → Look for EXAMPLES.md in your use case

---

## 📝 Version & Support

- **Underworld Writer Version:** 2.0.6+
- **Skill Type:** MCP-compatible, CLI-available
- **Last Updated:** 2026-09-15
- **Documentation Quality:** Complete core guides; examples and FAQs coming soon

---

## 🚀 Next Steps

**Choose your starting point:**

- **→ Fiction?** Go to [Fiction README](./use-cases/fiction/README.md)
- **→ True Crime?** Go to [True Crime README](./use-cases/true-crime/README.md)
- **→ Podcast?** Go to [Podcast README](./use-cases/podcast-production/README.md)
- **→ All of them?** Go to [USE_CASES_OVERVIEW.md](./USE_CASES_OVERVIEW.md)

---

**Built with the Underworld Writer Skill** | MCP-compatible | CLI-available
