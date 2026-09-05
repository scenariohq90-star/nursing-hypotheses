# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

## Product direction selected by the user

- The product is a responsive website, not a native mobile application.
- The selected source of visual truth is the first generated concept: a navy and teal clinical decision workspace with a slim website header, patient-status rail, central branching scenario, and learning-progress/evidence rail.
- The website is bilingual Arabic/English with complete RTL/LTR parity and a 390px mobile layout.
- The product is an educational simulation and exam-practice website only. It must never present itself as a clinical decision-support tool or a substitute for local policy, professional judgement, or supervised training.
- Scores are learning feedback only, never a professional competency, credential, licensure-readiness prediction, or clinical-decision claim.
- Every clinical case is fictional, must prohibit real patient data, and must link explanations to versioned authoritative references.
- The website includes original bilingual practice banks for SNLE and NCLEX-RN; never reproduce secure or official exam items, predict licensure readiness, or imply endorsement by SCFHS or NCSBN.
- Scenario presentations should offer safe contextual variation while preserving the clinically reviewed best action, rationale, score, and source set.
- Subscriptions, pricing, checkout, institutional plans, and paid-content entitlements are out of the current product scope. Do not surface membership sales or subscription calls to action unless the user explicitly starts a future billing phase.
- The visible footer credit must include the exact name `Abdulkarim alhejaili`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
