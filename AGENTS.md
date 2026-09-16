# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

## Product direction selected by the user

- The product is a responsive website, not a native mobile application.
- The selected source of visual truth is the second generated concept: a simplified navy-and-teal website with a compact header, an immersive featured-scenario hero, two vital-sign cards, a six-point decision path, one dominant start action, two supporting learning links, and a three-item mobile bottom navigation.
- The selected visual reference is stored at `artifacts/qa/reference-selected-v2.png`.
- The website is bilingual Arabic/English with complete RTL/LTR parity and a 390px mobile layout.
- The product is an educational simulation and exam-practice website only. It must never present itself as a clinical decision-support tool or a substitute for local policy, professional judgement, or supervised training.
- Scores are learning feedback only, never a professional competency, credential, licensure-readiness prediction, or clinical-decision claim.
- Every clinical case is fictional, must prohibit real patient data, and must retain internal mappings to versioned authoritative references.
- Keep source titles and external links in the central References page. Scenario and question interfaces show rationales without inline source lists so the learning flow stays focused.
- Do not repeat large educational-disclaimer banners throughout normal learning flows. Keep the product boundary and real-patient-data rules in About, Terms, Privacy, and calculator-specific safety controls, and never use copy that implies bedside decision support.
- Do not show the removed generic "calculation only — not a dose recommendation" banner above medication calculators; retain the input-specific unit, label, and result safeguards without changing named medicine shortcuts.
- Keep the Privacy notice concise: do not add a standalone "processors, location and technical records" section, while retaining accurate, necessary service and retention disclosures in plain language.
- The public beta owner dashboard is server-authorized and shows only anonymous daily usage aggregates. It must not collect answer selections, patient data, IP/user-agent, or persistent visitor identifiers; visit-session counts are approximate and begin only after activation.
- The website includes original bilingual practice banks for SNLE and NCLEX-RN; never reproduce secure or official exam items, predict licensure readiness, or imply endorsement by SCFHS or NCSBN.
- Scenario presentations should offer safe contextual variation while preserving the clinically reviewed best action, rationale, score, and source set.
- Subscriptions, pricing, checkout, institutional plans, and paid-content entitlements are out of the current product scope. Do not surface membership sales or subscription calls to action unless the user explicitly starts a future billing phase.
- The visible footer credit must include the exact name `Abdulkarim alhejaili`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
