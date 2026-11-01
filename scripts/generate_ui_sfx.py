"""Generate the original, frame-synced UI sound bed for MotionPulse."""

from __future__ import annotations

import math
import random
import wave
from array import array
from pathlib import Path


SAMPLE_RATE = 48_000
FPS = 30
DURATION_SECONDS = 12
FRAME_COUNT = SAMPLE_RATE * DURATION_SECONDS
OUTPUT = Path(__file__).resolve().parents[1] / "public" / "audio" / "motion-pulse-ui.wav"

left = array("f", [0.0]) * FRAME_COUNT
right = array("f", [0.0]) * FRAME_COUNT


def add_tone(
    start_frame: int,
    duration: float,
    frequency_start: float,
    frequency_end: float,
    gain: float,
    pan: float = 0.0,
    decay: float = 18.0,
    harmonic: float = 0.18,
) -> None:
    start = round(start_frame / FPS * SAMPLE_RATE)
    count = round(duration * SAMPLE_RATE)
    pan = max(-1.0, min(1.0, pan))
    gain_left = math.sqrt((1.0 - pan) * 0.5)
    gain_right = math.sqrt((1.0 + pan) * 0.5)
    phase = 0.0
    for i in range(count):
        u = i / max(1, count - 1)
        frequency = frequency_start + (frequency_end - frequency_start) * u
        phase += 2.0 * math.pi * frequency / SAMPLE_RATE
        attack = min(1.0, i / max(1, int(SAMPLE_RATE * 0.004)))
        envelope = attack * math.exp(-decay * u)
        sample = (math.sin(phase) + harmonic * math.sin(2.0 * phase)) * gain * envelope
        index = start + i
        if index < FRAME_COUNT:
            left[index] += sample * gain_left
            right[index] += sample * gain_right


def add_whoosh(start_frame: int, duration: float, gain: float, pan: float = 0.0, seed: int = 17) -> None:
    start = round(start_frame / FPS * SAMPLE_RATE)
    count = round(duration * SAMPLE_RATE)
    rng = random.Random(seed)
    filtered = 0.0
    pan = max(-1.0, min(1.0, pan))
    gain_left = math.sqrt((1.0 - pan) * 0.5)
    gain_right = math.sqrt((1.0 + pan) * 0.5)
    for i in range(count):
        u = i / max(1, count - 1)
        filtered = 0.90 * filtered + 0.10 * rng.uniform(-1.0, 1.0)
        envelope = math.sin(math.pi * u) ** 1.5
        sample = filtered * gain * envelope
        index = start + i
        if index < FRAME_COUNT:
            left[index] += sample * gain_left
            right[index] += sample * gain_right


# Four soft ticks follow the headline's staggered word reveals.
for frame, pitch in [(3, 1560), (10, 1370), (19, 1190), (26, 1460)]:
    add_tone(frame, 0.055, pitch, pitch * 0.82, 0.075, decay=22.0, harmonic=0.08)

# UI capsule and curve editor arrive with airy swells and rounded, quiet impacts.
add_whoosh(51, 0.30, 0.16, pan=-0.12, seed=51)
add_tone(51, 0.16, 235, 145, 0.18, pan=-0.12, decay=9.0, harmonic=0.10)
add_whoosh(102, 0.38, 0.19, pan=0.08, seed=102)
add_tone(102, 0.21, 185, 92, 0.20, pan=0.08, decay=8.0, harmonic=0.12)

# The movement-profile curve begins drawing at frame 118; a light ascending
# glassy sweep follows its rise without masking the earlier card entrance.
add_whoosh(116, 0.34, 0.12, pan=0.12, seed=116)
add_tone(118, 0.24, 430, 1040, 0.09, pan=0.12, decay=7.0, harmonic=0.20)

# Emphasis moves across Weight, Timing, and Flow.
add_tone(172, 0.075, 910, 770, 0.09, pan=-0.16, decay=20.0, harmonic=0.07)
add_tone(196, 0.075, 1180, 1010, 0.085, pan=0.04, decay=20.0, harmonic=0.07)
add_tone(226, 0.13, 680, 1040, 0.08, pan=0.16, decay=10.0, harmonic=0.22)

# Floating tags get a gently rising three-note UI sparkle.
for frame, pitch, pan in [(252, 740, -0.25), (260, 880, 0.05), (268, 990, 0.25)]:
    add_tone(frame, 0.20, pitch, pitch * 1.035, 0.07, pan=pan, decay=8.0, harmonic=0.28)

# Resolve into the final mark, then let it settle with a low-volume ping.
add_whoosh(323, 0.34, 0.15, pan=0.0, seed=323)
add_tone(323, 0.34, 520, 780, 0.095, pan=0.0, decay=4.5, harmonic=0.24)
add_tone(339, 0.14, 880, 720, 0.055, pan=0.0, decay=14.0, harmonic=0.08)

peak = max(max(abs(sample) for sample in left), max(abs(sample) for sample in right))
normalization = min(1.0, 0.78 / max(peak, 1e-9))
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

interleaved = array("h")
for l_sample, r_sample in zip(left, right):
    interleaved.append(round(max(-1.0, min(1.0, l_sample * normalization)) * 32767))
    interleaved.append(round(max(-1.0, min(1.0, r_sample * normalization)) * 32767))

with wave.open(str(OUTPUT), "wb") as wav_file:
    wav_file.setnchannels(2)
    wav_file.setsampwidth(2)
    wav_file.setframerate(SAMPLE_RATE)
    wav_file.writeframes(interleaved.tobytes())

print(f"Wrote {OUTPUT} ({DURATION_SECONDS}s, stereo, {SAMPLE_RATE} Hz)")
