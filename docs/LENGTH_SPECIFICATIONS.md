# Length Specifications Guide

Complete reference for specifying narrative and podcast episode lengths, including word counts, page counts, episode durations, and sponsor break scheduling.

---

## Overview

The Length Specifications system allows you to:

- **📖 Books & Narratives** — Define word count or page count ranges for chapters, novellas, novels, and serialized content
- **🎙️ Podcasts** — Specify episode lengths in minutes with sponsor break scheduling
- **⏱️ Time Estimates** — Convert between word count and reading/listening time
- **🎯 Production Planning** — Track recording, editing, and review time estimates

---

## Part 1: Narrative Length Specifications

### Overview

Use narrative length specifications for books, chapters, short stories, essays, and other written content. Specify length using either word count or page count, with min/max ranges.

### Word Count Specification

Define expected word count for a narrative:

```json
{
  "type": "book",
  "format": "print",
  "length": {
    "unit": "words",
    "minimum": 60000,
    "maximum": 80000,
    "target": 70000,
    "notes": "Novel-length underworld crime narrative"
  }
}
```

**Fields:**
- `minimum` — Shortest acceptable length (hard floor)
- `maximum` — Longest acceptable length (hard ceiling)
- `target` — Ideal/expected length (should be between min and max)
- `notes` — Context for this specification

### Page Count Specification

Define expected page count for print narratives:

```json
{
  "type": "book",
  "format": "print",
  "length": {
    "unit": "pages",
    "minimum": 200,
    "maximum": 300,
    "target": 250,
    "pageFormat": "trade-paperback",
    "wordsPerPage": 280,
    "notes": "Standard novel format"
  }
}
```

**Fields:**
- `pageFormat` — `letter`, `a4`, `trade-paperback`, `mass-market-paperback`
- `wordsPerPage` — Average words per page (for converting to word count)
- `linesPerPage` — For consistency checking

### Complete Narrative Example

```json
{
  "narrativeLengthSpec": {
    "type": "novel",
    "format": "both",
    "length": {
      "unit": "words",
      "minimum": 70000,
      "maximum": 90000,
      "target": 80000
    },
    "estimatedReadingTime": {
      "unit": "minutes",
      "minimum": 350,
      "maximum": 450,
      "wordsPerMinute": 200
    },
    "serializationSupport": {
      "episodic": true,
      "episodeCount": 8,
      "episodeLength": {
        "unit": "words",
        "minimum": 8000,
        "maximum": 12000,
        "target": 10000
      }
    }
  }
}
```

### Narrative Types

| Type | Typical Length | Use Case |
|------|---|---|
| `short-story` | 1,000 - 10,000 words | Short anthology entries |
| `essay` | 2,000 - 8,000 words | Narrative non-fiction |
| `novella` | 20,000 - 50,000 words | Shorter single narrative |
| `chapter` | 3,000 - 8,000 words | Individual book chapter |
| `book` | 50,000 - 120,000 words | Full novel or non-fiction |

---

## Part 2: Podcast Length Specifications

### Overview

Podcast length specifications define:

- Duration of each episode part (in minutes)
- Sponsor break timing and duration
- Content-only duration (excluding breaks)
- Production time estimates

### Basic Episode Length

Define single or multi-part episodes:

```json
{
  "episodeLength": {
    "format": "two-part",
    "parts": [
      {
        "partNumber": 1,
        "duration": {
          "minimum": 10,
          "maximum": 15,
          "target": 12
        },
        "sponsorBreaks": [
          {
            "position": "mid-roll",
            "lengthSeconds": 30,
            "scriptTemplate": "This episode is brought to you by [SPONSOR]..."
          }
        ],
        "contentDuration": {
          "minimum": 10,
          "maximum": 14.5,
          "target": 11.5
        }
      },
      {
        "partNumber": 2,
        "duration": {
          "minimum": 10,
          "maximum": 15,
          "target": 12
        },
        "sponsorBreaks": [
          {
            "position": "pre-roll",
            "lengthSeconds": 30
          }
        ],
        "contentDuration": {
          "minimum": 10,
          "maximum": 14.5,
          "target": 11.5
        }
      }
    ],
    "totalDuration": {
      "minimum": 20,
      "maximum": 30,
      "target": 24
    }
  }
}
```

### Sponsor Break Positions

| Position | Description | Typical Use |
|----------|---|---|
| `pre-roll` | Before episode starts | Host intro sponsor read |
| `mid-roll` | Middle of episode | Main sponsor break |
| `post-roll` | After episode ends | Call-to-action / secondary sponsor |
| `dynamic` | Producer decides | Flexible breaks during natural pauses |

### Sponsor Break Duration Guide

| Length | Type | Use Case |
|--------|------|----------|
| 15 sec | Announcement | Quick mention / cross-promotion |
| 30 sec | Standard read | Most common sponsor read |
| 60 sec | Full pitch | Deep sponsor integration |
| 90 sec | Extended | Multiple sponsors or long pitch |

### Multi-Part Episode Example

```json
{
  "format": "multi-part",
  "parts": [
    {
      "partNumber": 1,
      "duration": { "minimum": 8, "maximum": 12, "target": 10 },
      "sponsorBreaks": [
        { "position": "mid-roll", "lengthSeconds": 30 }
      ],
      "segments": [
        { "name": "Introduction", "estimatedDuration": 2 },
        { "name": "Case Background", "estimatedDuration": 5 },
        { "name": "Break", "estimatedDuration": 0.5 },
        { "name": "Deep Dive", "estimatedDuration": 2.5 }
      ]
    },
    {
      "partNumber": 2,
      "duration": { "minimum": 8, "maximum": 12, "target": 10 },
      "sponsorBreaks": [
        { "position": "post-roll", "lengthSeconds": 20 }
      ],
      "segments": [
        { "name": "Expert Analysis", "estimatedDuration": 4 },
        { "name": "Q&A", "estimatedDuration": 4 },
        { "name": "Closing", "estimatedDuration": 1.5 }
      ]
    },
    {
      "partNumber": 3,
      "duration": { "minimum": 5, "maximum": 8, "target": 6 },
      "sponsorBreaks": [],
      "segments": [
        { "name": "Listener Follow-up", "estimatedDuration": 4 },
        { "name": "Next Episode Teaser", "estimatedDuration": 1.5 }
      ]
    }
  ]
}
```

### Production Time Estimates

Include realistic production time for each episode:

```json
{
  "productionNotes": {
    "recordingTimePerEpisode": 2.5,    // hours
    "editingTimePerEpisode": 1.5,      // hours
    "reviewTimePerEpisode": 0.5,       // hours
    "totalProductionTimePerEpisode": 4.5 // hours
  }
}
```

**Typical Production Timelines:**

| Activity | Time | Notes |
|----------|------|-------|
| Recording | 1-3 hours | Includes breaks, retakes |
| Editing | 1-2 hours | Cutting, mixing, mastering |
| Fact-check review | 0.5-1 hour | For true crime content |
| Show notes | 0.5 hour | Creating and formatting |
| **Total per episode** | **3-6 hours** | Varies by complexity |

---

## Part 3: Series-Level Length Configuration

### Series Duration Specification

Define overall series length:

```json
{
  "seriesLength": {
    "episodeCount": 24,
    "seasonCount": 2,
    "episodeLength": {
      "format": "two-part",
      "parts": [
        {
          "duration": { "minimum": 10, "maximum": 15, "target": 12 }
        }
      ]
    },
    "sponsorBreaksPerEpisode": [
      { "position": "pre-roll", "lengthSeconds": 30 },
      { "position": "mid-roll", "lengthSeconds": 30 },
      { "position": "post-roll", "lengthSeconds": 20 }
    ],
    "totalSeriesDuration": {
      "minimum": 240,  // minutes for all 24 episodes
      "maximum": 360,
      "target": 288
    },
    "perSeasonDuration": {
      "minimum": 120,  // per season
      "maximum": 180,
      "target": 144
    }
  }
}
```

### Production Capacity Planning

```json
{
  "productionNotes": {
    "recordingTimePerEpisode": 2.5,
    "editingTimePerEpisode": 1.5,
    "reviewTimePerEpisode": 0.5,
    "totalProductionTimePerEpisode": 4.5,
    "totalSeriesProductionTime": 108  // 24 episodes × 4.5 hours
  }
}
```

---

## Part 4: Production Constraints

### Common Constraints

Define limitations on episode length:

```json
{
  "constraints": [
    {
      "type": "distribution",
      "description": "Spotify maximum episode length",
      "impact": "length-limit",
      "value": "180",
      "platform": "spotify",
      "notes": "Spotify recommends under 3 hours for best experience"
    },
    {
      "type": "technical",
      "description": "YouTube video length limit (free account)",
      "impact": "length-limit",
      "value": "720",
      "platform": "youtube",
      "notes": "Upgrade to verified account for longer uploads"
    },
    {
      "type": "business",
      "description": "Advertiser break frequency requirement",
      "impact": "break-frequency",
      "value": "every-15-minutes",
      "notes": "Minimum sponsor placement every 15 minutes of content"
    },
    {
      "type": "editorial",
      "description": "Guest interview maximum",
      "impact": "length-limit",
      "value": "45",
      "notes": "Expert interviews should not exceed 45 minutes total"
    }
  ]
}
```

### Platform-Specific Recommendations

| Platform | Recommended Length | Max Length | Notes |
|----------|---|---|---|
| Spotify | 30-60 min | 180 min | Longer content less discoverable |
| Apple Podcasts | 20-60 min | No limit | Consistent length builds habit |
| YouTube | 10-60 min | 12 hours | Verified accounts only |
| RSS Feed | Any | Any | Host dependent |

---

## Part 5: Practical Examples

### Example 1: Two-Part Crime Podcast

```json
{
  "episodeNumber": 1,
  "title": "The Union Boss Who Smuggled Opioids",
  "format": "two-part",
  "episodeLength": {
    "format": "two-part",
    "parts": [
      {
        "partNumber": 1,
        "duration": { "minimum": 8, "maximum": 12, "target": 10 },
        "sponsorBreaks": [
          { "position": "mid-roll", "lengthSeconds": 30 }
        ],
        "contentDuration": { "minimum": 8, "maximum": 11.5, "target": 9.5 },
        "segments": [
          { "name": "Hook", "estimatedDuration": 1 },
          { "name": "Case Background", "estimatedDuration": 3 },
          { "name": "Sponsor Break", "estimatedDuration": 0.5 },
          { "name": "Investigation Details", "estimatedDuration": 5 }
        ]
      },
      {
        "partNumber": 2,
        "duration": { "minimum": 8, "maximum": 12, "target": 10 },
        "sponsorBreaks": [
          { "position": "post-roll", "lengthSeconds": 20 }
        ],
        "contentDuration": { "minimum": 8, "maximum": 11.67, "target": 9.67 },
        "segments": [
          { "name": "Deep Analysis", "estimatedDuration": 4 },
          { "name": "Expert Commentary", "estimatedDuration": 3 },
          { "name": "Closing", "estimatedDuration": 1 }
        ]
      }
    ],
    "totalDuration": { "minimum": 16, "maximum": 24, "target": 20 }
  },
  "productionNotes": {
    "recordingTimePerEpisode": 2.5,
    "editingTimePerEpisode": 1.5,
    "reviewTimePerEpisode": 0.5
  }
}
```

### Example 2: Book with Episodic Adaptation

```json
{
  "narrativeLengthSpec": {
    "type": "book",
    "format": "both",
    "length": {
      "unit": "words",
      "minimum": 70000,
      "maximum": 90000,
      "target": 80000
    },
    "estimatedReadingTime": {
      "unit": "minutes",
      "minimum": 350,
      "maximum": 450,
      "wordsPerMinute": 200
    },
    "serializationSupport": {
      "episodic": true,
      "episodeCount": 8,
      "episodeLength": {
        "unit": "words",
        "minimum": 8000,
        "maximum": 12000,
        "target": 10000
      }
    }
  }
}
```

### Example 3: Series Configuration with Constraints

```json
{
  "seriesLength": {
    "episodeCount": 10,
    "seasonCount": 1,
    "episodeLength": {
      "format": "two-part",
      "parts": [
        { "duration": { "minimum": 10, "maximum": 15, "target": 12 } },
        { "duration": { "minimum": 10, "maximum": 15, "target": 12 } }
      ],
      "totalDuration": { "minimum": 20, "maximum": 30, "target": 24 }
    },
    "sponsorBreaksPerEpisode": [
      { "position": "pre-roll", "lengthSeconds": 30 },
      { "position": "mid-roll", "lengthSeconds": 30 },
      { "position": "post-roll", "lengthSeconds": 20 }
    ],
    "totalSeriesDuration": {
      "minimum": 200,
      "maximum": 300,
      "target": 240
    }
  },
  "constraints": [
    {
      "type": "distribution",
      "description": "Spotify episode length preference",
      "impact": "length-limit",
      "value": "180",
      "platform": "spotify"
    },
    {
      "type": "business",
      "description": "Sponsor placement requirement",
      "impact": "break-frequency",
      "value": "every-15-minutes"
    }
  ]
}
```

---

## Part 6: Helper Functions

The framework includes helper functions for common calculations:

### Convert Words to Minutes

```javascript
import { wordsToMinutes, minutesToWords } from '@h4shed/skill-underworld-writer';

// 10,000 words at 225 wpm = ~44 minutes
const readingMinutes = wordsToMinutes(10000, 225); // 44

// 20 minutes at 225 wpm = ~4,500 words
const estimatedWords = minutesToWords(20, 225); // 4,500
```

### Calculate Podcast Duration with Breaks

```javascript
import { calculatePodcastDuration } from '@h4shed/skill-underworld-writer';

const breaks = [
  { position: 'mid-roll', lengthSeconds: 30 },
  { position: 'post-roll', lengthSeconds: 20 }
];

const duration = calculatePodcastDuration(20, breaks);
// Returns: { content: 20, breaks: 0.83, total: 20.83 }
```

### Generate Break Schedule

```javascript
import { generateBreakSchedule } from '@h4shed/skill-underworld-writer';

const breaks = [
  { position: 'pre-roll', lengthSeconds: 30 },
  { position: 'mid-roll', lengthSeconds: 30 },
  { position: 'post-roll', lengthSeconds: 20 }
];

const schedule = generateBreakSchedule(24, breaks);
// Returns:
// [
//   { timeMarker: 0, breakSpec: {...} },   // pre-roll at start
//   { timeMarker: 12, breakSpec: {...} },  // mid-roll at 12 min
//   { timeMarker: 24, breakSpec: {...} }   // post-roll at end
// ]
```

---

## Part 7: Integration with Podcast Production

### Using Length Specs in Episode Config

Update your episode configuration to include length specifications:

```json
{
  "episodeNumber": 1,
  "seasonNumber": 1,
  "title": "The Union Boss Who Smuggled Opioids",
  "description": "...",
  "length": {
    "format": "two-part",
    "parts": [
      {
        "duration": { "minimum": 10, "maximum": 12, "target": 11 },
        "sponsorBreaks": [
          { "position": "mid-roll", "lengthSeconds": 30 }
        ]
      },
      {
        "duration": { "minimum": 10, "maximum": 12, "target": 11 },
        "sponsorBreaks": [
          { "position": "post-roll", "lengthSeconds": 20 }
        ]
      }
    ]
  },
  "productionTeam": {
    "host": "Producer Name",
    "producer": "Name",
    "editor": "Name"
  },
  "productionNotes": {
    "recordingTime": 2.5,
    "editingTime": 1.5,
    "reviewTime": 0.5
  }
}
```

### Creating EPISODE_LENGTH_CONFIG.json

Store episode length specifications alongside episode configuration:

```
output/[series-slug]/season-1/episode-1/
├── EPISODE_CONFIG.json
├── EPISODE_LENGTH_CONFIG.json     # NEW
├── scripts/
├── producer-briefs/
└── ...
```

---

## Part 8: Best Practices

### ✅ DO

- ✅ Set realistic **target** values between min and max
- ✅ Test your sponsor breaks in actual recording to verify timing
- ✅ Track actual vs. estimated production time to improve accuracy
- ✅ Allow 5-10% buffer in length estimates for editing variations
- ✅ Document constraints specific to your distribution platforms

### ❌ DON'T

- ❌ Set impossible minimums (e.g., 30 min minimum for 20 min episode)
- ❌ Ignore sponsor break time when calculating content duration
- ❌ Assume consistent reading speed across all audiences
- ❌ Plan production time without accounting for reviews and approvals
- ❌ Forget platform-specific length recommendations

---

## Next Steps

1. **Create length specifications** for your narratives or podcast series
2. **Store configs** in appropriate directories alongside project files
3. **Use helper functions** for time/word conversions
4. **Track actual vs. estimated** times to improve future planning
5. **Adjust constraints** based on your platform requirements

---

**See also:**
- [Podcast Production README](./use-cases/podcast-production/README.md)
- [Episode Development Workflow](./use-cases/podcast-production/EPISODE_DEVELOPMENT.md)
- [Narrative Development Guide](./use-cases/fiction/README.md)
