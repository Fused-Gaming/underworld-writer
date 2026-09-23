# Changelog

All notable changes to Underworld Writer are documented here.

Format follows Keep a Changelog and Semantic Versioning.

## [Unreleased]

### Added
- Future changes belong here before release.

## [2.3.2] - 2026-09-23

### Changed
- Refreshed the root `README.md`, which had been frozen at the 2.2.1 version badge/tag/artwork alt text despite the 2.3.0/2.3.1 releases: bumped version references to 2.3.1, added a "v2.3.x highlights" section (mastering, editorial linter, chunk synthesis cache, scoped-token publish CLI, relicense, `PRIVACY.md`, root doc cleanup), replaced the flat documentation list with a "Documentation structure" section mapping the actual `docs/` tree, fixed two dead links left by #154's root cleanup (`GETTING_STARTED.md`, `INSIGHT_CORRUPTION_SETUP.md`), extended the versioning history through 2.3.1, and listed the newer release/publish commands (`rock:evidence`, `rock:manifest`, `publish:npm`).

### Release Artwork
- **Documentation Refresh** — Root README now reflects the current version, 2.3.x feature set, and actual documentation structure, with all internal links verified.

## [2.3.1] - 2026-09-23

### Added
- `.npmrc` reading `//registry.npmjs.org/:_authToken=${UW_NPM_TOKEN}` so `scripts/publish-npm.mjs` authenticates with a scoped npm automation token from the environment instead of requiring an interactive `npm login` session; documented in `docs/ops/PUBLISHING.md` and `.env.example` (#155).

### Release Artwork
- **Scoped Publish Auth** — `UW_NPM_TOKEN` support lets the CLI publish flow authenticate with a per-package scoped token, with automatic fallback to `npm login`.

## [2.3.0] - 2026-09-23

### Added
- Render manifest (`episode.manifest.json`) persisted next to each episode's mastered WAV, recording measured integrated loudness, true peak, LRA, mastering targets, backend/model info, and per-segment text hashes (#149).
- Configurable editorial language linter (`src/editorial-lint.ts`) with `bannedPhrases`/`discouragedPhrases`/`preferredTerms` severities (`error`/`warn`/`review`), driven by `templates/editorial/style-dictionary.json` and overridable per brand/project (#146, #149).
- Repeated-opening, repeated-transition, excessive-rhetorical-question, and repeated-n-gram detection in the editorial linter, wired into `scripts/editorial-package.mjs` via `--lint`/`--strict` and `npm run editorial:lint` (#149).
- Chunk-level synthesis cache (`modal/cache/chunk_cache.py`) keyed on chunk text + voice profile (id/revision) + reference-audio hash + backend revision + synthesis params, enabling resumable episode rendering after a partial failure (#149).
- `scripts/publish-npm.mjs` (`npm run publish:npm`): git/npm-auth safety checks, runs `release:evidence`, publishes, and tags the release; documented in `docs/ops/PUBLISHING.md` (#149).
- `PRIVACY.md` at the repository root and in `.claude-plugin/`, documenting that this package has no telemetry, PACER queries default to mock mode with no live implementation yet, and cloud audio synthesis via Modal is opt-in and uses the user's own Modal account (#152).

### Changed
- Audio mastering now uses two-pass ffmpeg EBU R128 `loudnorm` true-peak limiting instead of a sample-peak `np.clip()` limiter; targets (`-16 LUFS` / `-1 dBTP` / `11 LRA`) are read from `modal/config/render_profiles/podcast-standard.json`'s `mix` block (#149).
- `@h4shed/rock-hardened` is now an exact-pinned devDependency invoked via its local bin (`hardened-changelogger`), replacing an unpinned `npx --yes --package=@h4shed/rock-hardened@0.8.2 ...` that auto-installed and executed the package on every publish (#149).
- **License changed from Apache-2.0 to a custom non-commercial license** (Unlicense base + Fused Gaming Non-Commercial Rights Amendment): free for personal/educational/research/non-production use; commercial use now requires a separate written license from Fused Gaming LLC (licensing@vln.gg). `LICENSE` renamed to `LICENSE.md`. `package.json`/`plugin.json`/`.claude-plugin/marketplace.json` `license` fields changed from `Apache-2.0` to `SEE LICENSE IN LICENSE.md` (#152).
- Moved operational/setup docs out of the repository root into `docs/ops/` (`DOCKER.md`, `MODAL_SETUP.md`, `PUBLISHING.md`) and `docs/archive/` (`BUILD_SETUP_REPORT.md`, `DOCKER_BUILD_SUMMARY.txt`) to reduce root clutter; `README.md`, `LICENSE.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CLAUDE.md`, `AGENTS.md`, `SKILL.md`, and `PRIVACY.md` remain at the root.

### Fixed
- Chunk resynthesis after a partial episode-generation failure no longer regenerates the whole episode; already-cached chunks are skipped (`force_regenerate` still available to bypass the cache) (#149).

## [2.2.1] - 2026-09-20

### Added
- Repository-local release-art renderer at `scripts/render-release-artwork.mjs`.
- Exact approved ArtPatch release template at `assets/branding/underworld-writer-release-changelog-template.svg`.
- Canonical 1200×630 release/Open Graph output at `release-artifacts/underworld-writer-release-og-1200x630.svg`.
- Structured `Release Artwork` metadata so release-card copy is deterministically sourced from this changelog.

### Changed
- Advanced the 2.2.0 release line to the **2.2.1 patch release** and normalized the authoritative package, plugin, release-ledger, and exported-skill version surfaces around that version.
- Retained `scripts/sync-version.mjs` as the deterministic local normalization path for generated lockfile root-version metadata; the dependency graph itself is unchanged from 2.2.0.
- Consolidated the release-branding/versioning work previously split across PRs #138 and #139 into PR #137 without discarding the 2.2.0 benchmark baseline or historical release ledger.
- Release artwork generation now reuses the exact approved Underworld Writer ArtPatch composition as an immutable visual base instead of redrawing the design from SVG primitives.
- Underworld Writer owns the release-art template and overlay rules while Rock-Hardened remains responsible for changelog/release evidence workflows.
- The release renderer reads the active package version and selected release section from `CHANGELOG.md`; future release renders may replace only declared version and feature-card text zones.
- The root README now uses the canonical generated 1200×630 SVG release asset.

### Fixed
- Replaced primitive/generic release-art approximations with the approved Neon Underworld ArtPatch composition.
- Preserved the complete 2.2.0 validation and benchmark evidence while adding 2.2.1 release metadata instead of overwriting the existing release ledger.
- Corrected stale release-art documentation that referenced the retired JPEG/raster template and `render-underworld-release-art.mjs` path.
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
