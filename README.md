# Underworld Writer

Create detailed character profiles, mythologies, and narrative worlds for underworld-themed stories with PACER API integration for fact-checking editorial phases.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js->=20.0.0-green.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](#)

## Overview

**Underworld Writer** is a creative skill for developing characters and narratives in underworld-themed fiction. It provides a three-phase structured methodology for character and narrative development, integrated with PACER API specifications for fact-checking editorial phases and ensuring accuracy in claim validation.

### Key Features

- **Three-Phase Character Development** — Foundation, Integration, Narrative Architecture
- **MCP Integration** — Register tools with Claude MCP ecosystem  
- **CLI Tool** — Command-line interface for character creation and export
- **PACER API Integration** — Fact-checking and claim validation for editorial accuracy
- **Markdown Export** — Generate formatted documentation from character profiles

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
```

### Programmatic Usage

```typescript
import { createCharacter, validateCharacter, exportCharacterAsMarkdown } from '@h4shed/skill-underworld-writer';

const character = createCharacter(/* phase 1, 2, 3 data */);
const markdown = exportCharacterAsMarkdown(character);
```

### MCP Integration

```typescript
import { Orchestrator } from '@h4shed/mcp-core';
import { registerUnderWorldWriterTools } from '@h4shed/skill-underworld-writer/mcp';

const orchestrator = new Orchestrator();
registerUnderWorldWriterTools(orchestrator);
```

## Three-Phase Methodology

### Phase 1: Character Foundation
- Identity, origin, motivation, background

### Phase 2: Underworld Integration  
- Role, faction, relationships, resources

### Phase 3: Narrative Architecture
- Mythology, story arc, themes, interactions

## PACER API Integration

Fact-checking and editorial accuracy for underworld narratives using PACER records and secondary sources.

See [SKILL.md](SKILL.md) and [SAMPLE_DATA.md](SAMPLE_DATA.md) for detailed documentation.

## API Reference

- `createCharacter(foundation, integration, narrative)` — Create character profile
- `validateCharacter(character)` — Validate completeness
- `generateCharacterSummary(character)` — Generate quick reference
- `exportCharacterAsMarkdown(character)` — Export as markdown
- `validateRelationships(character1, character2)` — Check relationship consistency

## Development

```bash
npm install
npm run build
npm run dev       # Watch mode
npm run cli       # Test CLI
```

## License

Licensed under **Apache License 2.0**. See [LICENSE](LICENSE) file.

## Support

- 📖 [Documentation](docs/)
- 🐛 [Issues](https://github.com/Fused-Gaming/underworld-writer/issues)
- 💬 [Discussions](https://github.com/Fused-Gaming/underworld-writer/discussions)

**Built with ❤️ by the Fused Gaming team**
