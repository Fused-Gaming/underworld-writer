# Series Framework: Building Branded Podcast Series

This document explains how to set up a podcast series with consistent branding, metadata, and configuration that carries forward to all episodes.

---

## Series Fundamentals

A series is the top-level organizational unit that defines:

- **Branding:** Name, colors, fonts, logos, visual identity
- **Distribution:** Website, social media, producer contact info
- **Audience:** Target listeners, tone, format
- **Content:** Genre, common themes, investigative angles
- **Metadata:** Created date, update date, maintainers

All episodes within a series inherit the series configuration and can override specific elements if needed.

---

## Series Naming and Structure

### Series Slug
Every series has a unique slug—a lowercase, hyphenated identifier used in file paths:

- ✅ Good: `corruption-insight`, `underworld-tales`, `tech-crimes`
- ❌ Bad: `Corruption Insight`, `corruption_insight`, `corruption-in-sight`

The slug appears in the directory structure:
```
output/
└── [series-slug]/
    ├── SERIES_CONFIG.json
    ├── season-1/
    │   └── episode-1/
    └── season-2/
```

### Series Name
A human-readable series name, typically 1-4 words:

- `Corruption Insight`
- `Underworld Tales`
- `Tech Crimes Unraveled`

---

## Series Configuration

### SERIES_CONFIG.json

Every series requires a `SERIES_CONFIG.json` file at the series root. This file is the single source of truth for series-wide settings.

**Location:**
```
output/[series-slug]/SERIES_CONFIG.json
```

**Required Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `seriesName` | string | Human-readable series name |
| `seriesSlug` | string | Lowercase, hyphenated identifier |
| `description` | string | 1-3 sentence series overview |
| `genre` | string | Category: `true-crime-investigative`, `fictional-anthology`, `underworld-mythology`, etc. |
| `targetAudience` | string | Who you're making this for |
| `podcastFormat` | string | `single-part` or `two-part` episodes |
| `episodeDuration` | string | Expected length: `10-15 minutes`, `45-60 minutes`, etc. |

**Branding Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `branding.primary` | hex color | Primary brand color (e.g., `#D32F2F`) |
| `branding.secondary` | hex color | Secondary accent color |
| `branding.accent` | hex color | Highlight/emphasis color |
| `fonts.heading` | string | Font for titles: `Inter`, `Playfair`, `Roboto`, etc. |
| `fonts.body` | string | Font for body text |

**Producer Information:**

| Field | Type | Description |
|-------|------|-------------|
| `producer.name` | string | Producer or team name |
| `producer.email` | string | Contact email |
| `producer.phone` | string (optional) | Contact phone |

**Distribution:**

| Field | Type | Description |
|-------|------|-------------|
| `website` | URL | Series website or landing page |
| `socialMedia.twitter` | string | Twitter handle (with or without @) |
| `socialMedia.instagram` | string | Instagram handle |
| `socialMedia.linkedin` | string | LinkedIn profile/page |
| `socialMedia.tiktok` | string | TikTok handle |

**Content Configuration:**

| Field | Type | Description |
|-------|------|-------------|
| `commonThemes` | string[] | Recurring themes across episodes |
| `investigativeAngles` | string[] | Key questions or angles the series explores |
| `verificationMode` | string | For true crime: `pacer-records-and-published-sources`, `published-sources-only`, etc. |

**Metadata:**

| Field | Type | Description |
|-------|------|-------------|
| `createdDate` | ISO 8601 | When the series was created |
| `updatedDate` | ISO 8601 | Last update date |

### Example SERIES_CONFIG.json

```json
{
  "seriesName": "Corruption Insight",
  "seriesSlug": "corruption-insight",
  "description": "Investigative true-crime podcast revealing California Bay Area scandals where powerful individuals escaped justice through legal maneuvering, connections, and systemic failures",
  "genre": "true-crime-investigative",
  "targetAudience": "Listeners interested in government accountability, legal system analysis, and Bay Area corruption",
  "podcastFormat": "two-part episodes",
  "episodeDuration": "6-8 minutes per part",
  "verificationMode": "pacer-records-and-published-sources",
  "branding": {
    "primary": "#D32F2F",
    "secondary": "#424242",
    "accent": "#FFA726"
  },
  "fonts": {
    "heading": "Inter",
    "body": "Inter"
  },
  "producer": {
    "email": "producer@insightcorruption.local",
    "phone": "+1-555-INSIGHT",
    "name": "Investigation Team"
  },
  "website": "https://insightcorruption.local",
  "socialMedia": {
    "twitter": "@InsightCorrupt",
    "instagram": "@InsightCorruption",
    "linkedin": "insight-corruption-podcast"
  },
  "commonThemes": [
    "Legal system failures allowing wealthy/connected individuals to escape consequences",
    "Restitution used as a replacement for prison time",
    "Public service records cited to minimize sentences for federal crimes",
    "Bay Area's systemic corruption across government agencies",
    "The two-tiered justice system revealed through sentencing disparities"
  ],
  "investigativeAngles": [
    "Why addiction narratives reduce sentences for drug smuggling",
    "How restitution can replace prison time for embezzlement",
    "What makes a 14-year bribery scheme worth only 13 months"
  ],
  "createdDate": "2026-09-15",
  "updatedDate": "2026-09-15"
}
```

---

## Series Hierarchy

### Seasons
Series are organized by season. Each season contains one or more episodes:

```
output/[series-slug]/
├── season-1/
│   ├── episode-1/
│   ├── episode-2/
│   └── episode-3/
└── season-2/
    ├── episode-1/
    └── episode-2/
```

### Episodes
Each episode is a self-contained directory with its own configuration and all production materials.

Each season can have:
- Multiple episodes
- Its own themes or focus (optional)
- Shared assets or reference materials (optional)

---

## Series Setup Workflow

### Step 1: Create Series Slug and Directory

```bash
mkdir -p output/[series-slug]/season-1
```

### Step 2: Create SERIES_CONFIG.json

Use the template above, filling in your series details.

### Step 3: Create Series README (Optional)

Create an optional `README.md` at the series root with series overview, episode list, etc.

```
output/[series-slug]/README.md
```

### Step 4: Create Season Directories

Create directories for each season:

```bash
mkdir -p output/[series-slug]/season-1
mkdir -p output/[series-slug]/season-2
```

### Step 5: Initialize First Episode

See [Episode Development Workflow](./EPISODE_DEVELOPMENT.md) to create your first episode.

---

## Branding Guidelines

### Color Scheme
Define three colors for your series:

- **Primary:** Main brand color (used for logos, headers, key elements)
- **Secondary:** Neutral or complementary color (backgrounds, text)
- **Accent:** Highlight color (CTAs, emphasis, alerts)

**Example:**
- Primary: `#D32F2F` (red) — for crime/investigation urgency
- Secondary: `#424242` (dark gray) — professional, neutral background
- Accent: `#FFA726` (orange) — warning/emphasis

### Fonts
Choose readable fonts appropriate to your genre:

- **Heading fonts:** `Inter`, `Playfair Display`, `Roboto`, `Montserrat`
- **Body fonts:** `Inter`, `Open Sans`, `Lato`, `Source Sans Pro`

**Note:** These are logical names; actual font implementation is handled by your publishing platform.

### Social Media Consistency
Use consistent handles and branding across platforms:

- ✅ Same handle format across platforms (`@InsightCorrupt` on Twitter and TikTok)
- ✅ Consistent profile photo/logo across platforms
- ✅ Matching bio/description language
- ✅ Same brand colors in graphics and videos

---

## Customizing per Episode (Optional)

Episodes can override specific series settings:

```json
// episode-config.json
{
  "episodeNumber": 5,
  "title": "Special Investigation",
  "overrideBranding": {
    "accent": "#1976D2"  // Different accent color for this episode
  },
  "specialThemes": [
    "Theme specific to this episode"
  ]
}
```

**Note:** Overrides are optional. Most episodes will inherit series branding and themes.

---

## Multi-Series Setup

If you're running multiple podcast series, repeat this process for each:

```
output/
├── corruption-insight/
│   ├── SERIES_CONFIG.json
│   └── season-1/
├── tech-crimes/
│   ├── SERIES_CONFIG.json
│   └── season-1/
└── underworld-tales/
    ├── SERIES_CONFIG.json
    └── season-1/
```

Each series has its own:
- Configuration file
- Branding
- Directory structure
- Target audience
- Production settings

---

## Maintenance and Updates

### Updating Series Config
When you change series-wide settings:

1. Edit `SERIES_CONFIG.json`
2. Update the `updatedDate` field
3. Re-generate episodes or update manually (episodes inherit series config unless overridden)

### Documenting Changes
Keep a changelog in series README:

```markdown
## Version History

### v1.1 (2026-09-20)
- Changed primary color from #D32F2F to #C62828 (darker red)
- Added LinkedIn to social media
- Expanded common themes

### v1.0 (2026-09-15)
- Initial series launch
- 5 episodes in season 1
```

---

## Next Steps

1. **Create your series directory and config** — Use the template above
2. **Develop your first episode** — See [Episode Development Workflow](./EPISODE_DEVELOPMENT.md)
3. **Coordinate guests** (if applicable) — See [Guest Coordination](./GUEST_COORDINATION.md)
4. **Review examples** — See [Examples](./EXAMPLES.md) for real-world setups

---

**Ready for the next phase?** Move on to [Episode Development Workflow](./EPISODE_DEVELOPMENT.md).
