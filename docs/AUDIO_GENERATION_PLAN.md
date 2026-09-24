# Audio generation architecture

This is the current operating architecture. Historical Chatterbox migration notes live in `docs/archive/CHATTERBOX_INTEGRATION_PLAN.md`.

## Runtime
Chatterbox is the default zero-shot voice-cloning backend. Modal provides scale-to-zero GPU inference; CPU work handles stitching, cue mixing, delivery encoding and mastering. Voice profiles are consent-gated and checksum-addressed.

## Stages
1. Editorial package passes source/claim verification and language lint.
2. Script is segmented at sentence boundaries into roughly 10-30 second synthesis units.
3. Chatterbox synthesizes with the project's canonical authorized reference.
4. Content-addressed cache makes retries/resume inexpensive.
5. Segment QC checks identity, pronunciation, critical tokens and artifacts.
6. Dialogue edit creates deterministic narration timing.
7. Semantic segment markers resolve the episode production plan.
8. Asset registry rejects missing or uncleared music/SFX.
9. Post-production mixes dialogue/music/SFX buses with configured ducking/fades.
10. FFmpeg two-pass EBU R128 mastering targets the render profile (default -16 LUFS, <= -1 dBTP).
11. Pipeline writes WAV master, 192 kbps MP3 delivery and a manifest containing synthesis/mastering/cue metadata.
12. Human listen-through is the final publication gate.

## Storage
Reference voices and large audio assets are not committed by default. Runtime references live in `underworld-voice-profiles`; generated masters/cache live in `underworld-episode-output`. Git tracks configuration, hashes, provenance and editorial source packages.

## Extensibility
Shows own their brand, voice bindings, production plans and asset registries. The runtime owns generic synthesis/mixing behavior. This prevents Insight Corruption-specific sound design from becoming hard-coded into the package.

