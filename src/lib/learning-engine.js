const PROFILE_SCHEMA_VERSION = 1;
const MAX_NAME_LENGTH = 80;
const MAX_ATTEMPTS = 500;
const MAX_DECISIONS_PER_ATTEMPT = 100;
const MAX_SERIALIZED_PROFILE_LENGTH = 500_000;

const CLASSIFICATIONS = ["safe", "gap", "delay", "unsafe"];
const CLASSIFICATION_SET = new Set(CLASSIFICATIONS);
const SAFE_IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$/;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sanitizeName(value) {
  if (typeof value !== "string") return "";

  return value
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_NAME_LENGTH);
}

function sanitizeIdentifier(value) {
  const candidate = typeof value === "number" && Number.isFinite(value) ? String(value) : value;
  if (typeof candidate !== "string") return "";

  const trimmed = candidate.trim();
  return SAFE_IDENTIFIER.test(trimmed) ? trimmed : "";
}

function sanitizeTimestamp(value) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) return "";
  return new Date(value).toISOString();
}

function sanitizeLabel(value, fallback) {
  const safeFallback = sanitizeName(fallback) || "Competency";
  if (!isRecord(value)) {
    return { en: safeFallback, ar: safeFallback };
  }

  return {
    en: sanitizeName(value.en) || safeFallback,
    ar: sanitizeName(value.ar) || safeFallback,
  };
}

function normalizeLanguage(value) {
  return typeof value === "string" && value.trim().toLowerCase().startsWith("ar") ? "ar" : "en";
}

function normalizeScore(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function normalizeCount(value, fallback = 0) {
  return Number.isInteger(value) && value >= 0 ? value : fallback;
}

function normalizeClassification(value) {
  return CLASSIFICATION_SET.has(value) ? value : "gap";
}

function roundScore(value) {
  return Math.round(value * 100) / 100;
}

function averageScore(decisions) {
  if (decisions.length === 0) return 0;
  return roundScore(decisions.reduce((sum, decision) => sum + decision.score, 0) / decisions.length);
}

function emptyClassificationCounts() {
  return { safe: 0, gap: 0, delay: 0, unsafe: 0 };
}

function classificationCountsFor(decisions) {
  const counts = emptyClassificationCounts();
  for (const decision of decisions) counts[decision.classification] += 1;
  return counts;
}

function educationalBand(score, criticalUnsafeCount, decisionCount) {
  if (decisionCount === 0) return "not-started";
  if (criticalUnsafeCount > 0) return "safety-review";
  if (score >= 85) return "strong-foundation";
  if (score >= 70) return "progressing";
  return "guided-review";
}

function summarizeCompetencies(decisions, isComplete = true) {
  const groups = new Map();

  for (const decision of decisions) {
    if (!groups.has(decision.competency)) groups.set(decision.competency, []);
    groups.get(decision.competency).push(decision);
  }

  return [...groups].map(([competency, competencyDecisions]) => {
    const score = averageScore(competencyDecisions);
    const classificationCounts = classificationCountsFor(competencyDecisions);
    const criticalUnsafeCount = classificationCounts.unsafe;

    return {
      competency,
      score,
      decisionCount: competencyDecisions.length,
      criticalUnsafeCount,
      hasCriticalUnsafeDecision: criticalUnsafeCount > 0,
      classificationCounts,
      educationalBand: isComplete
        ? educationalBand(score, criticalUnsafeCount, competencyDecisions.length)
        : "incomplete",
    };
  });
}

function extractChoiceId(value) {
  if (!isRecord(value)) return sanitizeIdentifier(value);
  return sanitizeIdentifier(value.choiceId ?? value.selectedChoiceId ?? value.id);
}

function indexAnswers(scenarioId, steps, answers) {
  const indexed = new Map();

  if (Array.isArray(answers)) {
    answers.forEach((answer, index) => {
      const stepId = isRecord(answer)
        ? sanitizeIdentifier(answer.stepId) || steps[index]?.id
        : steps[index]?.id;
      const choiceId = extractChoiceId(answer);
      if (stepId && choiceId) indexed.set(stepId, choiceId);
    });
    return indexed;
  }

  if (!isRecord(answers)) return indexed;

  const nested = isRecord(answers[scenarioId]) ? answers[scenarioId] : answers;
  for (const step of steps) {
    let rawAnswer;
    if (Object.prototype.hasOwnProperty.call(nested, step.id)) {
      rawAnswer = nested[step.id];
    } else {
      const flatKey = `${scenarioId}:${step.id}`;
      if (Object.prototype.hasOwnProperty.call(answers, flatKey)) rawAnswer = answers[flatKey];
    }

    const choiceId = extractChoiceId(rawAnswer);
    if (choiceId) indexed.set(step.id, choiceId);
  }

  return indexed;
}

function gradableStepsFor(scenario) {
  if (!isRecord(scenario) || !Array.isArray(scenario.steps)) return [];

  const seen = new Set();
  const steps = [];
  for (const rawStep of scenario.steps) {
    if (!isRecord(rawStep) || !Array.isArray(rawStep.choices) || rawStep.choices.length === 0) continue;
    const id = sanitizeIdentifier(rawStep.id);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    steps.push({ id, choices: rawStep.choices });
  }
  return steps;
}

function summarizeAttempt(scenarioId, decisions, totalDecisionCount, isComplete, unansweredStepIds = []) {
  const score = averageScore(decisions);
  const classificationCounts = classificationCountsFor(decisions);
  const criticalUnsafeCount = classificationCounts.unsafe;

  return {
    scenarioId,
    score,
    answeredDecisionCount: decisions.length,
    totalDecisionCount,
    isComplete,
    criticalUnsafeCount,
    hasCriticalUnsafeDecision: criticalUnsafeCount > 0,
    classificationCounts,
    educationalBand: isComplete
      ? educationalBand(score, criticalUnsafeCount, decisions.length)
      : "incomplete",
    competencyDetails: summarizeCompetencies(decisions, isComplete),
    decisions,
    unansweredStepIds,
  };
}

function sanitizeDecision(value) {
  if (!isRecord(value)) return null;

  const stepId = sanitizeIdentifier(value.stepId);
  const choiceId = sanitizeIdentifier(value.choiceId);
  const competency = sanitizeIdentifier(value.competency);
  if (!stepId || !choiceId || !competency) return null;

  return {
    stepId,
    choiceId,
    competency,
    score: normalizeScore(value.score),
    classification: normalizeClassification(value.classification),
  };
}

function sanitizeAttempt(value) {
  if (!isRecord(value)) return null;

  const scenarioId = sanitizeIdentifier(value.scenarioId);
  if (!scenarioId) return null;

  const decisions = [];
  const seenSteps = new Set();
  const rawDecisions = Array.isArray(value.decisions)
    ? value.decisions.slice(0, MAX_DECISIONS_PER_ATTEMPT)
    : [];

  for (const rawDecision of rawDecisions) {
    const decision = sanitizeDecision(rawDecision);
    if (!decision || seenSteps.has(decision.stepId)) continue;
    seenSteps.add(decision.stepId);
    decisions.push(decision);
  }

  const requestedTotal = normalizeCount(value.totalDecisionCount, decisions.length);
  const totalDecisionCount = Math.max(decisions.length, Math.min(MAX_DECISIONS_PER_ATTEMPT, requestedTotal));
  const isComplete = value.isComplete === true && totalDecisionCount > 0 && decisions.length === totalDecisionCount;

  const summary = summarizeAttempt(scenarioId, decisions, totalDecisionCount, isComplete);
  const id = sanitizeIdentifier(value.id);
  const completedAt = sanitizeTimestamp(value.completedAt);
  return {
    ...summary,
    ...(id ? { id } : {}),
    ...(completedAt ? { completedAt } : {}),
  };
}

function normalizeProfile(value) {
  if (!isRecord(value)) return createEmptyProfile("", "en");

  const attempts = Array.isArray(value.attempts)
    ? value.attempts
        .slice(-MAX_ATTEMPTS)
        .map(sanitizeAttempt)
        .filter(Boolean)
    : [];

  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    name: sanitizeName(value.name),
    language: normalizeLanguage(value.language),
    attempts,
  };
}

/**
 * Creates the minimal local learning profile. No clinical or patient data belongs here.
 */
export function createEmptyProfile(name = "", language = "en") {
  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    name: sanitizeName(name),
    language: normalizeLanguage(language),
    attempts: [],
  };
}

/**
 * Grades selected choices without mutating the scenario or the submitted answers.
 * Supported answer shapes are Record<stepId, choiceId>, a scenario-nested record,
 * flat `${scenarioId}:${stepId}` keys, and ordered/object arrays.
 */
export function gradeAttempt(scenario, answers = {}) {
  const scenarioId = sanitizeIdentifier(scenario?.id);
  if (!scenarioId) throw new TypeError("A scenario with a safe, stable id is required.");

  const steps = gradableStepsFor(scenario);
  const answerIndex = indexAnswers(scenarioId, steps, answers);
  const decisions = [];
  const unansweredStepIds = [];

  for (const step of steps) {
    const choiceId = answerIndex.get(step.id);
    const choice = step.choices.find((candidate) => {
      return isRecord(candidate) && sanitizeIdentifier(candidate.id) === choiceId;
    });

    if (!choice) {
      unansweredStepIds.push(step.id);
      continue;
    }

    decisions.push({
      stepId: step.id,
      choiceId,
      competency:
        sanitizeIdentifier(choice.competencyDomain) ||
        sanitizeIdentifier(choice.competency) ||
        "general",
      score: normalizeScore(choice.score),
      classification: normalizeClassification(choice.classification),
    });
  }

  const totalDecisionCount = steps.length;
  const isComplete = totalDecisionCount > 0 && decisions.length === totalDecisionCount;
  return {
    ...summarizeAttempt(scenarioId, decisions, totalDecisionCount, isComplete, unansweredStepIds),
    contentVersion: sanitizeIdentifier(scenario?.contentVersion) || "legacy",
  };
}

/** Adds one sanitized attempt to a new profile object. The input profile is not mutated. */
export function mergeAttempt(profile, attempt) {
  const safeProfile = normalizeProfile(profile);
  const safeAttempt = sanitizeAttempt(attempt);
  if (!safeAttempt) throw new TypeError("A valid graded attempt is required.");

  return {
    ...safeProfile,
    attempts: [...safeProfile.attempts, safeAttempt].slice(-MAX_ATTEMPTS),
  };
}

export function getCompletedScenarioCount(profile) {
  const completedScenarioIds = new Set();
  for (const attempt of normalizeProfile(profile).attempts) {
    if (attempt.isComplete) completedScenarioIds.add(attempt.scenarioId);
  }
  return completedScenarioIds.size;
}

/**
 * Rebuilds every stored attempt from the current authored scenario choices.
 * This prevents locally edited score/classification fields from becoming a
 * trusted learning summary. Local storage still is not an authenticated record.
 */
export function revalidateProfile(profile, scenarios = []) {
  const safeProfile = normalizeProfile(profile);
  const scenarioIndex = new Map();

  if (Array.isArray(scenarios)) {
    for (const scenario of scenarios) {
      const scenarioId = sanitizeIdentifier(scenario?.id);
      if (scenarioId && !scenarioIndex.has(scenarioId)) scenarioIndex.set(scenarioId, scenario);
    }
  }

  const attempts = [];
  for (const attempt of safeProfile.attempts) {
    const scenario = scenarioIndex.get(attempt.scenarioId);
    if (!scenario) continue;

    const answers = Object.fromEntries(
      attempt.decisions.map((decision) => [decision.stepId, decision.choiceId]),
    );
    const rebuilt = gradeAttempt(scenario, answers);
    if (rebuilt.answeredDecisionCount > 0) {
      attempts.push({
        ...rebuilt,
        ...(attempt.id ? { id: attempt.id } : {}),
        ...(attempt.completedAt ? { completedAt: attempt.completedAt } : {}),
      });
    }
  }

  return { ...safeProfile, attempts };
}

function competencyCatalog(scenarios) {
  const catalog = new Map();
  if (!Array.isArray(scenarios)) return catalog;

  for (const scenario of scenarios) {
    if (!isRecord(scenario)) continue;

    for (const step of gradableStepsFor(scenario)) {
      for (const choice of step.choices) {
        const slug = isRecord(choice)
          ? sanitizeIdentifier(choice.competencyDomain) || sanitizeIdentifier(choice.competency)
          : "";
        if (slug && !catalog.has(slug)) {
          catalog.set(slug, sanitizeLabel(choice.competencyDomainLabel, slug));
        }
      }
    }
  }

  return catalog;
}

/**
 * Returns educational, non-pass/fail insights. A weakness requires at least three
 * observed decisions across at least two distinct scenarios. Safety flags remain
 * explicit even while evidence is still insufficient.
 */
export function getCompetencyInsights(profile, scenarios = []) {
  const safeProfile = normalizeProfile(profile);
  const catalog = competencyCatalog(scenarios);
  const observations = new Map();
  const latestDecisionByScenarioStep = new Map();

  for (const attempt of safeProfile.attempts) {
    if (!attempt.isComplete) continue;
    for (const decision of attempt.decisions) {
      latestDecisionByScenarioStep.set(
        `${attempt.scenarioId}:${decision.stepId}`,
        { scenarioId: attempt.scenarioId, decision },
      );
    }
  }

  for (const { scenarioId, decision } of latestDecisionByScenarioStep.values()) {
    if (!catalog.has(decision.competency)) {
      catalog.set(decision.competency, sanitizeLabel(null, decision.competency));
    }
    if (!observations.has(decision.competency)) {
      observations.set(decision.competency, { decisions: [], scenarioIds: new Set() });
    }
    const group = observations.get(decision.competency);
    group.decisions.push(decision);
    group.scenarioIds.add(scenarioId);
  }

  return [...catalog].map(([competency, label]) => {
    const group = observations.get(competency) ?? { decisions: [], scenarioIds: new Set() };
    const decisionCount = group.decisions.length;
    const scenarioCount = group.scenarioIds.size;
    const score = decisionCount > 0 ? averageScore(group.decisions) : null;
    const classificationCounts = classificationCountsFor(group.decisions);
    const criticalUnsafeCount = classificationCounts.unsafe;
    const evidenceSufficient = decisionCount >= 3 && scenarioCount >= 2;

    let status = "insufficient-data";
    if (evidenceSufficient) {
      if (criticalUnsafeCount > 0 || score < 70) status = "weakness";
      else if (score >= 85) status = "strength";
      else status = "developing";
    }

    return {
      competency,
      label,
      status,
      score,
      decisionCount,
      scenarioCount,
      criticalUnsafeCount,
      hasCriticalUnsafeDecision: criticalUnsafeCount > 0,
      classificationCounts,
      evidenceSufficient,
      decisionsNeeded: Math.max(0, 3 - decisionCount),
      scenariosNeeded: Math.max(0, 2 - scenarioCount),
    };
  });
}

function scenarioCompetencyIds(scenario) {
  const competencyIds = new Set();
  for (const step of gradableStepsFor(scenario)) {
    for (const candidate of step.choices) {
      if (!isRecord(candidate)) continue;
      const competency =
        sanitizeIdentifier(candidate.competencyDomain) || sanitizeIdentifier(candidate.competency);
      if (competency) competencyIds.add(competency);
    }
  }
  return [...competencyIds];
}

/**
 * Ranks complete scenarios for the next practice choice. The ranking increases
 * exposure to lower-scoring or safety-flagged learning domains while keeping
 * unseen scenarios and evidence gathering in the mix. It is an educational
 * recommendation only, not a clinical competency or readiness assessment.
 */
export function getScenarioRecommendations(profile, scenarios = [], options = {}) {
  const safeProfile = normalizeProfile(profile);
  const catalog = Array.isArray(scenarios) ? scenarios.filter(isRecord) : [];
  const requestedLimit = Number.isFinite(Number(options.limit))
    ? Math.max(0, Math.floor(Number(options.limit)))
    : catalog.length;
  if (requestedLimit === 0 || catalog.length === 0) return [];

  const insights = getCompetencyInsights(safeProfile, catalog);
  const insightByCompetency = new Map(insights.map((insight) => [insight.competency, insight]));
  const completedAttempts = safeProfile.attempts.filter((attempt) => attempt.isComplete);
  const attemptCountByScenario = new Map();
  for (const attempt of completedAttempts) {
    attemptCountByScenario.set(
      attempt.scenarioId,
      (attemptCountByScenario.get(attempt.scenarioId) ?? 0) + 1,
    );
  }
  const mostRecentScenarioId = completedAttempts[completedAttempts.length - 1]?.scenarioId ?? null;
  const hasUncompletedScenarios = catalog.some((scenario) => !attemptCountByScenario.has(scenario.id));
  const statusWeight = {
    weakness: 500,
    developing: 260,
    "insufficient-data": 110,
    strength: 35,
  };

  return catalog
    .map((scenario) => {
      const competencyIds = scenarioCompetencyIds(scenario);
      const matchedInsights = competencyIds
        .map((competency) => insightByCompetency.get(competency))
        .filter(Boolean);
      const criticalInsights = matchedInsights.filter((insight) => insight.criticalUnsafeCount > 0);
      const weaknessInsights = matchedInsights.filter((insight) => insight.status === "weakness");
      const developingInsights = matchedInsights.filter((insight) => insight.status === "developing");
      const observedInsights = matchedInsights.filter((insight) => insight.decisionCount > 0);
      const domainWeights = matchedInsights.map((insight) => (
        (statusWeight[insight.status] ?? 0) +
        (insight.criticalUnsafeCount > 0 ? 320 : 0)
      ));
      const strongestDomainWeight = domainWeights.length ? Math.max(...domainWeights) : 80;
      const supportingDomainWeight = domainWeights.reduce((sum, weight) => sum + weight, 0) * 0.15;
      const attemptCount = attemptCountByScenario.get(scenario.id) ?? 0;
      const score =
        strongestDomainWeight +
        supportingDomainWeight +
        (attemptCount === 0 ? 90 : 0) -
        attemptCount * 18 -
        (hasUncompletedScenarios && attemptCount > 0 ? 1000 : 0) -
        (scenario.id === mostRecentScenarioId ? 160 : 0);

      let reason = "explore";
      if (criticalInsights.length > 0) reason = "safety-review";
      else if (weaknessInsights.length > 0) reason = "targeted-review";
      else if (developingInsights.length > 0) reason = "targeted-development";
      else if (observedInsights.length > 0) reason = "evidence-building";

      const focusInsights = [
        ...criticalInsights,
        ...weaknessInsights,
        ...developingInsights,
        ...observedInsights,
      ];
      const focusCompetencyIds = [...new Set(focusInsights.map((insight) => insight.competency))]
        .slice(0, 3);

      return {
        scenarioId: scenario.id,
        reason,
        score: roundScore(score),
        focusCompetencyIds,
        attemptCount,
      };
    })
    .sort((left, right) => right.score - left.score || left.scenarioId.localeCompare(right.scenarioId))
    .slice(0, Math.min(requestedLimit, catalog.length));
}

/** Serializes only the profile allowlist; unrelated or sensitive fields are discarded. */
export function serializeProfile(profile) {
  return JSON.stringify(normalizeProfile(profile));
}

/** Parses untrusted local persistence without throwing and rebuilds trusted summaries. */
export function parseProfile(raw) {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > MAX_SERIALIZED_PROFILE_LENGTH) {
    return createEmptyProfile("", "en");
  }

  try {
    return normalizeProfile(JSON.parse(raw));
  } catch {
    return createEmptyProfile("", "en");
  }
}
