# Nursing Hypotheses motion graphic

This folder contains the source and final deliverable for the bilingual Nursing Hypotheses overview video.

- Final video: `nursing-hypotheses-motion-ar-vertical.mp4`
- Format: 1080 x 1920, 9:16, 50 seconds, H.264/AAC
- Narration: Arabic
- On-screen language: Arabic with supporting English copy
- Sound: locally generated original ambient soundbed

The video presents the public educational website, branching fictional scenarios, original question practice, medication-math exercises, feedback, references, and learning-pattern review. It does not present patient-specific guidance or clinical dosing recommendations.

## Source files

- `motion.html`: responsive animated composition and scene timing
- `capture-motion.cjs`: browser capture script
- `narration-ar.txt`: approved Arabic narration
- `generate-soundbed.py`: original soundbed generator
- `render-motion.py`: final H.264/AAC render pipeline

Transient recordings, audio intermediates, preview frames, and local browser profiles are intentionally ignored by Git.

The capture script loads a project-installed `playwright` package by default. In a bundled runtime, set `MOTION_PLAYWRIGHT_MODULE` to the Playwright module directory. Set `CHROME_PATH` only when Chrome is not installed in a standard Windows location.
