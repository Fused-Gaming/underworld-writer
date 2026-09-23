# Privacy Policy

**Effective date:** 2026-09-23
**Applies to:** `@h4shed/skill-underworld-writer` (Underworld Writer), all use-case tooling (fiction, true-crime, podcast production), and the Claude Code plugin distribution of this package.

## Summary

Underworld Writer does not collect, transmit, or sell any personal data on its own. It is a local skill/CLI/MCP-tool package: it reads and writes files on the machine it runs on, and it does not phone home. The sections below describe every case where this package can cause data to leave your machine, and only when you deliberately enable that feature.

## 1. No telemetry

This package does not implement telemetry, analytics, crash reporting, or usage tracking of any kind, and has no opt-in mechanism for any of these — there is nothing to enable. Any prior documentation or license text suggesting otherwise was inaccurate and has been corrected.

## 2. PACER integration (fact-checking)

`src/pacer-integration.ts` provides an interface for querying the U.S. federal courts' Public Access to Court Electronic Records (PACER) system for true-crime fact-checking.

- **By default, this runs in mock mode** (`PACERClient`'s `mockMode` defaults to `true`) and returns only bundled sample/test case data. No network request is made and no data leaves your machine.
- **Live PACER queries are not implemented** in this version of the package (`queryCaseByNumber`/`queryCaseByDefendant` throw `Live PACER queries not yet implemented` outside mock mode). If a future version adds live queries, it will require your own PACER account/credentials, and any case-number or defendant-name lookups you perform would be sent to `pacer.uscourts.gov` under PACER's own privacy policy and terms, not this project's.

## 3. Cloud audio synthesis (optional, opt-in)

The podcast-production tooling (`modal/`) can render episode audio using [Modal](https://modal.com) GPU infrastructure running the Chatterbox text-to-speech backend. This only happens if you configure and invoke it yourself (`scripts/setup-modal.sh`, `npm run` targets that call into `modal/app.py`).

If you use this feature:
- Episode script text, voice-profile reference audio, and generated audio/manifest output are uploaded to and stored in Modal Volumes under **your own Modal account**.
- This data is subject to [Modal's own privacy policy](https://modal.com/legal/privacy), not this project's — Fused Gaming LLC does not operate, control, or have access to your Modal account or its storage.
- Nothing is sent to Modal unless you have configured Modal credentials and explicitly run the audio-generation pipeline.

## 4. npm / GitHub

Installing this package via npm, or cloning/using it via GitHub, is subject to [npm's privacy policy](https://docs.npmjs.com/policies/privacy) and [GitHub's privacy statement](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement) respectively, for the ordinary operation of those platforms (package downloads, repository access). This project does not add any additional data collection on top of standard package/repository hosting.

## 5. Local content you create

Character profiles, case files, episode scripts, and other content you author using this tool are stored as plain files on your own machine (or wherever you choose to commit/publish them) under `projects/`, `output/`, and similar directories. Nothing about using this tool causes that content to be transmitted anywhere by default.

## 6. Third-party dependencies

This package has third-party npm dependencies (see `package-lock.json`) and, for cloud audio synthesis, third-party Python/Modal dependencies (see `modal/requirements*`). Those dependencies' own network behavior, if any, is governed by their own licenses and privacy practices, not this document.

## 7. Changes to this policy

If this package's data-handling behavior changes (for example, if live PACER queries or telemetry are added in a future version), this file will be updated to reflect that accurately, and the change will be noted in `CHANGELOG.md`.

## Contact

Questions about this policy: licensing@vln.gg
