# Episode Development Workflow

This document explains how to develop individual podcast episodes within your series framework.

---

## Episode Fundamentals

An episode is a self-contained production unit with:

- **Metadata:** Episode number, season, title, description, dates
- **Configuration:** Source references, guest info, verification tier
- **Generated Content:** Scripts, producer briefs, guest materials
- **Source Materials:** Research documents, court records, articles
- **Production Assets:** Audio files, images, graphics
- **Metadata & Reviews:** Fact-checking, approval records

---

## Episode Directory Structure

Each episode creates a standardized directory tree:

```
output/[series-slug]/season-[N]/episode-[N]/
├── EPISODE_CONFIG.json          # Episode configuration
├── README.md                     # Episode guide
├── scripts/
│   ├── main-script.json         # Structured script (JSON)
│   └── script.md                # Human-readable script (Markdown)
├── source-materials/
│   ├── verification-worksheet.csv
│   ├── court-documents/
│   ├── articles/
│   └── research-notes/
├── producer-briefs/
│   ├── producer-brief.json
│   └── brief.md
├── guest-materials/
│   ├── guest-script.json
│   ├── guest-script.md
│   └── checklist-[guest-name].md
├── recording-guides/
│   └── recording-session.md
├── assets/
│   ├── images/
│   ├── audio-clips/
│   └── graphics/
├── published-assets/
│   ├── episode-cover.png
│   └── social-clips/
├── metadata/
│   └── episode.json
├── reviews/
│   ├── fact-check-approval.md
│   └── editorial-notes.md
└── archived/
    └── [previous-versions]
```

---

## Episode Configuration

### EPISODE_CONFIG.json

Every episode requires an `EPISODE_CONFIG.json` file. This file defines the episode's scope, sources, and metadata.

**Location:**
```
output/[series-slug]/season-[N]/episode-[N]/EPISODE_CONFIG.json
```

**Required Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `episodeNumber` | number | Episode number (1, 2, 3, etc.) |
| `seasonNumber` | number | Season number (1, 2, 3, etc.) |
| `title` | string | Episode title |
| `description` | string | 1-3 sentence description |
| `characters` | string[] | Names of case subjects or main characters |
| `location` | string | Geographic location or jurisdiction |
| `year` | number | Year of focus (when case occurred) |

**Metadata & Classification:**

| Field | Type | Description |
|-------|------|-------------|
| `tags` | string[] | Topic tags: `opioid-crisis`, `bribery`, `fraud`, etc. |
| `sourceVerificationTier` | number | 1-4, based on source quality |
| `caseReference` | string | Path to case file if from project directory |
| `status` | string | `in-development`, `scripted`, `recorded`, `edited`, `published` |

**Duration & Dates:**

| Field | Type | Description |
|-------|------|-------------|
| `duration.estimated` | number | Estimated minutes (per part if two-part) |
| `duration.actualRecorded` | number (optional) | Actual recording time |
| `duration.edited` | number (optional) | Final edited length |
| `recordingDate` | ISO 8601 (optional) | When recording took place |
| `airDate` | ISO 8601 (optional) | When episode aired/will air |

**Content & Investigation:**

| Field | Type | Description |
|-------|------|-------------|
| `keyPoints` | string[] | Main claims or questions the episode addresses |
| `investigativeAngles` | string[] | Key investigative questions |
| `guestOpportunities` | string[] | Types of guests or expert opportunities |
| `factCheckLayers` | string[] | What sources need verification (PACER, published, etc.) |
| `producerNotes` | string | Notes specific to this episode's focus |

### Example EPISODE_CONFIG.json

```json
{
  "episodeNumber": 1,
  "seasonNumber": 1,
  "title": "The Union Boss Who Smuggled Opioids",
  "subtitle": "Joanne Segovia's Zero-Jail Deal",
  "description": "Union executive Joanne Segovia was convicted of federal opioid smuggling involving over 17,000 pills—yet received zero jail time. This episode explores how an addiction narrative became a legal escape route in a case of public trust violation.",
  "characters": ["Joanne Segovia"],
  "location": "San Jose, California",
  "year": 2024,
  "tags": ["opioid-crisis", "federal-sentencing", "union-politics", "addiction-defense"],
  "sourceVerificationTier": 2,
  "caseReference": "joanne-segovia-case.json",
  "duration": {
    "estimated": 14,
    "actualRecorded": null,
    "edited": null
  },
  "recordingDate": null,
  "airDate": null,
  "keyPoints": [
    "How many opioid pills were smuggled?",
    "What addiction defense was used?",
    "Why does union leadership escape sentencing?",
    "What's the street-level vs. executive contrast?"
  ],
  "investigativeAngles": [
    "Addiction as legal defense for federal crimes",
    "Sentencing disparities: street dealers vs. union executives",
    "Public trust positions and reduced consequences",
    "Opioid crisis accountability gaps"
  ],
  "guestOpportunities": [
    "Law enforcement official familiar with union politics",
    "Defense attorney specializing in addiction/sentencing",
    "Public health expert on opioid crisis",
    "DEA agent on controlled substance smuggling",
    "Medical professional on tapentadol addiction potential"
  ],
  "factCheckLayers": [
    "PACER records: Federal sentencing documentation",
    "Published: San José Spotlight, NBC Bay Area, KQED (2024)",
    "Timeline: When did smuggling start? How was it detected?"
  ],
  "producerNotes": "Focus on the 'escape mechanism': addiction as sentencing mitigation. Contrast with typical opioid distribution cases.",
  "status": "in-development"
}
```

---

## Episode Development Workflow

### Phase 1: Initialize Episode

#### Step 1: Create Directory

```bash
mkdir -p output/[series-slug]/season-1/episode-1/{scripts,source-materials,producer-briefs,guest-materials,recording-guides,assets,published-assets,metadata,reviews,archived}
```

#### Step 2: Create EPISODE_CONFIG.json

Copy the template above and fill in episode details.

#### Step 3: Create Episode README

Create `README.md` with episode overview, workflow phases, and quick facts:

```markdown
# Episode 1: The Union Boss Who Smuggled Opioids

## Quick Facts
- **Episode:** 1
- **Season:** 1
- **Duration:** ~14 minutes (two 7-minute parts)
- **Subject:** Joanne Segovia
- **Case Year:** 2024

## Production Status
- [ ] Research complete
- [ ] Sources verified
- [ ] Script generated
- [ ] Guest identified
- [ ] Recording scheduled
- [ ] Editing complete
- [ ] Fact-check approved
- [ ] Published

## Key Questions
- How did addiction defense work for federal drug smuggling?
- Why was a union executive sentenced to zero jail time?
- What's the contrast with street-level drug distribution?

[Continue with your own sections...]
```

### Phase 2: Research & Source Gathering

#### Step 1: Create Source Worksheet

Create `source-materials/verification-worksheet.csv`:

```csv
Claim,Sources,Tier,Status,Verified By,Date
"17,000 opioids smuggled","PACER records, San José Spotlight (2024)",2,"pending","","2026-09-15"
"Addiction defense used","San José Spotlight interview",3,"pending","","2026-09-15"
"Union executive role","Public records, news reports",1,"pending","","2026-09-15"
```

#### Step 2: Gather Materials

Collect research documents in `source-materials/`:

```
source-materials/
├── court-documents/
│   └── pacer_docket.pdf
├── articles/
│   ├── san-jose-spotlight.md
│   └── nbc-bay-area.md
└── research-notes/
    └── investigation-summary.md
```

#### Step 3: Verify Facts (True Crime Only)

Use the True Crime verification workflow from [True Crime SKILL.md](../true-crime/protocols/SKILL.md):

1. Tier each claim (Tier 1-4)
2. Update verification worksheet with sources
3. Track gaps and escalation needs
4. Document verification status in metadata

### Phase 3: Script Generation

The podcast scripting engine generates scripts automatically from character/case data.

**Inputs:**
- Character profile (from Fiction use case) or Case data (from True Crime use case)
- Episode configuration
- Script configuration (format, audience, duration)

**Outputs:**
- Main script (JSON and Markdown)
- Script segments with timing
- Q&A windows for guest input
- Attribution tiers for each claim

**Files Created:**
- `scripts/main-script.json` — Structured, parseable script
- `scripts/script.md` — Human-readable version

### Phase 4: Producer Materials

The system generates producer briefs from scripts:

**Outputs:**
- Producer brief with key facts and talking points
- Verification status summary
- Recording notes and technical guidance

**Files Created:**
- `producer-briefs/producer-brief.json` — Structured brief
- `producer-briefs/brief.md` — Human-readable version

### Phase 5: Guest Coordination (If Applicable)

See [Guest Coordination](./GUEST_COORDINATION.md) for full details.

**Outputs:**
- Guest script with conversation cues
- Guest preparation checklist
- Background context and discussion topics

**Files Created:**
- `guest-materials/guest-script.md`
- `guest-materials/checklist-[guest-name].md`

### Phase 6: Recording Preparation

#### Create Recording Guide

Generate `recording-guides/recording-session.md` with:

```markdown
# Recording Session Guide

## Segment Breakdown
- Segment 1: Introduction (~90s) — 0:00-1:30
- Segment 2: Case Overview (~120s) — 1:30-3:30
- Segment 3: Investigation Details (~150s) — 3:30-6:00
[... etc ...]

## Technical Checklist
- [ ] Microphone level check
- [ ] Background noise assessment
- [ ] Recording format (WAV)
- [ ] Backup recording enabled
```

### Phase 7: Production

1. Conduct guest interviews (if applicable)
2. Record main narration using script
3. Capture audio clips and graphics
4. Create episode cover art

**Save to:**
- `assets/audio-clips/` — Interview clips, sound effects
- `assets/images/` — Photos, diagrams
- `published-assets/episode-cover.png` — Cover art

### Phase 8: Post-Production & Review

#### Fact-Check Approval

Create `reviews/fact-check-approval.md`:

```markdown
# Fact-Check Review

## Claims Verified
- [x] 17,000 opioids (PACER records confirm)
- [x] Addiction defense cited (San José Spotlight interview)
- [x] Union executive role (Public records)

## Gaps Identified
- [ ] Exact sentencing date (needs PACER verification)
- [ ] Comparison to street-level cases (research in progress)

## Approval Status
- Verified by: [Name]
- Date: 2026-09-20
- Status: APPROVED with notes

## Notes
All Tier 1 and 2 claims verified. Tier 3 claims need secondary corroboration.
```

#### Update Episode Config

Update `EPISODE_CONFIG.json` status to reflect progress:

```json
{
  "status": "edited",
  "duration": {
    "actualRecorded": 14.2,
    "edited": 13.8
  },
  "airDate": "2026-09-27"
}
```

### Phase 9: Distribution

1. Create social media clips in `published-assets/social-clips/`
2. Generate transcription
3. Create show notes
4. Publish episode

---

## Status Tracking

Update episode status as you progress:

| Status | Meaning |
|--------|---------|
| `in-development` | Initial creation, research phase |
| `scripted` | Script generated and approved |
| `recorded` | Recording session complete |
| `edited` | Editing and mixing complete |
| `reviewed` | Fact-check and editorial review complete |
| `published` | Released to audience |
| `archived` | Previous version |

Update `EPISODE_CONFIG.json` status field as you progress.

---

## Multiple Episodes

When creating multiple episodes for a season:

1. **Series Config Once** — Set up `SERIES_CONFIG.json` once
2. **Repeat Episode Workflow** — Create episode directory + config for each episode
3. **Reuse Materials** — Common research materials, guest bios, etc. can be referenced from shared season folder
4. **Batch Production** — Generate scripts and briefs for multiple episodes at once

---

## Common Variations

### Hybrid Episodes (Fiction + True Crime)
Some episodes may blend real events with fictional reconstruction:

```json
{
  "hybrid": true,
  "factualBasis": ["PACER records", "news articles"],
  "fictionalElements": ["character dialogue reconstruction", "scene-setting details"],
  "disclosureRequired": true
}
```

### Guest-Heavy Episodes
Episodes focused on expert interviews:

```json
{
  "format": "interview-focused",
  "guests": [
    {
      "name": "Dr. Jane Smith",
      "role": "Criminal Justice Expert",
      "expertise": "federal sentencing disparities"
    }
  ],
  "mainNarratorMinutes": 5,
  "guestInterviewMinutes": 10
}
```

### Multi-Part Deep Dives
Longer investigations split across multiple episodes:

```json
{
  "seriesPart": "investigation-phase-1",
  "continuedInEpisode": 5,
  "requiresPriorEpisode": false
}
```

---

## Organizing Large Projects

For many-episode series, consider:

1. **Batch creation** — Create all episode directories at once
2. **Shared season materials** — Common research in season-level folder
3. **Template updates** — Update templates as you discover common needs
4. **Archive old versions** — Move outdated scripts to `archived/` subdirectory
5. **Metadata rollups** — Track series-wide metrics (total verified claims, gaps, etc.)

---

## Next Steps

1. **Create your first episode** — Use the configuration template above
2. **Gather research** — Collect sources in `source-materials/`
3. **Generate scripts** — Use the podcast scripting engine
4. **Coordinate guests** — See [Guest Coordination](./GUEST_COORDINATION.md)
5. **Track progress** — Update status and dates regularly

---

**Ready to coordinate guests?** Move on to [Guest Coordination](./GUEST_COORDINATION.md).
