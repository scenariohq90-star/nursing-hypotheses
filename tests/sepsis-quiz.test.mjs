import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  answeredSepsisQuestionCount,
  boundedSepsisQuestionIndex,
  isSepsisQuizComplete,
  scoreSepsisQuiz,
  SEPSIS_QUIZ_COPY,
  SEPSIS_QUIZ_QUESTIONS,
  SEPSIS_QUIZ_TOTAL,
  sepsisScoreBand,
  withSepsisAnswer,
} from "../src/data/sepsis-quiz.js";
import { SEPSIS_QUIZ_REFERENCES } from "../src/data/sepsis-quiz-references.js";

test("Sepsis Quiz keeps the complete bilingual 10-question bank", () => {
  assert.equal(SEPSIS_QUIZ_TOTAL, 10);
  assert.equal(SEPSIS_QUIZ_QUESTIONS.length, 10);
  assert.equal(new Set(SEPSIS_QUIZ_QUESTIONS.map((question) => question.id)).size, 10);
  assert.equal(SEPSIS_QUIZ_COPY.ar.title, "اختبار Sepsis");
  assert.equal(SEPSIS_QUIZ_COPY.en.title, "Sepsis Quiz");

  for (const question of SEPSIS_QUIZ_QUESTIONS) {
    assert.equal(question.options.length, 4, `${question.id} must have four options`);
    assert.equal(new Set(question.options.map((option) => option.id)).size, 4);
    assert.ok(question.options.some((option) => option.id === question.correctOptionId));
    assert.ok(question.prompt.ar && question.prompt.en);
    assert.ok(question.rationale.ar && question.rationale.en);
    assert.ok(question.source.ar && question.source.en);
    assert.ok(question.referenceIds.length >= 1);
    for (const option of question.options) assert.ok(option.text.ar && option.text.en);
  }
});

test("Sepsis Quiz scores only valid selected answers", () => {
  let answers = {};
  for (const question of SEPSIS_QUIZ_QUESTIONS) {
    answers = withSepsisAnswer(answers, question.id, question.correctOptionId);
  }
  assert.equal(answeredSepsisQuestionCount(SEPSIS_QUIZ_QUESTIONS, answers), 10);
  assert.equal(isSepsisQuizComplete(SEPSIS_QUIZ_QUESTIONS, answers), true);
  assert.equal(scoreSepsisQuiz(SEPSIS_QUIZ_QUESTIONS, answers), 10);
  assert.equal(sepsisScoreBand(10, 10), "excellent");

  const invalid = { ...answers, [SEPSIS_QUIZ_QUESTIONS[0].id]: "not-an-option" };
  assert.equal(answeredSepsisQuestionCount(SEPSIS_QUIZ_QUESTIONS, invalid), 9);
  assert.equal(isSepsisQuizComplete(SEPSIS_QUIZ_QUESTIONS, invalid), false);
  assert.equal(scoreSepsisQuiz(SEPSIS_QUIZ_QUESTIONS, invalid), 9);
});

test("Sepsis Quiz score bands and navigation bounds are stable", () => {
  assert.equal(sepsisScoreBand(8, 10), "excellent");
  assert.equal(sepsisScoreBand(6, 10), "good");
  assert.equal(sepsisScoreBand(5, 10), "review");
  assert.equal(sepsisScoreBand(2, 0), "review");
  assert.equal(boundedSepsisQuestionIndex(-1, 10), 0);
  assert.equal(boundedSepsisQuestionIndex(12, 10), 9);
});

test("Sepsis Quiz references remain centralized and can be text-only", async () => {
  const referenceIds = new Set(SEPSIS_QUIZ_REFERENCES.map((reference) => reference.id));
  assert.equal(referenceIds.size, 3);
  for (const question of SEPSIS_QUIZ_QUESTIONS) {
    for (const referenceId of question.referenceIds) assert.ok(referenceIds.has(referenceId));
  }
  const componentSource = await readFile(new URL("../src/components/SepsisQuiz.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(componentSource, /question\.source/);
  assert.match(componentSource, /href="#\/resources"/);
});
