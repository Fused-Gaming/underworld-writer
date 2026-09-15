# Audio Generation Plan — Hugging Face Voice Models on Modal.com

Design for turning a generated `ScriptOutput` (text) into a mixed, edited
episode audio file, using trained voice-actor models for each character/host
and running inference on Modal.com. This is a **plan**, not yet implemented
— no code in this repo depends on it today.

## 1. Goal

Given:
- A `ScriptOutput` (script text, segments, speaker labels) from
  `ScriptGenerator`
- One trained voice model per `AuthorHost.voiceProfileId` (see
  `EPISODE_PUBLISHING_SCHEMA.md` §1.5)

Produce:
- A mixed, edited episode audio file (intro/outro, per-segment voice
  synthesis, pauses honored, crossfades at transitions) ready to attach to
  the episode's `Post` and publish by its `scheduledAirDate`.

## 2. Model choice

| Stage | Model family | Why |
|---|---|---|
| Text-to-speech / voice cloning | Coqui **XTTS-v2** (`coqui/XTTS-v2`) or **F5-TTS** (`SWivid/F5-TTS`) | Open-weight, few-shot voice cloning from ~10-30s of reference audio, multilingual, runs on a single A10/A100 |
| Voice model fine-tuning (optional, per host/character) | LoRA fine-tune on top of XTTS-v2/F5-TTS speaker encoder | Only needed if few-shot cloning quality is insufficient for a recurring host voice |
| Audio editing / assembly | Deterministic Python (`pydub`/`ffmpeg`), not a model | Splicing, crossfades, pause insertion, loudness normalization — no ML needed here |
| Optional: dialogue/emotion control | `parler-tts/parler-tts-mini-v1` for emotion/style prompting | Only if segments need expressive delivery beyond flat narration |

**Recommendation:** start with XTTS-v2 for cloning quality and speed; keep
the pipeline model-agnostic (swap in F5-TTS or a fine-tuned model per voice
profile without changing the Modal orchestration).

## 3. Voice profile → model mapping

Each `AuthorHost.voiceProfileId` resolves to:

```json
{
  "voiceProfileId": "voice-morrigan-01",
  "baseModel": "coqui/XTTS-v2",
  "referenceAudio": "voice-refs/morrigan-01.wav",
  "fineTunedCheckpoint": null,
  "language": "en"
}
```

- `referenceAudio`: 10-30s clean reference clip of the voice actor (stored
  in a Modal Volume, never committed to the repo).
- `fineTunedCheckpoint`: set once/if a LoRA fine-tune exists for that voice
  actor; falls back to zero-shot cloning from `referenceAudio` otherwise.

## 4. Modal.com deployment architecture

```
underworld-writer repo
   │  (ScriptOutput JSON + episode.json)
   ▼
Modal App: underworld-audio
   ├─ modal.Image  — base image with torch, transformers, TTS deps, ffmpeg
   ├─ modal.Volume — "voice-profiles" (reference audio + fine-tuned checkpoints)
   ├─ modal.Volume — "episode-output" (rendered audio, cached across runs)
   ├─ @app.cls(gpu="A10G", volumes={...})
   │     class VoiceSynthesizer:
   │         @modal.enter()  — load XTTS-v2 once per container (warm start)
   │         @modal.method() synthesize(text, voice_profile_id) -> bytes (wav)
   │
   ├─ @app.function(cpu=..., volumes={...})
   │     def assemble_episode(segments: list[SegmentAudio], episode_meta) -> bytes (mp3)
   │         # crossfades, pause padding, intro/outro stitch, loudness normalize
   │
   └─ @app.function()  — entrypoint
         def generate_episode_audio(script_output_json, episode_json) -> str (output path)
             1. parse ScriptOutput segments + speaker labels
             2. for each segment: VoiceSynthesizer.synthesize.remote(text, voice_profile_id)
                 (fan out with .map() for parallel GPU synthesis across segments)
             3. assemble_episode(all segment audio, episode_meta)
             4. write final file to "episode-output" volume, return path/URL
```

Key Modal primitives used:
- **`modal.Image`** — pinned image with `TTS`/`f5-tts`, `torch`, `ffmpeg`, `pydub`.
- **`modal.Volume`** — persistent storage for voice reference audio, fine-tuned
  checkpoints, and rendered output, so containers don't re-download per run.
- **`modal.Cls` with `@modal.enter()`** — loads the TTS model into GPU memory
  once per container and reuses it across segment-synthesis calls (avoids
  reloading multi-GB weights per segment).
- **`.map()` for fan-out** — synthesize all of an episode's segments in
  parallel across multiple GPU containers, then join for assembly.
- **`gpu="A10G"`** (or `"A100"` if fine-tuned models need more VRAM) — right-sized
  for XTTS-v2/F5-TTS inference; avoid over-provisioning.
- **Scheduled trigger** — a Modal `@app.function(schedule=modal.Period(...))`
  or an external call from this repo's CLI, invoked far enough ahead of each
  episode's `scheduledAirDate` to leave time for a human QA pass before
  publish.

## 5. Pipeline stages in detail

1. **Input**: `ScriptOutput` (from `ScriptGenerator`) + `episode.json`
   (from `EPISODE_PUBLISHING_SCHEMA.md`), each segment already tagged with
   a `speaker` (narrator/host/guest) and any `[PAUSE]` markers.
2. **Voice resolution**: map each segment's speaker to a `voiceProfileId`,
   then to a `baseModel` + `referenceAudio`/`fineTunedCheckpoint`.
3. **Synthesis (GPU, parallel via `.map()`)**: one XTTS-v2/F5-TTS call per
   segment, returning raw WAV bytes.
4. **Editing/assembly (CPU)**:
   - Insert silence for `[PAUSE]` markers (duration configurable, e.g. 800ms).
   - Crossfade between adjacent segments (~150ms) to avoid hard cuts.
   - Prepend/append intro and outro beds (static audio assets, not
     model-generated).
   - Normalize loudness to a podcast target (e.g. -16 LUFS).
5. **Output**: final MP3/WAV written to the `episode-output` Modal Volume,
   downloaded or pushed to whatever hosting the `Post.platformLinks` point
   to, then `Post.publishedAt` and `Episode.status = "published"` are set.

## 6. Editing "together" multiple takes

For guest interviews or two-part episodes recorded partially live: the
`assemble_episode` function accepts a manifest of ordered clips where each
clip is either (a) freshly synthesized from a script segment or (b) a
pre-recorded human take passed through unchanged — allowing synthetic
narration and real guest audio to be spliced into one continuous episode.

## 7. Security / privacy notes

- Voice reference audio for real hosts/guests requires explicit consent
  before being used to fine-tune or clone a voice; store consent alongside
  the voice profile record.
- Reference audio and fine-tuned checkpoints live only in the Modal Volume,
  never in this git repo.
- Distinguish clearly (in `Post.showNotes` or metadata) when narration is
  synthetic vs. a real recorded human voice, per platform disclosure norms
  for AI-generated audio.

## 8. Open questions for implementation

- Which hosting target receives the final render (S3, direct RSS host,
  etc.) — determines the last step of `generate_episode_audio`.
- Whether any host/guest needs a fine-tuned checkpoint now, or zero-shot
  cloning from a reference clip is sufficient for launch.
- Turnaround SLA: how far ahead of `scheduledAirDate` (§3 in
  `EPISODE_PUBLISHING_SCHEMA.md`) the render + human QA pass needs to run.
