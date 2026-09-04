import assert from "node:assert/strict";
import test from "node:test";

import {
  createEmptyProfile,
  getCompletedScenarioCount,
  getCompetencyInsights,
  getScenarioRecommendations,
  gradeAttempt,
  mergeAttempt,
  parseProfile,
  revalidateProfile,
  serializeProfile,
} from "../src/lib/learning-engine.js";

function choice(id, score, classification, competency = "assessment") {
  return { id, score, classification, competency, text: { en: id, ar: id } };
}

function scenario(id, stepChoices, competency = "assessment") {
  return {
    id,
    competencies: [{ slug: competency, label: { en: "Assessment", ar: "التقييم" } }],
    steps: stepChoices.map((choices, index) => ({ id: `step-${index + 1}`, choices })),
  };
}

const emergencyScenario = scenario("ed-breathing", [
  [choice("oxygen", 100, "safe"), choice("wait", 0, "unsafe")],
  [choice("reassess", 100, "safe"), choice("discharge", 10, "unsafe")],
  [choice("escalate", 90, "unsafe"), choice("document", 70, "delay")],
]);

test("createEmptyProfile keeps only a minimal normalized learner profile", () => {
  assert.deepEqual(createEmptyProfile("  نورة\u0000  العتيبي  ", "ar-SA"), {
    schemaVersion: 1,
    name: "نورة العتيبي",
    language: "ar",
    attempts: [],
  });
  assert.equal(createEmptyProfile("Learner", "fr").language, "en");
});

test("gradeAttempt averages selected choices and never hides an unsafe decision", () => {
  const attempt = gradeAttempt(emergencyScenario, {
    "step-1": "oxygen",
    "step-2": "reassess",
    "step-3": "escalate",
  });

  assert.equal(attempt.score, 96.67);
  assert.equal(attempt.isComplete, true);
  assert.equal(attempt.criticalUnsafeCount, 1);
  assert.equal(attempt.hasCriticalUnsafeDecision, true);
  assert.equal(attempt.classificationCounts.unsafe, 1);
  assert.equal(attempt.educationalBand, "safety-review");
  assert.deepEqual(attempt.competencyDetails, [
    {
      competency: "assessment",
      score: 96.67,
      decisionCount: 3,
      criticalUnsafeCount: 1,
      hasCriticalUnsafeDecision: true,
      classificationCounts: { safe: 2, gap: 0, delay: 0, unsafe: 1 },
      educationalBand: "safety-review",
    },
  ]);
});

test("gradeAttempt supports nested, flat, and ordered answer shapes", () => {
  const compactScenario = scenario("ward-fall", [
    [choice("assess", 80, "safe")],
    [choice("escalate", 60, "gap")],
  ]);

  const nested = gradeAttempt(compactScenario, {
    "ward-fall": { "step-1": "assess", "step-2": "escalate" },
  });
  const flat = gradeAttempt(compactScenario, {
    "ward-fall:step-1": "assess",
    "ward-fall:step-2": "escalate",
  });
  const ordered = gradeAttempt(compactScenario, ["assess", "escalate"]);

  assert.equal(nested.score, 70);
  assert.deepEqual(flat.decisions, nested.decisions);
  assert.deepEqual(ordered.decisions, nested.decisions);
});

test("a partial attempt scores observed choices but is not counted as completed", () => {
  const attempt = gradeAttempt(emergencyScenario, { "step-1": "oxygen" });
  const profile = mergeAttempt(createEmptyProfile("Learner", "en"), attempt);

  assert.equal(attempt.score, 100);
  assert.equal(attempt.answeredDecisionCount, 1);
  assert.equal(attempt.totalDecisionCount, 3);
  assert.equal(attempt.isComplete, false);
  assert.equal(attempt.educationalBand, "incomplete");
  assert.ok(attempt.competencyDetails.every((detail) => detail.educationalBand === "incomplete"));
  assert.deepEqual(attempt.unansweredStepIds, ["step-2", "step-3"]);
  assert.equal(getCompletedScenarioCount(profile), 0);
});

test("abandoned partial attempts do not influence longitudinal learning insights", () => {
  const first = scenario("case-one", [
    [choice("unsafe-one", 0, "unsafe")],
    [choice("unsafe-two", 0, "unsafe")],
  ]);
  const second = scenario("case-two", [[choice("unsafe-three", 0, "unsafe")]]);
  const partial = gradeAttempt(first, { "step-1": "unsafe-one" });
  const complete = gradeAttempt(second, { "step-1": "unsafe-three" });
  let profile = mergeAttempt(createEmptyProfile(), partial);
  profile = mergeAttempt(profile, complete);

  const [insight] = getCompetencyInsights(profile, [first, second]);
  assert.equal(insight.decisionCount, 1);
  assert.equal(insight.scenarioCount, 1);
  assert.equal(insight.status, "insufficient-data");
});

test("mergeAttempt is immutable and completed count uses unique scenario ids", () => {
  const original = createEmptyProfile("Learner", "en");
  const first = gradeAttempt(emergencyScenario, {
    "step-1": "oxygen",
    "step-2": "reassess",
    "step-3": "document",
  });
  const afterFirst = mergeAttempt(original, first);
  const afterRetry = mergeAttempt(afterFirst, first);
  const secondScenario = scenario("icu-sepsis", [[choice("screen", 100, "safe")]]);
  const afterSecondScenario = mergeAttempt(
    afterRetry,
    gradeAttempt(secondScenario, { "step-1": "screen" }),
  );

  assert.equal(original.attempts.length, 0);
  assert.equal(afterFirst.attempts.length, 1);
  assert.equal(afterRetry.attempts.length, 2);
  assert.equal(getCompletedScenarioCount(afterRetry), 1);
  assert.equal(getCompletedScenarioCount(afterSecondScenario), 2);
});

test("insights require three decisions across two scenarios before declaring weakness", () => {
  const oneScenario = scenario("scenario-one", [
    [choice("a", 20, "gap")],
    [choice("b", 20, "gap")],
    [choice("c", 20, "gap")],
  ]);
  const secondScenario = scenario("scenario-two", [[choice("d", 20, "gap")]]);
  let profile = createEmptyProfile("Learner", "en");
  profile = mergeAttempt(
    profile,
    gradeAttempt(oneScenario, { "step-1": "a", "step-2": "b", "step-3": "c" }),
  );

  let insight = getCompetencyInsights(profile, [oneScenario, secondScenario])[0];
  assert.equal(insight.decisionCount, 3);
  assert.equal(insight.scenarioCount, 1);
  assert.equal(insight.status, "insufficient-data");
  assert.equal(insight.scenariosNeeded, 1);

  profile = mergeAttempt(profile, gradeAttempt(secondScenario, { "step-1": "d" }));
  insight = getCompetencyInsights(profile, [oneScenario, secondScenario])[0];
  assert.equal(insight.evidenceSufficient, true);
  assert.equal(insight.status, "weakness");
  assert.equal(insight.score, 20);
});

test("an early unsafe choice is surfaced without prematurely labelling a weakness", () => {
  const safetyScenario = scenario("scenario-safety", [[choice("unsafe-action", 95, "unsafe")]]);
  const profile = mergeAttempt(
    createEmptyProfile("Learner", "en"),
    gradeAttempt(safetyScenario, { "step-1": "unsafe-action" }),
  );

  const insight = getCompetencyInsights(profile, [safetyScenario])[0];
  assert.equal(insight.status, "insufficient-data");
  assert.equal(insight.criticalUnsafeCount, 1);
  assert.equal(insight.hasCriticalUnsafeDecision, true);
});

test("sufficient safe evidence produces non-punitive strength and developing statuses", () => {
  const firstScenario = scenario("first", [
    [choice("a", 90, "safe")],
    [choice("b", 90, "safe")],
  ]);
  const secondScenario = scenario("second", [[choice("c", 90, "safe")]]);
  let profile = createEmptyProfile("Learner", "en");
  profile = mergeAttempt(profile, gradeAttempt(firstScenario, { "step-1": "a", "step-2": "b" }));
  profile = mergeAttempt(profile, gradeAttempt(secondScenario, { "step-1": "c" }));

  const [insight] = getCompetencyInsights(profile, [firstScenario, secondScenario]);
  assert.equal(insight.status, "strength");
  assert.equal(insight.score, 90);
  assert.equal(insight.evidenceSufficient, true);
});

test("serializeProfile and parseProfile discard unrelated sensitive fields and rebuild summaries", () => {
  const graded = gradeAttempt(emergencyScenario, {
    "step-1": "wait",
    "step-2": "reassess",
    "step-3": "document",
  });
  const untrusted = {
    ...createEmptyProfile("Learner", "en"),
    accessToken: "do-not-store-token",
    patientNotes: "do-not-store-clinical-note",
    attempts: [
      {
        ...graded,
        score: 100,
        criticalUnsafeCount: 0,
        narrative: "do-not-store-narrative",
        decisions: graded.decisions.map((decision) => ({
          ...decision,
          rationale: "do-not-store-rationale",
        })),
      },
    ],
  };

  const serialized = serializeProfile(untrusted);
  assert.equal(serialized.includes("do-not-store"), false);

  const parsed = parseProfile(serialized);
  assert.deepEqual(Object.keys(parsed), ["schemaVersion", "name", "language", "attempts"]);
  assert.equal(parsed.attempts[0].score, 56.67);
  assert.equal(parsed.attempts[0].criticalUnsafeCount, 1);
  assert.deepEqual(Object.keys(parsed.attempts[0].decisions[0]), [
    "stepId",
    "choiceId",
    "competency",
    "score",
    "classification",
  ]);
});

test("parseProfile is defensive for malformed, oversized, and structurally invalid input", () => {
  assert.deepEqual(parseProfile("{not-json"), createEmptyProfile("", "en"));
  assert.deepEqual(parseProfile("x".repeat(500_001)), createEmptyProfile("", "en"));
  assert.deepEqual(parseProfile(JSON.stringify(["not", "a", "profile"])), createEmptyProfile("", "en"));
});

test("revalidateProfile recalculates locally edited scores from authored choices", () => {
  const authored = scenario("trusted-case", [
    [choice("safe-action", 100, "safe")],
    [choice("unsafe-action", 0, "unsafe")],
  ]);
  const tampered = {
    schemaVersion: 1,
    name: "Learner",
    language: "en",
    attempts: [
      {
        scenarioId: "trusted-case",
        score: 100,
        totalDecisionCount: 2,
        isComplete: true,
        decisions: [
          { stepId: "step-1", choiceId: "safe-action", competency: "assessment", score: 0, classification: "unsafe" },
          { stepId: "step-2", choiceId: "unsafe-action", competency: "assessment", score: 100, classification: "safe" },
        ],
      },
      {
        scenarioId: "invented-case",
        score: 100,
        totalDecisionCount: 1,
        isComplete: true,
        decisions: [
          { stepId: "fake-step", choiceId: "fake-choice", competency: "assessment", score: 100, classification: "safe" },
        ],
      },
    ],
  };

  const rebuilt = revalidateProfile(tampered, [authored]);
  assert.equal(rebuilt.attempts.length, 1);
  assert.equal(rebuilt.attempts[0].score, 50);
  assert.equal(rebuilt.attempts[0].criticalUnsafeCount, 1);
  assert.equal(rebuilt.attempts[0].educationalBand, "safety-review");
  assert.equal(rebuilt.attempts[0].isComplete, true);
});

test("repeating the same scenario replaces step evidence instead of inflating it", () => {
  const repeatedScenario = scenario("repeat-case", [
    [choice("safe-one", 100, "safe"), choice("gap-one", 20, "gap")],
    [choice("safe-two", 100, "safe"), choice("gap-two", 20, "gap")],
  ]);
  let profile = createEmptyProfile("Learner", "en");
  profile = mergeAttempt(profile, gradeAttempt(repeatedScenario, { "step-1": "gap-one", "step-2": "gap-two" }));
  profile = mergeAttempt(profile, gradeAttempt(repeatedScenario, { "step-1": "safe-one", "step-2": "safe-two" }));

  const [insight] = getCompetencyInsights(profile, [repeatedScenario]);
  assert.equal(profile.attempts.length, 2);
  assert.equal(insight.decisionCount, 2);
  assert.equal(insight.scenarioCount, 1);
  assert.equal(insight.score, 100);
  assert.equal(insight.status, "insufficient-data");
});

test("scenario recommendations surface a new case while preserving an early safety signal", () => {
  const attempted = scenario("attempted", [[choice("unsafe", 0, "unsafe", "safety")]], "safety");
  const relatedNew = scenario("related-new", [[choice("safe", 100, "safe", "safety")]], "safety");
  const unrelatedNew = scenario("unrelated-new", [[choice("assess", 100, "safe", "assessment")]], "assessment");
  const profile = mergeAttempt(
    createEmptyProfile("Learner", "en"),
    gradeAttempt(attempted, { "step-1": "unsafe" }),
  );
  const recommendations = getScenarioRecommendations(profile, [attempted, relatedNew, unrelatedNew]);

  assert.equal(recommendations[0].scenarioId, "related-new");
  assert.equal(recommendations[0].reason, "safety-review");
  assert.equal(recommendations.find((item) => item.scenarioId === "attempted").attemptCount, 1);
  assert.ok(recommendations.findIndex((item) => item.scenarioId === "attempted") > 0);
  assert.equal(getCompetencyInsights(profile, [attempted, relatedNew, unrelatedNew]).find((item) => item.competency === "safety").status, "insufficient-data");
});
