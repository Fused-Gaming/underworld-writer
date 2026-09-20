# Changelog

All notable changes to Underworld Writer are documented here.

Format follows Keep a Changelog and Semantic Versioning.

## [Unreleased]

### Added
- Future changes belong here before release.

## [2.2.1] - 2026-09-20

### Added
- Drafted a properly sized **1200×630** Underworld Writer release artwork asset at `release-artifacts/underworld-writer-release-og-1200x630.svg`.

### Changed
- Bumped the package/plugin patch version to **2.2.1** for release-branding follow-up work.
- Registered the 2.2.1 OpenGraph artwork draft in `assets/branding/release-brand.json`.
- Clarified that the supplied 1536×572 cover remains the canonical source identity while generated release cards live under `release-artifacts/`.

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
- Canonical Underworld Writer release-brand contract at `assets/branding/release-brand.json` with approved-cover fingerprint, palette, protected composition rules, and derivative format definitions.
- Human-readable release-brand usage guidance at `assets/branding/README.md`.
- Segment-first editorial package generator at `scripts/editorial-package.mjs`.
- Reusable podcast/article block library at `templates/editorial/shared-segments.json`.
- Shared evidence/claim packages capable of rendering both podcast and article outputs without independently rewriting core facts.
- Runtime validation based on actual spoken-word counts plus fixed-duration blocks.
- Article target-length validation with generated section manifests.
- Release validation fixture for Insight Corruption Episode 1.

### Changed
- Consolidated generated and producer-facing podcast artifacts beneath the canonical `output/` root.
- Moved legacy Insight Corruption generated artifacts into the canonical series/episode structure without discarding source material.
- Added a Season 1 manifest and generator metadata for Insight Corruption.
- Replaced Episode 1's timestamp-based outline with 13 independently recordable/scriptable segments plus a derived producer read-through file.
- Replaced Episode 1's short monolithic LinkedIn article with a segmented 1,864-word article generated from the same evidence package as the podcast.
- Made assembled podcast/article files derived artifacts; agents must edit episode packages/templates and regenerate instead of making source-of-truth corrections only in assembled files.
- Wired `release-contract.config.json` to the approved Underworld Writer cover identity, brand contract, fallback icon, and non-destructive 1200×630 render strategy.
- Extended `AGENTS.md` so future agents must use the approved Underworld Writer release art system rather than inventing a new release theme.
- Release version advanced to 2.2.0.

### Fixed
- Prevented future agents from creating competing root-level podcast output directories.
- Removed retired `migration` branch assumptions from test workflow configuration.
- Normalized package/plugin/exported-skill release versioning and added automated drift detection.
- Corrected Episode 1's legacy offense framing: the final conviction concerned unlawful tapentadol importation, while the original fentanyl-related theory was withdrawn after prosecutors acknowledged a testing error.
- Removed the unsupported `FCPA Violations` label from the Joanne Segovia case file.
- Removed Episode 1's dependency on an unscripted four-minute guest block to claim a 30-minute runtime.

### Validation
- `npm run test:workspace` exercises canonical series → season → episode scaffolding plus expected validator failures.
- `npm run test:episode1` validates the Episode 1 editorial package without writing output.
- Episode 1 podcast result: **4,092 scripted words**, **29.52 estimated minutes** at 145 WPM including the fixed 90-second mid-roll — **PASS** against a 30 ± 1 minute target.
- Episode 1 LinkedIn article result: **1,864 words** — **PASS** against the configured 1,800–2,300 word range.
- `npm run benchmark:workspace` measures registry lookup, canonical path construction, and scaffold metadata validation in addition to existing benchmarks.
- `npm run validate:release` combines version checks, workspace validation, Rock-Hardened changelog validation, workspace/editorial fixtures, build, tests, and benchmarks.
- Approved release cover identity recorded as **1536×572**, SHA-256 `7ec8cb4032a8b37620327f06afffbb1c5fa4240ee150db80191c26a0acc67609`.

## [2.1.0] - 2026-09-20

### Added
- Integration tests for character-to-story workflows.
- Performance benchmarking utilities and baseline metrics.
- Expanded developer documentation.

## [2.0.7] - 2026-09-15

### Fixed
- True-crime case files can be adapted by the podcast scripting engine without character-shape crashes.
- Fact-attribution tiers derive from case-file source and verification metadata.
