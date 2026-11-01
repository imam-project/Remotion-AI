"""Generate original soft pop cues and UI transitions for the first Remotion story."""

from __future__ import annotations

import math
import random
import wave
from array import array
from pathlib import Path


SAMPLE_RATE = 48_000
FPS = 30
DURATION_SECONDS = 24.2
SAMPLE_COUNT = round(SAMPLE_RATE * DURATION_SECONDS)
OUTPUT = Path(__file__).resolve().parents[1] / "public" / "audio" / "first-remotion-ui.wav"

left = array("f", [0.0]) * SAMPLE_COUNT
right = array("f", [0.0]) * SAMPLE_COUNT


def add_pop(frame: int, pitch: float = 1120, gain: float = 0.032) -> None:
    """A short, rounded descending tick aligned to each spoken word reveal."""
    start = round(frame / FPS * SAMPLE_RATE)
    duration = 0.082
    count = round(duration * SAMPLE_RATE)
    phase = 0.0
    for i in range(count):
        u = i / max(1, count - 1)
        hz = pitch - 390 * u
        phase += 2 * math.pi * hz / SAMPLE_RATE
        attack = min(1.0, i / max(1, int(SAMPLE_RATE * 0.003)))
        envelope = attack * math.exp(-6.3 * u) * (1 - 0.22 * u)
        sample = (math.sin(phase) + 0.13 * math.sin(2 * phase)) * gain * envelope
        idx = start + i
        if idx < SAMPLE_COUNT:
            left[idx] += sample * 0.707
            right[idx] += sample * 0.707


def add_whoosh(frame: int, duration: float = 0.25, gain: float = 0.035, seed: int = 23) -> None:
    start = round(frame / FPS * SAMPLE_RATE)
    count = round(duration * SAMPLE_RATE)
    rng = random.Random(seed)
    filtered = 0.0
    for i in range(count):
        u = i / max(1, count - 1)
        filtered = 0.92 * filtered + 0.08 * rng.uniform(-1.0, 1.0)
        envelope = math.sin(math.pi * u) ** 1.5
        sample = filtered * gain * envelope
        idx = start + i
        if idx < SAMPLE_COUNT:
            left[idx] += sample * 0.707
            right[idx] += sample * 0.707


# One very soft pop per spoken word, aligned with AppleCaption's reveal frames.
caption_pops = [
    2, 16, 33, 45, 71,
    109, 116, 137, 146, 156, 165,
    194, 200, 207, 213, 222, 231, 243, 260,
    330, 340, 352, 379, 387, 398, 409, 421,
    473, 486, 513, 527, 552, 562, 572,
    603, 613, 626,
    662, 668, 676, 684,
]
for index, frame in enumerate(caption_pops):
    add_pop(frame, pitch=1120 + (index % 4) * 60, gain=0.024)

# Gentle swishes support the larger UI cards and the move into the closing group.
for index, frame in enumerate([7, 98, 220, 316, 459, 601]):
    add_whoosh(frame, duration=0.27 if frame < 500 else 0.32, gain=0.035, seed=frame + index)

# UI ticks mark the software handoff and the code panel, away from spoken-word pops.
for index, frame in enumerate([276]):
    add_pop(frame, pitch=1420 + (index % 3) * 80, gain=0.022)

peak = max(max(abs(sample) for sample in left), max(abs(sample) for sample in right))
normalization = min(1.0, 0.55 / max(peak, 1e-9))
interleaved = array("h")
for l_sample, r_sample in zip(left, right):
    interleaved.append(round(max(-1.0, min(1.0, l_sample * normalization)) * 32767))
    interleaved.append(round(max(-1.0, min(1.0, r_sample * normalization)) * 32767))

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(OUTPUT), "wb") as wav:
    wav.setnchannels(2)
    wav.setsampwidth(2)
    wav.setframerate(SAMPLE_RATE)
    wav.writeframes(interleaved.tobytes())

print(f"Wrote {OUTPUT} ({DURATION_SECONDS}s, stereo, {SAMPLE_RATE} Hz)")
