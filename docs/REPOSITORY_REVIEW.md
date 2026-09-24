# Repository review — production pipeline branch

Reviewed after adding the professional podcast post-production layer.

## Structure decisions
- Generic synthesis/mixing remains in `modal/`; no Insight Corruption-specific names are hard-coded into mixer behavior.
- Show-specific sound design lives in `projects/insight-corruption/production/audio/`.
- Voice identity/provenance remains in `voice-profiles/`; logical speaker bindings remain separately in `voices/` (not duplicates).
- Generated audio remains outside Git by default; configuration, hashes and provenance remain versioned.
- Completed Chatterbox migration plan moved from the runtime directory to `docs/archive/`.
- Current audio architecture replaced stale XTTS-era operating guidance.
- Docs landing pages were reduced to navigational guides instead of duplicating implementation detail.

## Production completeness
The runtime now has semantic cue resolution, dialogue/music/SFX layering, narration ducking, fades, fail-closed asset clearance, two-pass loudness mastering, WAV master output, MP3 delivery output, and cue metadata in the render manifest.

Insight Corruption now has a sound-design brief, asset registry, production profile and Episode 1 cue plan. The registry deliberately contains no pretend music: required theme/beds/stingers remain `required-not-procured` until real rights-cleared files and license metadata are supplied.

## Documentation set
Current first-user path is: Getting Started → Architecture → Voice Intake → Production Audio → Modal Setup → Production Release → Publishing. Troubleshooting and asset-procurement guides cover the two new operational surfaces.

## Remaining external gates
1. Upload the verified Eric canonical/alternate WAV references to the Modal voice-profile volume and verify hashes.
2. Commission/procure the five Insight Corruption audio identity assets and mark them approved only after rights/provenance are recorded.
3. Run the repository's Node build/tests plus Python post-production tests in an environment with the repository checkout and dependencies.
4. Deploy Modal and render a short proof corpus before a full episode.
5. Human-listen and approve the mastered release candidate.

## Validation note
A static repository/diff review was completed. An execution attempt from the assistant container could not clone GitHub because that runtime has no external DNS/network access; therefore this review does not claim that the branch's executable build or Modal render has passed.
