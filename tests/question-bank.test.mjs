import assert from "node:assert/strict";
import test from "node:test";

import {
  examCategories,
  examDifficulties,
  examDomains,
  examReferences,
  examTracks,
  questionBank,
  questionIntakePolicy,
} from "../src/data/question-bank.js";
import {
  questionBankExpansionDistribution,
  validateQuestionBankExpansion,
} from "../src/data/question-bank-expansion.js";
import { questionBankExpansionBDrafts } from "../src/data/question-bank-expansion-b.js";
import { references } from "../src/data/scenarios.js";
import {
  createGuidedQuiz,
  createQuiz,
  getGuidedQuestionPlan,
  getQuestionCategoryInsights,
  gradeQuiz,
  shuffleWithSeed,
} from "../src/lib/question-engine.js";

function assertBilingual(value, label) {
  assert.equal(typeof value?.en, "string", `${label} needs English`);
  assert.equal(typeof value?.ar, "string", `${label} needs Arabic`);
  assert.ok(value.en.trim(), `${label} English cannot be empty`);
  assert.ok(value.ar.trim(), `${label} Arabic cannot be empty`);
}

test("question bank contains 101 original bilingual questions across three independent study paths", () => {
  assert.equal(questionBank.length, 101);
  assert.equal(questionBank.filter((question) => question.examId === "saudi-nursing").length, 39);
  assert.equal(questionBank.filter((question) => question.examId === "international-rn").length, 31);
  assert.equal(questionBank.filter((question) => question.examId === "computerized-practice").length, 31);
  assert.equal(new Set(questionBank.map((question) => question.id)).size, questionBank.length);
  assert.deepEqual(new Set(examTracks.map((track) => track.id)), new Set(["saudi-nursing", "international-rn", "computerized-practice"]));

  const categoryIds = new Set(examCategories.map((category) => category.id));
  const difficultyIds = new Set(examDifficulties.map((difficulty) => difficulty.id));
  const domainIds = new Set(examDomains.map((domain) => domain.id));
  const sourceIds = new Set([...examReferences, ...references].map((reference) => reference.id));
  const sourceRecords = [...new Map(
    [...examReferences, ...references].map((reference) => [reference.id, reference]),
  ).values()];
  assert.equal(sourceRecords.length, 73);
  assert.equal(new Set(sourceRecords.map((reference) => reference.url)).size, 72);

  for (const question of questionBank) {
    assert.match(question.id, /^[a-z0-9-]+$/);
    assert.equal(question.fictional, true);
    assert.equal(question.official, false);
    assert.equal(question.accessTier, "free");
    assert.ok(["1.4.0", "1.5.0-expansion-draft", "1.6.0-expansion-b-draft"].includes(question.contentVersion));
    assert.ok([
      "Independent nursing learning domains v1.4",
      "Independent nursing learning domains v1.5",
      "Independent nursing learning domains v1.6",
    ].includes(question.learningModelVersion));
    assert.equal(question.intakePolicyVersion, questionIntakePolicy.version);
    assert.equal(question.sourceUse, "independent-clinical-context");
    assert.equal(question.reviewStatus, "draft");
    assert.equal(question.clinicalReviewDate, null);
    assert.equal(question.clinicalReview.status, "pending");
    assert.equal(question.legalReview.status, "pending");
    assert.equal(question.translationReview.status, "pending");
    assert.ok(["standard", "high-alert"].includes(question.clinicalRisk));
    assert.ok(Array.isArray(question.riskDomains) && question.riskDomains.length > 0);
    assert.equal(question.evidenceReview.status, "mapped-pending-human-verification");
    assert.equal(question.evidenceClaims.length, 1);
    assert.deepEqual(question.evidenceClaims[0].referenceIds, question.referenceIds);
    assert.ok(["independently-authored", "independently-authored-clean-room"].includes(question.provenance.origin));
    assert.equal(question.claims.official, false);
    assert.equal(question.claims.examEquivalent, false);
    assert.equal(question.claims.adaptive, false);
    assert.equal(question.claims.predictive, false);
    assert.ok(categoryIds.has(question.categoryId));
    assert.ok(difficultyIds.has(question.difficultyId));
    assert.ok(domainIds.has(question.domainId));
    assertBilingual(question.domain, `${question.id} domain`);
    assertBilingual(question.stem, `${question.id} stem`);
    assertBilingual(question.topic, `${question.id} topic`);
    assertBilingual(question.rationale, `${question.id} rationale`);
    assert.equal(question.options.length, 4, `${question.id} must have four options`);
    assert.equal(new Set(question.options.map((option) => option.id)).size, 4);
    assert.equal(question.options.filter((option) => option.id === question.correctOptionId).length, 1);
    for (const option of question.options) {
      assertBilingual(option.text, `${question.id}:${option.id} text`);
      assertBilingual(question.optionRationales[option.id], `${question.id}:${option.id} rationale`);
    }
    assert.ok(question.referenceIds.length >= 1, `${question.id} needs at least one clinical context source`);
    for (const referenceId of question.referenceIds) {
      assert.ok(sourceIds.has(referenceId), `${question.id} cites missing source ${referenceId}`);
    }
  }
});

test("the two clean-room expansion passes preserve their promised domain coverage", () => {
  const expansionA = validateQuestionBankExpansion();
  assert.equal(expansionA.valid, true, expansionA.errors.join("\n"));
  assert.equal(expansionA.questionCount, 15);
  assert.deepEqual(expansionA.distribution, questionBankExpansionDistribution);

  const expansionBDistribution = Object.fromEntries(
    ["mental-health", "pharmacology", "fundamentals", "management-safety"].map((domainId) => [
      domainId,
      questionBankExpansionBDrafts.filter((question) => question.domainId === domainId).length,
    ]),
  );
  assert.equal(questionBankExpansionBDrafts.length, 15);
  assert.deepEqual(expansionBDistribution, {
    "mental-health": 4,
    pharmacology: 4,
    fundamentals: 3,
    "management-safety": 4,
  });
});

test("unverified study material stays outside authoring while evidence remains an internal quality gate", () => {
  assert.deepEqual(questionIntakePolicy, {
    version: "2026-09-05",
    unverifiedMaterialDisposition: "retain-local-review-only",
    unverifiedTextMayEnterAuthoring: false,
    recalledOrSecureItemUseAllowed: false,
    generalTopicRequiresIndependentPublicConfirmation: true,
    independentAuthorshipRequired: true,
    internalClinicalEvidenceRequired: true,
    learnerFacingCitationRequired: false,
    humanReviewRequiredBeforePublicClinicalUse: true,
  });
  assert.ok(Object.isFrozen(questionIntakePolicy));
  assert.ok(questionBank.every((question) => question.referenceIds.length >= 1));
});

test("high-alert questions expose explicit review metadata and direct topic references", () => {
  const highAlert = questionBank.filter((question) => question.clinicalRisk === "high-alert");
  assert.ok(highAlert.length >= 20);
  assert.ok(highAlert.every((question) => question.riskDomains.length > 0));

  const expectedSources = new Map([
    ["saudi-nursing-adult-mental-health-008", "joint-commission-suicide-risk-2026"],
    ["saudi-nursing-adult-stroke-009", "aha-asa-stroke-2026"],
    ["saudi-nursing-maternal-bleeding-010", "rcog-antepartum-haemorrhage"],
    ["saudi-nursing-maternal-newborn-012", "who-essential-newborn-care"],
    ["saudi-nursing-maternal-pediatric-013", "rch-paediatric-respiratory-severity"],
    ["international-pharmacology-infiltration-025", "ismp-high-alert-acute-care-2024"],
    ["international-physiological-asthma-028", "gina-asthma-2026"],
    ["computerized-medication-hypoglycemia-042", "ada-hospital-care-2026"],
    ["computerized-acute-sepsis-047", "ssc-2026"],
    ["saudi-nursing-maternal-preeclampsia-052", "nice-hypertension-pregnancy-ng133"],
    ["international-risk-ng-tube-063", "nhs-ng-tube-safety"],
    ["computerized-acute-meningitis-064", "nice-bacterial-meningitis-ng240"],
    ["computerized-medication-opioid-068", "aha-opioid-emergency-2025"],
  ]);
  for (const [questionId, sourceId] of expectedSources) {
    const question = questionBank.find((item) => item.id === questionId);
    assert.equal(question?.clinicalRisk, "high-alert", `${questionId} must remain high-alert`);
    assert.ok(question?.referenceIds.includes(sourceId));
  }
});

test("public study-path metadata is independent and excludes examination-owner references", () => {
  assert.ok(examReferences.length >= 6);
  assert.equal(new Set(examReferences.map((reference) => reference.id)).size, examReferences.length);
  assert.ok(examReferences.every((reference) => /^https:\/\//.test(reference.url)));
  for (const reference of examReferences) {
    assertBilingual(reference.title, `${reference.id} title`);
    assertBilingual(reference.organization, `${reference.id} organization`);
    assertBilingual(reference.accessNote, `${reference.id} access note`);
    assertBilingual(reference.licensingNote, `${reference.id} licensing note`);
  }
  const publicMetadata = JSON.stringify({
    tracks: examTracks.map(({ label, shortLabel, description }) => ({ label, shortLabel, description })),
    categories: examCategories.map(({ label }) => label),
  });
  assert.doesNotMatch(publicMetadata, /NCLEX|NCSBN|SNLE|SCFHS|Prometric/i);
});

test("every distractor has a specific bilingual rationale", () => {
  for (const question of questionBank) {
    const incorrect = question.options.filter((answer) => answer.id !== question.correctOptionId);
    for (const answer of incorrect) {
      const rationale = question.optionRationales[answer.id];
      assertBilingual(rationale, `${question.id}.${answer.id} distractor rationale`);
      assert.notDeepEqual(rationale, question.rationale);
      assert.doesNotMatch(rationale.en, /does not address the safest immediate nursing priority/i);
    }
  }
});

test("quiz creation filters and shuffles deterministically without mutating authored content", () => {
  const original = JSON.stringify(questionBank);
  const options = { examId: "saudi-nursing", categoryIds: ["saudi-nursing-adult"], difficultyIds: [], limit: 5, seed: "cohort-a" };
  const first = createQuiz(questionBank, options);
  const second = createQuiz(questionBank, options);
  const different = createQuiz(questionBank, { ...options, seed: "cohort-b" });

  assert.deepEqual(first, second);
  assert.equal(first.length, 5);
  assert.ok(first.every((question) => question.examId === "saudi-nursing" && question.categoryId === "saudi-nursing-adult"));
  assert.notDeepEqual(first.map((question) => question.id), different.map((question) => question.id));
  assert.equal(JSON.stringify(questionBank), original);
  assert.deepEqual(shuffleWithSeed([1, 2, 3, 4], "x"), shuffleWithSeed([1, 2, 3, 4], "x"));
});

test("a learner can build a 30-question fixed set from every study path", () => {
  for (const examId of ["saudi-nursing", "international-rn", "computerized-practice"]) {
    const quiz = createQuiz(questionBank, { examId, limit: 30, seed: `large-set-${examId}` });
    assert.equal(quiz.length, 30);
    assert.ok(quiz.every((question) => question.examId === examId));
    assert.equal(new Set(quiz.map((question) => question.id)).size, 30);
  }
});

test("grading reports incomplete work and calculates completed sets from authored answers", () => {
  const questions = createQuiz(questionBank, { examId: "international-rn", limit: 5, seed: "grade" });
  const partial = gradeQuiz(questions, { [questions[0].id]: questions[0].correctOptionId });
  assert.equal(partial.isComplete, false);
  assert.equal(partial.score, null);
  assert.equal(partial.answeredCount, 1);

  const allCorrect = Object.fromEntries(questions.map((question) => [question.id, question.correctOptionId]));
  const complete = gradeQuiz(questions, allCorrect);
  assert.equal(complete.isComplete, true);
  assert.equal(complete.score, 100);
  assert.equal(complete.correctCount, questions.length);

  const invalid = gradeQuiz(questions, Object.fromEntries(questions.map((question) => [question.id, "invented-option"])));
  assert.equal(invalid.isComplete, false);
  assert.equal(invalid.answeredCount, 0);
});

test("learning-domain insights cannot be inflated by repeating one question", () => {
  const domain = {
    ...examDomains.find((item) => item.id === "fundamentals"),
    examId: "saudi-nursing",
  };
  const three = questionBank.filter((question) => (
    question.examId === domain.examId && question.domainId === domain.id
  )).slice(0, 3);
  const one = three.slice(0, 1);
  const repeatedAnswer = { [one[0].id]: one[0].correctOptionId };
  const repeatedAttempts = Array.from({ length: 4 }, (_, index) => ({
    ...gradeQuiz(one, repeatedAnswer),
    id: `repeat-${index}`,
  }));

  let [insight] = getQuestionCategoryInsights(repeatedAttempts, [domain]);
  assert.equal(insight.uniqueQuestionCount, 1);
  assert.equal(insight.completedSetCount, 4);
  assert.equal(insight.status, "insufficient-data");

  const firstSet = gradeQuiz(three.slice(0, 2), Object.fromEntries(three.slice(0, 2).map((question) => [question.id, question.correctOptionId])));
  const secondSet = gradeQuiz(three.slice(2), { [three[2].id]: three[2].correctOptionId });
  insight = getQuestionCategoryInsights([{ ...firstSet, id: "set-a" }, { ...secondSet, id: "set-b" }], [domain])[0];
  assert.equal(insight.uniqueQuestionCount, 3);
  assert.equal(insight.completedSetCount, 2);
  assert.equal(insight.status, "strength");
  assert.equal(insight.score, 100);
});

test("guided practice waits for sufficient evidence, then weights an evidenced lower-accuracy domain", () => {
  const categories = [
    { id: "weak", examId: "guided-test", label: { en: "Weak", ar: "ضعيف" } },
    { id: "strong", examId: "guided-test", label: { en: "Strong", ar: "قوي" } },
  ];
  const makeQuestion = (categoryId, index) => ({
    id: `${categoryId}-${index}`,
    examId: "guided-test",
    categoryId,
    official: false,
    fictional: true,
    correctOptionId: "a",
    options: [
      { id: "a", text: { en: "Correct", ar: "صحيح" } },
      { id: "b", text: { en: "Incorrect", ar: "غير صحيح" } },
    ],
  });
  const bank = [
    ...Array.from({ length: 10 }, (_, index) => makeQuestion("weak", index + 1)),
    ...Array.from({ length: 10 }, (_, index) => makeQuestion("strong", index + 1)),
  ];
  const firstQuestions = [bank[0], bank[1], bank[10], bank[11]];
  const secondQuestions = [bank[2], bank[12]];
  const first = {
    ...gradeQuiz(firstQuestions, { "weak-1": "b", "weak-2": "b", "strong-1": "a", "strong-2": "a" }),
    id: "guided-first",
  };
  const second = {
    ...gradeQuiz(secondQuestions, { "weak-3": "b", "strong-3": "a" }),
    id: "guided-second",
  };
  const bankSnapshot = JSON.stringify(bank);
  const attemptsSnapshot = JSON.stringify([first, second]);
  const plan = getGuidedQuestionPlan([first, second], categories, "guided-test");
  const options = { examId: "guided-test", limit: 10, seed: "guided-seed" };
  const guided = createGuidedQuiz(bank, [first, second], categories, options);
  const repeated = createGuidedQuiz(bank, [first, second], categories, options);
  const answeredIds = new Set(["weak-1", "weak-2", "weak-3", "strong-1", "strong-2", "strong-3"]);

  assert.equal(plan.mode, "targeted-review");
  assert.deepEqual(plan.focusCategoryIds, ["weak"]);
  assert.equal(guided.length, 10);
  assert.equal(guided.filter((question) => question.categoryId === "weak").length, 6);
  assert.ok(guided.every((question) => !answeredIds.has(question.id)));
  assert.equal(new Set(guided.map((question) => question.id)).size, guided.length);
  assert.deepEqual(guided, repeated);
  assert.equal(JSON.stringify(bank), bankSnapshot);
  assert.equal(JSON.stringify([first, second]), attemptsSnapshot);
});

test("guided practice does not label one completed sample as a weakness and never repeats when unseen items are exhausted", () => {
  const category = { id: "sample", examId: "sample-test", label: { en: "Sample", ar: "عينة" } };
  const bank = Array.from({ length: 3 }, (_, index) => ({
    id: `sample-${index + 1}`,
    examId: "sample-test",
    categoryId: "sample",
    official: false,
    fictional: true,
    correctOptionId: "a",
    options: [{ id: "a", text: { en: "A", ar: "أ" } }, { id: "b", text: { en: "B", ar: "ب" } }],
  }));
  const attempt = { ...gradeQuiz(bank, Object.fromEntries(bank.map((question) => [question.id, "b"]))), id: "one-set" };

  assert.equal(getGuidedQuestionPlan([attempt], [category], "sample-test").mode, "evidence-building");
  assert.deepEqual(createGuidedQuiz(bank, [attempt], [category], { examId: "sample-test", limit: 3, seed: "done" }), []);
});
