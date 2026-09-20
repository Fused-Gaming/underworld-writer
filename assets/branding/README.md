# Underworld Writer Release Branding

This directory defines the canonical visual contract for Underworld Writer releases.

## Canonical cover

Approved artwork: `underworld-writer-release-cover.jpeg`

The approved source is the wide Fused Gaming / Open Source cover featuring the `UNDERWORLD WRITER` wordmark, white mascot, purple-magenta cavern environment, and the line:

> Build the world. Track the truth. Ship the story.

Expected source dimensions: **1536 × 572**.

Approved source fingerprint:

```text
SHA-256 7ec8cb4032a8b37620327f06afffbb1c5fa4240ee150db80191c26a0acc67609
```

Until the binary is materialized at the canonical path, agents must treat that fingerprint and `release-brand.json` as the identity of the approved artwork supplied for the v2.2.0 release work.

## Source of truth

Machine-readable rules live in:

```text
assets/branding/release-brand.json
```

Release automation, Rock-Hardened integration, coding agents, design agents, and humans should read that contract instead of inventing per-release visual styles.

## Visual hierarchy

1. `FUSED GAMING / OPEN SOURCE`
2. `UNDERWORLD WRITER`
3. `CHARACTER SYSTEMS · NARRATIVE ENGINE · EDITORIAL CONTROL`
4. `Build the world. Track the truth. Ship the story.`
5. Optional release annotation such as `v2.2.0 · RELEASE`

Release annotations are additions to the approved artwork, not replacements for its identity.

## Palette

| Token | Hex | Use |
|---|---|---|
| `void` | `#020414` | primary background / extension field |
| `deepViolet` | `#1D103B` | dark secondary field |
| `cavernPurple` | `#421968` | environmental purple |
| `electricViolet` | `#782198` | secondary accent |
| `writerMagenta` | `#C739CC` | primary release accent |
| `ghostWhite` | `#F4EAFA` | high-emphasis type / mascot-adjacent UI |
| `mistLavender` | `#CFAEE5` | soft secondary type/accent |
| `mutedStone` | `#716F7B` | low-emphasis metadata |

The canonical cover remains the authority if sampled colors differ slightly because of compression, glow, or gradients.

## Release derivatives

- **1536 × 572:** use the approved cover directly.
- **1280 × 640 GitHub social:** contain the cover over a dark purple/void extension rather than cropping the title or mascot.
- **1200 × 630 Open Graph:** same containment rule; version badge may be added in a safe margin.
- **1080 × 1080 square:** frame/inset the approved cover instead of center-cropping it.

Do not stretch, recolor the mascot, replace the wordmark, or cover protected visual regions.

## Repository boundary

```text
assets/branding/        canonical brand definitions and source artwork
release-artifacts/      generated release cards, manifests, attestations, and derivatives
```

Generated artwork must never overwrite the canonical source asset.
