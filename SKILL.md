# Underworld Writer Skill

**Version 2.3.2** — see [CHANGELOG.md](./CHANGELOG.md) for release history.

## Overview

The Underworld Writer Skill provides structured methodologies and production tooling for three distinct narrative use cases:

1. **Fiction** — Three-phase character development for imagined underworld worlds
2. **True Crime** — Four-step fact-verification workflow for investigative narratives, with PACER-informed source-tier verification
3. **Podcast Production** — Segment-first episodic series development: canonical workspace scaffolding, editorial packages, mastering, and publishing

This skill enables creators and journalists to develop rich narratives—fictional, fact-checked, or both—with systematic character development, rigorous verification, and reproducible production workflows, usable directly via CLI, as an MCP tool set, or by agents such as Claude, ChatGPT, Codex, Cursor, and Copilot (see [AGENTS.md](./AGENTS.md)).

## Quick Navigation

- **New to Underworld Writer?** Start at [docs/README.md](./docs/README.md)
- **Fiction writers** → [docs/use-cases/fiction/README.md](./docs/use-cases/fiction/README.md)
- **Journalists & true crime** → [docs/use-cases/true-crime/README.md](./docs/use-cases/true-crime/README.md)
- **Podcast producers** → [docs/use-cases/podcast-production/README.md](./docs/use-cases/podcast-production/README.md)
- **Complete index** → [docs/INDEX.md](./docs/INDEX.md)

---

## Fiction: Three-Phase Methodology

The Underworld Writer Skill provides a structured three-phase methodology for creating detailed character profiles, mythologies, and narrative worlds for underworld-themed fiction. This methodology enables creators to develop rich, cohesive underworld narratives through systematic character development.

## Three-Phase Methodology

### Phase 1: Character Foundation

Establish the core identity and baseline characteristics of your character.

**Components:**
- **Name & Identity**: Full name, aliases, identity conflicts
- **Origin**: Birthplace, family lineage, cultural background
- **Physical Characteristics**: Appearance, distinctive features, transformation abilities
- **Background**: Life events, formative experiences, turning points
- **Core Motivation**: Primary goals, fears, desires

### Phase 2: Underworld Integration

Integrate the character into underworld systems and hierarchies.

**Components:**
- **Role & Rank**: Position in underworld hierarchy, responsibilities
- **Faction Affiliation**: Which group/organization they serve or oppose
- **Powers & Abilities**: Supernatural abilities, skills, limitations
- **Relationships**: Allies, enemies, complicated relationships within underworld
- **Resources**: Territory, followers, magical artifacts, wealth

### Phase 3: Narrative Architecture

Place the character within larger mythology and story systems.

**Components:**
- **Mythological Foundation**: Connected myths, ancient origins
- **Hierarchies & Conflicts**: Position in power structures, rivalries
- **Story Arc**: Character journey, potential transformations
- **Thematic Elements**: What this character represents symbolically
- **Interaction Points**: How they intersect with other characters and plot

## Success Criteria (Fiction)

- All three phases are comprehensively developed
- Character feels integrated into underworld setting
- Clear motivation and conflict points established
- Consistent with broader mythology and lore
- Detailed enough for narrative development

## Example Output (Fiction)

A complete character profile includes:
- 2-3 page character document
- Relationship map showing connections
- Mythology and backstory
- Story arc outline
- Integration points with world-building

---

## True Crime: Four-Step Verification Workflow

For fact-sourced investigative narratives grounded in court records and public documents. See [docs/use-cases/true-crime/README.md](./docs/use-cases/true-crime/README.md) for the full methodology.

1. **Source-tier triage** — classify every claim's evidence quality (Tier 1 primary legal record → Tier 4 unverified marketing/bio copy)
2. **Query construction** — targeted search strategies against court records, named associates, and aliases
3. **Cross-source reconciliation** — convergence rule for 5+ independent sources; attributed split-evidence when sources disagree; never averaged or guessed
4. **Escalation for persistent gaps** — PACER docket search, BOP inmate locator, local news archives, and explicit `[GAP — searched, not public]` disclosure when nothing resolves it

PACER integration (`src/pacer-integration.ts`) defaults to mock mode; live PACER queries are not yet implemented (see [PRIVACY.md](./PRIVACY.md)).

---

## Podcast Production: Segment-First Editorial Workflow

Episodic series development on a canonical, cross-agent workspace contract. See [AGENTS.md](./AGENTS.md) (authoritative workspace contract) and [docs/use-cases/podcast-production/README.md](./docs/use-cases/podcast-production/README.md).

- **Canonical workspace** — `output/<series-slug>/season-<n>/episode-<n>/` scaffolding via `npm run podcast:new-series` / `podcast:new-season` / `podcast:new-episode`, validated by `npm run validate:workspace`
- **Segment-first editorial packages** — one evidence/claim package (`projects/<series>/episode-packages/season-<n>/episode-<n>.json`) drives both the podcast script and a derived article via `npm run editorial:generate` / `editorial:check`, reusing shared blocks from `templates/editorial/shared-segments.json` (intros, disclosures, transitions, sponsor slots, outros, CTAs)
- **Editorial language linting** — configurable banned/discouraged/preferred-term checks and repetition detection (`npm run editorial:lint`), driven by `templates/editorial/style-dictionary.json`
- **Audio production** — Modal-based synthesis with chunk-level caching for resumable rendering after partial failures, two-pass EBU R128 `loudnorm` true-peak mastering, and a persisted per-episode render manifest (loudness, true peak, LRA, segment text hashes); see `projects/insight-corruption/production/voice/VOICE_PODCAST_GENERATION.md`
- **Guest coordination** — interview scripts, prep materials, and talking points alongside each episode

## Tooling

- **CLI** (`underworld-writer` / `npm run cli`) — character creation, export, and script validation; see `src/cli.ts`
- **MCP tools** (`@h4shed/skill-underworld-writer/mcp`) — the same capabilities registered for agent ecosystems via `@h4shed/mcp-core`
- **Release pipeline** — changelog-driven release evidence via `@h4shed/rock-hardened` (`npm run rock:validate`, `rock:evidence`), version synchronization (`npm run version:sync`/`version:check`), and a local, scoped-token (`UW_NPM_TOKEN`) npm publish CLI (`npm run publish:npm`); see [docs/ops/PUBLISHING.md](./docs/ops/PUBLISHING.md)
