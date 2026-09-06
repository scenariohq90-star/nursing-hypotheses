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
    natural_narration = OUTPUT / "narration-ar-natural.wav"
    narration = natural_narration if natural_narration.is_file() else OUTPUT / "narration-ar.wav"
    soundbed = OUTPUT / "soundbed-original.wav"
    final_video = OUTPUT / "nursing-hypotheses-motion-ar-vertical.mp4"
    narration_delay = "" if narration == natural_narration else "adelay=350|350,"

    for source in (raw_video, narration, soundbed):
        if not source.is_file():
            raise FileNotFoundError(source)

    filter_graph = (
        "[0:v]fps=30,scale=1080:1920:force_original_aspect_ratio=decrease,"
        "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=#041c37,format=yuv420p[v];"
        f"[1:a]aresample=48000,aformat=channel_layouts=stereo,{narration_delay}"
        "highpass=f=65,lowpass=f=10000,volume=1.0,apad=pad_dur=50[voice_raw];"
        "[voice_raw]asplit=2[voice_mix][voice_sidechain];"
        "[2:a]aresample=48000,aformat=channel_layouts=stereo,volume=0.32[bed];"
        "[bed][voice_sidechain]sidechaincompress=threshold=0.018:ratio=8:attack=25:release=350[ducked];"
        "[voice_mix][ducked]amix=inputs=2:duration=longest:dropout_transition=2,"
        "loudnorm=I=-16:TP=-1.5:LRA=7,aresample=48000,"
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
