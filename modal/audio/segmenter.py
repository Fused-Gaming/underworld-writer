"""Sentence-aware text chunking for TTS synthesis.

modal/config/render_profiles/podcast-standard.json declares
`synthesis.chunking` (sentence-aware, 10-30s target) but the prior
`modal/app.py` sent each full script segment — often several paragraphs —
to the model as a single inference call. VOICE_PODCAST_GENERATION.md
Section 5 calls that out directly: long single-shot TTS calls are a
concrete cause of degraded pacing/prosody, and a single failed call forces
re-rendering the whole segment instead of one small chunk. This splits a
segment's text into chunks sized for one inference call each, without ever
splitting inside a sentence.
"""

import re

_SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+(?=[A-Z0-9\"'‘“])")


def split_sentences(text: str) -> list[str]:
    text = text.strip()
    if not text:
        return []
    return [s.strip() for s in _SENTENCE_SPLIT.split(text) if s.strip()]


def chunk_text(
    text: str,
    *,
    words_per_minute: int = 145,
    target_seconds_min: int = 10,
    target_seconds_max: int = 30,
) -> list[str]:
    """Group sentences into chunks targeting `target_seconds_max` of speech.

    Never splits a sentence. A single sentence longer than the max target
    still becomes its own chunk rather than being cut mid-sentence.
    """
    max_words = max(1, round(words_per_minute * target_seconds_max / 60))
    min_words = max(1, round(words_per_minute * target_seconds_min / 60))

    sentences = split_sentences(text)
    chunks: list[str] = []
    current: list[str] = []
    current_words = 0

    for sentence in sentences:
        sentence_words = len(sentence.split())
        if current and current_words + sentence_words > max_words:
            chunks.append(" ".join(current))
            current, current_words = [], 0
        current.append(sentence)
        current_words += sentence_words
        if current_words >= min_words and current_words >= max_words:
            chunks.append(" ".join(current))
            current, current_words = [], 0

    if current:
        chunks.append(" ".join(current))

    return chunks or [text.strip()]
