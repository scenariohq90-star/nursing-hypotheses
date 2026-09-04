import assert from "node:assert/strict";
import test from "node:test";

import {
  createExamSessionState,
  getConfirmedAnswers,
  getRemainingSeconds,
  isExamSessionExpired,
  restoreExamSessionState,
  serializeExamSession,
} from "../src/hooks/useExamSession.js";
import {
  analyzePerformance,
  getPerformanceByCategory,
} from "../src/lib/question-engine.js";

function makeQuestion(id, categoryId, correctOptionId = "b") {
  return {
    id,
    categoryId,
    category: { en: categoryId, ar: categoryId },
    fictional: true,
    official: false,
    correctOptionId,
    options: ["a", "b", "c", "d"].map((optionId) => ({
      id: optionId,
      text: { en: `${id}-${optionId}`, ar: `${id}-${optionId}` },
    })),
  };
}

test("exam session restores question order, progress and the exact absolute deadline", () => {
  const bank = [makeQuestion("q-1", "adult"), makeQuestion("q-2", "paediatric")];
  const startedAt = 1_800_000_000_000;
  const created = createExamSessionState({
    questions: [
      { ...bank[1], options: [...bank[1].options].reverse() },
      bank[0],
    ],
    durationSeconds: 900,
    metadata: { examId: "practice" },
    sessionId: "session-a",
    now: startedAt,
  });
  const progressed = {
    ...created,
    currentQuestionIndex: 1,
    selectedAnswers: { "q-2": "c", "q-1": "b" },
    lockedQuestionIds: ["q-2"],
  };
  const restored = restoreExamSessionState(serializeExamSession(progressed), bank, startedAt + 125_500);

  assert.equal(restored.id, "session-a");
  assert.deepEqual(restored.questions.map((question) => question.id), ["q-2", "q-1"]);
  assert.deepEqual(restored.questions[0].options.map((option) => option.id), ["d", "c", "b", "a"]);
  assert.equal(restored.currentQuestionIndex, 1);
  assert.deepEqual(restored.selectedAnswers, { "q-2": "c", "q-1": "b" });
  assert.deepEqual(restored.lockedQuestionIds, ["q-2"]);
  assert.equal(restored.deadlineAt, startedAt + 900_000);
  assert.equal(getRemainingSeconds(restored.deadlineAt, startedAt + 125_500), 775);
});

test("exam session expires while the page is away and rejects stale bank identifiers", () => {
  const bank = [makeQuestion("q-1", "adult")];
  const startedAt = 1_800_000_000_000;
  const created = createExamSessionState({ questions: bank, durationSeconds: 30, now: startedAt });
  const serialized = serializeExamSession(created);

  assert.equal(restoreExamSessionState(serialized, bank, startedAt + 31_000).status, "expired");
  assert.equal(getRemainingSeconds(created.deadlineAt, startedAt + 31_000), 0);
  assert.equal(isExamSessionExpired(created, startedAt + 30_000), true);
  assert.equal(restoreExamSessionState(serialized, [], startedAt + 1_000), null);
  assert.equal(restoreExamSessionState("not-json", bank), null);

  const corrupted = JSON.parse(serialized);
  corrupted.optionOrderByQuestionId["q-1"] = ["a", "a", "b", "c"];
  assert.equal(restoreExamSessionState(JSON.stringify(corrupted), bank, startedAt + 1_000), null);
});

test("only explicitly locked answers are eligible for grading", () => {
  const bank = [makeQuestion("q-1", "adult"), makeQuestion("q-2", "adult")];
  const session = {
    ...createExamSessionState({ questions: bank, durationSeconds: 60, now: 1_800_000_000_000 }),
    selectedAnswers: { "q-1": "b", "q-2": "b" },
    lockedQuestionIds: ["q-1"],
  };

  assert.deepEqual(getConfirmedAnswers(session), { "q-1": "b" });
});

test("performance analysis calculates category accuracy and returns 10 new focused questions", () => {
  const bank = [
    ...Array.from({ length: 12 }, (_, index) => makeQuestion(`p-${index + 1}`, "paediatric")),
    ...Array.from({ length: 12 }, (_, index) => makeQuestion(`m-${index + 1}`, "medical")),
    ...Array.from({ length: 12 }, (_, index) => makeQuestion(`s-${index + 1}`, "surgical")),
  ];
  const answers = {
    "p-1": "a",
    "p-2": "a",
    "p-3": "a",
    "m-1": "b",
    "m-2": "a",
    "m-3": "b",
    "s-1": "b",
    "s-2": "b",
    "s-3": "b",
  };
  const snapshot = JSON.stringify(bank);
  const performance = getPerformanceByCategory(answers, bank);
  const focused = analyzePerformance(answers, bank);

  assert.deepEqual(performance.map(({ categoryId, score }) => ({ categoryId, score })), [
    { categoryId: "paediatric", score: 0 },
    { categoryId: "medical", score: 66.67 },
    { categoryId: "surgical", score: 100 },
  ]);
  assert.equal(focused.length, 10);
  assert.ok(focused.slice(0, 9).every((question) => question.categoryId === "paediatric"));
  assert.equal(focused[9].categoryId, "medical");
  assert.ok(focused.every((question) => !Object.hasOwn(answers, question.id)));
  assert.notEqual(focused[0], bank.find((question) => question.id === focused[0].id));
  assert.equal(JSON.stringify(bank), snapshot);
});

test("an explicitly unanswered timed item counts as an incorrect category attempt", () => {
  const bank = [makeQuestion("q-1", "adult"), makeQuestion("q-2", "adult")];
  const performance = getPerformanceByCategory([
    { questionId: "q-1", selectedOptionId: "b" },
    { questionId: "q-2", selectedOptionId: null },
  ], bank);

  assert.equal(performance[0].answeredCount, 2);
  assert.equal(performance[0].correctCount, 1);
  assert.equal(performance[0].score, 50);
});

test("performance analysis uses a deterministic broad baseline before any answer", () => {
  const bank = Array.from({ length: 14 }, (_, index) => makeQuestion(`q-${index + 1}`, index % 2 ? "medical" : "surgical"));
  const first = analyzePerformance({}, bank);
  const second = analyzePerformance([], bank);

  assert.equal(first.length, 10);
  assert.deepEqual(first.map((question) => question.id), second.map((question) => question.id));
});

test("performance analysis avoids repeats when another domain has 10 unseen items", () => {
  const bank = [
    ...Array.from({ length: 2 }, (_, index) => makeQuestion(`small-${index + 1}`, "small-weak")),
    ...Array.from({ length: 10 }, (_, index) => makeQuestion(`new-${index + 1}`, "unassessed")),
  ];
  const focused = analyzePerformance({ "small-1": "a", "small-2": "a" }, bank);

  assert.equal(focused.length, 10);
  assert.ok(focused.every((question) => question.categoryId === "unassessed"));
  assert.ok(focused.every((question) => !Object.hasOwn({ "small-1": "a", "small-2": "a" }, question.id)));
});
