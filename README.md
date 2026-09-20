# Underworld Writer

![Underworld Writer v2.2.0 release notes](release-artifacts/release-card-hero.svg)

> Release artwork is generated from `CHANGELOG.md` with Rock-Hardened. Regenerate the hero profile with:
>
> `npx --yes --package=@h4shed/rock-hardened@1.0.0 hardened-changelogger render --svg-profiles hero --no-png`

**Multi-Purpose Character Development, True Crime Narratives, and Podcast Scripting Engine**

Create detailed character profiles, mythologies, and narrative worlds for fictional underworld-themed stories, fact-checked true crime narratives, and production-ready podcast episode scripts. Integrates PACER API for editorial accuracy, automatic fact attribution, and guest interview optimization.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js->=20.0.0-green.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](#)
[![PACER Integration](https://img.shields.io/badge/PACER-Fact%20Checking-orange.svg)](#pacer-api-integration)

## Overview

**Underworld Writer** is a specialized skill for developing sophisticated character profiles and narratives across three distinct use cases:

1. **Creative Fiction** — Build richly detailed underworld-themed stories with mythologies and hierarchies
2. **True Crime Documentation** — Transform real court cases into narrative-driven books with fact-checked legal details from PACER
3. **Podcast Production** — Generate fact-checked episode scripts for true crime podcasters with complete producer handoff materials

The tool provides a three-phase structured methodology for character and narrative development, integrated with PACER API (Public Access to Court Electronic Records) specifications for fact-checking editorial phases and ensuring accuracy in claim validation. The podcast engine enables production-ready script generation from character narratives with automatic fact attribution and Q&A window identification.

### Key Features

- **Dual-Purpose Development** — Fiction writing or true crime narrative transformation
- **Three-Phase Character Development** — Foundation, Integration, Narrative Architecture  
- **Podcast Scripting Engine** — Generate production-ready episode scripts (v2.0.6+)
  - Single or two-part episode formats
  - Automatic Q&A window identification
  - Tier-based fact attribution system
  - Producer briefs, guest handoffs, timing guides
  - Missing fact detection for interview opportunities
- **PACER API Integration** — Fact-check real court records and case details for accuracy
- **MCP Tool Integration** — Register with Claude MCP ecosystem for seamless workflow
- **CLI Tool** — Command-line interface for character creation, podcast generation, and export
- **Markdown Export** — Generate formatted documentation from character profiles and scripts
- **Relationship Validation** — Check character consistency across multi-character narratives
- **Editorial Phase Tracking** — Document amendment history and claim verification status

## Quick Start

### Installation

```bash
npm install @h4shed/skill-underworld-writer
```

### CLI Usage

```bash
# Create a new character
underworld-writer create --name "Hades" --role "Lord" --faction "Olympian"

# Export character as markdown
underworld-writer export --file character.json --output character.md

# Generate podcast episode script for true crime producers
underworld-writer format-script --character character.json --output podcast/

# Validate podcast script structure
underworld-writer validate-script --character character.json

# Run performance benchmarks
underworld-writer benchmark
```

## 🎙️ Podcast Scripting Engine v2.0.6

Generate production-ready podcast episode scripts from underworld character narratives and PACER court records. Perfect for true crime podcasters targeting audiences like *Darknet Diaries*.

### Podcast Features

- **Flexible Formats** — Single episode (~8-12 min) or two-part format (~6-8 min each)
- **Fact Attribution** — Tier-based verification (Federal Records → Character Narrative)
- **Q&A Windows** — Automatically identifies 3+ dialogue points for guest expertise
- **Producer Materials** — Scripts, producer briefs, guest handoffs, timing guides
- **Missing Facts Detection** — Flags unverified claims for interview follow-up
- **Markdown Ready** — Export as production-ready documents for producers

### Podcast Quick Start

```bash
# Generate complete podcast materials
underworld-writer format-script \
  --character solarwinds-operator.json \
  --case pacer-case.json \
  --output podcast-output/

# Output includes:
# - full-podcast-script.md (complete narrative with fact attributions)
# - producer-brief.md (talking points, verification status)
# - guest-handoff.md (interview preparation guide)
# - script-data.json (structured data for processing)
```

### Podcast Example: SolarWinds Supply Chain Attack

The repository includes a complete two-part podcast example about APT29/SVR operators:

```bash
# Generate the SolarWinds episode
node generate-solarwinds-example.mjs

# Output statistics:
# ✓ Format: Two-part episode (13 minutes total)
# ✓ Segments: 8 narrative segments with pacing
# ✓ Q&A Windows: 3 identified discussion points
# ✓ Fact Attributions: 3 verified facts
# ✓ Missing Facts: 0 (ready for production)
```

### Programmatic Usage — Podcast Scripting

```typescript
import { ScriptGenerator } from '@h4shed/skill-underworld-writer/podcast-script-generator';

const character = {
  phase1: { name: "...", origin: "...", coreMotivation: "..." },
  phase2: { roleAndRank: "...", factionAffiliation: { ... } },
  phase3: { storyArc: { ... }, hierarchiesAndConflicts: { ... } }
};

const caseData = {
  caseNumber: "CASE-2020-001",
  title: "Investigation Title",
  outcome: "Case outcome summary"
};

const generator = new ScriptGenerator(character, { format: 'two-part' }, caseData);

// Generate complete script with all materials
const script = generator.generateScript();
const producerBrief = generator.createProducerBrief();
const guestScript = generator.createGuestScript();

// Access derived analysis
const qaWindows = generator.identifyQAWindows();
const missingFacts = generator.flagMissingFacts();
const attributions = generator.extractAttributions();
```

### Programmatic Usage — Creative Fiction

```typescript
import { createCharacter, validateCharacter, exportCharacterAsMarkdown } from '@h4shed/skill-underworld-writer';

const character = createCharacter(
  {
    name: "Lucifer Kane",
    aliases: ["The Crimson Judge"],
    origin: "Former prosecutor turned underground crime lord",
    physicalCharacteristics: {
      appearance: "Tall, imposing figure with piercing dark eyes",
      distinctiveFeatures: "Scarred left temple from courthouse shooting"
    },
    background: "Corrupted by years of prosecuting organized crime...",
    coreMotivation: "Build a criminal empire transcending traditional law"
  },
  {
    roleAndRank: "Don of the Eastern Crime Syndicate",
    responsibilities: ["Territory management", "Dispute resolution"],
    factionAffiliation: {
      primary: "The Underworld Collective",
      allies: ["Russian Mafia contingent"],
      opposition: ["Federal Task Force"]
    },
    powersAndAbilities: {
      abilities: ["Legal expertise", "Strategic planning", "Network coordination"],
      limitations: ["No direct combat training", "Political exposure"]
    },
    relationships: [
      { name: "Detective Sarah Chen", type: "enemy", description: "Pursuing him for 10 years" }
    ],
    resources: {
      territory: "Downtown Chicago district",
      followers: 250,
      wealth: "Estimated $50M"
    }
  },
  {
    mythologicalFoundation: "Modern twist on Faustian bargain mythology",
    hierarchiesAndConflicts: {
      internal: ["Loyalty vs. ambition among lieutenants"],
      external: ["Police intervention", "Rival gang encroachment"],
      personal: ["Moral deterioration"]
    },
    storyArc: {
      act1: "Rise from corruption to power",
      act2: "Consolidation and internal threats",
      act3: "Fall to federal prosecution"
    },
    thematicElements: ["Power corruption", "Justice vs. law", "Redemption"],
    interactionPoints: ["Recruit key allies", "Negotiate territory peace"]
  }
);

const markdown = exportCharacterAsMarkdown(character);
```

### Programmatic Usage — True Crime Documentation

```typescript
import { createCharacter, validateCharacter } from '@h4shed/skill-underworld-writer';

// Create character from court records
const defendant = createCharacter(
  {
    name: "James Mitchell",
    aliases: [],
    origin: "Defendant in U.S. District Court, N.D. Illinois, Case 2024-CV-89234",
    physicalCharacteristics: {
      appearance: "Described in court as 6'2\", medium build",
      distinctiveFeatures: "No distinctive marks noted in court filings"
    },
    background: "Former financial advisor, indicted on fraud charges",
    coreMotivation: "Defend against federal charges; minimize sentence"
  },
  {
    roleAndRank: "Defendant",
    responsibilities: ["Court appearances", "Attorney coordination"],
    factionAffiliation: {
      primary: "U.S. District Court, Northern District of Illinois",
      allies: ["Defense counsel (Doe & Associates)"],
      opposition: ["U.S. Attorney's Office"]
    },
    powersAndAbilities: {
      abilities: ["Financial knowledge", "Courtroom experience"],
      limitations: ["Limited freedom due to bail conditions"]
    },
    relationships: [
      { name: "Federal Prosecutor Johnson", type: "enemy", description: "Lead prosecutor" },
      { name: "Attorney Martha Chen", type: "ally", description: "Defense counsel" },
      { name: "Co-defendant Robert Torres", type: "complicated", description: "Potential witness" }
    ],
    resources: {
      territory: "Released on bail, home confinement",
      artifacts: ["Trial exhibits: financial documents, emails"],
      wealth: "Assets frozen pending trial outcome"
    }
  },
  {
    mythologicalFoundation: "American legal system and justice narrative",
    hierarchiesAndConflicts: {
      internal: ["Guilt vs. innocence claims"],
      external: ["Federal prosecution vs. defense"],
      personal: ["Family impact", "Financial collapse"]
    },
    storyArc: {
      act1: "Indictment filed; discovery phase begins",
      act2: "Depositions and pre-trial motions",
      act3: "Trial verdict and sentencing"
    },
    thematicElements: ["White-collar crime", "Justice system", "Redemption possibility"],
    interactionPoints: ["PACER docket entry 2024-CV-89234", "Court filing date: 2024-03-15"]
  }
);

// Validate against PACER records
const validation = validateCharacter(defendant);
console.log("Character completeness:", validation.completeness);
console.log("Fact-check status:", validation.warnings);
console.log("Suggested amendments:", validation.suggestions);
```

### MCP Integration — Using with Claude AI

Register Underworld Writer tools with Claude's MCP ecosystem for seamless AI-assisted character development:

```typescript
import { Orchestrator } from '@h4shed/mcp-core';
import { registerUnderWorldWriterTools } from '@h4shed/skill-underworld-writer/mcp';

const orchestrator = new Orchestrator();
await registerUnderWorldWriterTools(orchestrator);

// Now available in Claude context:
// - underworld_create_character
// - underworld_validate_character
// - underworld_export_character
// - underworld_validate_relationships
```

**Available MCP Tools:**

| Tool | Purpose | Use Case |
|------|---------|----------|
| `underworld_create_character` | Create character with three phases | Both fiction & true crime |
| `underworld_validate_character` | Check completeness and consistency | Both scenarios |
| `underworld_export_character` | Generate markdown documentation | Book preparation |
| `underworld_validate_relationships` | Verify multi-character consistency | Complex narratives |

**With Claude AI + MCP:**
- Natural language character development
- AI-assisted PACER research and claim validation
- Automatic narrative consistency checking
- Book-ready export generation

## Use Cases and Scenarios

### Scenario 1: Creative Fiction — Underworld Narratives

Build rich, detailed fictional characters for fantasy, mythology, crime fiction, and supernatural stories.

**Example: Creating a Fictional Antagonist**
```bash
underworld-writer create \
  --name "Cassandra Vale" \
  --role "Underground Network Coordinator" \
  --faction "The Syndicate"
```

This creates a character with full three-phase development suitable for:
- Urban fantasy novels
- Mythology-based storytelling  
- Crime fiction protagonists and antagonists
- Supernatural narrative worlds
- Role-playing game character design

### Scenario 2: True Crime Documentation — Real Story Transformation

Transform real court cases and legal proceedings into narrative-driven books with fact-checked accuracy using PACER API integration.

**Workflow: From Court Records to Book Narrative**

1. **Research Phase** — Query PACER for relevant case numbers and court documents
2. **Character Development** — Build narrative characters based on actual litigants
3. **Fact-Checking Phase** — Cross-reference claims against court documents
4. **Editorial Amendment** — Track corrections and verify updated information
5. **Narrative Export** — Generate book-ready markdown with sourced claims

**Example: Creating a True Crime Character from PACER Data**
```bash
# Research the case in PACER first (case number, docket, parties)
underworld-writer create \
  --name "James Patterson" \
  --role "Defendant in Federal Case 2023-CV-45678" \
  --faction "United States District Court" \
  --pacer-case-number "2023-45678" \
  --pacer-court "N.D. Illinois"
```

The character profile will automatically:
- Link to the PACER case record
- Track all court filings and amendments
- Validate claims against documented court records
- Maintain amendment history with timestamps
- Generate fact-checked narrative export

## Three-Phase Methodology

### Phase 1: Character Foundation
- **Identity** — Name, aliases, physical characteristics
- **Origin** — Background story (fictional or real)
- **Motivation** — Core drives and objectives
- **Background** — History and context
- **Special Notes** — For true crime: PACER case references, court document links

### Phase 2: Underworld Integration  
- **Role & Rank** — Position in the narrative hierarchy
- **Faction Affiliation** — Primary organization/court system
- **Relationships** — Connections to other characters
- **Powers & Abilities** — Skills, expertise, or legal standing (for true crime: credentials, profession)
- **Resources** — Assets, territory, or documented evidence
- **For True Crime** — Documented relationships in court records, co-defendant links, attorney information

### Phase 3: Narrative Architecture
- **Mythology** — World-building or case significance
- **Story Arc** — Three-act structure (Beginning, Middle, End)
- **Themes** — Core narrative elements
- **Conflicts** — Internal, external, personal dimensions
- **Interaction Points** — Where the character impacts the narrative
- **For True Crime** — Editorial phases tracking, amendment history, fact-check verification status

## PACER API Integration for Fact-Checking

The PACER (Public Access to Court Electronic Records) integration enables writers to build narratives grounded in real, publicly available court documents and legal proceedings.

### How It Works

1. **Case Record Lookup** — Query PACER for specific case numbers and court filings
2. **Claim Validation** — Cross-reference narrative claims against court-filed documents
3. **Amendment Tracking** — Document when claims are updated based on new evidence
4. **Source Attribution** — Link narrative details to specific PACER document entries
5. **Editorial Sign-Off** — Track which claims are verified and which are still pending

### Workflow Example: True Crime Narrative

```typescript
import { validateCharacter } from '@h4shed/skill-underworld-writer';

// Create character based on court records
const defendant = {
  phase1: {
    name: "John Doe",
    origin: "Charged in U.S. District Court, N.D. Illinois, Case 2023-CV-45678",
    coreMotivation: "Defend against federal charges",
    pacerCaseNumber: "2023-45678",
    pacerCourt: "N.D. Illinois"
  },
  phase2: {
    roleAndRank: "Defendant",
    factionAffiliation: { primary: "U.S. District Court" },
    relationships: [
      { name: "Federal Prosecutor", type: "enemy" },
      { name: "Defense Attorney", type: "ally" }
    ]
  },
  phase3: {
    storyArc: {
      act1: "Initial indictment and charges filed",
      act2: "Discovery process and court proceedings",
      act3: "Trial verdict and sentencing"
    }
  }
};

// Validate against known facts
const validation = validateCharacter(defendant);
console.log("Claim Completeness:", validation.completeness);
console.log("Verification Status:", validation.warnings);
```

### PACER Record Types Supported

- **Civil Cases** — Contract disputes, personal injury, employment claims
- **Criminal Cases** — Federal prosecutions, sentencing records
- **Bankruptcy Cases** — Financial records and creditor information
- **Appellate Records** — Appeals court decisions and briefs

### Editorial Phase Tracking

For true crime narratives, track each claim's verification status:

```
✓ VERIFIED — Claim matches court document
⚠ PENDING — Awaiting court record confirmation
✏ AMENDED — Claim updated based on new evidence
🔗 SOURCED — Linked to specific PACER docket entry
```

## Advanced Usage

### Validating Character Relationships (Multi-Character Narratives)

For stories with multiple characters (co-defendants, related parties), ensure consistency:

```bash
# Check if two characters' relationships align
underworld-writer validate-relationships \
  --character1 character-1.json \
  --character2 character-2.json
```

### Generating Book-Ready Markdown

Export fully formatted character profiles as Markdown for book publishing:

```bash
underworld-writer export \
  --file character.json \
  --output book-chapter.md
```

The exported markdown includes:
- Character overview and background
- Court record references (for true crime)
- Relationship networks
- Story arc progression
- Editorial verification status

See [SKILL.md](SKILL.md) and [SAMPLE_DATA.md](SAMPLE_DATA.md) for detailed documentation and examples.

## API Reference

### Core Functions

#### `createCharacter(foundation, integration, narrative): UnderWorldCharacter`
Create a complete character profile with all three phases.

**Parameters:**
- `foundation: CharacterFoundation` — Identity, origin, motivation
- `integration: UnderworldIntegration` — Role, faction, relationships
- `narrative: NarrativeArchitecture` — Mythology, story arc, themes

**Returns:** Full character profile with metadata

#### `validateCharacter(character): ValidationResult`
Validate character completeness and consistency across all phases.

**Returns:** Object with:
- `isValid: boolean` — All required fields present
- `completeness: number` — 0-100 score
- `errors: string[]` — Critical issues
- `warnings: string[]` — Suggested improvements
- `suggestions: string[]` — Enhancement recommendations

#### `generateCharacterSummary(character): string`
Generate a quick-reference summary of the character.

**Returns:** Formatted text summary for quick review

#### `exportCharacterAsMarkdown(character): string`
Export character profile as publication-ready Markdown.

**Returns:** Formatted Markdown with all phases and metadata

#### `validateRelationships(character1, character2): {consistent: boolean, notes: string[]}`
Check relationship consistency between two characters.

**Returns:** Consistency validation with detailed notes

### Type Definitions

```typescript
interface CharacterFoundation {
  name: string;
  aliases: string[];
  origin: string;
  physicalCharacteristics: {
    appearance: string;
    distinctiveFeatures: string;
    transformationAbilities?: string;
  };
  background: string;
  coreMotivation: string;
}

interface UnderworldIntegration {
  roleAndRank: string;
  responsibilities: string[];
  factionAffiliation: {
    primary: string;
    allies: string[];
    opposition: string[];
  };
  powersAndAbilities: {
    abilities: string[];
    limitations: string[];
  };
  relationships: Array<{
    name: string;
    type: 'ally' | 'enemy' | 'mentor' | 'protégé' | 'rival' | 'romantic' | 'complicated';
    description: string;
  }>;
  resources: {
    territory?: string;
    followers?: number;
    artifacts?: string[];
    wealth?: string;
  };
}

interface NarrativeArchitecture {
  mythologicalFoundation: string;
  hierarchiesAndConflicts: {
    internal: string[];
    external: string[];
    personal: string[];
  };
  storyArc: {
    act1: string;
    act2: string;
    act3: string;
  };
  thematicElements: string[];
  interactionPoints: string[];
}

interface UnderWorldCharacter {
  phase1: CharacterFoundation;
  phase2: UnderworldIntegration;
  phase3: NarrativeArchitecture;
  metadata: {
    characterType: string;
    developmentLevel: 'concept' | 'developing' | 'complete';
    complexity: 'simple' | 'moderate' | 'complex';
    createdDate: string;
    lastModified: string;
  };
}
```

## Common Workflows

### Workflow 1: Creative Fiction Novel Development

**Goal:** Write a novel with complex criminal underworld characters

1. Create character using `createCharacter()` with rich fictional details
2. Generate summary with `generateCharacterSummary()` for quick reference
3. Validate completeness with `validateCharacter()` to ensure depth
4. Create related characters (allies, enemies, mentors)
5. Validate relationships with `validateRelationships()` for consistency
6. Export all characters as Markdown with `exportCharacterAsMarkdown()`
7. Use exported Markdown as chapter foundation for your novel

### Workflow 2: True Crime Book from Court Records

**Goal:** Transform a real court case into a narrative-driven book

1. **Research:** Query PACER for case number and download court documents
2. **Create:** Build character profiles for each party (defendants, prosecutors, judges)
3. **Document:** Add PACER case references and court filing dates to each character
4. **Validate:** Cross-reference narrative claims against court documents
5. **Amendment:** Update character details when new evidence emerges
6. **Verify:** Mark claims as "VERIFIED", "AMENDED", or "PENDING" based on court records
7. **Export:** Generate book-ready Markdown with source attribution
8. **Publish:** Use exported Markdown as foundation for true crime book

### Workflow 3: Multi-Character Narrative Consistency

**Goal:** Ensure character relationships make sense across complex narratives

1. Create multiple characters for your narrative
2. After each character creation, run `validateRelationships()` with related characters
3. Check for contradictory relationship types (e.g., "ally" vs. "enemy")
4. Update character relationships if inconsistencies found
5. Run relationship validation again until all relationships align
6. Export validated characters for final narrative assembly

## Best Practices

### For Creative Fiction

- **Phase 1 Depth:** Invest time in character origin and motivation—these drive story
- **Phase 2 Networks:** Build rich relationship networks; they create conflict
- **Phase 3 Execution:** Detailed story arcs make character actions predictable
- **Validation:** Use `validateCharacter()` to identify underdeveloped areas
- **Export:** Generate Markdown as chapter outline for your novel

### For True Crime Documentation

- **PACER Research First:** Gather all court documents before character creation
- **Claim Accuracy:** Link every narrative claim to specific court filings
- **Amendment Tracking:** Document when claims change based on new evidence
- **Source Attribution:** Include PACER docket entries in exported Markdown
- **Legal Review:** Have legal expert review exported Markdown before publication
- **Ethical Consideration:** Respect privacy of still-living individuals; use public records only

### For Multi-Character Narratives

- **Consistency First:** Validate relationships frequently, not just at end
- **Hierarchy Clarity:** Define power structures and rank explicitly
- **Conflict Mapping:** Use relationship conflicts to drive plot tension
- **Evolution:** Track how relationships change through story arc
- **Validation Testing:** Test all character pairs before final export

## Example Outputs

### Creative Fiction Character Export

```markdown
# Lucifer Kane

## Phase 1: Character Foundation

### Identity
- **Aliases**: The Crimson Judge, The Underground Magistrate

### Origin
Former prosecutor turned underground crime lord...

### Characteristics
Tall, imposing figure with piercing dark eyes. Scarred left temple from courthouse shooting.

### Background
Corrupted by years of prosecuting organized crime...

### Core Motivation
Build a criminal empire transcending traditional law

---

## Phase 2: Underworld Integration

### Role & Rank
Don of the Eastern Crime Syndicate

### Faction
- **Primary**: The Underworld Collective
- **Allies**: Russian Mafia contingent
- **Opposition**: Federal Task Force

### Powers & Abilities
- **Abilities**: Legal expertise; Strategic planning; Network coordination
- **Limitations**: No direct combat training; Political exposure

### Relationships
- **Detective Sarah Chen** (enemy): Pursuing him for 10 years
- **Lieutenant Marcus Vale** (ally): Loyal second-in-command

### Resources
- **Territory**: Downtown Chicago district
- **Followers**: 250
- **Wealth**: Estimated $50M

---

## Phase 3: Narrative Architecture

### Mythology
Modern twist on Faustian bargain mythology

### Story Arc
1. **Act 1**: Rise from corruption to power
2. **Act 2**: Consolidation and internal threats
3. **Act 3**: Fall to federal prosecution

### Themes
- Power corruption
- Justice vs. law
- Redemption

### Interaction Points
- Recruit key allies
- Negotiate territory peace
- Face final confrontation with Detective Chen
```

### True Crime Character Export (with PACER References)

```markdown
# James Mitchell - Defendant
**Case**: U.S. v. Mitchell, 2024-CV-89234, N.D. Illinois
**Status**: Trial Phase
**Last Updated**: 2024-09-13

## Phase 1: Character Foundation

### Legal Identity
- **Name**: James Mitchell
- **Case**: United States District Court, Northern District of Illinois
- **Case Number**: 2024-CV-89234
- **Docket Link**: [PACER Docket](https://pacer.uscourts.gov/...)

### Origin & Background
Defendant in federal fraud prosecution. Former financial advisor, indicted on charges of securities fraud and wire fraud.

---

## Phase 2: Underworld Integration

### Legal Role
- **Role**: Defendant
- **Charged With**: Securities fraud, wire fraud, conspiracy (18 U.S.C. § 1343, 1344)

### Court System Integration
- **Court**: U.S. District Court, N.D. Illinois
- **Judge**: Honorable Patricia Williams
- **Prosecution**: U.S. Attorney's Office, N.D. Illinois
- **Defense Counsel**: Martha Chen, Esq. (Doe & Associates LLP)

### Key Relationships
- **Federal Prosecutor Johnson** (adversary): Lead prosecutor
- **Attorney Martha Chen** (counsel): Defense attorney
- **Co-defendant Robert Torres** (complicated): Potential witness/cooperation status

### Documentary Evidence
- [PACER Docket 2024-CV-89234](link to specific filing)
- Exhibits A-Z: Financial documents, emails, transaction records
- Prosecution witness list (12 witnesses)

---

## Phase 3: Narrative Architecture

### Case Narrative Arc
1. **Act 1**: Initial indictment (2024-03-15); Arrest and bail hearing
2. **Act 2**: Discovery, depositions, pre-trial motions (2024-03-15 to 2024-08-30)
3. **Act 3**: Trial (scheduled 2024-10-01); Verdict and sentencing

### Key Themes
- White-collar financial crime
- Corporate accountability
- Impact on investors and victims

### Fact-Check Status

| Claim | Source | Status | Last Verified |
|-------|--------|--------|--------------|
| "Defendant charged with wire fraud" | PACER Docket 2024-CV-89234, Filing 1 | ✓ VERIFIED | 2024-09-13 |
| "Co-defendant Robert Torres also indicted" | PACER Docket 2024-CV-89234, Filing 1 | ✓ VERIFIED | 2024-09-13 |
| "Trial date: October 1, 2024" | PACER Docket 2024-CV-89234, Scheduling Order | ⚠ PENDING | Awaiting final confirmation |

**Editorial Notes**: All material facts verified against PACER court filings. Claims pending court confirmation are marked PENDING.
```

## Development

```bash
npm install
npm run build
npm run dev       # Watch mode
npm run cli       # Test CLI
```

## PACER Integration

**Public Access to Court Electronic Records (PACER) Integration** enables true crime writers to fact-check claims against actual federal court records. The system supports:

- **Mock Mode** (default): Uses real publicly available case data (e.g., ShadowCrew case: 03-CR-0322, Middle District of Florida)
- **Tier-Based Source Verification**:
  - Tier 1: Federal court records via PACER (100% confidence)
  - Tier 2: Multiple corroborating sources (85% confidence)
  - Tier 3: Single journalist source (70% confidence)
  - Tier 4: Searched but unavailable (0% confidence)

```typescript
import { PACERClient, VerificationEngine } from '@h4shed/skill-underworld-writer/pacer';

const client = new PACERClient(); // Mock mode by default
const engine = new VerificationEngine();

// Query federal court case
const brianCase = await client.queryCaseByNumber('03-CR-0322', 'Middle District of Florida');

// Classify claim with source verification
const result = engine.classifyClaim(
  "The defendant was sentenced to 90 months and released in October 2007",
  {
    pacer: brianCase,
    dojStatement: "Federal prosecution records",
    newsArticles: 3,
  }
);

console.log(`Confidence: ${result.confidence}%`); // Tier 1: 100%
```

## Asset Validation (Cleanroom Sandbox)

**Cleanroom sandbox asset validation** ensures all distributable assets meet licensing and compliance requirements before publication.

Supported licenses:
- `svgrepo-free` — SVG Repo free for commercial/personal use
- `cc0` — Creative Commons Zero (public domain)
- `mit` — MIT License
- `apache2` — Apache License 2.0
- `unlicense` — Unlicense (public domain)
- `public-domain` — Public domain

```typescript
import { AssetValidator } from '@h4shed/skill-underworld-writer/asset-validation';

const validator = new AssetValidator();

const result = await validator.validateAsset({
  path: 'assets/underworld-writer-icon.svg',
  license: 'svgrepo-free',
  attribution: 'SVG Repo community',
  usage: 'package-icon',
});

if (result.valid) {
  const attribution = validator.getAttributionString(result);
  console.log(attribution);
  
  // Validate for publishing
  const readyToPub = await validator.validateForPublishing(result);
}
```

## Performance

All core operations are highly performant and suitable for high-throughput applications:

| Operation | Time | Tests |
|-----------|------|-------|
| Character creation | < 5ms | ✅ 100 characters/batch |
| Character validation | < 5ms | ✅ Completeness checks |
| Summary generation | < 3ms | ✅ Formatted output |
| Markdown export | < 10ms | ✅ Document generation |
| PACER query (mock) | < 10ms | ✅ Case lookups |
| Asset validation | < 5ms | ✅ 50 assets/batch |

Run benchmarks locally:
```bash
npm test -- tests/benchmark.test.ts
```

## Plugin Registration

Underworld Writer is distributed as an MCP-compatible plugin with CLI and skill exports. The `plugin.json` manifest declares:

- **Skill Export**: Three-phase character development methodology
- **Tool Exports**: MCP-compatible tools for Claude integration
- **CLI Export**: Command-line interface for batch operations

```bash
# Via npx (requires @h4shed/skill-underworld-writer installed)
npx underworld-writer create --name "Character Name" --role "Role" --faction "Faction"

# Programmatically
import skill from '@h4shed/skill-underworld-writer';
const tools = await skill.tools();
```

## License

Licensed under **Apache License 2.0**. See [LICENSE](LICENSE) file.

## Support

- 📖 [Documentation](docs/)
- 🐛 [Issues](https://github.com/Fused-Gaming/underworld-writer/issues)
- 💬 [Discussions](https://github.com/Fused-Gaming/underworld-writer/discussions)

**Built with ❤️ by the Fused Gaming team**