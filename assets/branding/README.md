# Underworld Writer Release Branding

This directory defines the repository-owned visual contract for Underworld Writer release artwork.

## Canonical release artwork

The approved source is:

```text
assets/branding/underworld-writer-release-cover.jpg
```

It is the **Neon Underworld** composition: a black/magenta/violet cavern scene with the large `UNDERWORLD WRITER` wordmark, `v<semver> RELEASE` treatment, stitched plush voodoo-doll mascot, neon portal, release-highlight cards, and repository footer.

For the canonical README/Open Graph release card, use the 1200 × 630 composition directly. Do not rebuild it from basic vector shapes.

## Non-negotiable rule

**The approved composition is artwork, not a loose mood board.**

Agents and release automation must not replace it with:

- a generic cyberpunk background;
- a simplified white mascot silhouette;
- an independently redrawn voodoo doll;
- a new wordmark layout;
- a primitive SVG reconstruction;
- a different feature-card/footer hierarchy.

When the canonical artwork exists, use it directly. SVG derivatives should wrap or reference the approved source rather than approximate it.

## Source of truth

Machine-readable rules live in:

```text
assets/branding/release-brand.json
```

The release integration config lives at:

```text
release-contract.config.json
```

Rock-Hardened supplies changelog/release data. **Underworld Writer owns the visual design.** Do not modify `Fused-Gaming/rock-hardened` to alter this repository's release appearance.

## Visual hierarchy

1. `FUSED GAMING / OPEN SOURCE`
2. `UNDERWORLD WRITER`
3. `NARRATIVE ENGINE · EDITORIAL TOOLING · PODCAST CREATION · REAL IMPACT`
4. `v<semver> RELEASE`
5. `BUILD THE STORY. EXPOSE THE TRUTH. SHIP WHAT MATTERS.`
6. Release-highlight cards
7. Repository footer / `OPEN NARRATIVES. REAL CHANGE.`

## Canonical files

```text
assets/branding/underworld-writer-release-cover.jpg
release-artifacts/underworld-writer-release-og-1200x630.jpg
release-artifacts/underworld-writer-release-og-1200x630.svg
```

The JPG is the approved visual source/derivative. The SVG is a compatibility wrapper and must not contain a hand-redrawn substitute.

## Release adaptation

Future versions may update release number, changelog-driven highlights, and supporting copy while preserving the same design language and hierarchy. If the composition itself changes, the new design must be deliberately approved and then promoted to the canonical source before automation is allowed to use it.
