import assert from "node:assert/strict";
import test from "node:test";

import { competencyDomains, references, scenarios, selectScenarioVariant } from "../src/data/scenarios.js";
import {
  createEmptyProfile,
  getCompetencyInsights,
  gradeAttempt,
  mergeAttempt,
} from "../src/lib/learning-engine.js";

const classifications = new Set(["safe", "gap", "delay", "unsafe"]);

function assertBilingual(value, label) {
  assert.equal(typeof value?.en, "string", `${label} needs English copy`);
  assert.equal(typeof value?.ar, "string", `${label} needs Arabic copy`);
  assert.ok(value.en.trim(), `${label} English copy cannot be empty`);
  assert.ok(value.ar.trim(), `${label} Arabic copy cannot be empty`);
}

test("the learning library ships twelve bilingual department scenarios", () => {
  assert.equal(scenarios.length, 12);
  assert.equal(new Set(scenarios.map((scenario) => scenario.departmentId)).size, 12);

  for (const scenario of scenarios) {
    assert.match(scenario.id, /^[a-z0-9-]+$/);
    assert.equal(scenario.fictional, true);
    assert.equal(scenario.reviewStatus, "draft");
    assert.equal(scenario.contentDraftDate, "2026-09-04");
    assert.equal(scenario.clinicalReviewDate, null);
    assert.equal(scenario.clinicalReview.status, "pending");
    assert.equal(scenario.legalReview.status, "pending");
    assert.equal(scenario.translationReview.status, "pending");
    assert.equal(scenario.evidenceReview.status, "mapped-pending-human-verification");
    assert.equal(scenario.evidenceReview.mappedAt, "2026-09-05");
    assert.equal(scenario.contentVersion, "1.3.0");
    assertBilingual(scenario.title, `${scenario.id} title`);
    assertBilingual(scenario.summary, `${scenario.id} summary`);
    assertBilingual(scenario.department, `${scenario.id} department`);
    assert.ok(scenario.steps.length >= 3, `${scenario.id} needs at least three decisions`);
    assert.ok(scenario.competencies.length > 0, `${scenario.id} needs competency metadata`);
    assert.ok(scenario.referenceIds.length > 0, `${scenario.id} needs evidence references`);
    assert.equal(scenario.contextVariants.length, 2, `${scenario.id} needs two context variants`);
    assert.equal(scenario.accessTier, "free");
    for (const variant of scenario.contextVariants) {
      assertBilingual(variant.label, `${variant.id} label`);
      assertBilingual(variant.setup, `${variant.id} setup`);
      assert.ok(variant.changes.length >= 2, `${variant.id} needs visible context changes`);
      for (const change of variant.changes) {
        assertBilingual(change.label, `${variant.id}:${change.id} label`);
        assertBilingual(change.value, `${variant.id}:${change.id} value`);
      }
    }
    for (const step of scenario.steps) {
      for (const vital of step.vitals) assertBilingual(vital.value, `${step.id} vital value`);
      assert.equal(step.evidenceClaims.length, 1, `${step.id} needs a mapped rationale claim`);
      assert.equal(step.evidenceClaims[0].status, "mapped-pending-human-verification");
      assert.deepEqual(step.evidenceClaims[0].referenceIds, step.referenceIds);
    }
  }
});

test("context selection is deterministic and changes with seeds across the library", () => {
  let changedScenarioCount = 0;
  for (const scenario of scenarios) {
    assert.equal(selectScenarioVariant(scenario, "same-seed")?.id, selectScenarioVariant(scenario, "same-seed")?.id);
    const ids = new Set(Array.from({ length: 20 }, (_, index) => selectScenarioVariant(scenario, `seed-${index}`)?.id));
    if (ids.size > 1) changedScenarioCount += 1;
  }
  assert.equal(changedScenarioCount, scenarios.length);
});

test("option wording does not make length a universal answer cue", () => {
  let safeLongestEnglish = 0;
  let safeLongestArabic = 0;
  let stepCount = 0;

  for (const scenario of scenarios) {
    for (const step of scenario.steps) {
      stepCount += 1;
      const safeChoice = step.choices.find((choice) => choice.classification === "safe");
      assert.ok(safeChoice);
      if (safeChoice.text.en.length === Math.max(...step.choices.map((choice) => choice.text.en.length))) {
        safeLongestEnglish += 1;
      }
      if (safeChoice.text.ar.length === Math.max(...step.choices.map((choice) => choice.text.ar.length))) {
        safeLongestArabic += 1;
      }
    }
  }

  assert.ok(safeLongestEnglish / stepCount < 2 / 3);
  assert.ok(safeLongestArabic / stepCount < 2 / 3);
});

test("all decisions are bilingual, gradable, and include original feedback", () => {
  const stepIds = new Set();
  const choiceIds = new Set();

  for (const scenario of scenarios) {
    for (const step of scenario.steps) {
      assert.ok(!stepIds.has(step.id), `duplicate step id: ${step.id}`);
      stepIds.add(step.id);
      assertBilingual(step.narrative, `${step.id} narrative`);
      assertBilingual(step.question, `${step.id} question`);
      assert.equal(step.choices.length, 3, `${step.id} should have three choices`);
      assert.ok(step.choices.some((choice) => choice.classification === "safe"));

      for (const choice of step.choices) {
        assert.ok(!choiceIds.has(choice.id), `duplicate choice id: ${choice.id}`);
        choiceIds.add(choice.id);
        assertBilingual(choice.text, `${choice.id} text`);
        assertBilingual(choice.feedback, `${choice.id} feedback`);
        assertBilingual(choice.rationale, `${choice.id} rationale`);
        assert.ok(Number.isFinite(choice.score) && choice.score >= 0 && choice.score <= 100);
        assert.ok(classifications.has(choice.classification));
        if (choice.classification === "unsafe") assert.equal(choice.score, 0, `${choice.id} unsafe choices cannot receive credit`);
        assert.equal(typeof choice.competency, "string");
        assert.ok(choice.competency);
      }
    }
  }

  assert.equal(stepIds.size, 39);
  assert.equal(choiceIds.size, 117);
});

test("every cited source is present and uses a fixed HTTPS URL", () => {
  assert.equal(references.length, 67);
  const ids = new Set(references.map((reference) => reference.id));
  assert.equal(ids.size, references.length);

  for (const reference of references) {
    assertBilingual(reference.title, `${reference.id} title`);
    assertBilingual(reference.organization, `${reference.id} organization`);
    assert.doesNotThrow(() => new URL(reference.url));
    assert.equal(new URL(reference.url).protocol, "https:");
  }

  for (const scenario of scenarios) {
    for (const referenceId of scenario.referenceIds) {
      assert.ok(ids.has(referenceId), `${scenario.id} cites missing reference ${referenceId}`);
    }
    for (const step of scenario.steps) {
      assert.ok(Array.isArray(step.referenceIds) && step.referenceIds.length > 0, `${step.id} needs a source set`);
      for (const referenceId of step.referenceIds) {
        assert.ok(ids.has(referenceId), `${step.id} cites missing reference ${referenceId}`);
        assert.ok(scenario.referenceIds.includes(referenceId), `${step.id} source must belong to its scenario source set`);
      }
    }
    for (const hypothesis of scenario.hypotheses ?? []) {
      assert.ok(hypothesis.referenceIds.length > 0, `${hypothesis.id} needs direct references`);
      for (const referenceId of hypothesis.referenceIds) {
        assert.ok(ids.has(referenceId), `${hypothesis.id} cites missing reference ${referenceId}`);
        assert.ok(scenario.referenceIds.includes(referenceId), `${hypothesis.id} source must belong to its scenario source set`);
      }
    }
  }
});

test("high-risk draft items cite direct topic sources", () => {
  const sourceIds = new Set(references.map((reference) => reference.id));
  for (const id of [
    "cdc-tb-infection-control",
    "cdc-cdiff-clinical-guidance",
    "nice-antenatal-bleeding-ng201",
    "who-pph-2025",
    "eviq-extravasation-procedure",
    "lifeblood-transfusion-reaction",
    "nice-neutropenic-sepsis-cg151",
    "ada-hypoglycemia-2026",
    "rcuk-abcde-2024",
    "dailymed-potassium-chloride-2026",
    "rch-croup-2024",
    "nice-bronchiolitis-ng9",
    "joint-commission-suicide-risk-2026",
    "rcuk-anaphylaxis-2021",
    "nice-violence-aggression-ng10",
    "nice-perioperative-care-ng180",
    "rch-paediatric-respiratory-severity",
    "ismp-high-alert-acute-care-2024",
    "psmf-medication-errors-2024",
    "psmf-handoff-communication-2023",
  ]) assert.ok(sourceIds.has(id), `missing direct topic source ${id}`);

  const medicationSafety = references.find((reference) => reference.id === "psmf-medication-errors-2024");
  assert.equal(medicationSafety.year, 2024);
  const handoff = references.find((reference) => reference.id === "psmf-handoff-communication-2023");
  assert.equal(handoff.year, 2023);
  const paediatricRespiratory = references.find((reference) => reference.id === "rch-paediatric-respiratory-severity");
  assert.equal(paediatricRespiratory.year, 2024);

  const tb = scenarios.find((scenario) => scenario.id === "infection-control-respiratory-risk");
  assert.ok(tb.referenceIds.includes("cdc-tb-infection-control"));
  const oncology = scenarios.find((scenario) => scenario.id === "oncology-fever-between-cycles");
  assert.ok(oncology.referenceIds.includes("nice-neutropenic-sepsis-cg151"));
  const criticalCare = scenarios.find((scenario) => scenario.id === "icu-postoperative-sepsis");
  assert.ok(!criticalCare.referenceIds.includes("nice-cg50"));
  assert.ok(criticalCare.referenceIds.includes("nice-delirium-cg103"));
  assert.ok(criticalCare.referenceIds.includes("nice-perioperative-care-ng180"));
});

test("the critical-care scenario includes an educational hypothesis-prioritisation exercise", () => {
  const scenario = scenarios.find((item) => item.id === "icu-postoperative-sepsis");
  assert.equal(scenario.hypotheses.length, 3);
  assert.deepEqual(scenario.hypotheses.map((item) => item.correctPriority), ["high", "medium", "low"]);
  for (const hypothesis of scenario.hypotheses) {
    assertBilingual(hypothesis.problem, `${hypothesis.id} problem`);
    assertBilingual(hypothesis.etiology, `${hypothesis.id} etiology`);
    assertBilingual(hypothesis.signs, `${hypothesis.id} signs`);
    assertBilingual(hypothesis.rationale, `${hypothesis.id} rationale`);
  }
});

test("the lead emergency case matches the selected visual reference", () => {
  const scenario = scenarios[0];
  assert.equal(scenario.id, "ed-older-adult-dyspnea");
  assert.equal(scenario.steps.length, 6);

  const priority = scenario.steps[1];
  const vitals = Object.fromEntries(
    priority.vitals.map((vital) => [vital.label.en, vital.value.en]),
  );

  assert.deepEqual(vitals, {
    "Heart rate": "112",
    "Respiratory rate": "26",
    "Blood pressure": "148/88",
    SpO2: "89",
  });
  assert.equal(priority.question.en, "What is the priority action now?");
  assert.equal(priority.question.ar, "ما الإجراء ذو الأولوية الآن؟");
});

test("competency insights use a cross-scenario evidence taxonomy", () => {
  const domainSlugs = new Set(competencyDomains.map((domain) => domain.slug));
  const observations = new Map(
    competencyDomains.map((domain) => [domain.slug, { decisions: 0, scenarios: new Set() }]),
  );

  for (const scenario of scenarios) {
    for (const step of scenario.steps) {
      for (const answer of step.choices) {
        assert.ok(domainSlugs.has(answer.competencyDomain));
        assertBilingual(answer.competencyDomainLabel, `${answer.id} domain label`);
      }
      const domain = step.choices[0].competencyDomain;
      observations.get(domain).decisions += 1;
      observations.get(domain).scenarios.add(scenario.id);
    }
  }

  for (const [domain, evidence] of observations) {
    assert.ok(evidence.decisions >= 3, `${domain} needs at least three learning decisions`);
    assert.ok(evidence.scenarios.size >= 2, `${domain} needs evidence across two scenarios`);
  }

  let profile = createEmptyProfile("Learner", "en");
  for (const scenario of scenarios) {
    const lowestScoringAnswers = Object.fromEntries(
      scenario.steps.map((step) => [
        step.id,
        [...step.choices].sort((left, right) => left.score - right.score)[0].id,
      ]),
    );
    profile = mergeAttempt(profile, gradeAttempt(scenario, lowestScoringAnswers));
  }

  const insights = getCompetencyInsights(profile, scenarios);
  assert.equal(insights.length, competencyDomains.length);
  assert.ok(insights.every((insight) => insight.evidenceSufficient));
  assert.ok(insights.every((insight) => insight.status === "weakness"));
});
