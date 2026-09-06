from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "output"
VENDOR = ROOT / ".vendor"
sys.path.insert(0, str(VENDOR))

import imageio_ffmpeg  # noqa: E402


def main() -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    raw_video = OUTPUT / "motion-raw.webm"
    narration = OUTPUT / "narration-ar.wav"
    soundbed = OUTPUT / "soundbed-original.wav"
    final_video = OUTPUT / "nursing-hypotheses-motion-ar-vertical.mp4"

    for source in (raw_video, narration, soundbed):
        if not source.is_file():
            raise FileNotFoundError(source)

    filter_graph = (
        "[0:v]fps=30,scale=1080:1920:force_original_aspect_ratio=decrease,"
        "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=#041c37,format=yuv420p[v];"
        "[1:a]aresample=48000,aformat=channel_layouts=stereo,adelay=350|350,"
        "highpass=f=65,lowpass=f=10000,volume=1.25,apad=pad_dur=50[voice];"
        "[2:a]aresample=48000,aformat=channel_layouts=stereo,volume=0.34[bed];"
        "[voice][bed]amix=inputs=2:duration=longest:dropout_transition=2,"
        "loudnorm=I=-16:TP=-1.5:LRA=9,aresample=48000,"
        "aformat=sample_rates=48000:channel_layouts=stereo[a]"
    )
    command = [
        ffmpeg,
        "-y",
        "-i", str(raw_video),
        "-i", str(narration),
        "-i", str(soundbed),
        "-filter_complex", filter_graph,
        "-map", "[v]",
        "-map", "[a]",
        "-t", "50",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "20",
        "-c:a", "aac",
        "-b:a", "160k",
        "-movflags", "+faststart",
        str(final_video),
    ]
    subprocess.run(command, check=True)
    print(final_video)


if __name__ == "__main__":
    main()
