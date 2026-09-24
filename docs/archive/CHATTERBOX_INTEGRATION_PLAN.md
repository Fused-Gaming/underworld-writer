# Historical migration plan

> Archived after the Chatterbox backend and production pipeline became the current runtime. See `docs/AUDIO_GENERATION_PLAN.md` for operating guidance.

# Chatterbox TTS on Modal — Integration Plan

Status: Phase 1 implemented (backend swap + config-driven chunking/retry/concurrency). Benchmarking (T4/L4/A10) and the ASR QA pipeline (Phase 3) remain outstanding — both require an actual Modal deployment with GPU access and a consented, uploaded reference clip, neither of which exists in this repo yet.
Branch: `feature/modal-chatterbox`
Target backend: Resemble AI Chatterbox TTS
Primary goal: render recurring ~30 minute podcast episodes with cloned host voices at the lowest practical Modal compute cost while preserving acceptable voice consistency.

## 1. Existing baseline

The current `modal/` implementation already provides the right orchestration shape:

- `VoiceSynthesizer` Modal class for persistent GPU model loading
- Modal Volume for consent-gated voice profiles/reference audio
- fan-out synthesis across script segments
- CPU episode assembly, crossfades, pauses, and LUFS normalization
- output Volume for rendered episodes
- optional fine-tuning scaffold

The first implementation should preserve this public contract and replace the XTTS-specific synthesis internals behind a backend adapter.

## 2. Chatterbox choice

Use `chatterbox-tts` as the default synthesis backend.

Initial implementation target:

```python
from chatterbox.tts import ChatterboxTTS

model = ChatterboxTTS.from_pretrained(device="cuda")
wav = model.generate(
    text,
    audio_prompt_path=reference_wav,
)
```

A later benchmark may evaluate `ChatterboxTurboTTS` if it materially lowers real-time factor/cost without degrading the recurring-host voice enough to matter.

Do not introduce fine-tuning in phase 1. Chatterbox voice cloning from a clean reference clip should be evaluated first. Fine-tuning remains an escalation path only if repeatability is insufficient.

## 3. Modal cost strategy

### GPU selection

Benchmark in this order:

1. `T4` — cheapest Modal GPU candidate; preferred if Chatterbox fits and throughput is acceptable.
2. `L4` — fallback if T4 memory/performance is inadequate.
3. `A10` — only if L4/T4 fail quality, memory, or throughput requirements.

Do not keep the existing A10/A10G selection as the default without evidence.

### Container lifecycle

For batch episode generation:

- keep model initialization inside `@modal.enter()`
- use a short scaledown window (target: 30–60 seconds during benchmarks)
- avoid one cold start per segment
- batch consecutive segments for the same speaker where practical
- cap concurrency rather than blindly fanning out all segments
- keep audio stitching/normalization on CPU
- cache model weights in the image or a dedicated Modal Volume where supported

### Render strategy

A 30-minute episode should not be rendered as one giant model call.

Target segment duration:

- normal narration: roughly 10–30 seconds of generated speech per inference unit
- split long paragraphs on sentence boundaries
- retain semantic paragraph boundaries where possible
- merge very short adjacent lines from the same speaker to reduce per-call overhead

This gives retryability, stable memory usage, and deterministic reconstruction if one segment fails.

## 4. Proposed module layout

```text
modal/
├── app.py                       # orchestration + Modal entrypoints
├── backends/
│   ├── __init__.py
│   ├── base.py                  # synthesis backend protocol
│   └── chatterbox.py            # Chatterbox implementation
├── audio/
│   ├── segmenter.py             # text -> synthesis chunks
│   └── assembly.py              # deterministic CPU mix/normalize
├── config/
│   ├── episodes/
│   └── voice_profiles/
├── benchmark_chatterbox.py      # T4/L4/A10 benchmark harness
├── train_voice.py               # retain, but not part of phase 1
└── CHATTERBOX_INTEGRATION_PLAN.md
```

Phase 1 can be implemented with fewer files if desired, but the backend boundary should exist from the beginning so Chatterbox is not hard-wired throughout orchestration code.

## 5. Backend interface

Proposed internal contract:

```python
class SynthesisBackend(Protocol):
    sample_rate: int

    def load(self) -> None: ...

    def synthesize(
        self,
        text: str,
        reference_wav: str,
        *,
        language: str = "en",
        exaggeration: float | None = None,
        cfg_weight: float | None = None,
    ) -> bytes: ...
```

`VoiceSynthesizer` remains responsible for:

- loading the consent-gated voice profile
- resolving reference audio
- selecting synthesis defaults
- returning WAV bytes

The backend remains responsible only for model lifecycle + waveform generation.

## 6. Voice profile additions

Extend each voice profile with optional Chatterbox defaults:

```json
{
  "synthesis": {
    "backend": "chatterbox",
    "exaggeration": 0.5,
    "cfgWeight": 0.5,
    "referenceClip": "clips/eric-nissen/reference.wav"
  }
}
```

Keep existing consent enforcement unchanged.

For recurring podcast hosts, maintain one canonical reference clip plus a small approved alternate set. The canonical clip should be clean, single-speaker speech with minimal music/reverb/background noise.

## 7. Episode-level consistency controls

Add episode config controls for:

- backend/model version
- deterministic random seed when supported
- default exaggeration
- default CFG weight
- target speaking rate policy
- max text characters/tokens per segment
- max concurrent synthesis calls
- retry count
- pause duration by script marker
- target LUFS

Record all of these in a render manifest next to the final WAV so an episode can be reproduced later.

## 8. Benchmark harness

Before production wiring, add `benchmark_chatterbox.py` that renders the same fixed test corpus on each candidate GPU.

Measure:

- cold-start seconds
- model-load seconds
- inference seconds
- generated audio seconds
- real-time factor (`inference_seconds / audio_seconds`)
- peak GPU memory if available
- estimated Modal GPU cost per generated audio minute
- total cost estimate for a 30-minute episode

Test corpus should include:

1. neutral narration
2. emotionally emphatic passage
3. names/proper nouns
4. numbers/dates/acronyms
5. a longer paragraph
6. repeated phrase across multiple calls to inspect voice drift

Acceptance gate:

- use the cheapest GPU that completes the corpus reliably
- reject a cheaper GPU only for measured OOM, unacceptable throughput, or material quality degradation

## 9. Phase plan

### Phase 1 — Backend swap + benchmark

- [x] add Chatterbox backend adapter (`modal/backends/chatterbox.py`, behind `modal/backends/base.py`'s protocol)
- [x] switch Modal image dependencies from Coqui TTS to `chatterbox-tts`
- [ ] benchmark T4, L4, A10 — needs a live Modal deployment; not runnable from this repo checkout
- [x] reduce scaledown window for batch workloads (300s → 60s)
- [x] keep existing voice-profile consent enforcement (`_resolve_reference_audio` unchanged)
- [ ] render a short single-speaker sample — blocked on a consented, uploaded reference clip (see `projects/insight-corruption/voice-profiles/eric-william-nissen.json`, still `pending-intake`)

### Phase 2 — Production episode segmentation

- [x] sentence-aware chunking (`modal/audio/segmenter.py::chunk_text`, wired into `VoiceSynthesizer.synthesize`)
- [ ] same-speaker chunk coalescing across adjacent script segments (current chunking is within one segment only)
- [x] bounded parallel synthesis (`allow_concurrent_inputs` set from the render profile's `synthesis.concurrency.maxCalls`)
- [x] per-segment retry (`_synthesize_chunk_with_retry`, count from `synthesis.concurrency.retryCount`) — no cache yet
- [x] render manifest (per-segment/per-chunk hashes and generation params — see VOICE_PODCAST_GENERATION.md Section 14; written as `episode.manifest.json` next to `episode.wav` by `assemble_episode()`/`generate_episode_audio()` in `modal/app.py`)
- [ ] resume incomplete episode renders

### Phase 3 — Podcast quality controls

- [x] true-peak-aware audio mastering (ffmpeg two-pass EBU R128 `loudnorm`, `linear=true`, replacing the old `np.clip()` sample-peak hard limiter — see `_master_episode_audio()` in `modal/app.py`; targets read from `modal/config/render_profiles/podcast-standard.json`'s `mix` block)
- [ ] benchmark Chatterbox vs Chatterbox Turbo
- [ ] voice-specific generation presets
- [ ] pronunciation overrides for names/acronyms
- [ ] optional intro/outro/music ducking
- [ ] automated QC metrics + sample audit

### Phase 4 — Only if needed

- [ ] investigate fine-tuning or speaker adaptation if zero-shot cloning is not consistent enough

## 10. First code change

The first implementation commit after this plan should be intentionally small:

1. add `modal/backends/chatterbox.py`
2. update the Modal image dependencies
3. change `VoiceSynthesizer.load_model()` and `synthesize()` to call the adapter
4. retain the rest of `generate_episode_audio()` and `assemble_episode()` unchanged
5. add a local/Modal smoke test rendering a short sentence from a consented reference clip

That gives us a measurable Chatterbox baseline before changing segmentation, concurrency, or episode assembly.
