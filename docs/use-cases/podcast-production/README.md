# Podcast Production Use Case

## Overview

The Podcast Production use case provides a complete workflow for creating episodic podcast series from character-based narratives. Whether you're adapting fictional underworld characters, fact-checked true crime cases, or hybrid narratives, this use case handles:

- **Series Architecture** — Branding, metadata, season/episode structure
- **Episode Development** — Scripts, producer briefs, guest materials
- **Guest Coordination** — Interview scripts, preparation materials, talking points
- **Output Organization** — Standardized directory structures for each episode
- **Reproducible Workflow** — Consistent methodology across multiple episodes and seasons

---

## When to Use This Use Case

Use Podcast Production when you are:

- ✅ Creating episodic content for a podcast series
- ✅ Producing multiple episodes with consistent branding
- ✅ Coordinating guests or expert interviews
- ✅ Generating scripts with segment timing and cues
- ✅ Organizing research, scripts, and assets across episodes
- ✅ Building a scalable, repeatable production workflow

Do NOT use this use case if you are:

- ❌ Writing a single narrative essay (use Fiction or True Crime instead)
- ❌ Creating one-off audio content without episodic structure
- ❌ Building a long-form narrative that doesn't break into episodes

---

## Core Components

### 1. Series Framework
A series is branded and configured once, then reused across all seasons and episodes.

**Includes:**
- Series name, slug, tagline, description
- Branding (colors, fonts, logos)
- Producer contact information
- Social media handles and website
- Common themes and investigative angles
- Target audience and tone

**Output:** `SERIES_CONFIG.json` in the series root directory

### 2. Episode Development
Each episode receives its own directory structure with organized subdirectories for every phase of production.

**Includes:**
- Episode metadata (number, season, title, description)
- Episode configuration and research materials
- Generated scripts (main script in JSON and Markdown)
- Producer briefs and talking points
- Guest materials and interview scripts

**Output:** Complete episode directory with subdirectories for scripts, assets, metadata, etc.

### 3. Guest Coordination
Materials for preparing guests and conducting interviews.

**Includes:**
- Guest scripts with conversation cues
- Background context and discussion topics
- Preparation checklists
- Expected runtime and segment breakdown
- Talking points and key facts

**Output:** Guest-specific scripts and preparation materials

### 4. Source Verification (True Crime Only)
When building from true crime cases, the podcast production workflow integrates with the True Crime use case for source verification.

**Includes:**
- Fact attribution tiers
- Source worksheets
- Verification status tracking
- Gap identification and escalation

**Output:** Source documentation within episode materials

---

## Directory Structure

Each episode creates a standardized directory tree:

```
output/
└── [series-slug]/
    ├── SERIES_CONFIG.json
    ├── season-1/
    │   ├── episode-1/
    │   │   ├── EPISODE_CONFIG.json
    │   │   ├── README.md
    │   │   ├── scripts/
    │   │   │   ├── main-script.json      # Structured script
    │   │   │   └── script.md             # Human-readable script
    │   │   ├── source-materials/
    │   │   │   ├── verification-worksheet.csv
    │   │   │   ├── court-documents/
    │   │   │   └── research-articles/
    │   │   ├── producer-briefs/
    │   │   │   ├── producer-brief.json   # Structured brief
    │   │   │   └── brief.md              # Human-readable brief
    │   │   ├── guest-materials/
    │   │   │   ├── guest-script.json     # Structured guest script
    │   │   │   ├── guest-script.md       # Human-readable guest script
    │   │   │   └── checklist-[guest-name].md
    │   │   ├── recording-guides/
    │   │   │   └── recording-session.md  # Timing and technical guide
    │   │   ├── assets/
    │   │   │   ├── images/
    │   │   │   ├── audio-clips/
    │   │   │   └── graphics/
    │   │   ├── published-assets/
    │   │   │   ├── episode-cover.png
    │   │   │   └── social-clips/
    │   │   ├── metadata/
    │   │   │   └── episode.json
    │   │   ├── reviews/
    │   │   │   └── fact-check-approval.md
    │   │   └── archived/
    │   │       └── [previous-versions]/
    │   ├── episode-2/
    │   └── [more episodes...]
    └── season-2/
        └── [episodes...]
```

---

## Typical Workflow

### Phase 1: Series Setup
1. Create series configuration with branding, producer info, social media handles
2. Define common themes and investigative angles
3. Establish target audience and episode format

### Phase 2: Episode Initialization
1. Create episode configuration with title, description, character/case reference
2. Gather source materials and research
3. Identify guest opportunities and interview angles

### Phase 3: Content Generation
1. Generate podcast script from character/case data
2. Generate producer brief with talking points
3. Generate guest script and preparation materials

### Phase 4: Production
1. Prepare recording guide with timing
2. Conduct guest interviews (if applicable)
3. Record main narration
4. Create audio assets and social clips

### Phase 5: Post-Production
1. Edit and mix audio
2. Conduct fact-checking review
3. Generate show notes and transcription
4. Prepare for distribution

---

## Key Features

### Reproducible Structure
Every episode follows the same directory structure, making it easy to:
- Find scripts, assets, and materials quickly
- Train new team members on the workflow
- Scale to multiple seasons with consistent organization

### Metadata Tracking
Each episode stores its own configuration and metadata:
- Episode number, season, title, description
- Character/case references
- Recording and air dates
- Source verification tier
- Production status

### Multi-Guest Support
Handle episodes with multiple guests:
- Separate guest scripts per guest
- Individual preparation checklists
- Guest-specific talking points

### Branding Flexibility
Series branding is configured once and applied across all episodes:
- Colors, fonts, logos
- Producer contact info
- Social media handles
- Website URL
- Custom themes and angles (can be overridden per episode)

### Source Integration
When building from fact-checked sources:
- Verification worksheets per episode
- Source attribution tiers
- Gap identification
- Escalation tracking

---

## Integration with Other Use Cases

### With True Crime
Combine True Crime's verification workflow with Podcast Production's structure:

```
True Crime Workflow (Verification)
    ↓
Generate scripts with source attribution
    ↓
Podcast Production (Organization & Scaling)
    ↓
Episode directories with producer briefs and guest materials
```

**Result:** Fact-checked, attributed, episodically organized podcast series

**Example:** "Insight Corruption" Bay Area corruption cases (see `output/insight-corruption/`)

### With Fiction
Create fictional podcast series with consistent character development:

```
Fiction Workflow (Character Development)
    ↓
Three-phase character profiles per episode
    ↓
Podcast Production (Organization & Scaling)
    ↓
Episodic series with consistent world-building
```

**Result:** Episodic fiction series with deep character development

**Example:** Fictional underworld anthology series

---

## Next Steps

1. **Learn the Framework:** Read [Series Framework](./SERIES_FRAMEWORK.md)
2. **Understand Episode Development:** Read [Episode Development Workflow](./EPISODE_DEVELOPMENT.md)
3. **Master Guest Coordination:** Read [Guest Coordination](./GUEST_COORDINATION.md)
4. **See It In Action:** Review [Examples](./EXAMPLES.md)
5. **Use the Templates:** Copy templates from [Templates](./TEMPLATES.md) to get started

---

## Document Guide

- **[SERIES_FRAMEWORK.md](./SERIES_FRAMEWORK.md)** — How to set up and configure a series
- **[EPISODE_DEVELOPMENT.md](./EPISODE_DEVELOPMENT.md)** — How to develop individual episodes
- **[GUEST_COORDINATION.md](./GUEST_COORDINATION.md)** — How to prepare and coordinate guests
- **[TEMPLATES.md](./TEMPLATES.md)** — Copy-paste configuration templates
- **[EXAMPLES.md](./EXAMPLES.md)** — Real-world example series and episodes

---

**Ready to build your podcast?** Start with [SERIES_FRAMEWORK.md](./SERIES_FRAMEWORK.md).
