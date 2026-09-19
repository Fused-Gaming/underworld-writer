# Episode Publishing Schema — Books, Series, Seasons, Episodes, Authors/Hosts

Addresses [#7](https://github.com/Fused-Gaming/underworld-writer/issues/7): a structured
schema for documenting every book, podcast series, season, episode, and
author/host attribute, plus a **post** (show notes/publish) and **scheduled
air date** for each episode.

This schema sits on top of the existing `ScriptOutput` / `ProducerBrief`
types in `src/podcast-types.ts` — it does not change script generation, it
adds the metadata layer needed to schedule and publish what that engine
produces. It is also additive to the existing on-disk conventions in
`output/<project>/season-N/episode-N/EPISODE_CONFIG.json` and
`projects/<project>/PROJECT_MANIFEST.json`, neither of which currently has
a publish/air-date field or an Author/Host/Book entity — this proposal
introduces both without breaking those existing files.

---

## 1. Entity Model

```
Book (optional, true-crime/fiction source material)
 └─ Podcast Series
     └─ Season
         └─ Episode
             ├─ Author/Host attributes
             ├─ Post (show notes / publish record)
             └─ Scheduled air date
```

### 1.1 Book

| Field | Type | Notes |
|---|---|---|
| `id` | string | slug, e.g. `shadowcrew-chronicles` |
| `title` | string | |
| `author` | string | matches Author entity `id` |
| `isbn` | string? | optional |
| `sourceType` | `fiction` \| `true-crime` | maps to existing use-case pathways |
| `relatedSeriesIds` | string[] | podcast series adapted from this book |

### 1.2 Podcast Series

| Field | Type | Notes |
|---|---|---|
| `id` | string | slug |
| `title` | string | |
| `description` | string | |
| `bookId` | string? | source book, if adapted |
| `hosts` | Author[] | see §2 |
| `seasons` | Season[] | |

### 1.3 Season

| Field | Type | Notes |
|---|---|---|
| `id` | string | e.g. `s1` |
| `seasonNumber` | integer | |
| `title` | string | |
| `episodes` | Episode[] | |
| `premiereDate` | ISO date | first episode's `scheduledAirDate` |
| `finaleDate` | ISO date | last episode's `scheduledAirDate` |

### 1.4 Episode

| Field | Type | Notes |
|---|---|---|
| `id` | string | e.g. `s1e01` |
| `episodeNumber` | integer | |
| `title` | string | |
| `format` | `single` \| `two-part` | matches `ScriptOutput.format` |
| `characterId` | string | links to `SAMPLE_DATA.md` / character JSON |
| `scriptOutputRef` | string | path/ref to generated `ScriptOutput` |
| `guestHostIds` | string[] | Author/Host entities appearing as guests |
| `post` | Post | see §3 |
| `scheduledAirDate` | ISO 8601 datetime | when the episode goes live |
| `recordingDate` | ISO date? | |
| `status` | `draft` \| `scripted` \| `recorded` \| `edited` \| `scheduled` \| `published` | |

### 1.5 Author / Host

| Field | Type | Notes |
|---|---|---|
| `id` | string | slug |
| `name` | string | |
| `role` | `author` \| `host` \| `co-host` \| `guest` | |
| `bio` | string | |
| `voiceProfileId` | string? | reference to a trained voice model (see `AUDIO_GENERATION_PLAN.md`) |
| `socialLinks` | string[] | |

---

## 2. Post (show notes / publish record)

Each episode carries one `Post` — the text that accompanies its release
(show notes, social copy, RSS description):

| Field | Type | Notes |
|---|---|---|
| `title` | string | headline for the episode |
| `summary` | string | 1-2 sentence teaser |
| `showNotes` | string (markdown) | derived from `ProducerBrief` |
| `keyFacts` | string[] | pulled from `ProducerBrief.keyFacts` |
| `tags` | string[] | |
| `publishedAt` | ISO 8601 datetime? | set once actually live; null while scheduled |
| `platformLinks` | `{ platform: string; url: string }[]` | Spotify/Apple/YouTube etc., filled in after publish |

`Post.publishedAt` is distinct from `Episode.scheduledAirDate`: the latter
is the plan, the former is the confirmed, live timestamp.

---

## 3. Sample: Season 1 Episode Schedule

Derived from the existing `SAMPLE_DATA.md` characters and the true-crime
example in `examples/`. Dates are illustrative — adjust to the real release
cadence (weekly, Tuesdays, 09:00 ET, used below).

| Episode | Title | Format | Status | Scheduled Air Date | Post |
|---|---|---|---|---|---|
| S1E01 | "The Shadow Weaver's Bargain" — Morrigan Blackthorn | single | scheduled | 2026-10-06T13:00:00Z | draft show notes attached |
| S1E02 | "The Midnight Apprentice" — Theron Nightborn (Part 1) | two-part | scheduled | 2026-10-13T13:00:00Z | draft show notes attached |
| S1E03 | "The Midnight Apprentice" — Theron Nightborn (Part 2) | two-part | scheduled | 2026-10-13T13:05:00Z | released same day as E02, per two-part convention |
| S1E04 | "The Tainted Elder" — Valdris the Corrupted | single | scheduled | 2026-10-20T13:00:00Z | draft show notes attached |
| S1E05 | "SolarWinds: Inside the Breach" (true crime) | single | scripted | 2026-10-27T13:00:00Z | pending guest handoff sign-off |

This table is the canonical publishing calendar; each row's `Episode.id`
maps 1:1 to a `ScriptOutput` produced by `ScriptGenerator`.

---

## 4. Example JSON record (single episode)

```json
{
  "id": "s1e01",
  "episodeNumber": 1,
  "title": "The Shadow Weaver's Bargain",
  "format": "single",
  "characterId": "morrigan-blackthorn",
  "scriptOutputRef": "output/s1e01/script-output.json",
  "guestHostIds": ["host-jane-doe"],
  "status": "scheduled",
  "scheduledAirDate": "2026-10-06T13:00:00Z",
  "recordingDate": "2026-09-29",
  "post": {
    "title": "The Shadow Weaver's Bargain",
    "summary": "Morrigan Blackthorn keeps the Veil between three realms — at a cost only she remembers.",
    "showNotes": "In this episode... [derived from ProducerBrief]",
    "keyFacts": [
      "Keeper of the Veil, Council Elder (Position 4 of 7)",
      "Enforces the 350-year-old Treaty of Shadows"
    ],
    "tags": ["fiction", "underworld", "season-1"],
    "publishedAt": null,
    "platformLinks": []
  }
}
```

---

## 5. Implementation notes

- These types can live in `src/podcast-types.ts` as `Book`, `PodcastSeries`,
  `Season`, `Episode`, `Post`, and `AuthorHost` interfaces, additive to the
  existing `ScriptOutput`/`ProducerBrief` types — no breaking changes.
- A future CLI command, e.g. `underworld-writer schedule-episode`, could
  read a `ScriptOutput` and prompt for `scheduledAirDate` + `post` fields,
  writing the combined record to `output/<season>/<episode>/episode.json`.
- The scheduling calendar (§3) is the input the audio-generation pipeline in
  [`AUDIO_GENERATION_PLAN.md`](./AUDIO_GENERATION_PLAN.md) consumes: each
  `scheduledAirDate` becomes the deadline for that episode's Modal.com
  render job.
