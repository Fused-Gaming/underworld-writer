# Production audio guide

Underworld Writer separates **editorial truth**, **voice synthesis**, and **sound design**. The post-production layer must never turn a disputed claim into a sonic assertion.

## Pipeline
1. Approve and lint the source-backed script.
2. Resolve an authorized voice profile and reference checksum.
3. Synthesize/chunk narration; cache and QA each chunk.
4. Resolve production markers from segment IDs.
5. Verify every music/SFX asset against the show's asset registry.
6. Build dialogue, music and SFX buses.
7. Duck beds beneath narration and apply transparent fades.
8. Master to the render profile (-16 LUFS stereo, <= -1 dBTP by default).
9. Export WAV master + MP3 delivery + render/provenance manifest.
10. Human-listen before publication.

## Asset clearance
Do not commit random downloaded music. Each asset needs: stable ID, path, creator/source, ownership/license, allowed channels/territories/term where relevant, attribution requirements, SHA-256, and approval status.

## Cue vocabulary
`intro-bed`, `outro-bed`, `music-bed`, `stinger`, `sfx`, and `room-tone`. Episode plans should reference semantic segment markers rather than fragile absolute timestamps. Marker resolution happens after TTS because generated duration can change.

## Investigative restraint
Sound design can organize attention; it cannot supply evidence. Avoid literal sirens, gunshots, gavels, cash sounds, ominous hits under named people, or other effects that editorialize a factual allegation unless authentic source audio is itself part of the reporting and is clearly identified.

