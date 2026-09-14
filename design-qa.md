# Nursing Hypotheses design QA

## Comparison target

- Selected direction: `artifacts/qa/reference-selected-v2.png`
- Implementation capture: `artifacts/qa/home-v2-mobile-ar-viewport.png`
- Paired visual comparison: `artifacts/qa/comparison-v2-mobile.png`
- Central references capture: `artifacts/qa/references-v2-mobile-ar.png`
- Local routes: `http://127.0.0.1:5173/#/home` and `http://127.0.0.1:5173/#/resources`

## Viewport and state

- Selected direction normalized from 853 x 1880 to the implementation height for paired review.
- Mobile implementation inspected in Chrome at a 390 x 844 viewport override. Browser content measured 375 CSS pixels because of the visible scrollbar; `scrollWidth` equalled `clientWidth` at 375, so no horizontal overflow was present.
- Desktop implementation inspected in Chrome at 1440 x 900. Content measured 1425 CSS pixels with `scrollWidth` equal to `clientWidth`; the desktop navigation was visible and the mobile dock was hidden.
- Arabic used `dir="rtl"` and English used `dir="ltr"`. Both language states rendered without clipping.
- Browser console inspection returned no warnings or errors.

## Interaction coverage

- Opened and closed the Tools menu with Escape; focus returned to its trigger.
- Opened the featured Emergency Department scenario and confirmed the patient summary, timeline, first prompt, options, and action fit the mobile flow without inline source lists or repeated warning banners.
- Started a ten-question set, selected and locked an answer, and confirmed rationale feedback remained while question source links were absent.
- Opened the central References page, confirmed 73 deduplicated records, search, usage filters, access notes, and 73 external publisher links.
- Confirmed the fixed mobile dock contains only Scenarios, Question bank, and My learning.

## Comparison iterations

### Pass 1

- The new hero extended too far vertically and pushed the second shortcut behind the mobile dock.
- The scenario patient rail and timeline consumed too much of the first viewport.

### Pass 2

- Reduced the mobile hero and heading spacing so both shortcuts remain visible and reachable.
- Compacted the mobile patient rail, context, toolbar, and timeline so the first decision prompt begins inside the initial viewport.
- Replaced the large navigation menu with three primary destinations and a compact Tools menu.
- Removed the prominent homepage warning strip and all per-scenario and per-question reference lists. Preserved scope information in About, Terms, and Privacy, plus calculator-specific safety controls.

## Final findings

- The implementation preserves the selected direction's navy/teal clinical identity, photographic simulation hero, large decision prompt, vital cards, six-step rail, bright primary action, shortcut cards, and fixed mobile dock.
- The implementation intentionally omits the reference design's warning row because the requested content now lives in low-prominence policy pages.
- Reference titles and links appear only in the central References route. Scenario and question source identifiers remain internal for editorial traceability and automated checks.
- Touch targets, semantic headings, keyboard controls, visible focus styles, and RTL/LTR layout remain intact.
- Verification passed: 77 application tests, production build, and 15 Sites worker tests.

final result: passed
