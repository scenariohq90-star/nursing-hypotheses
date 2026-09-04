const normalizeFilter = (value) =>
  new Set(
    (Array.isArray(value) ? value : [])
      .filter((entry) => typeof entry === "string")
      .map((entry) => entry.trim())
      .filter(Boolean),
  );

function hashSeed(seed) {
  let hash = 2166136261;
  for (const character of String(seed ?? "default")) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed) {
  let state = hashSeed(seed);
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** Returns a deterministic shuffled copy without mutating the input array. */
export function shuffleWithSeed(items, seed = "default") {
  if (!Array.isArray(items)) return [];
  const shuffled = [...items];
  const random = seededRandom(seed);
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function getEligibleQuestions(questionBank, options = {}) {
  const bank = Array.isArray(questionBank) ? questionBank : [];
  const examId = typeof options.examId === "string" ? options.examId : "all";
  const categoryIds = normalizeFilter(options.categoryIds);
  const difficultyIds = normalizeFilter(options.difficultyIds);

  return bank.filter((question) => {
    if (!question || question.official !== false || question.fictional !== true) return false;
    if (examId !== "all" && question.examId !== examId) return false;
    if (categoryIds.size > 0 && !categoryIds.has(question.categoryId)) return false;
    if (difficultyIds.size > 0 && !difficultyIds.has(question.difficultyId)) return false;
    return Array.isArray(question.options) && question.options.length >= 2;
  });
}

function requestedQuestionCount(options = {}) {
  return Number.isFinite(Number(options.limit))
    ? Math.max(0, Math.floor(Number(options.limit)))
    : 10;
}

function prepareQuestions(items, seed) {
  return items.map((question) => ({
    ...question,
    options: shuffleWithSeed(question.options, `${seed}:${question.id}:options`).map((option) => ({
      ...option,
      text: { ...option.text },
    })),
  }));
}

/**
 * Selects an original practice set by exam/category/difficulty and shuffles both
 * items and response positions deterministically. This is not adaptive testing.
 */
export function createQuiz(questionBank, options = {}) {
  const seed = String(options.seed ?? "default");
  const selected = shuffleWithSeed(
    getEligibleQuestions(questionBank, options),
    `${seed}:questions`,
  ).slice(0, requestedQuestionCount(options));
  return prepareQuestions(selected, seed);
}

/**
 * Describes how a fixed guided-practice set will be assembled. This is a
 * transparent educational recommendation, not computerized adaptive testing.
 */
export function getGuidedQuestionPlan(attempts, categories = [], examId = "all") {
  const relevantInsights = getQuestionCategoryInsights(attempts, categories)
    .filter((insight) => examId === "all" || insight.examId === examId);
  const observedInsights = relevantInsights.filter((insight) => insight.answeredCount > 0);
  const targetedInsights = observedInsights
    .filter((insight) => insight.status === "review" || insight.status === "developing")
    .sort((left, right) => {
      if (left.status !== right.status) return left.status === "review" ? -1 : 1;
      return (left.score ?? 101) - (right.score ?? 101);
    });

  let mode = "baseline";
  if (targetedInsights.some((insight) => insight.status === "review")) mode = "targeted-review";
  else if (targetedInsights.length > 0) mode = "targeted-development";
  else if (observedInsights.length > 0) mode = "evidence-building";

  return {
    mode,
    focusCategoryIds: targetedInsights.slice(0, 3).map((insight) => insight.categoryId),
    focusCategories: targetedInsights.slice(0, 3).map((insight) => ({
      examId: insight.examId,
      categoryId: insight.categoryId,
      label: insight.label,
      score: insight.score,
      status: insight.status,
      uniqueQuestionCount: insight.uniqueQuestionCount,
      completedSetCount: insight.completedSetCount,
    })),
    observedCategoryCount: observedInsights.length,
  };
}

/**
 * Builds one fixed practice set before the learner starts. Lower-accuracy
 * categories receive more weight only after the evidence threshold is met;
 * unseen items and category variety remain protected. This is not CAT and it
 * does not estimate ability, readiness, or a probability of passing.
 */
export function createGuidedQuiz(questionBank, attempts, categories = [], options = {}) {
  const eligible = getEligibleQuestions(questionBank, options);
  const requestedLimit = requestedQuestionCount(options);
  const seed = String(options.seed ?? "default");
  const examId = typeof options.examId === "string" ? options.examId : "all";
  if (eligible.length === 0 || requestedLimit === 0) return [];

  const insights = getQuestionCategoryInsights(attempts, categories)
    .filter((insight) => examId === "all" || insight.examId === examId);
  const insightByCategory = new Map(insights.map((insight) => [insight.categoryId, insight]));
  const answeredQuestionIds = new Set();

  for (const attempt of Array.isArray(attempts) ? attempts : []) {
    if (!attempt?.isComplete || !Array.isArray(attempt.decisions)) continue;
    const matchingDecisions = attempt.decisions.filter((decision) => (
      (examId === "all" || decision.examId === examId) &&
      typeof decision.questionId === "string"
    ));
    for (const decision of matchingDecisions) answeredQuestionIds.add(decision.questionId);
  }

  const unseenEligible = eligible.filter((question) => !answeredQuestionIds.has(question.id));
  if (unseenEligible.length === 0) return [];

  const priorityByStatus = {
    review: 500,
    developing: 300,
    "insufficient-data": 140,
    strength: 40,
  };
  const ranked = unseenEligible.map((question) => {
    const insight = insightByCategory.get(question.categoryId);
    const evidenceGap = insight ? Math.max(0, 3 - insight.uniqueQuestionCount) : 3;
    const score =
      (priorityByStatus[insight?.status ?? "insufficient-data"] ?? 0) +
      90 +
      evidenceGap * 12 +
      (hashSeed(`${seed}:${question.id}`) % 1000) / 1000;
    return { question, score };
  }).sort((left, right) => right.score - left.score || left.question.id.localeCompare(right.question.id));

  const targetCount = Math.min(requestedLimit, unseenEligible.length);
  const maximumFromOneCategory = Math.max(2, Math.ceil(targetCount * 0.6));
  const selected = [];
  const deferred = [];
  const selectedByCategory = new Map();
  for (const candidate of ranked) {
    const count = selectedByCategory.get(candidate.question.categoryId) ?? 0;
    if (count >= maximumFromOneCategory) {
      deferred.push(candidate);
      continue;
    }
    selected.push(candidate.question);
    selectedByCategory.set(candidate.question.categoryId, count + 1);
    if (selected.length === targetCount) break;
  }
  if (selected.length < targetCount) {
    for (const candidate of deferred) {
      selected.push(candidate.question);
      if (selected.length === targetCount) break;
    }
  }

  return prepareQuestions(selected, seed);
}

function normalizeAnswers(answers) {
  if (answers instanceof Map) return new Map(answers);
  if (Array.isArray(answers)) {
    return new Map(
      answers
        .filter((answer) => answer && typeof answer.questionId === "string")
        .map((answer) => [answer.questionId, answer.optionId ?? answer.selectedOptionId]),
    );
  }
  if (answers && typeof answers === "object") return new Map(Object.entries(answers));
  return new Map();
}

/** Calculates accuracy for every answered learning domain, lowest score first. */
export function getPerformanceByCategory(userAnswers, questionBank) {
  const submitted = normalizeAnswers(userAnswers);
  const questions = Array.isArray(questionBank) ? questionBank : [];
  const performance = new Map();

  for (const question of questions) {
    if (!submitted.has(question.id)) continue;
    const selectedOptionId = submitted.get(question.id);
    const categoryId = typeof question.categoryId === "string" ? question.categoryId : "uncategorized";
    const group = performance.get(categoryId) ?? {
      categoryId,
      category: question.category ?? { en: categoryId, ar: categoryId },
      answeredCount: 0,
      correctCount: 0,
    };
    group.answeredCount += 1;
    if (selectedOptionId === question.correctOptionId) group.correctCount += 1;
    performance.set(categoryId, group);
  }

  return [...performance.values()]
    .map((group) => ({
      ...group,
      score: Number(((group.correctCount / group.answeredCount) * 100).toFixed(2)),
    }))
    .sort((left, right) => left.score - right.score || right.answeredCount - left.answeredCount || left.categoryId.localeCompare(right.categoryId));
}

function clonePracticeQuestion(question) {
  return {
    ...question,
    options: (question.options ?? []).map((option) => ({
      ...option,
      text: option.text && typeof option.text === "object" ? { ...option.text } : option.text,
    })),
  };
}

/**
 * Returns a new set of up to 10 questions starting with the lowest-scoring
 * domains. Lower assessed domains are added in score order. Previously unseen
 * items are exhausted before an answered item can repeat; higher-scoring or
 * unassessed domains fill only when weaker domains cannot supply 10 new items.
 */
export function analyzePerformance(userAnswers, questionBank) {
  const bank = (Array.isArray(questionBank) ? questionBank : [])
    .filter((question) => question?.official === false && question?.fictional === true && Array.isArray(question.options));
  const targetCount = Math.min(10, bank.length);
  if (targetCount === 0) return [];

  const submitted = normalizeAnswers(userAnswers);
  const performance = getPerformanceByCategory(submitted, bank);
  if (!performance.length) {
    return [...bank]
      .sort((left, right) => left.categoryId.localeCompare(right.categoryId) || left.id.localeCompare(right.id))
      .slice(0, targetCount)
      .map(clonePracticeQuestion);
  }

  const focusCategoryIds = [];
  let unseenAvailableInFocus = 0;
  for (let index = 0; index < performance.length; index += 1) {
    const insight = performance[index];
    focusCategoryIds.push(insight.categoryId);
    unseenAvailableInFocus += bank.filter((question) => (
      question.categoryId === insight.categoryId && !submitted.has(question.id)
    )).length;
    const nextInsight = performance[index + 1];
    if (unseenAvailableInFocus >= targetCount && nextInsight?.score !== insight.score) break;
  }

  if (unseenAvailableInFocus < targetCount) {
    const assessedCategoryIds = new Set(performance.map((insight) => insight.categoryId));
    const unassessedCategoryIds = [...new Set(bank.map((question) => question.categoryId))]
      .filter((categoryId) => !assessedCategoryIds.has(categoryId))
      .sort();
    for (const categoryId of unassessedCategoryIds) {
      focusCategoryIds.push(categoryId);
      unseenAvailableInFocus += bank.filter((question) => (
        question.categoryId === categoryId && !submitted.has(question.id)
      )).length;
      if (unseenAvailableInFocus >= targetCount) break;
    }
  }

  const focusSet = new Set(focusCategoryIds);
  const scoreByCategory = new Map(performance.map((insight) => [insight.categoryId, insight.score]));
  const compareFocusedQuestions = (left, right) => {
    const scoreDifference = (scoreByCategory.get(left.categoryId) ?? 101) - (scoreByCategory.get(right.categoryId) ?? 101);
    if (scoreDifference) return scoreDifference;
    return left.id.localeCompare(right.id);
  };
  const focusedQuestions = bank.filter((question) => focusSet.has(question.categoryId));
  const unseenQuestions = focusedQuestions
    .filter((question) => !submitted.has(question.id))
    .sort(compareFocusedQuestions);
  const repeatQuestions = focusedQuestions
    .filter((question) => submitted.has(question.id))
    .sort(compareFocusedQuestions);

  return [...unseenQuestions, ...repeatQuestions].slice(0, targetCount).map(clonePracticeQuestion);
}

/** Grades only a fully answered quiz; partial work reports progress with a null score. */
export function gradeQuiz(questions, answers, options = {}) {
  const authoredQuestions = Array.isArray(questions) ? questions : [];
  const submitted = normalizeAnswers(answers);
  const decisions = [];
  const unansweredQuestionIds = [];
  const includeUnanswered = options.includeUnanswered === true;

  for (const question of authoredQuestions) {
    const selectedOptionId = submitted.get(question.id);
    const validOption = question.options?.some((option) => option.id === selectedOptionId);
    if (!validOption) {
      unansweredQuestionIds.push(question.id);
      if (includeUnanswered) {
        decisions.push({
          questionId: question.id,
          selectedOptionId: null,
          correctOptionId: question.correctOptionId,
          isCorrect: false,
          examId: question.examId,
          categoryId: question.categoryId,
        });
      }
      continue;
    }
    decisions.push({
      questionId: question.id,
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      isCorrect: selectedOptionId === question.correctOptionId,
      examId: question.examId,
      categoryId: question.categoryId,
    });
  }

  const totalQuestionCount = authoredQuestions.length;
  const answeredCount = decisions.filter((decision) => decision.selectedOptionId !== null).length;
  const correctCount = decisions.filter((decision) => decision.isCorrect).length;
  const isComplete = totalQuestionCount > 0 && (answeredCount === totalQuestionCount || includeUnanswered);

  return {
    schemaVersion: 1,
    questionIds: authoredQuestions.map((question) => question.id),
    decisions,
    answeredCount,
    totalQuestionCount,
    correctCount,
    score: isComplete ? Number(((correctCount / totalQuestionCount) * 100).toFixed(2)) : null,
    isComplete,
    unansweredQuestionIds,
    completedAt: isComplete ? new Date().toISOString() : null,
  };
}

/**
 * Aggregates only complete attempts. Statuses are educational signals, never a
 * prediction of licensure-exam readiness or a pass/fail decision.
 */
export function getQuestionCategoryInsights(attempts, categories = []) {
  const categoryMap = new Map(
    (Array.isArray(categories) ? categories : []).map((category) => [
      `${category.examId}:${category.id}`,
      category,
    ]),
  );
  const groups = new Map();

  for (const [attemptIndex, attempt] of (Array.isArray(attempts) ? attempts : []).entries()) {
    if (!attempt?.isComplete || !Array.isArray(attempt.decisions)) continue;
    const categoriesInAttempt = new Set();
    for (const decision of attempt.decisions) {
      if (typeof decision?.examId !== "string" || typeof decision?.categoryId !== "string") {
        continue;
      }
      const key = `${decision.examId}:${decision.categoryId}`;
      const group = groups.get(key) ?? {
        examId: decision.examId,
        categoryId: decision.categoryId,
        decisionByQuestionId: new Map(),
        completedSetIds: new Set(),
      };
      if (typeof decision.questionId !== "string" || !decision.questionId) continue;
      group.decisionByQuestionId.set(decision.questionId, decision.isCorrect === true);
      categoriesInAttempt.add(key);
      groups.set(key, group);
    }
    for (const key of categoriesInAttempt) {
      groups.get(key)?.completedSetIds.add(attempt.id ?? `${attempt.completedAt ?? "set"}:${attemptIndex}`);
    }
  }

  const orderedKeys = [
    ...categoryMap.keys(),
    ...[...groups.keys()].filter((key) => !categoryMap.has(key)).sort(),
  ];

  return orderedKeys.map((key) => {
    const catalogEntry = categoryMap.get(key);
    const group = groups.get(key) ?? {
      examId: catalogEntry?.examId ?? key.split(":")[0],
      categoryId: catalogEntry?.id ?? key.split(":").slice(1).join(":"),
      decisionByQuestionId: new Map(),
      completedSetIds: new Set(),
    };
    const answeredCount = group.decisionByQuestionId.size;
    const correctCount = [...group.decisionByQuestionId.values()].filter(Boolean).length;
    const completedSetCount = group.completedSetIds.size;
    const score = answeredCount
      ? Number(((correctCount / answeredCount) * 100).toFixed(2))
      : null;
    let status = "insufficient-data";
    if (answeredCount >= 3 && completedSetCount >= 2) {
      if (score < 70) status = "review";
      else if (score < 85) status = "developing";
      else status = "strength";
    }

    return {
      examId: group.examId,
      categoryId: group.categoryId,
      label: catalogEntry?.label ?? { en: group.categoryId, ar: group.categoryId },
      answeredCount,
      uniqueQuestionCount: answeredCount,
      completedSetCount,
      correctCount,
      score,
      status,
    };
  });
}
