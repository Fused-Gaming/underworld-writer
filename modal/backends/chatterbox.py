"""Chatterbox TTS synthesis backend.

Replaces the XTTS-v2 baseline per modal/CHATTERBOX_INTEGRATION_PLAN.md
Phase 1: Chatterbox clones a voice zero-shot from a short reference clip,
benchmarks cheaper on Modal's smaller GPUs (T4/L4 vs. the H100 the prior
implementation over-provisioned), and ships with built-in PerTh
watermarking for synthetic-audio provenance — see
projects/insight-corruption/production/voice/VOICE_PODCAST_GENERATION.md
Section 2.1.
"""

import io

DEFAULT_EXAGGERATION = 0.5
DEFAULT_CFG_WEIGHT = 0.5


class ChatterboxBackend:
    """Wraps chatterbox-tts behind the SynthesisBackend protocol."""

    sample_rate = 24000  # overwritten by the loaded model's native rate, if it differs

    def __init__(self) -> None:
        self._model = None

    def load(self) -> None:
        from chatterbox.tts import ChatterboxTTS

        self._model = ChatterboxTTS.from_pretrained(device="cuda")
        self.sample_rate = getattr(self._model, "sr", self.sample_rate)

    def synthesize(
        self,
        text: str,
        reference_wav: str,
        *,
        language: str = "en",
        exaggeration: float | None = None,
        cfg_weight: float | None = None,
    ) -> bytes:
        if self._model is None:
            raise RuntimeError("ChatterboxBackend.load() must run before synthesize()")

        import soundfile as sf

        wav = self._model.generate(
            text,
            audio_prompt_path=reference_wav,
            exaggeration=DEFAULT_EXAGGERATION if exaggeration is None else exaggeration,
            cfg_weight=DEFAULT_CFG_WEIGHT if cfg_weight is None else cfg_weight,
        )

        buf = io.BytesIO()
        sf.write(buf, wav.squeeze().cpu().numpy(), self.sample_rate, format="WAV")
        return buf.getvalue()
