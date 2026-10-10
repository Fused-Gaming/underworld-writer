# Rock-Hardened Integration

How Underworld Writer uses `@h4shed/rock-hardened` for changelog validation, release evidence, and release cards. Owned by this repository; the upstream tool is maintained at https://github.com/fused-gaming/rock-hardened.

## Division of responsibility

- **Rock-Hardened** supplies changelog validation, the release manifest, the SBOM, provenance, attestation, and the generic card renderer.
- **Underworld Writer** owns the approved visual composition. `scripts/render-release-artwork.mjs` writes release art from the approved SVG template (`assets/branding/underworld-writer-release-changelog-template.svg`) and updates only the declared text zones from `CHANGELOG.md`.
- `release-contract.config.json` declares both halves: `integration.releaseDataProvider` names Rock-Hardened, and `render.template` names the approved template.

## Version pin

- `package.json` pins `@h4shed/rock-hardened` to an **exact** devDependency (currently `0.8.2`). It is never fetched with `npx --yes`.
- The version is bumped deliberately, in its own commit, after the new version has been run through the checks below.
- The CLI banner prints `v0.8.0` even though the installed package is `0.8.2`. This is cosmetic; the package version is the one that matters.

## Commands

| Script | Runs | Purpose |
| --- | --- | --- |
| `npm run rock:validate` | `hardened-changelogger validate` | Checks `CHANGELOG.md` against the release contract. Part of `validate:release`. |
| `npm run rock:evidence` | `hardened-changelogger ci` | Full pipeline: validate, manifest, cards (HTML/SVG), SBOM, provenance, attestation, attestation chain. Writes to `release-artifacts/`. |
| `npm run rock:manifest` | `hardened-changelogger manifest` | Writes only `release-manifest.json`. |
| `npm run release:evidence` | validate:release, rock:evidence, release:art | Local release contract used by `publish:npm` and `prepublishOnly`. |

Run `rock:validate` before every commit that touches `CHANGELOG.md`. Run `release:evidence` only as part of a release candidate.

## Tracked outputs

`release-artifacts/` is a designated output root (see `AGENTS.md`). Most of its files are regenerated on every run and are gitignored. Two are tracked:

- `release-artifacts/release-card-hero.svg` (carries the commit stamp in its footer; restamp it after each release-prep commit)
- `release-artifacts/underworld-writer-release-og-1200x630.{svg,jpg}`

The SBOM and provenance files change on every run because the SBOM timestamp changes. Do not commit them.

## Known issue: provenance verification fails

Observed on 2026-10-10 with `0.8.2`:

```
✓ SBOM valid
✗ Provenance verification failed
  - SBOM hash mismatch: provenance does not match current SBOM
```

**Cause.** In `bin/hardened-changelogger.js`, `provenanceCommand` builds the SBOM with `buildSBOM({ cwd })`. It passes no `version`, so the SBOM is stamped `0.0.0`, and it gets a new timestamp. The file that `sbomCommand` wrote is stamped `2.4.1` with a different timestamp. The provenance hash is computed on the first object, so it can never match the file that verification reads.

**Effect.** `rock:evidence` still exits `0`. A release can therefore pass the pipeline while its provenance check is failing. Do not treat a green exit code as proof that provenance verified; check the printed `✓`/`✗` lines.

**Options**, in order of preference:

1. Upgrade to a rock-hardened release that fixes `provenanceCommand`, then confirm `✓ Provenance verified` on a clean run.
2. Report the bug upstream with the reproduction above.
3. Accept the failure as a known issue and record it in the release notes, as PR #172 does.

Until one of these lands, release reviewers must read the provenance line, not only the exit code.

## Upgrade procedure

1. Read the upstream changelog for the target version.
2. On a branch, change the exact pin in `package.json` and run `npm install --save-dev --save-exact @h4shed/rock-hardened@<version>`.
3. Run `npm run rock:validate`, then `npm run rock:evidence`. Confirm the verify section prints `✓ SBOM valid`, `✓ Provenance verified` (or record the remaining failure).
4. Run `npm run release:art:check` and `npm run validate:workspace`.
5. Commit the lockfile and pin change together, separate from feature work.

## Verification record

| Date | Commit | Pin | `rock:validate` | `rock:evidence` exit | Provenance |
| --- | --- | --- | --- | --- | --- |
| 2026-10-10 | `21c94cd` | 0.8.2 | pass | 0 | **fail** (SBOM hash mismatch) |
