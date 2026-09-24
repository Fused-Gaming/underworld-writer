# Audio troubleshooting

**Voice profile not found:** upload the runtime JSON to `underworld-voice-profiles`.

**Reference clip not found/hash mismatch:** upload the exact derived WAV at the configured path; do not substitute a similarly named file.

**Production asset clearance failed:** update the show asset registry only after acquiring and documenting rights, then place the exact asset at the runtime path.

**Unknown production marker:** the production plan references a segment ID absent from the generated ScriptOutput. Regenerate from the authoritative episode package or fix the cue marker.

**Voice drift:** keep the canonical reference fixed, shorten problematic synthesis chunks, inspect punctuation/pronunciation, then A/B an approved alternate reference. Do not randomly swap references across the episode.

**Music masks narration:** lower bed gain and/or increase dialogue ducking. Do not solve masking by over-compressing the voice.

**Master fails loudness/peak:** inspect the pre-master mix for clipping or excessive dynamics; do not simply raise limiter pressure.

**One bad sentence:** regenerate the failed chunk only. The cache is designed to avoid rerendering the full episode.

