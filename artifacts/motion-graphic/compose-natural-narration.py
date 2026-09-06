from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "output"
VENDOR = ROOT / ".vendor"
sys.path.insert(0, str(VENDOR))

import imageio_ffmpeg  # noqa: E402


# Scene start, followed by the last audible word plus a short natural tail.
SCENES = (
    (0.45, 3.05),
    (4.10, 5.75),
    (10.15, 6.20),
    (17.25, 3.90),
    (23.20, 4.00),
    (30.15, 4.80),
    (36.15, 4.55),
    (42.20, 6.55),
)


def main() -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    sources = [OUTPUT / f"narration-scene-{index}.wav" for index in range(len(SCENES))]
    for source in sources:
        if not source.is_file():
            raise FileNotFoundError(source)

    filters: list[str] = []
    labels: list[str] = []
    for index, (start_seconds, trim_seconds) in enumerate(SCENES):
        delay_ms = round(start_seconds * 1000)
        label = f"scene{index}"
        filters.append(
            f"[{index}:a]aresample=48000,aformat=sample_rates=48000:channel_layouts=mono,"
            f"atrim=0:{trim_seconds},asetpts=PTS-STARTPTS,adelay={delay_ms}:all=1[{label}]"
        )
        labels.append(f"[{label}]")

    filters.append(
        f"{''.join(labels)}amix=inputs={len(labels)}:duration=longest:normalize=0,"
        "apad=pad_dur=50,atrim=0:50,aresample=48000[narration]"
    )

    target = OUTPUT / "narration-ar-natural.wav"
    command = [ffmpeg, "-y"]
    for source in sources:
        command.extend(("-i", str(source)))
    command.extend((
        "-filter_complex", ";".join(filters),
        "-map", "[narration]",
        "-c:a", "pcm_s16le",
        str(target),
    ))
    subprocess.run(command, check=True)
    print(target)


if __name__ == "__main__":
    main()
