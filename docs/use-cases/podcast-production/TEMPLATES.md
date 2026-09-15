# Configuration Templates

Copy-paste starting points for the files this use case's workflow expects. These
consolidate the inline examples already in
[SERIES_FRAMEWORK.md](./SERIES_FRAMEWORK.md) and
[EPISODE_DEVELOPMENT.md](./EPISODE_DEVELOPMENT.md) into one place; see those
documents for field-by-field explanations.

---

## SERIES_CONFIG.json

```json
{
  "seriesName": "",
  "seriesSlug": "",
  "description": "",
  "genre": "",
  "targetAudience": "",
  "podcastFormat": "single-part episodes",
  "episodeDuration": "",
  "verificationMode": "",
  "branding": { "primary": "#000000", "secondary": "#000000", "accent": "#000000" },
  "fonts": { "heading": "", "body": "" },
  "producer": { "name": "", "email": "" },
  "commonThemes": [],
  "investigativeAngles": [],
  "createdDate": "",
  "updatedDate": ""
}
```

## EPISODE_CONFIG.json

```json
{
  "episodeNumber": 1,
  "seasonNumber": 1,
  "title": "",
  "description": "",
  "characters": [],
  "location": "",
  "year": null,
  "tags": [],
  "sourceVerificationTier": null,
  "caseReference": "",
  "status": "in-development",
  "duration": { "estimated": null },
  "keyPoints": [],
  "investigativeAngles": [],
  "guestOpportunities": [],
  "factCheckLayers": [],
  "producerNotes": ""
}
```

## Length + sponsor-break block (add to EPISODE_CONFIG.json)

See [LENGTH_SPECIFICATIONS.md](../../LENGTH_SPECIFICATIONS.md) for the full
schema. Minimal single-part example:

```json
{
  "length": {
    "format": "single-part",
    "parts": [
      {
        "partNumber": 1,
        "duration": { "minimum": 0, "maximum": 0, "target": 0 },
        "sponsorBreaks": [
          { "position": "mid-roll", "lengthSeconds": 30 }
        ]
      }
    ]
  }
}
```

**Known limitation:** these length/sponsor-break fields are documentation and
planning metadata only. `src/podcast-script-generator.ts`'s `ScriptGenerator`
does not currently read this block or vary its output duration to match it —
see [EXAMPLES.md](./EXAMPLES.md) for how the Insight Corruption and Homeless
Lunchbox examples worked around that gap by hand.

## Non-true-crime / non-fiction formats

If your show isn't a narrated case/character episode (e.g. an interview show,
a review show, a roundtable), the `characters`/`caseReference` fields above
won't apply cleanly. Adapt rather than force-fit — see The Homeless Lunchbox
example in [EXAMPLES.md](./EXAMPLES.md) for a worked case of a cohost review
format using this same directory structure with those fields left empty or
repurposed (e.g. `hosts` instead of `characters`).
