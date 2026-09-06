from __future__ import annotations

import math
import wave
from pathlib import Path

import numpy as np


SAMPLE_RATE = 48_000
DURATION_SECONDS = 50.0
TRANSITIONS = (4.0, 10.0, 17.0, 23.0, 30.0, 36.0, 42.0)
OUTPUT = Path(__file__).resolve().parent / "output" / "soundbed-original.wav"


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    sample_count = int(SAMPLE_RATE * DURATION_SECONDS)
    time = np.arange(sample_count, dtype=np.float64) / SAMPLE_RATE

    slow_breath = 0.55 + 0.45 * np.sin(2 * math.pi * 0.055 * time - 0.8)
    bed = (
        0.017 * np.sin(2 * math.pi * 146.83 * time)
        + 0.012 * np.sin(2 * math.pi * 220.00 * time + 0.7)
        + 0.008 * np.sin(2 * math.pi * 293.66 * time + 1.2)
    ) * slow_breath

    for index, start in enumerate(TRANSITIONS):
        offset = np.maximum(time - start, 0.0)
        active = (time >= start) & (time <= start + 1.8)
        frequency = 523.25 if index % 2 == 0 else 659.25
        chime = 0.045 * np.sin(2 * math.pi * frequency * offset) * np.exp(-2.8 * offset)
        shimmer = 0.018 * np.sin(2 * math.pi * frequency * 1.5 * offset + 0.4) * np.exp(-3.6 * offset)
        bed += (chime + shimmer) * active

    fade_in = np.clip(time / 1.5, 0.0, 1.0)
    fade_out = np.clip((DURATION_SECONDS - time) / 2.5, 0.0, 1.0)
    bed *= fade_in * fade_out
    stereo = np.column_stack((bed * 0.96, bed))
    peak = max(float(np.max(np.abs(stereo))), 1e-9)
    stereo = np.clip(stereo * (0.22 / peak), -1.0, 1.0)
    pcm = (stereo * 32767).astype("<i2")

    with wave.open(str(OUTPUT), "wb") as handle:
        handle.setnchannels(2)
        handle.setsampwidth(2)
        handle.setframerate(SAMPLE_RATE)
        handle.writeframes(pcm.tobytes())

    print(OUTPUT)


if __name__ == "__main__":
    main()
