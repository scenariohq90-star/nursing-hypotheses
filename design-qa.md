# Nursing Hypotheses design QA

## Comparison target

- Source visual truth: `C:\Users\itzzk\.codex\codex-remote-attachments\01a06a4b-bfcd-7810-84f6-4f51e9462279\D36A7DCD-2385-4F7A-BBCE-5486336F699C\1-صورة-1.jpg`
- Preserved source copy: `artifacts/qa/reference-selected.jpg`
- Final rendered implementation: `artifacts/qa/scenario-reference-state-1280x910-normalized.png`
- Full-view paired comparison: `artifacts/qa/comparison-final.html` and `artifacts/qa/comparison-final.png`
- Focused decision comparison: `artifacts/qa/comparison-focused-final.html` and `artifacts/qa/comparison-focused-final.png`
- Responsive evidence: `artifacts/qa/question-bank-mobile-ar-390x720-normalized.png`, `artifacts/qa/learning-account-mobile-en-390x844.png`, `artifacts/qa/learning-account-mobile-ar-390x844.png`, and `artifacts/qa/learning-account-mobile-ar-menu-390x844.png`
- Private production evidence: `artifacts/qa/live-private-home-1200x750.png`
- Local route: `http://localhost:4173/#/scenario/ed-older-adult-dyspnea`
- Learning-account route: `http://localhost:5173/#/learning`

## Normalization and state

- Source: 1280 x 910 JPEG.
- Final desktop implementation: 1280 x 910 rendered pixels, 1280 x 910 CSS content viewport, device pixel ratio 1. The in-app browser was set to 1295 x 921 so its scrollbar/chrome subtraction produced an exact 1280 x 910 content capture.
- Desktop state: English, Emergency Department, `Breathless at Triage`, step 2 of 6, no answer selected, HR 112, RR 26, BP 148/88 and SpO2 89% on room air.
- Mobile question-bank implementation: 390 x 720 rendered pixels, 390px CSS content width, device pixel ratio 1. The in-app browser was set to 405 x 748 to normalize its content capture. `scrollWidth` equalled `clientWidth` at 390px.
- Mobile learning-account implementation: 390 x 844 rendered pixels, 390 x 844 CSS viewport, device pixel ratio 1, captured with Chrome device-metrics emulation. English LTR and Arabic RTL both reported `document.scrollWidth = 390`, with no element extending outside the viewport. The Arabic menu-open state retained the same width.
- Both source and rendered desktop images are present together in the full-view comparison. The focused comparison uses those same normalized images and enlarges the timeline, prompt, options and primary action for readable inspection.

## Findings

No actionable P0, P1 or P2 visual, responsive, accessibility or core-flow differences remain.

- **Fonts and typography:** Inter and IBM Plex Sans Arabic provide the source-like clinical sans-serif hierarchy, with clear display, body and microcopy weights. English and Arabic wrap without clipping in the inspected desktop and mobile views.
- **Spacing and layout rhythm:** the patient / decision / progress three-column composition, separators, option sizing and CTA hierarchy follow the source. The compact context strip preserves the added variable-scenario feature without pushing the primary confirmation action below the matched desktop viewport.
- **Colors and tokens:** the navy header, teal actions and progress, white/cool-grey surfaces and amber safety treatment track the source palette and keep semantic states distinguishable.
- **Image and icon quality:** the source contains no clinical photography. Consistent Phosphor vector icons are used for clinical and navigation symbols; there are no emoji, placeholder images, handcrafted inline SVGs or CSS-art substitutes.
- **Copy and content:** the bilingual clinical prompt, vitals, progress and choices align with the reference state. The fictional-case safety strip, expandable context explanation and source disclosure are intentional educational safeguards. Exam content is identified as original independent practice.
- **Interaction states:** scenario choice, confirm, feedback and next-step states work; context details expand; question-bank validation, locked answers, final debrief and local analytics work; mobile navigation, language switching, references, membership-preview and learning-account mode controls work.
- **Responsiveness and accessibility:** Arabic RTL and English LTR were checked. At 390px there was no horizontal overflow on either the question bank or the newly integrated account panel. The Arabic mobile menu opens as a two-column navigation grid with seven reachable links and exposes `aria-expanded="true"`. Controls are semantic buttons, radios, links, details/summary and progress elements; focus styles and screen-reader labels remain present.
- **Console:** final in-app browser inspection returned no warnings or errors. A fresh CDP network pass on the learning route returned no failed or HTTP 4xx/5xx responses.
- **Published surface:** the owner-only production deployment screenshot shows the bilingual header, safety notice, main learning proposition, featured simulation and 24 / 12 / 28 summary counts rendered correctly.

Accepted P3 differences:

- A standalone production logo file was not supplied. The implementation uses the closest coherent icon-library mark instead of reconstructing the screenshot mark with custom art.
- The safety notice and compact scenario-variation strip add limited height beyond the source. They are intentional safeguards and the primary question, all choices and confirmation action still fit in the normalized desktop frame.
- The implementation exposes a larger navigation set because the requested question bank and membership preview are real routes. At the reference width, the full navigation remains visible and uses the source's restrained header treatment.

## Comparison history

### Pass 1 — blocked

Evidence: `artifacts/qa/comparison-pass1.html`, `artifacts/qa/comparison-pass1.png`, and `artifacts/qa/scenario-reference-state-1280x910.png`.

- **[P2] Desktop navigation collapsed too early.** At the source width the reference showed direct navigation, while the implementation showed a menu button. Fix: retain the compressed desktop navigation through 1120px and reduce gaps/type size below 1320px.
- **[P2] Primary confirmation action fell below the matched viewport.** The first scenario-context treatment used three text rows and displaced the core decision action. Fix: convert it to a compact one-row label/chip strip with semantic expandable details. Closed height reduced from approximately 132px to 70px at the inspected desktop width.

The initial browser capture excluded scrollbar space and measured 1265 x 899, so it was used only to identify these unambiguous structural differences. The post-fix pass was recaptured at an exact normalized 1280 x 910 before acceptance.

### Final pass — passed

Evidence: `artifacts/qa/scenario-reference-state-1280x910-normalized.png`, `artifacts/qa/comparison-final.png`, `artifacts/qa/comparison-focused-final.png`, and `artifacts/qa/question-bank-mobile-ar-390x720-normalized.png`.

- Direct desktop navigation is visible at the matched source size.
- The scenario variation remains clear, and its longer explanation is available through `details/summary`.
- The question, three options and primary confirmation action are visible in the matched frame.
- The focused paired comparison confirmed readable prompt hierarchy, option borders, controls, timeline and CTA treatment.
- Arabic question-bank content rendered at a true 390px content width with no horizontal overflow.
- The learning-account panel, bilingual language switch and menu also rendered at a true 390px width in English and Arabic without clipping. An earlier command-line screenshot was rejected because headless Chrome laid the page out at its 500px minimum and cropped the PNG to 390px; the accepted evidence uses device-metrics emulation and confirms `innerWidth`, `clientWidth` and `scrollWidth` are all 390px.

## Browser verification checklist

- [x] Source and implementation opened together in one full-view comparison.
- [x] Central decision region opened together in one focused comparison.
- [x] Desktop source state normalized to 1280 x 910 at device pixel ratio 1.
- [x] Arabic mobile question bank normalized to 390 x 720 with no horizontal overflow.
- [x] English and Arabic learning-account states captured at a true 390 x 844 viewport with no horizontal overflow.
- [x] Arabic/English switching and RTL/LTR checked.
- [x] Scenario answer validation, feedback, next step and context expansion checked.
- [x] Question-bank setup, empty-submit alert, locked answer, debrief and learning analytics checked.
- [x] Mobile menu, membership preview, exact footer credit and 28-source reference set checked.
- [x] Mobile account sign-in/create-account mode controls and seven-link menu checked without submitting credentials.
- [x] Owner-only production deployment completed and its rendered home screenshot was inspected.
- [x] Runtime console checked with no warnings or errors.
- [x] 44 content, engine, account-sync and security tests, the production build, and 4 Sites-worker tests passed.

final result: passed
