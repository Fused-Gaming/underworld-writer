# Changelog

All notable changes to Underworld Writer are documented here.

Format follows Keep a Changelog and Semantic Versioning.

## [Unreleased]

### Added
- Future changes belong here before release.

## [2.2.1] - 2026-09-19

### Added
- Repository-local release-art renderer at `scripts/render-underworld-release-art.mjs`.
- Canonical Neon Underworld raster template at `assets/branding/underworld-writer-release-changelog-template.jpg`.
- Structured `Release Artwork` metadata so visual feature cards stay changelog-driven without auto-summarizing arbitrary long bullets.

### Changed
- Release artwork generation now reuses the approved Underworld Writer composition as an immutable visual base instead of redrawing the design from SVG primitives.
- Underworld Writer owns the release-art template and overlay rules while Rock-Hardened remains responsible for changelog/release evidence workflows.
- The release renderer reads the active package version and selected release section from `CHANGELOG.md`.

### Fixed
- Replaced the primitive SVG approximation of the release artwork with the approved Neon Underworld composition as the canonical repository release source.
- Added a real canonical release-cover asset and a 1200×630 release derivative to the repository.
- Changed the SVG release asset into a compatibility/output surface around the approved artwork instead of independently redrawing the brand from vector primitives.
- Updated the release-brand contract to prohibit generic mascot substitutions, primitive redraws, alternate cavern compositions, and independently regenerated title/card/footer layouts.
- Clarified the release boundary: Rock-Hardened supplies changelog/release data; Underworld Writer owns its visual composition.

### Release Artwork
- **SEGMENT-FIRST** — Podcast & article pipelines
- **VOICE READY** — Scripts, timing & production docs
- **ROCK-HARDENED** — Validated releases & changelog art
- **OPEN SOURCE** — Build. Audit. Improve. Together.
- **REAL IMPACT** — Fiction, true-crime, and investigative stories.
- **BUILT FOR MORE** — Episodes. Series. A more transparent tomorrow.

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
- Canonical Underworld Writer release-brand contract at `assets/branding/release-brand.json`.
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

## [2.1.0] - 2026-09-20

### Added
- Integration tests for character-to-story workflows.
- Performance benchmarking utilities and baseline metrics.
- Expanded developer documentation.

## [2.0.7] - 2026-09-15

### Fixed
- True-crime case files can be adapted by the podcast scripting engine without character-shape crashes.
- Fact-attribution tiers derive from a case file's own sources/verification_status.
