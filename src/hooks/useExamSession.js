import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const EXAM_SESSION_SCHEMA_VERSION = 1;

function asFiniteTimestamp(value, fallback) {
  const timestamp = Number(value);
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : fallback;
}

function normalizeDurationSeconds(value) {
  const duration = Math.floor(Number(value));
  return Number.isFinite(duration) ? Math.max(1, duration) : 900;
}

function safeParse(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function cloneQuestionWithOptionOrder(question, optionIds) {
  const authoredOptions = question.options ?? [];
  const optionsById = new Map(authoredOptions.map((option) => [option.id, option]));
  const authoredOptionIds = authoredOptions.map((option) => option.id);
  if (
    optionIds.length !== authoredOptionIds.length ||
    new Set(optionIds).size !== optionIds.length ||
    new Set(authoredOptionIds).size !== authoredOptionIds.length ||
    optionIds.some((optionId) => !optionsById.has(optionId))
  ) return null;
  const orderedOptions = optionIds.map((optionId) => optionsById.get(optionId)).filter(Boolean);
  if (orderedOptions.length !== authoredOptions.length) return null;
  return {
    ...question,
    options: orderedOptions.map((option) => ({
      ...option,
      text: option.text && typeof option.text === "object" ? { ...option.text } : option.text,
    })),
  };
}

/** Uses an absolute deadline so refreshes, sleeping tabs and slow ticks do not add time. */
export function getRemainingSeconds(deadlineAt, now = Date.now()) {
  const deadline = Number(deadlineAt);
  const currentTime = Number(now);
  if (!Number.isFinite(deadline) || !Number.isFinite(currentTime)) return 0;
  return Math.max(0, Math.ceil((deadline - currentTime) / 1000));
}

export function isExamSessionExpired(session, now = Date.now()) {
  return Boolean(session?.deadlineAt) && getRemainingSeconds(session.deadlineAt, now) === 0;
}

/** Only locked answers are eligible for grading, including when time expires. */
export function getConfirmedAnswers(session) {
  const lockedQuestionIds = new Set(Array.isArray(session?.lockedQuestionIds) ? session.lockedQuestionIds : []);
  return Object.fromEntries(
    Object.entries(session?.selectedAnswers ?? {})
      .filter(([questionId, optionId]) => lockedQuestionIds.has(questionId) && typeof optionId === "string"),
  );
}

export function createExamSessionState({
  questions,
  durationSeconds,
  metadata = {},
  sessionId,
  now = Date.now(),
}) {
  const authoredQuestions = Array.isArray(questions) ? questions.filter(Boolean) : [];
  if (!authoredQuestions.length) return null;
  const duration = normalizeDurationSeconds(durationSeconds);
  const startedAt = asFiniteTimestamp(now, Date.now());
  return {
    schemaVersion: EXAM_SESSION_SCHEMA_VERSION,
    id: typeof sessionId === "string" && sessionId ? sessionId : `exam-session-${startedAt}`,
    questions: authoredQuestions.map((question) => ({
      ...question,
      options: (question.options ?? []).map((option) => ({
        ...option,
        text: option.text && typeof option.text === "object" ? { ...option.text } : option.text,
      })),
    })),
    currentQuestionIndex: 0,
    selectedAnswers: {},
    lockedQuestionIds: [],
    durationSeconds: duration,
    startedAt,
    deadlineAt: startedAt + duration * 1000,
    status: "active",
    metadata: metadata && typeof metadata === "object" ? { ...metadata } : {},
  };
}

/** Stores identifiers and option order; question copy is rehydrated from the reviewed bank. */
export function serializeExamSession(session) {
  if (!session?.questions?.length) return "";
  return JSON.stringify({
    schemaVersion: EXAM_SESSION_SCHEMA_VERSION,
    id: session.id,
    questionIds: session.questions.map((question) => question.id),
    optionOrderByQuestionId: Object.fromEntries(
      session.questions.map((question) => [question.id, question.options.map((option) => option.id)]),
    ),
    currentQuestionIndex: session.currentQuestionIndex,
    selectedAnswers: session.selectedAnswers,
    lockedQuestionIds: session.lockedQuestionIds,
    durationSeconds: session.durationSeconds,
    startedAt: session.startedAt,
    deadlineAt: session.deadlineAt,
    status: session.status,
    metadata: session.metadata,
  });
}

export function restoreExamSessionState(value, questionBank, now = Date.now()) {
  const parsed = safeParse(value);
  const catalog = Array.isArray(questionBank) ? questionBank : [];
  if (parsed?.schemaVersion !== EXAM_SESSION_SCHEMA_VERSION || !Array.isArray(parsed.questionIds) || !parsed.questionIds.length) return null;

  const questionById = new Map(catalog.map((question) => [question.id, question]));
  const questions = parsed.questionIds.map((questionId) => {
    const question = questionById.get(questionId);
    const optionOrder = parsed.optionOrderByQuestionId?.[questionId];
    if (!question || !Array.isArray(optionOrder)) return null;
    return cloneQuestionWithOptionOrder(question, optionOrder);
  });
  if (questions.some((question) => !question)) return null;

  const selectedAnswers = {};
  for (const question of questions) {
    const selectedOptionId = parsed.selectedAnswers?.[question.id];
    if (question.options.some((option) => option.id === selectedOptionId)) {
      selectedAnswers[question.id] = selectedOptionId;
    }
  }
  const lockedQuestionIds = [...new Set(
    (Array.isArray(parsed.lockedQuestionIds) ? parsed.lockedQuestionIds : [])
      .filter((questionId) => selectedAnswers[questionId]),
  )];
  const startedAt = asFiniteTimestamp(parsed.startedAt, Number(now));
  const durationSeconds = normalizeDurationSeconds(parsed.durationSeconds);
  const deadlineAt = asFiniteTimestamp(parsed.deadlineAt, startedAt + durationSeconds * 1000);
  const currentQuestionIndex = Math.min(
    questions.length - 1,
    Math.max(0, Math.floor(Number(parsed.currentQuestionIndex) || 0)),
  );

  return {
    schemaVersion: EXAM_SESSION_SCHEMA_VERSION,
    id: typeof parsed.id === "string" && parsed.id ? parsed.id.slice(0, 120) : `restored-${startedAt}`,
    questions,
    currentQuestionIndex,
    selectedAnswers,
    lockedQuestionIds,
    durationSeconds,
    startedAt,
    deadlineAt,
    status: getRemainingSeconds(deadlineAt, now) > 0 ? "active" : "expired",
    metadata: parsed.metadata && typeof parsed.metadata === "object" ? { ...parsed.metadata } : {},
  };
}

function readStoredSession(storageKey, questionBank) {
  if (typeof window === "undefined") return null;
  try {
    return restoreExamSessionState(window.localStorage.getItem(storageKey), questionBank);
  } catch {
    return null;
  }
}

function writeStoredSession(storageKey, session) {
  if (typeof window === "undefined") return;
  try {
    if (session) window.localStorage.setItem(storageKey, serializeExamSession(session));
    else window.localStorage.removeItem(storageKey);
  } catch {
    // The timed practice remains usable when storage is unavailable.
  }
}

/**
 * Owns one timed exam session. Progress is persisted locally after each action;
 * the countdown is derived from a saved deadline rather than a saved tick value.
 */
export function useExamSession({ storageKey, questionBank }) {
  const [session, setSession] = useState(() => readStoredSession(storageKey, questionBank));
  const sessionRef = useRef(session);
  const [clockNow, setClockNow] = useState(() => Date.now());

  const commitSession = useCallback((updater) => {
    const currentSession = sessionRef.current;
    const nextSession = typeof updater === "function" ? updater(currentSession) : updater;
    sessionRef.current = nextSession;
    writeStoredSession(storageKey, nextSession);
    if (nextSession !== currentSession) setSession(nextSession);
    return nextSession;
  }, [storageKey]);

  useEffect(() => {
    if (!session || session.status !== "active") return undefined;
    const updateClock = () => {
      const currentTime = Date.now();
      setClockNow(currentTime);
      if (isExamSessionExpired(session, currentTime)) {
        commitSession((currentSession) => currentSession?.id === session.id
          ? { ...currentSession, status: "expired" }
          : currentSession);
      }
    };
    updateClock();
    const intervalId = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(intervalId);
  }, [commitSession, session?.deadlineAt, session?.id, session?.status]);

  const startSession = useCallback((options) => {
    const nextSession = createExamSessionState(options);
    setClockNow(Number(options?.now) || Date.now());
    commitSession(nextSession);
    return nextSession;
  }, [commitSession]);

  const selectAnswer = useCallback((optionId) => {
    const currentTime = Date.now();
    setClockNow(currentTime);
    commitSession((currentSession) => {
      if (!currentSession || currentSession.status !== "active") return currentSession;
      if (isExamSessionExpired(currentSession, currentTime)) return { ...currentSession, status: "expired" };
      const question = currentSession.questions[currentSession.currentQuestionIndex];
      if (!question || currentSession.lockedQuestionIds.includes(question.id)) return currentSession;
      if (!question.options.some((option) => option.id === optionId)) return currentSession;
      return {
        ...currentSession,
        selectedAnswers: { ...currentSession.selectedAnswers, [question.id]: optionId },
      };
    });
  }, [commitSession]);

  const lockCurrentAnswer = useCallback(() => {
    const currentTime = Date.now();
    setClockNow(currentTime);
    commitSession((currentSession) => {
      if (!currentSession || currentSession.status !== "active") return currentSession;
      if (isExamSessionExpired(currentSession, currentTime)) return { ...currentSession, status: "expired" };
      const question = currentSession.questions[currentSession.currentQuestionIndex];
      if (!question || !currentSession.selectedAnswers[question.id]) return currentSession;
      if (currentSession.lockedQuestionIds.includes(question.id)) return currentSession;
      return {
        ...currentSession,
        lockedQuestionIds: [...currentSession.lockedQuestionIds, question.id],
      };
    });
  }, [commitSession]);

  const goToNextQuestion = useCallback(() => {
    const currentTime = Date.now();
    setClockNow(currentTime);
    commitSession((currentSession) => {
      if (!currentSession || currentSession.status !== "active") return currentSession;
      if (isExamSessionExpired(currentSession, currentTime)) return { ...currentSession, status: "expired" };
      const question = currentSession.questions[currentSession.currentQuestionIndex];
      if (!question || !currentSession.lockedQuestionIds.includes(question.id)) return currentSession;
      if (currentSession.currentQuestionIndex >= currentSession.questions.length - 1) return currentSession;
      return { ...currentSession, currentQuestionIndex: currentSession.currentQuestionIndex + 1 };
    });
  }, [commitSession]);

  const clearSession = useCallback(() => {
    commitSession(null);
  }, [commitSession]);

  const derived = useMemo(() => {
    const questions = session?.questions ?? [];
    const currentQuestionIndex = session?.currentQuestionIndex ?? 0;
    const currentQuestion = questions[currentQuestionIndex] ?? null;
    return {
      questions,
      currentQuestionIndex,
      currentQuestion,
      selectedAnswers: session?.selectedAnswers ?? {},
      selectedAnswerId: currentQuestion ? session?.selectedAnswers?.[currentQuestion.id] ?? "" : "",
      isCurrentAnswerLocked: currentQuestion ? session?.lockedQuestionIds?.includes(currentQuestion.id) === true : false,
      remainingSeconds: session ? getRemainingSeconds(session.deadlineAt, clockNow) : 0,
      isExpired: session?.status === "expired",
      hasSession: Boolean(session),
    };
  }, [clockNow, session]);

  return {
    session,
    ...derived,
    startSession,
    selectAnswer,
    lockCurrentAnswer,
    goToNextQuestion,
    clearSession,
  };
}
