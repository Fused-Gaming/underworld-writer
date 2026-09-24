# Versioned voice references

The Modal sync job maps files under this directory into the persistent `underworld-voice-profiles` volume.

Expected Episode 1 host files:

```text
clips/eric-nissen/eric-nissen-canonical.wav
clips/eric-nissen/eric-nissen-alt-neutral-emphatic.wav
clips/eric-nissen/eric-nissen-alt-emphatic.wav
```

The bytes must match the SHA-256 values in `projects/insight-corruption/voice-profiles/eric-william-nissen.json`. The sync job fails closed on missing files, hash mismatches, or unconfirmed consent.

These files are intentionally **not baked into the Chatterbox Docker/Modal image**. They are synchronized from the checked-out repository into the persistent Modal volume during deployment. This avoids duplicating voice data in immutable image layers while still making repository state the deployment source of truth.

