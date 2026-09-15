# Length Specification Templates

Copy-paste templates for common narrative and podcast configurations.

---

## Podcast Templates

### Template 1: Standard Two-Part Episode (6-8 min per part)

```json
{
  "episodeNumber": 1,
  "seasonNumber": 1,
  "title": "[Episode Title]",
  "description": "[Episode description]",
  "length": {
    "format": "two-part",
    "parts": [
      {
        "partNumber": 1,
        "duration": {
          "minimum": 6,
          "maximum": 8,
          "target": 7
        },
        "sponsorBreaks": [
          {
            "position": "mid-roll",
            "lengthSeconds": 30,
            "scriptTemplate": "This episode is brought to you by [SPONSOR]..."
          }
        ],
        "contentDuration": {
          "minimum": 6,
          "maximum": 7.5,
          "target": 6.5
        },
        "segments": [
          {
            "name": "Hook/Introduction",
            "estimatedDuration": 1
          },
          {
            "name": "Main Content",
            "estimatedDuration": 4
          },
          {
            "name": "Sponsor Break",
            "estimatedDuration": 0.5
          },
          {
            "name": "Content Wrap-up",
            "estimatedDuration": 1.5
          }
        ]
      },
      {
        "partNumber": 2,
        "duration": {
          "minimum": 6,
          "maximum": 8,
          "target": 7
        },
        "sponsorBreaks": [
          {
            "position": "post-roll",
            "lengthSeconds": 20
          }
        ],
        "contentDuration": {
          "minimum": 6,
          "maximum": 7.67,
          "target": 6.83
        },
        "segments": [
          {
            "name": "Deep Dive",
            "estimatedDuration": 4
          },
          {
            "name": "Expert Commentary",
            "estimatedDuration": 2
          },
          {
            "name": "Closing",
            "estimatedDuration": 1
          }
        ]
      }
    ],
    "totalDuration": {
      "minimum": 12,
      "maximum": 16,
      "target": 14
    }
  },
  "productionTeam": {
    "host": "[Your Name]",
    "producer": "[Producer Name]",
    "engineer": "[Engineer Name]",
    "editor": "[Editor Name]",
    "fact_checker": "[Fact Checker Name]"
  },
  "productionNotes": {
    "recordingTime": 2.5,
    "editingTime": 1.5,
    "reviewTime": 0.5,
    "totalProductionTime": 4.5
  }
}
```

### Template 2: Long-Form Single Episode (30-45 min)

```json
{
  "episodeNumber": 1,
  "seasonNumber": 1,
  "title": "[Episode Title]",
  "length": {
    "format": "single-part",
    "parts": [
      {
        "partNumber": 1,
        "duration": {
          "minimum": 30,
          "maximum": 45,
          "target": 37
        },
        "sponsorBreaks": [
          {
            "position": "pre-roll",
            "lengthSeconds": 30
          },
          {
            "position": "mid-roll",
            "lengthSeconds": 30
          },
          {
            "position": "post-roll",
            "lengthSeconds": 20
          }
        ],
        "contentDuration": {
          "minimum": 29,
          "maximum": 44,
          "target": 36
        },
        "segments": [
          {
            "name": "Introduction",
            "estimatedDuration": 2
          },
          {
            "name": "Main Story Part 1",
            "estimatedDuration": 8
          },
          {
            "name": "Sponsor Break 1",
            "estimatedDuration": 0.5
          },
          {
            "name": "Main Story Part 2",
            "estimatedDuration": 10
          },
          {
            "name": "Sponsor Break 2",
            "estimatedDuration": 0.5
          },
          {
            "name": "Analysis & Closing",
            "estimatedDuration": 8
          }
        ]
      }
    ],
    "totalDuration": {
      "minimum": 30,
      "maximum": 45,
      "target": 37
    }
  },
  "productionNotes": {
    "recordingTime": 3,
    "editingTime": 2,
    "reviewTime": 1
  }
}
```

### Template 3: Three-Part Deep Dive

```json
{
  "episodeNumber": 1,
  "seasonNumber": 1,
  "title": "[Multi-Part Investigation Title]",
  "length": {
    "format": "multi-part",
    "parts": [
      {
        "partNumber": 1,
        "duration": {
          "minimum": 8,
          "maximum": 12,
          "target": 10
        },
        "sponsorBreaks": [
          {
            "position": "mid-roll",
            "lengthSeconds": 30
          }
        ],
        "segments": [
          {
            "name": "Hook",
            "estimatedDuration": 1
          },
          {
            "name": "Background",
            "estimatedDuration": 5
          },
          {
            "name": "Sponsor",
            "estimatedDuration": 0.5
          },
          {
            "name": "Setup",
            "estimatedDuration": 3
          }
        ]
      },
      {
        "partNumber": 2,
        "duration": {
          "minimum": 8,
          "maximum": 12,
          "target": 10
        },
        "sponsorBreaks": [
          {
            "position": "pre-roll",
            "lengthSeconds": 30
          }
        ],
        "segments": [
          {
            "name": "Deep Analysis",
            "estimatedDuration": 5
          },
          {
            "name": "Interview/Expert",
            "estimatedDuration": 4
          },
          {
            "name": "Implications",
            "estimatedDuration": 1
          }
        ]
      },
      {
        "partNumber": 3,
        "duration": {
          "minimum": 6,
          "maximum": 10,
          "target": 8
        },
        "sponsorBreaks": [
          {
            "position": "post-roll",
            "lengthSeconds": 20
          }
        ],
        "segments": [
          {
            "name": "Wrap-up Analysis",
            "estimatedDuration": 4
          },
          {
            "name": "Listener Questions",
            "estimatedDuration": 2
          },
          {
            "name": "Next Episode Teaser",
            "estimatedDuration": 1
          }
        ]
      }
    ],
    "totalDuration": {
      "minimum": 22,
      "maximum": 34,
      "target": 28
    }
  },
  "productionNotes": {
    "recordingTime": 3,
    "editingTime": 2,
    "reviewTime": 1
  }
}
```

---

## Series Configuration Templates

### Template 1: 10-Episode Season (Two-Part Format)

```json
{
  "seriesName": "[Series Name]",
  "seriesSlug": "[series-slug]",
  "episodeCount": 10,
  "seasonCount": 1,
  "episodeLength": {
    "format": "two-part",
    "parts": [
      {
        "duration": {
          "minimum": 10,
          "maximum": 15,
          "target": 12
        },
        "sponsorBreaks": [
          {
            "position": "mid-roll",
            "lengthSeconds": 30
          }
        ]
      },
      {
        "duration": {
          "minimum": 10,
          "maximum": 15,
          "target": 12
        },
        "sponsorBreaks": [
          {
            "position": "post-roll",
            "lengthSeconds": 20
          }
        ]
      }
    ],
    "totalDuration": {
      "minimum": 20,
      "maximum": 30,
      "target": 24
    }
  },
  "sponsorBreaksPerEpisode": [
    {
      "position": "pre-roll",
      "lengthSeconds": 30,
      "notes": "Intro sponsor/host read"
    },
    {
      "position": "mid-roll",
      "lengthSeconds": 30,
      "notes": "Main sponsor break"
    },
    {
      "position": "post-roll",
      "lengthSeconds": 20,
      "notes": "Call-to-action / secondary"
    }
  ],
  "totalSeriesDuration": {
    "minimum": 200,
    "maximum": 300,
    "target": 240
  },
  "productionNotes": {
    "recordingTimePerEpisode": 2.5,
    "editingTimePerEpisode": 1.5,
    "reviewTimePerEpisode": 0.5,
    "totalProductionTimePerEpisode": 4.5,
    "totalSeriesProductionTime": 45
  },
  "constraints": [
    {
      "type": "distribution",
      "description": "Spotify recommendation",
      "impact": "length-limit",
      "value": "180",
      "platform": "spotify",
      "notes": "Prefer episodes under 3 hours for discoverability"
    },
    {
      "type": "business",
      "description": "Sponsor placement frequency",
      "impact": "break-frequency",
      "value": "every-15-minutes",
      "notes": "Main sponsor break every 15 minutes of content"
    }
  ]
}
```

### Template 2: 24-Episode Series (Two Seasons)

```json
{
  "seriesName": "[Series Name]",
  "seriesSlug": "[series-slug]",
  "episodeCount": 24,
  "seasonCount": 2,
  "episodeLength": {
    "format": "two-part",
    "parts": [
      {
        "duration": {
          "minimum": 8,
          "maximum": 12,
          "target": 10
        }
      },
      {
        "duration": {
          "minimum": 8,
          "maximum": 12,
          "target": 10
        }
      }
    ],
    "totalDuration": {
      "minimum": 16,
      "maximum": 24,
      "target": 20
    }
  },
  "totalSeriesDuration": {
    "minimum": 384,
    "maximum": 576,
    "target": 480
  },
  "perSeasonDuration": {
    "minimum": 192,
    "maximum": 288,
    "target": 240
  },
  "productionNotes": {
    "recordingTimePerEpisode": 2.5,
    "editingTimePerEpisode": 1.5,
    "reviewTimePerEpisode": 0.5,
    "totalProductionTimePerEpisode": 4.5,
    "totalSeriesProductionTime": 108
  }
}
```

---

## Narrative Templates

### Template 1: Novel Length Specification

```json
{
  "narrativeLengthSpec": {
    "type": "book",
    "format": "both",
    "length": {
      "unit": "words",
      "minimum": 70000,
      "maximum": 90000,
      "target": 80000,
      "notes": "Standard novel length for underworld crime narrative"
    },
    "estimatedReadingTime": {
      "unit": "minutes",
      "minimum": 350,
      "maximum": 450,
      "wordsPerMinute": 200,
      "notes": "Assumes 200 wpm average reading speed"
    },
    "serializationSupport": {
      "episodic": true,
      "episodeCount": 8,
      "episodeLength": {
        "unit": "words",
        "minimum": 8000,
        "maximum": 12000,
        "target": 10000,
        "notes": "Can be serialized in 8-part podcast or web serial"
      }
    }
  }
}
```

### Template 2: Novella Specification

```json
{
  "narrativeLengthSpec": {
    "type": "novella",
    "format": "digital",
    "length": {
      "unit": "words",
      "minimum": 20000,
      "maximum": 50000,
      "target": 35000,
      "notes": "Digital-first novella"
    },
    "estimatedReadingTime": {
      "unit": "minutes",
      "minimum": 100,
      "maximum": 250,
      "wordsPerMinute": 200
    }
  }
}
```

### Template 3: Serialized Chapter Specification

```json
{
  "narrativeLengthSpec": {
    "type": "chapter",
    "format": "digital",
    "length": {
      "unit": "words",
      "minimum": 3000,
      "maximum": 5000,
      "target": 4000,
      "notes": "Weekly serialized chapter for web/email"
    },
    "estimatedReadingTime": {
      "unit": "minutes",
      "minimum": 15,
      "maximum": 25,
      "wordsPerMinute": 200
    }
  }
}
```

---

## Sponsor Break Script Templates

### 30-Second Read

```
This episode is brought to you by [SPONSOR NAME]. [SPONSOR PITCH - 2-3 sentences about their product/service]. Visit [URL] today to get [OFFER] and support our show. That's [URL].
```

### 60-Second Read

```
This episode is brought to you by [SPONSOR NAME], the [PRODUCT CATEGORY] trusted by [AUDIENCE].

[DETAILED PRODUCT DESCRIPTION - 2-3 sentences].

[SPECIFIC BENEFIT] means you can [LISTENER BENEFIT]. And right now, [SPECIAL OFFER].

Visit [URL] and use code [CODE] for [DISCOUNT/OFFER]. That's [URL] with code [CODE].

Thank you to [SPONSOR NAME] for supporting [SHOW NAME].
```

---

## Quick Reference

| Format | Min Length | Max Length | Target | Sponsor Breaks |
|--------|---|---|---|---|
| Short episode | 6 min | 10 min | 8 min | 1 (30s) |
| Standard 2-part | 10 min | 15 min | 12 min | 1-2 (30-60s) |
| Long episode | 20 min | 30 min | 25 min | 2-3 (30-60s) |
| Deep dive (3-part) | 8-10 min | 12-15 min | 10-12 min | 1 per part |
| **Novella** | 20K | 50K | 35K | N/A |
| **Novel** | 70K | 90K | 80K | N/A |

---

**See also:** [LENGTH_SPECIFICATIONS.md](./LENGTH_SPECIFICATIONS.md) for complete guide
