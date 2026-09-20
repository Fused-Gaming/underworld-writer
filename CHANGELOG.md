# Changelog

All notable changes to Underworld Writer are documented here.

Format follows Keep a Changelog and Semantic Versioning.

## [Unreleased]

### Added
- Future changes belong here before release.

## [2.2.0] - 2026-09-19

### Added
- Cross-agent workspace contract in `AGENTS.md` with Claude and Copilot pointers.
- Canonical podcast series registry at `output/SERIES_REGISTRY.json`.
- Versioned series, season, episode, and registry JSON schemas.
- Podcast workspace scaffolding commands for new series, seasons, and episodes.
- Workspace validation for rogue output roots, manifest identity, and release metadata consistency.
- Fixture-based workspace contract tests.
- Workspace-specific performance benchmarks.
- Release version synchronization utility.
- Rock-Hardened release validation/evidence integration.

### Changed
- Consolidated generated and producer-facing podcast artifacts beneath the canonical `output/` root.
- Moved legacy Insight Corruption generated artifacts into the canonical series/episode structure without discarding source material.
- Added a Season 1 manifest and generator metadata for Insight Corruption.
- Release version advanced to 2.2.0.

### Fixed
- Prevented future agents from creating competing root-level podcast output directories.
- Removed retired `migration` branch assumptions from test workflow configuration.
- Normalized package/plugin release versioning and added automated drift detection.

### Validation
- `npm run test:workspace` exercises canonical series → season → episode scaffolding plus expected validator failures.
- `npm run benchmark:workspace` measures registry lookup, canonical path construction, and scaffold metadata validation in addition to existing benchmarks.
- `npm run validate:release` combines version checks, workspace validation, Rock-Hardened changelog validation, build, tests, and benchmarks.

## [2.1.0] - 2026-09-20

### Added
- Integration tests for character-to-story workflows.
- Performance benchmarking utilities and baseline metrics.
- Expanded developer documentation.

## [2.0.7] - 2026-09-15

### Fixed
- True-crime case files can be adapted by the podcast scripting engine without character-shape crashes.
- Fact-attribution tiers derive from case-file source and verification metadata.
