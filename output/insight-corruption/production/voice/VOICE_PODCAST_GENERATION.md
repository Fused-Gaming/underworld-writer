# Authorized Voice Podcast Generation on Modal

## Purpose

This document defines a low-cost, repeatable production architecture for generating approximately 30-minute **Insight Corruption** podcast episodes using an **authorized synthetic version of Eric William Nissen's voice**.

The intended editorial use is investigative narration concerning documented fraud, corruption, public records, court filings, procurement, government activity, financial relationships, and related reporting. The system is designed around four priorities:

1. **Voice consistency** across a full episode.
2. **Factual integrity** for names, dates, dollar amounts, case numbers, statutory citations, and direct quotations.
3. **Low serverless inference cost** using Modal.com GPU instances that scale to zero.
4. **Auditable provenance and disclosure** so a generated episode can be traced back to its approved script, evidence package, model revision, and authorized reference voice.

> **Authorization requirement:** Eric's explicit written permission to synthesize and publish his voice is required. Public availability of his social-media videos is not itself permission to clone his voice.

---

## Executive Recommendation

Build version 1 around:

- **Chatterbox Turbo** for zero-shot voice cloning.
- **Modal L4** as the initial inference GPU.
- **T4 benchmarking** after the pipeline works to determine whether its lower hourly rate also produces a lower cost per accepted minute.
- Three curated, authorized Eric reference clips: **neutral**, **emphatic**, and **conversational**.
- Approximately **4,100-4,600 words** for a 30-minute script, adjusted after measuring Eric's generated speaking rate.
- TTS segments of roughly **200-300 characters / 30-50 spoken words**.
- Segment-level ASR verification before mastering.
- CPU-based FFmpeg stitching and loudness mastering.
- Scale-to-zero Modal workers and regeneration of failed segments only.
- A persistent generation manifest with hashes for the script, reference audio, segments, model revision, and final master.

Do **not** start by training a bespoke voice model. Chatterbox Turbo supports zero-shot voice conditioning from a short reference recording, which avoids a dedicated training lifecycle and should be materially cheaper to operate. Fine-tuning should be considered only if controlled testing demonstrates a specific consistency or delivery problem that cannot be solved through better reference audio, segmentation, pronunciation handling, or selective regeneration.

---

# 1. Consent, Editorial Control, and Publication Rules

## 1.1 Required authorization

Before any production use, maintain a written authorization record covering at least:

- Permission to create a synthetic version of Eric's voice.
- Permission to use specified social-media recordings as reference audio.
- Whether commercial use is authorized.
- Approved publication channels.
- Whether the authorization applies to drafts, public releases, promotional clips, or all three.
- A revocation/update process for future use.
- Any prohibited topics, contexts, or impersonation scenarios.

The production system should retain a hash of the consent record and the exact approved reference files used for generation.

## 1.2 Editorial approval is separate from voice approval

Voice authorization should not be treated as blanket editorial approval for statements Eric has never reviewed.

If a generated episode materially changes Eric's editorial position, creates new allegations, or materially reframes the evidence, require an editorial approval step before release.

## 1.3 Disclosure

Each released episode should clearly disclose the synthetic narration.

Suggested language:

> This episode uses an authorized AI-generated version of Eric Nissen's voice to narrate an editorially reviewed script. Source materials and corrections information are linked in the show notes.

The disclosure should appear in the episode and in its show notes.

## 1.4 Investigative-content safeguards

For episodes involving alleged fraud or corruption:

- Distinguish **documented fact**, **allegation**, **inference**, and **opinion**.
- Attribute contested claims to the person, filing, agency, or source making them.
- Never synthesize a direct quote unless it has been verified against the source record.
- Preserve denials, contrary evidence, corrections, and requests for comment.
- Do not invent evidence, sources, quotes, dollar figures, case numbers, or allegations.
- Maintain a claim-to-source map that can be published alongside the episode.

---

# 2. Model Selection

## 2.1 Primary: Chatterbox Turbo

Recommended first choice: **Resemble AI Chatterbox Turbo**.

Why it is a strong fit:

- Zero-shot voice cloning from a short authorized reference clip.
- MIT licensing posture for the open-source model.
- Compact inference-oriented architecture.
- Reported inference performance substantially faster than real time under favorable hardware conditions.
- Built-in PerTh audio watermarking for synthetic-audio provenance.
- Existing Modal deployment examples reduce integration work.

The most important economic advantage is that this approach can condition on Eric's reference audio at inference time instead of requiring a custom training run.

## 2.2 Secondary: OpenVoice V2

Use as a fallback or comparison baseline.

Advantages:

- MIT license.
- Instant voice cloning / tone-color transfer.
- Useful as a second implementation if Chatterbox cadence or stability is not sufficient.

## 2.3 XTTS-v2

Technically capable, but its Coqui Public Model License needs separate review before a monetized production deployment. It should not be the default commercial path without confirming that the intended use is permitted.

## 2.4 Fish Speech

Potentially useful for research and benchmarking, but commercial licensing terms should be resolved before production use.

---

# 3. Authorized Voice Reference Pack

Start small. Do not scrape hundreds of social clips simply because they are available.

Create three clean reference files from recordings Eric owns or has specifically authorized:

```text
voice/
  neutral.wav
  emphatic.wav
  conversational.wav
  consent-record.pdf
```

Recommended characteristics:

### `neutral.wav`
- 8-15 seconds.
- Normal speaking pace.
- Minimal room echo.
- No background music.
- No second speaker.

### `emphatic.wav`
- 8-15 seconds.
- Strong investigative delivery without shouting.
- Useful for openings, contradictions, and major findings.

### `conversational.wav`
- 8-15 seconds.
- Relaxed podcast cadence.
- Useful for context, transitions, and explanatory passages.

If source material comes from social video:

- Preserve the original file.
- Extract the cleanest available audio without unnecessary lossy re-encoding.
- Retain URL/source metadata and authorization status.
- Avoid segments containing music, overlapping voices, clipping, or aggressive denoising artifacts.

## Optional evaluation corpus

If zero-shot quality is insufficient, assemble an authorized **30-60 minute clean corpus** of Eric speaking. Segment it into roughly **5-20 second** utterances with transcripts.

The first use of this larger corpus should be **evaluation and reference selection**, not automatically fine-tuning a new model.

---

# 4. Thirty-Minute Episode Specification

## 4.1 Word-count target

At a narration rate of approximately **140-150 words per minute**, a 30-minute episode will generally require about **4,200-4,500 spoken words**.

Use **~4,350 words** as an initial target, then update the target after measuring Eric's actual synthesized words-per-minute rate.

## 4.2 Suggested episode structure

| Section | Time | Approx. words @145 WPM | Purpose |
|---|---:|---:|---|
| Cold open | 1 min | 145 | Lead with the most consequential verified fact, contradiction, or unanswered question. |
| Context | 3 min | 435 | Who, what, when, definitions, prior history. |
| Evidence block A | 6 min | 870 | Primary records, timeline, first evidentiary arc. |
| Evidence block B | 6 min | 870 | Second evidentiary arc, responses, contradictions, counterpoints. |
| Connections / money / process | 5 min | 725 | Procurement, contracts, filings, organizational relationships, financial context. |
| Known vs. alleged | 3 min | 435 | Explicitly separate verified facts from disputed claims and inference. |
| Implications / open questions | 4 min | 580 | Missing records, unanswered questions, next reporting steps. |
| Outro / sources / disclosure | 2 min | 290 | Source access, corrections channel, synthetic-voice disclosure. |

The structure is a planning framework, not a requirement to force every investigation into the same editorial shape.

---

# 5. Script Segmentation

The model should not receive an entire 30-minute script as one generation request.

Target:

- **200-300 characters per segment**, normally about **30-50 spoken words**.
- Prefer complete sentence boundaries.
- Permit two short sentences in one segment if the cadence remains natural.

Never split inside:

- A person's name.
- A company or agency name.
- A date.
- A dollar amount.
- A percentage.
- A statute citation.
- A court case number.
- A URL.
- A direct quotation.

Each segment should include metadata similar to:

```json
{
  "id": "seg-0042",
  "text": "...",
  "style": "neutral",
  "claim_ids": ["CLM-018", "CLM-019"],
  "source_ids": ["SRC-011"],
  "critical_tokens": [
    "September 11, 2026",
    "$125,000",
    "Case No. 26CV01234"
  ]
}
```

Suggested style tags:

- `neutral`
- `emphatic`
- `conversational`

Keep style selection explicit rather than allowing every segment to infer emotional delivery independently.

---

# 6. Evidence and Claims Layer

Voice generation should be downstream of a structured evidence workflow.

Recommended flow:

```text
source records
    -> claims ledger
    -> editorial script
    -> deterministic segments
    -> TTS generation
    -> ASR verification
    -> mastering
    -> final episode + source manifest
```

A claims ledger should contain at minimum:

```json
{
  "claim_id": "CLM-018",
  "claim": "...",
  "status": "documented|alleged|inference|disputed",
  "source_ids": ["SRC-011"],
  "quote_exact": false,
  "editor_notes": "..."
}
```

This makes it possible to answer a critical production question later: **which evidence supported the words being spoken in this exact audio segment?**

---

# 7. Repository / Episode Data Layout

Suggested working layout:

```text
episode/
  episode.json
  sources/
    claims-ledger.json
  script/
    master.md
    segments.json
  voice/
    neutral.wav
    emphatic.wav
    conversational.wav
    consent-record.pdf
  audio/
    raw/
      segment-0001.wav
    qa/
      segment-0001.json
    final/
      episode-master.wav
      episode.mp3
  provenance/
    generation-manifest.json
```

Do not commit large generated WAV/MP3 assets to Git by default unless the repository intentionally stores release media. Prefer object storage for generated artifacts and keep manifests/metadata in version control.

---

# 8. Modal Deployment Architecture

## 8.1 Baseline GPU

Begin with **Modal L4**.

Then benchmark:

| GPU | Approx. current rate | Role |
|---|---:|---|
| T4 | $0.000164/sec (~$0.59/hr) | Lowest nominal hourly price; benchmark for lowest total episode cost. |
| L4 | $0.000222/sec (~$0.80/hr) | Recommended starting point for inference efficiency. |
| A10 | $0.000306/sec (~$1.10/hr) | Extra headroom if L4 throughput or memory becomes limiting. |

Modal bills GPU use by the second, so **cost per accepted finished minute** matters more than hourly price alone.

A cheaper T4 that takes much longer or causes more retries may cost more per finished episode than L4.

## 8.2 Serverless behavior

The worker should:

- Load Chatterbox once when the container starts.
- Prepare/cache Eric's approved voice conditioning once.
- Synthesize all segments for one episode on the same loaded worker when practical.
- Scale to zero after the job completes.
- Persist model weights in the image/cache so each episode does not redownload them.
- Use CPU resources for stitching and mastering.

Do not keep a GPU warm all day for an occasional podcast render unless benchmarked demand justifies the idle cost.

## 8.3 Concurrency strategy

Prefer:

1. Parallelizing **different episodes** across workers.
2. Sequential or modestly batched segment generation inside one episode.

Avoid spawning dozens of GPU workers for a single episode unless testing shows it lowers end-to-end cost. High intra-episode parallelism can increase memory pressure, cold starts, and duplicate model-loading overhead.

---

# 9. Illustrative Modal Implementation

Pin the exact model and dependency revisions in production. This is an architectural example, not a guarantee of the current library API.

```python
import modal

app = modal.App("inner-rhythm-podcast-tts")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("ffmpeg")
    .uv_pip_install(
        "chatterbox-tts",
        "torchaudio",
        "soundfile",
    )
)


@app.cls(
    image=image,
    gpu="L4",
    scaledown_window=60,
)
class PodcastTTS:
    @modal.enter()
    def load(self):
        from chatterbox.tts_turbo import ChatterboxTurboTTS

        self.model = ChatterboxTurboTTS.from_pretrained(device="cuda")
        # Prepare/cache approved voice conditioning here if supported
        # by the pinned model revision.

    @modal.method()
    def synthesize_episode(
        self,
        segments,
        reference_path,
        base_seed=20260919,
    ):
        outputs = []

        for i, segment in enumerate(segments):
            # Stable but segment-specific seeds aid reproducibility.
            seed = base_seed + i
            set_all_seeds(seed)

            wav = self.model.generate(
                segment["text"],
                audio_prompt_path=reference_path,
                temperature=0.8,
                top_p=0.95,
                top_k=1000,
                repetition_penalty=1.2,
            )

            outputs.append(save_segment(i, wav))

        return outputs
```

Production code should record the generation parameters used for every segment.

---

# 10. Cost Model

For a 30-minute episode:

```text
30 minutes = 1,800 seconds of finished narration
```

Let:

- `S` = synthesis speed relative to real time.
- `C` = cold-start + voice-conditioning overhead in seconds.
- `R` = GPU price per second.

Then:

```text
episode_gpu_cost ~= (1800 / S + C) * R
```

Assuming approximately **60 seconds** of startup/conditioning overhead:

| Synthesis speed | GPU seconds | T4 | L4 | A10 |
|---|---:|---:|---:|---:|
| 6x realtime | 360 sec | ~$0.059 | ~$0.080 | ~$0.110 |
| 4x realtime | 510 sec | ~$0.084 | ~$0.113 | ~$0.156 |
| 2x realtime | 960 sec | ~$0.157 | ~$0.213 | ~$0.294 |
| 1x realtime | 1,860 sec | ~$0.305 | ~$0.413 | ~$0.569 |

These are illustrative compute estimates and exclude:

- CPU mastering.
- Storage.
- Network transfer.
- ASR verification.
- Segment retries.
- Any external script-generation API costs.

Initial optimization target:

> **Less than approximately $0.25 in primary TTS GPU compute for one accepted 30-minute episode.**

The actual KPI should be:

```text
TOTAL PRODUCTION COMPUTE COST / ACCEPTED FINISHED AUDIO MINUTE
```

not simply GPU hourly rate.

---

# 11. Cost-Control Rules

1. Cache model weights.
2. Load the model once per worker, not once per segment.
3. Prepare the approved voice reference once where the model/API permits it.
4. Regenerate only failed segments.
5. Perform stitching, fades, metadata, and loudness normalization on CPU.
6. Delete unnecessary intermediate experiments after QA.
7. Archive final masters and provenance manifests.
8. Benchmark T4 and L4 using the exact same script and acceptance criteria.
9. Choose the platform profile with the lowest cost **after retry rate is included**.

---

# 12. Segment-Level Quality Assurance

Investigative narration has a high error cost. A pronunciation error can turn one person's name into another or alter a monetary figure.

Every synthesized segment should be back-transcribed using a strong ASR model.

## Automated checks

For each segment:

1. Run ASR.
2. Normalize punctuation/casing for comparison.
3. Compare the ASR transcript against the canonical script segment.
4. Hard-check critical tokens.
5. Inspect audio quality metrics.
6. Accept, retry, or escalate for manual review.

Critical tokens include:

- Person names.
- Organization names.
- Dates.
- Dollar amounts.
- Percentages.
- Statutory citations.
- Court case numbers.
- Addresses when material to the reporting.
- Direct quotations.

## Audio checks

Flag segments with:

- Clipping.
- Excessive silence.
- Truncated speech.
- Extreme speaking rate.
- Abnormal loudness.
- Voice drift.
- Repeated words or phrases.

## Retry policy

When a segment fails:

1. Regenerate only that segment.
2. Keep the same authorized reference style.
3. Use a controlled alternate seed.
4. Retry a limited number of times.
5. Escalate persistent failures for editorial/manual correction.

Do not rerender a complete 30-minute episode because one name was spoken incorrectly.

---

# 13. Mastering

After all segments pass QA:

1. Trim abnormal leading/trailing silence.
2. Apply short, transparent crossfades where needed.
3. Stitch segments in deterministic order.
4. Insert approved intro/outro audio.
5. Normalize loudness.
6. Write metadata.
7. Hash the final master.

Suggested podcast targets:

- **-16 LUFS** for stereo, or
- **-19 LUFS** for mono.
- True peak at or below approximately **-1 dBTP**.

Use FFmpeg or another CPU-based mastering path so expensive GPU time is not spent on operations that do not need a GPU.

---

# 14. Provenance Manifest

Every release should produce a machine-readable manifest similar to:

```json
{
  "episode_id": "IC-001",
  "generated_at": "2026-09-19T00:00:00Z",
  "model": "chatterbox-turbo",
  "model_revision": "PINNED_REVISION",
  "modal_app_revision": "DEPLOY_REVISION",
  "script_sha256": "...",
  "voice_reference_sha256": "...",
  "consent_record_sha256": "...",
  "seed_policy": "base-plus-segment-index",
  "segments": [
    {
      "id": "seg-0001",
      "audio_sha256": "...",
      "qa": "accepted"
    }
  ],
  "final_master_sha256": "...",
  "synthetic_voice_disclosed": true
}
```

Retain Chatterbox's provenance watermark rather than stripping it during mastering.

---

# 15. Benchmark Before Production

Run a controlled 10-minute bake-off before locking the architecture.

The benchmark script should deliberately include:

- Difficult proper names.
- Dates.
- Dollar figures.
- Case numbers.
- Direct quotations.
- Long explanatory sentences.
- Short emphatic sentences.
- Transitions between neutral and forceful delivery.

Use the same:

- Script.
- Reference voice.
- Segment boundaries.
- QA rules.

Across T4, L4, and A10.

Record:

- Cold-start time.
- Voice-conditioning time.
- Synthesis time.
- GPU seconds.
- Retry rate.
- ASR mismatch rate.
- Critical-token failures.
- Human listener preference.
- Cost per accepted finished minute.

Also test at least two reference styles:

- Neutral.
- Emphatic.

---

# 16. Initial Acceptance Targets

| Metric | Initial target |
|---|---:|
| Voice identity consistency | Human reviewers accept >=95% of segments without identity-drift concerns. |
| Critical-token accuracy | 100% after automated/manual correction. |
| Segment retry rate | <10%. |
| Episode duration | 29-31 minutes for a nominal 30-minute release. |
| Primary TTS GPU compute | Target < $0.25 per episode after optimization. |
| Disclosure present | 100%. |
| Provenance manifest present | 100%. |

Critical-token accuracy should be treated as a release gate, not an average-quality metric.

---

# 17. Implementation Phases

## Phase 0 - Authorization and source preparation

- Execute written voice authorization.
- Select approved source videos/audio.
- Create neutral, emphatic, and conversational reference files.
- Establish the disclosure language.
- Hash and register the reference files.

## Phase 1 - TTS prototype

- Deploy Chatterbox Turbo to a Modal L4.
- Create deterministic script segmentation.
- Generate a 10-minute benchmark.
- Store generation metadata per segment.

## Phase 2 - QA pipeline

- Add ASR back-transcription.
- Add critical-token checks.
- Add limited segment retries.
- Add audio-quality checks.
- Add CPU mastering.

## Phase 3 - Full episode pipeline

Connect:

```text
claims ledger
  -> approved script
  -> segments
  -> TTS
  -> ASR QA
  -> segment correction
  -> mastering
  -> final audio
  -> show notes + source manifest
```

## Phase 4 - Cost tuning

- Benchmark T4 vs. L4 vs. A10.
- Optimize model/image caching.
- Measure cold starts.
- Reduce unnecessary storage.
- Track cost per accepted finished minute.

## Phase 5 - Optional fine-tuning research

Only enter this phase if the zero-shot benchmark fails a defined quality requirement.

Before training, determine whether the problem can instead be fixed by:

- Cleaner reference audio.
- A different reference style.
- Better segmentation.
- Pronunciation dictionaries.
- Script punctuation changes.
- Selective regeneration.
- A different zero-shot model.

If fine-tuning remains justified, use only an authorized dataset and document the model/license implications separately.

---

# 18. Suggested Future Automation

A production job can eventually accept an episode package containing:

```json
{
  "episode_id": "IC-001",
  "script": "script/master.md",
  "segments": "script/segments.json",
  "claims": "sources/claims-ledger.json",
  "voice_profile": "neutral",
  "target_duration_minutes": 30,
  "qa": {
    "critical_token_match": true,
    "asr_compare": true,
    "manual_review_on_failure": true
  }
}
```

The orchestrator can then:

1. Validate source/claim metadata.
2. Estimate expected episode duration.
3. Dispatch TTS to Modal.
4. Run segment QA.
5. Retry failures.
6. Master the accepted segments.
7. Create show-note citations.
8. Generate the provenance manifest.
9. Produce a release candidate for editorial approval.

This turns the model into a narration component inside an accountable publishing workflow rather than a black-box "generate podcast" button.

---

# 19. Primary Technical References

- Modal pricing: https://modal.com/pricing
- Modal Chatterbox example: https://modal.com/docs/examples/chatterbox_tts
- Chatterbox Turbo overview: https://www.resemble.ai/learn/models/chatterbox-turbo
- Chatterbox source: https://github.com/resemble-ai/chatterbox
- OpenVoice: https://github.com/myshell-ai/OpenVoice
- XTTS-v2 license: https://huggingface.co/coqui/XTTS-v2/blob/main/LICENSE.txt
- Fish Speech license: https://github.com/fishaudio/fish-speech/blob/main/LICENSE

Rates, APIs, model revisions, and license terms can change. Pin production dependencies and re-check licensing and Modal pricing before relying on any specific cost figure for a release budget.

---

# 20. Final Production Recommendation

Start with the smallest reliable architecture:

```text
AUTHORIZED ERIC REFERENCE AUDIO
            +
   EDITORIALLY APPROVED SCRIPT
            +
       CLAIMS LEDGER
            |
            v
   CHatterbox Turbo / Modal L4
            |
            v
    SEGMENT-LEVEL ASR QA
            |
            v
      CPU MASTERING
            |
            v
 FINAL EPISODE + MANIFEST + SOURCES
```

The first engineering objective is not to create the most sophisticated custom voice model. It is to prove that a short authorized reference, deterministic segmentation, serverless GPU inference, and strict QA can reliably produce an accepted 30-minute episode for very little compute cost.

Once that benchmark exists, optimize based on measured failure modes and dollars per accepted minute.