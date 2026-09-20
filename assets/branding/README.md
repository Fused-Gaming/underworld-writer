# Underworld Writer Release Branding

This directory defines the canonical visual contract for **Underworld Writer** release artwork.

## Canonical release design

The approved repository-owned release composition is the **Neon Underworld Release Changelog** design.

Canonical generated artifact:

```text
release-artifacts/underworld-writer-release-og-1200x630.svg
```

Machine-readable design contract:

```text
assets/branding/release-brand.json
```

Repository render configuration:

```text
release-contract.config.json
```

Rock-Hardened remains the changelog/release-data renderer. **Underworld Writer owns the visual design.** Do not modify Rock-Hardened solely to change this repository's artwork.

## Visual identity

The release graphic must preserve this hierarchy:

1. `FUSED GAMING / OPEN SOURCE`
2. `UNDERWORLD WRITER`
3. `NARRATIVE ENGINE · EDITORIAL TOOLING · PODCAST CREATION · REAL IMPACT`
4. release/version row such as `v2.2.1 RELEASE`
5. `BUILD THE STORY. EXPOSE THE TRUTH. SHIP WHAT MATTERS.`
6. four to six current-release feature cards
7. repository/footer identity

The scene uses a cinematic black/purple cavern environment, a neon-magenta portal or vertical energy beam, and a stitched voodoo-doll mascot on the right side.

## Mascot

The recurring release mascot is a stitched voodoo doll inspired by the CC0 SVG Repo asset:

```text
https://www.svgrepo.com/svg/321677/voodoo-doll
```

The mascot may be stylized to fit the Underworld Writer visual language, but it must remain recognizable as a cloth/rag-doll form with seams, stitched or button-like facial details, pins, and magenta rim lighting.

## Palette

| Token | Hex | Use |
|---|---|---|
| `void` | `#03040A` | main background |
| `panel` | `#050813` | feature cards/footer |
| `deepViolet` | `#12051C` | cavern shadows |
| `cavernPurple` | `#35104E` | environmental midtone |
| `electricViolet` | `#9D20F3` | glow/supporting accent |
| `writerMagenta` | `#FF2AC8` | primary accent |
| `hotMagenta` | `#FF40CE` | release/version emphasis |
| `ghostWhite` | `#F7F7FB` | primary text |
| `mistLavender` | `#CFD3DD` | secondary text |
| `mutedStone` | `#70809D` | low-emphasis metadata |

## Layout contract — 1200 × 630

- **Upper left:** product identity and descriptor.
- **Upper/right center:** cavern scene, portal/light beam, mascot.
- **Left middle:** version + `RELEASE` treatment and release tagline.
- **Lower third:** four to six changelog-driven feature cards.
- **Footer:** repository identity, `OPEN NARRATIVES. REAL CHANGE.`, and changelog/render metadata.

Essential text must always sit on a dark/high-contrast field. Never place release copy directly over a visually noisy portion of the cavern scene.

## Feature cards

Preferred recurring card categories are:

- `SEGMENT-FIRST`
- `VOICE READY`
- `ROCK-HARDENED`
- `OPEN SOURCE`
- `REAL IMPACT`
- `BUILT FOR MORE`

These labels are part of the visual language, but their descriptions must be derived from the **current** changelog/release. Do not preserve stale feature claims from an older release.

## Generation flow

```text
CHANGELOG.md
     │
     ▼
Rock-Hardened release data
     │
     ▼
release-contract.config.json
     │
     ▼
assets/branding/release-brand.json
     │
     ▼
release-artifacts/underworld-writer-release-og-1200x630.svg
     │
     ├── README hero
     ├── Open Graph / social release asset
     └── release evidence
```

The release asset is derivative output. The **design contract**, not an individual generated release image, controls future artwork.

## Format adaptations

- **1200 × 630:** canonical README/Open Graph release composition.
- **1280 × 640:** preserve the same left-brand/right-mascot split and feature cards.
- **1536 × 572:** reduce card height before sacrificing protected brand/mascot regions.
- **1080 × 1080:** stack the brand/release region above the scene and cards; do not center-crop the wide design.

## Repository boundary

```text
assets/branding/        repository-owned design contract and guidance
release-artifacts/      generated changelog/release derivatives
```

Future agents must preview any materially new composition before replacing this design system.
