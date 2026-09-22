"""Synthesis backend protocol.

modal/CHATTERBOX_INTEGRATION_PLAN.md Section 5 specifies this contract:
`VoiceSynthesizer` stays responsible for loading the consent-gated voice
profile, resolving reference audio, and selecting synthesis defaults; a
backend is responsible only for model lifecycle and waveform generation.
"""

from typing import Protocol


class SynthesisBackend(Protocol):
    """One TTS engine's model lifecycle + single-call waveform generation."""

    sample_rate: int

    def load(self) -> None:
        """Load model weights. Called once per container from @modal.enter()."""
        ...

    def synthesize(
        self,
        text: str,
        reference_wav: str,
        *,
        language: str = "en",
        exaggeration: float | None = None,
        cfg_weight: float | None = None,
    ) -> bytes:
        """Synthesize `text` conditioned on `reference_wav`, returning WAV bytes."""
        ...
