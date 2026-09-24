# Getting Started with Underworld Writer

Welcome to Underworld Writer — a narrative development system for creating complex characters and investigating true crime cases. This guide will have you up and running in minutes.

## Installation

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher (or your preferred package manager)

### Quick Install

```bash
# Clone or navigate to the repository
cd underworld-writer

# Install dependencies
npm install

# Verify installation
npm run build
```

## Quick Start

### Your First Fiction Character

The fiction methodology uses a three-phase approach to develop characters with depth and complexity.

```javascript
// Basic character foundation (Phase 1)
const character = {
  name: 'Morgan Shadowblade',
  origin: 'Born in the lower quarters of Valantis',
  aliases: ['The Silent Knife', 'Morgan'],
  physicalCharacteristics: {
    appearance: 'Lean frame, dark hair with silver streaks, piercing gray eyes',
    distinctiveFeatures: ['Deep scar across left cheekbone', 'Obsidian ring']
  },
  background: 'Orphaned at twelve, raised by the Shadow Guild',
  coreMotivation: 'Seek redemption for past crimes while protecting those who cannot protect themselves'
};

// Underworld integration (Phase 2)
const underworldProfile = {
  roleAndRank: 'Master Operative',
  factionAffiliation: {
    primary: 'Shadow Guild',
    allies: ['The Network', 'Merchant Consortium'],
    opposition: ['Royal Guard', 'Inquisition']
  },
  powersAndAbilities: {
    abilities: ['Expert swordcraft', 'Shadow magic affinity', 'Stealth mastery', 'Interrogation'],
    limitations: ['Vulnerable to light magic', 'Haunted by past', 'Difficulty trusting others']
  },
  relationships: [
    {
      targetCharacter: 'Kael Nightwhisper',
      relationshipType: 'ally',
      description: 'Served together for fifteen years',
      tension: 'medium'
    }
  ]
};

// Narrative architecture (Phase 3)
const narrative = {
  storyArc: {
    act1: 'Morgan is blackmailed into one final mission by former rival',
    act2: 'Secrets surface that challenge everything Morgan believes about loyalty',
    act3: 'Choice between vengeance and redemption, consequences reshape the guild'
  },
  thematicElements: ['Redemption', 'Loyalty', 'Power', 'Identity'],
  interactionPoints: [
    {
      character: 'Kael Nightwhisper',
      scene: 'Guild headquarters, final confrontation',
      outcome: 'Kael\'s betrayal is revealed; Morgan chooses mercy',
      stakes: 'Control of the Shadow Guild'
    }
  ],
  mythologicalFoundation: 'The Redeemed Warrior archetype'
};
```

## Common Workflows

### Fiction Workflow: Creating a Complete Character

1. **Define Phase 1 (Foundation)**
   - Write the character's name, origin story, and core motivations
   - Detail physical appearance and distinctive features
   - Establish their background and how they arrived at their current situation

2. **Develop Phase 2 (Underworld Integration)**
   - Assign a faction affiliation or social group
   - List skills, abilities, and realistic limitations
   - Map relationships to other characters with tension dynamics
   - Establish resources and connections

3. **Build Phase 3 (Narrative Architecture)**
   - Outline the three-act story arc
   - Identify thematic elements that resonate with the character
   - Plan key interaction points with other characters
   - Connect to archetypal patterns or mythological foundations

### True Crime Workflow: Investigating a Case

The true crime verification system uses a six-step process to ensure accuracy:

#### Step 1: Case Identification
- Gather basic case information: case number, defendant(s), jurisdiction
- Record filing date and initial charges
- Establish primary sources: PACER, court websites, news archives

#### Step 2: Classification
- Classify charges and legal framework
- Document case type and complexity level
- Note any multi-jurisdictional elements

#### Step 3: Query & Research
- Search public records with appropriate tiers:
  - **Tier 1**: Federal records (PACER documents, official court filings)
  - **Tier 2**: Multiple corroborating sources (court + news + transcripts)
  - **Tier 3**: Single verified source (credible news outlet, official press release)
  - **Tier 4**: Investigative analysis (secondary sources, interviews)

#### Step 4: Reconciliation & Corroboration
- Cross-reference facts across sources
- Identify conflicts and document reasoning
- Note any contradictions with explanations

#### Step 5: Escalation Protocols
- For federal case details: Request PACER access (requires account + payment)
- For inmate records: Access Bureau of Prisons database
- Document access requirements and data accessed

#### Step 6: Final Review & Attribution
- Attribute facts to specific sources with tier rating
- Create producer notes explaining methodology
- Generate final report with full source documentation

## Running Tests

### Local Testing
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- test/fiction.test.ts
```

### Test Structure
- `test/fiction.test.ts` — Validates three-phase fiction methodology
- `test/true-crime.test.ts` — Validates six-step true crime verification
- `test/integration/` — Integration tests for cross-methodology workflows

## Building & Linting

```bash
# Build TypeScript to JavaScript
npm run build

# Lint code
npm run lint

# Format code (if configured)
npm run format
```

## Project Structure

```
underworld-writer/
├── src/               # TypeScript source files
│   ├── cli.ts        # Command-line interface
│   ├── mcp-tools.ts  # MCP tool implementations
│   └── index.ts      # Main exports
├── test/             # Test files
│   ├── fiction.test.ts
│   ├── true-crime.test.ts
│   └── integration/
│       └── character-story.test.ts
├── dist/             # Compiled JavaScript (generated)
├── docs/             # Documentation
├── examples/         # Example files
├── scripts/          # Utility scripts
├── package.json      # Project manifest
└── tsconfig.json     # TypeScript configuration
```

## Configuration

### Package Manager
This project uses npm. If you prefer another package manager (pnpm, yarn, bun), ensure consistency:
- Use the same lock file format throughout
- Run clean installs if switching managers
- Document your choice for other contributors

### TypeScript
Configured with strict mode enabled for maximum type safety. No `any` types are permitted in source code.

### ESLint
Uses flat config format (ESLint v10+) with separate rules for source and test files. Run `npm run lint` to check code quality.

## Environment Variables

Create a `.env` file for local development (this file should never be committed):

```bash
# Optional: Development settings go here
# Do not add secrets or API keys
```

An `.env.example` file shows required variables (leave values empty as placeholders).

## Common Issues

### Tests fail with coverage 0%
- Ensure you've run `npm run build` before testing
- Tests execute against compiled `dist/` output, not source TypeScript
- Clear coverage cache: `rm -rf coverage/`

### Build fails with TypeScript errors
- Verify all files in `src/` follow strict mode rules
- Check that no `any` types are used without type assertions
- Run `npm run build` to see full error output

### Lint warnings about unused variables
- Prefix with underscore to intentionally ignore: `_unusedVar`
- Or remove the variable if truly unused

## Next Steps

1. **Explore examples** — Check the `examples/` directory for complete character and case examples
2. **Read documentation** — See `docs/` for in-depth methodology guides
3. **Contribute** — Review `CONTRIBUTING.md` to learn how to submit improvements
4. **Join the community** — Participate in discussions and help develop the methodology

## Getting Help

- Check the [documentation](../INDEX.md) for detailed guides
- Review test files for usage examples
- Open an issue for bugs or feature requests
- See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development guidelines

## Version Information

Current version: see [CHANGELOG.md](../../CHANGELOG.md), or `package.json`'s `version` field — this file isn't updated per release.
