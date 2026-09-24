# Podcast production release runbook

A release candidate is publishable only when all gates pass: editorial lint, claim/source verification, voice authorization and reference hash, segment QA, asset clearance, full mix render, loudness/true-peak validation, synthetic-voice disclosure, source manifest, and human listen-through.

## Required artifacts
- approved script/package
- voice profile + reference hash
- resolved production plan
- asset clearance registry snapshot
- chunk/render manifest
- mastered WAV
- delivery MP3
- source/corrections manifest

Never publish directly from a TTS render. TTS output is an intermediate; the mastered, QC-approved release candidate is the publication artifact.

