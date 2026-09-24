# Contributing to Underworld Writer

Thank you for your interest in contributing to Underworld Writer! This document outlines how to effectively contribute to the project.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful, constructive, and collaborative in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/underworld-writer.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Set up development environment: `npm install`
5. Verify setup: `npm run build && npm run test`

## Development Workflow

### Before Starting Work

1. Check existing [issues](https://github.com/Fused-Gaming/underworld-writer/issues) to avoid duplicate work
2. For new features, open an issue first to discuss approach
3. For bug fixes, link to the relevant issue in your PR

### Making Changes

1. Write clear, descriptive commit messages
2. Follow the existing code style (enforced by ESLint)
3. Add tests for new functionality
4. Ensure all tests pass: `npm run test`
5. Run linter: `npm run lint`
6. Build successfully: `npm run build`

### Code Style Guidelines

#### TypeScript Standards
- **No `any` types** — Use proper type annotations or type inference
- **Strict mode enabled** — All types must be properly defined
- **Avoid `as` assertions** — Use type guards or better inference when possible
- **Clear naming** — Variables and functions should be self-documenting

#### File Organization
- Source code: `src/` (TypeScript)
- Tests: `test/` (TypeScript)
- Compiled output: `dist/` (JavaScript, auto-generated)
- Examples: `examples/`
- Documentation: `docs/`

#### Naming Conventions
```typescript
// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Functions: camelCase
function getUserCharacter() { }

// Classes: PascalCase
class CharacterBuilder { }

// Interfaces: PascalCase
interface CharacterPhase { }

// Private members: leadingUnderscore
private _internalState: string;
```

#### Comments
- Only add comments for WHY, not WHAT
- If code is unclear without comments, refactor instead
- Document complex algorithms or non-obvious logic
```typescript
// Good: Explains the reasoning
// Skip tier 1 sources if multiple tier 2 sources corroborate
if (tier2Sources.length >= 2) {
  skip(tier1Sources);
}

// Unnecessary: Restates what code does
// Increment counter
counter++;
```

### Testing Requirements

#### Test Structure
- Write tests alongside implementation changes
- One test file per module
- Descriptive test names starting with "should"
- Group related tests with `describe` blocks

#### Test Coverage
- New features require tests demonstrating functionality
- Bug fixes should include a test preventing regression
- Aim for meaningful coverage, not high percentages
- Run: `npm run test:coverage`

#### Test Organization
```typescript
describe('Module Name', () => {
  describe('Feature or Behavior', () => {
    it('should do X when Y happens', () => {
      // Arrange
      const input = setup();
      
      // Act
      const result = performAction(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### Documentation Requirements

For new features, update:
1. **Code comments** — Clear, brief explanations of complex logic
2. **JSDoc blocks** — For exported functions and classes
3. **README.md** — If it affects user-facing behavior
4. **GETTING_STARTED.md** — If it's a common workflow
5. **docs/** — Detailed guides for complex features

Example JSDoc:
```typescript
/**
 * Validates a character across all three phases.
 * @param character - Character object to validate
 * @returns True if all phases are complete and valid
 */
export function validateCharacter(character: Character): boolean {
  // Implementation
}
```

## Submitting Changes

### Creating a Pull Request

1. Push your branch to your fork
2. Open a pull request with:
   - Clear title describing the change
   - Description explaining what and why
   - Reference to related issue(s)
   - Tests passing locally

3. PR Title Format:
   ```
   feat: Add support for character relationships
   fix: Resolve case verification tier calculation
   docs: Update true crime methodology guide
   ```

4. PR Description Template:
   ```markdown
   ## Summary
   Brief description of changes

   ## Related Issue
   Closes #123

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation
   - [ ] Performance improvement

   ## Testing
   - [ ] Tests pass locally
   - [ ] Coverage maintained/improved
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] No new warnings
   - [ ] Documentation updated
   - [ ] Tests added/updated
   ```

### Review Process

- Maintainers review for:
  - Code quality and style
  - Test coverage
  - Documentation
  - Methodology alignment
- Address feedback promptly
- Maintain a clean commit history
- Rebase if needed to keep history linear

## Project Methodology

### Fiction System
The three-phase approach for character development:
1. **Foundation** — Basic character traits and background
2. **Underworld Integration** — Faction, abilities, relationships
3. **Narrative Architecture** — Story arc and thematic elements

When adding fiction features, ensure they enhance this methodology without complicating it.

### True Crime System
The six-step verification process:
1. **Case Identification** — Gather basic information
2. **Classification** — Categorize charges and jurisdiction
3. **Query & Research** — Search public records
4. **Reconciliation** — Cross-reference and verify
5. **Escalation** — Access restricted databases if needed
6. **Review & Attribution** — Document sources

New true crime features must maintain source integrity and verification rigor.

## Performance Considerations

- Profile code before optimizing (`npm run benchmark` if available)
- Consider impact on test execution time
- Document performance-critical sections
- Avoid unnecessary async operations

## Security Guidelines

- Never commit secrets, API keys, or tokens
- Use `.env.example` for required environment variables
- Review dependencies before adding new packages
- Run `npm audit` and fix vulnerabilities
- Keep dependencies up to date

## Debugging

### Local Testing
```bash
# Run specific test
npm run test -- test/fiction.test.ts

# Run with debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Watch mode for development
npm run test:watch
```

### Build Issues
```bash
# Clean build
rm -rf dist && npm run build

# Check types
npx tsc --noEmit
```

### Common Problems
- **Type errors** — Run `npx tsc --noEmit` for full TypeScript diagnostics
- **Lint failures** — Run `npm run lint` and fix issues
- **Test failures** — Check error output and ensure `dist/` is current

## Commits and History

### Commit Messages
- First line: Clear, concise summary (50 characters max)
- Blank line
- Detailed explanation if needed
- Reference issues: "Fixes #123" or "Relates to #456"

### Examples
```
feat: Add character relationship validation

Implement bidirectional relationship checking to ensure
consistency between character connections.

Fixes #45
```

```
fix: Correct tier calculation in case verification

The previous logic was applying tier weights in the wrong
order, causing accurate facts to be downgraded.

Relates to #89
```

## Release Process

Maintainers handle releases, but contributors should:
- Update version in `package.json` when appropriate
- Document changes in `RELEASE_NOTES.md`
- Ensure tests pass on all Node versions (18.x, 20.x)
- Tag releases following semantic versioning

## Asking for Help

- Use GitHub discussions for questions
- Open issues for bugs with reproduction steps
- Comment on PRs with specific feedback
- Check existing documentation first

## Special Contribution Types

### Documentation Contributions
- Fix typos and improve clarity
- Add examples and use cases
- Improve navigation and organization
- Translate guides (if applicable)

### Test Improvements
- Add tests for untested code paths
- Improve test organization
- Enhance test documentation
- Fix flaky tests

### Performance Improvements
- Include benchmarks showing improvement
- Verify no performance regressions
- Document any behavioral changes
- Keep code readability

### Methodology Contributions
- Propose changes to the three-phase fiction system
- Suggest improvements to six-step verification
- Provide evidence of improvements
- Gather feedback before implementation

## Recognition

Contributors are recognized in:
- Commit history
- Release notes ([CHANGELOG.md](CHANGELOG.md))

## Questions?

- Check [Getting Started](docs/guides/GETTING_STARTED.md)
- Review [docs/INDEX.md](docs/INDEX.md)
- Open an issue for clarification

Thank you for making Underworld Writer better!
