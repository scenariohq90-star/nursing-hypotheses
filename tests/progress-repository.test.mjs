import test from "node:test";
import assert from "node:assert/strict";
import {
  ensureScenarioAttemptMetadata,
  prepareLearningRecords,
  retainAttemptsAfterHistoryClear,
  splitLearningRecords,
} from "../src/lib/progress-repository.js";

const userId = "d9428888-122b-4d8c-a826-9b3b5ed40d68";

test("legacy scenario attempts receive stable safe record metadata", () => {
  const profile = {
    attempts: [{
      scenarioId: "ed-breathlessness",
      decisions: [{ stepId: "assessment", choiceId: "oxygen" }],
    }],
  };
  const timestamp = "2026-09-05T10:00:00.000Z";
  const first = ensureScenarioAttemptMetadata(profile, timestamp);
  const second = ensureScenarioAttemptMetadata(first, "2026-09-06T10:00:00.000Z");

  assert.match(first.attempts[0].id, /^scenario-legacy-[a-z0-9]+-0$/);
  assert.equal(second.attempts[0].id, first.attempts[0].id);
  assert.equal(second.attempts[0].completedAt, timestamp);
});

test("cloud records contain only the minimum answer identifiers", () => {
  const scenarioAttempt = {
    id: "scenario-1",
    scenarioId: "ed-breathlessness",
    contentVersion: "1.1.0",
    completedAt: "2026-09-05T10:00:00.000Z",
    score: 100,
    decisions: [{
      stepId: "assessment",
      choiceId: "oxygen",
      score: 100,
      classification: "safe",
      competency: "assessment",
    }],
  };
  const questionAttempt = {
    id: "question-set-1",
    examId: "snle",
    bankVersion: "2026-09-04.3",
    completedAt: "2026-09-05T10:05:00.000Z",
    score: 100,
    questionIds: ["snle-1"],
    decisions: [{
      questionId: "snle-1",
      selectedOptionId: "b",
      correctOptionId: "b",
      isCorrect: true,
    }],
  };

  const records = prepareLearningRecords(userId, [scenarioAttempt], [questionAttempt]);
  assert.equal(records.length, 2);
  assert.equal("score" in records[0].payload, false);
  assert.equal(records[0].payload.contentVersion, "1.1.0");
  assert.deepEqual(records[0].payload.decisions, [{ stepId: "assessment", choiceId: "oxygen" }]);
  assert.equal(records[1].payload.bankVersion, "2026-09-04.3");
  assert.equal("seed" in records[1].payload, false);
  assert.equal("correctOptionId" in records[1].payload.decisions[0], false);
  assert.equal("isCorrect" in records[1].payload.decisions[0], false);
});

test("cloud rows split only recognized record types", () => {
  const split = splitLearningRecords([
    { record_type: "scenario", payload: { id: "s1" } },
    { record_type: "question-set", payload: { id: "q1" } },
    { record_type: "unknown", payload: { id: "x1" } },
    { record_type: "scenario", payload: null },
  ]);

  assert.deepEqual(split.scenarioAttempts, [{ id: "s1" }]);
  assert.deepEqual(split.questionSetAttempts, [{ id: "q1" }]);
});

test("history clearing removes only completed attempts present when clear started", () => {
  const oldCompleted = { id: "old-completed", isComplete: true };
  const activeDraft = { id: "active-draft", isComplete: false };
  const completedDuringClear = { id: "new-completed", isComplete: true };

  const retained = retainAttemptsAfterHistoryClear(
    [oldCompleted, activeDraft, completedDuringClear],
    new Set([oldCompleted.id]),
  );

  assert.deepEqual(retained, [activeDraft, completedDuringClear]);
});
