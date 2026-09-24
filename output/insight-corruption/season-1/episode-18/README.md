# Insight Corruption — Season 1 Episode 18

**Episode:** Elizabeth Williams & Insight Housing: The Paper Trail  
**Tracking issue:** #148  
**Status:** studio-prep

## Production files

- `EPISODE_CONFIG.json` — editorial/runtime/source configuration
- `scripts/script.md` — full human-readable recording script
- `script-output.json` — `ScriptOutput` payload consumed by the Modal studio renderer
- `producer-briefs/brief.md` — source tiers, risk notes, right-of-reply questions
- `published-assets/article.md` — long-form companion article draft
- `modal/config/episodes/insight-corruption-ep18.json` — audio render configuration

## Studio render

From the repository root, using the existing Modal environment/voice volume:

```bash
modal run modal/app.py::generate_episode_audio \
  --episode-config config/episodes/insight-corruption-ep18.json
```

Run from `modal/` if the current studio command expects episode configs relative to that directory, consistent with `modal/config/episodes/README.md`.

Expected output:

```text
insight-corruption-ep18.wav
```

Voice profile:

```text
voice-eric-nissen-01
```

## Editorial gate before publication

The studio script is intentionally safe to render now because unresolved ACCELA/fire/payment-ledger claims are framed as questions or attributed allegations rather than established facts.

Before **publication**:

1. Incorporate any material right-of-reply response from Elizabeth Williams, Insight Housing, or SSVF oversight.
2. Reconcile direct ACCELA/code/fire records if obtained.
3. Reconcile the complete SSVF payment ledger if obtained.
4. Re-render if those records materially change narration.

## Child issues

- #162 — Script Framing
- #163 — Sponsor Break
- #164 — Producer Brief & Source Handoff
- #165 — Publication Pipeline
- #166 — Audio Render
- #167 — Scheduling & Air Date
