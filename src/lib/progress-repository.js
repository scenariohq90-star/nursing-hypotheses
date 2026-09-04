const SAFE_IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,119}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_RECORDS_PER_WRITE = 50;

function safeIdentifier(value) {
  const candidate = typeof value === "string" ? value.trim() : "";
  return SAFE_IDENTIFIER.test(candidate) ? candidate : "";
}

function safeTimestamp(value, fallback) {
  if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toISOString();
  }
  return fallback;
}

function hashText(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function makeRecordId(prefix) {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return `${prefix}-${uuid}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function ensureScenarioAttemptMetadata(profile, now = new Date().toISOString()) {
  const source = profile && typeof profile === "object" ? profile : { attempts: [] };
  const attempts = (Array.isArray(source.attempts) ? source.attempts : []).map((attempt, index) => {
    const existingId = safeIdentifier(attempt?.id);
    const signature = JSON.stringify([
      attempt?.scenarioId,
      (attempt?.decisions ?? []).map((decision) => [decision?.stepId, decision?.choiceId]),
      index,
    ]);
    return {
      ...attempt,
      id: existingId || `scenario-legacy-${hashText(signature)}-${index}`,
      completedAt: safeTimestamp(attempt?.completedAt, now),
    };
  });
  return { ...source, attempts };
}

export function addScenarioAttemptMetadata(attempt, now = new Date().toISOString()) {
  return {
    ...attempt,
    id: makeRecordId("scenario"),
    completedAt: safeTimestamp(now, new Date().toISOString()),
  };
}

function scenarioPayload(attempt) {
  return {
    schemaVersion: 1,
    id: safeIdentifier(attempt?.id),
    scenarioId: safeIdentifier(attempt?.scenarioId),
    contentVersion: safeIdentifier(attempt?.contentVersion) || "legacy",
    completedAt: safeTimestamp(attempt?.completedAt, new Date().toISOString()),
    decisions: (Array.isArray(attempt?.decisions) ? attempt.decisions : []).map((decision) => ({
      stepId: safeIdentifier(decision?.stepId),
      choiceId: safeIdentifier(decision?.choiceId),
    })).filter((decision) => decision.stepId && decision.choiceId),
  };
}

function questionSetPayload(attempt) {
  return {
    schemaVersion: 1,
    id: safeIdentifier(attempt?.id),
    examId: safeIdentifier(attempt?.examId),
    questionIds: (Array.isArray(attempt?.questionIds) ? attempt.questionIds : [])
      .map(safeIdentifier)
      .filter(Boolean),
    decisions: (Array.isArray(attempt?.decisions) ? attempt.decisions : []).map((decision) => ({
      questionId: safeIdentifier(decision?.questionId),
      selectedOptionId: safeIdentifier(decision?.selectedOptionId),
    })).filter((decision) => decision.questionId),
    bankVersion: safeIdentifier(attempt?.bankVersion) || "legacy",
    selectionMode: ["guided", "manual", "performance-focus"].includes(attempt?.selectionMode)
      ? attempt.selectionMode
      : "manual",
    completionReason: attempt?.completionReason === "time-expired" ? "time-expired" : "completed",
    completedAt: safeTimestamp(attempt?.completedAt, new Date().toISOString()),
  };
}

function asCloudRecord(userId, recordType, activityId, payload) {
  if (!UUID.test(userId) || !safeIdentifier(payload.id) || !safeIdentifier(activityId)) return null;
  if (JSON.stringify(payload).length > 8_000) return null;
  return {
    user_id: userId,
    client_record_id: payload.id,
    record_type: recordType,
    activity_id: activityId,
    payload,
    completed_at: payload.completedAt,
  };
}

export function prepareLearningRecords(userId, scenarioAttempts = [], questionSetAttempts = []) {
  const records = [];
  for (const attempt of scenarioAttempts.slice(-500)) {
    const payload = scenarioPayload(attempt);
    const record = asCloudRecord(userId, "scenario", payload.scenarioId, payload);
    if (record) records.push(record);
  }
  for (const attempt of questionSetAttempts.slice(-100)) {
    const payload = questionSetPayload(attempt);
    const record = asCloudRecord(userId, "question-set", payload.examId, payload);
    if (record) records.push(record);
  }
  return records;
}

export function splitLearningRecords(rows) {
  const scenarioAttempts = [];
  const questionSetAttempts = [];
  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || !row.payload || typeof row.payload !== "object" || Array.isArray(row.payload)) continue;
    if (row.record_type === "scenario") scenarioAttempts.push(row.payload);
    if (row.record_type === "question-set") questionSetAttempts.push(row.payload);
  }
  return { scenarioAttempts, questionSetAttempts };
}

async function loadSupabase() {
  const module = await import("./supabase-client.js");
  return module.supabase;
}

async function saveLearnerProfile(supabase, userId, language) {
  const { error } = await supabase.rpc("save_learner_profile", {
    p_expected_user_id: userId,
    p_preferred_language: language === "ar" ? "ar" : "en",
  });
  if (error) throw error;
}

export function selectOwnedEntitlement(entitlementState, userId) {
  if (!userId || entitlementState?.userId !== userId) return null;
  return entitlementState.value ?? null;
}

export function retainAttemptsAfterHistoryClear(attempts, completedAttemptIds) {
  const idsToClear = completedAttemptIds instanceof Set
    ? completedAttemptIds
    : new Set(Array.isArray(completedAttemptIds) ? completedAttemptIds : []);
  return (Array.isArray(attempts) ? attempts : []).filter(
    (attempt) => !attempt?.isComplete || !idsToClear.has(attempt.id),
  );
}

async function upsertInBatches(supabase, userId, records) {
  for (let index = 0; index < records.length; index += MAX_RECORDS_PER_WRITE) {
    const batch = records.slice(index, index + MAX_RECORDS_PER_WRITE).map((record) => ({
      client_record_id: record.client_record_id,
      record_type: record.record_type,
      activity_id: record.activity_id,
      payload: record.payload,
      completed_at: record.completed_at,
    }));
    const { error } = await supabase.rpc("save_learning_records", {
      p_expected_user_id: userId,
      p_records: batch,
    });
    if (error) throw error;
  }
}

export async function syncLearningHistory({ userId, language, scenarioAttempts, questionSetAttempts }) {
  const supabase = await loadSupabase();
  if (!supabase || !UUID.test(userId)) throw new Error("Cloud sync is unavailable.");
  const records = prepareLearningRecords(userId, scenarioAttempts, questionSetAttempts);

  const profilePromise = saveLearnerProfile(supabase, userId, language);
  const recordsPromise = upsertInBatches(supabase, userId, records);
  await Promise.all([profilePromise, recordsPromise]);

  const [{ data, error }, entitlementResult, profileStateResult] = await Promise.all([
    supabase
      .from("learning_records")
      .select("record_type,payload,completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(600),
    supabase
      .from("entitlements")
      .select("plan_code,status,access_until")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("learner_profiles")
      .select("history_cleared_at")
      .eq("user_id", userId)
      .single(),
  ]);
  if (error) throw error;
  if (entitlementResult.error) throw entitlementResult.error;
  if (profileStateResult.error) throw profileStateResult.error;
  return {
    records: (data ?? []).slice().reverse(),
    entitlement: entitlementResult.data ?? null,
    historyClearedAt: profileStateResult.data?.history_cleared_at ?? null,
  };
}

export async function saveLearningAttempt(userId, recordType, attempt) {
  const supabase = await loadSupabase();
  if (!supabase || !UUID.test(userId)) return { ok: false };
  const records = recordType === "scenario"
    ? prepareLearningRecords(userId, [attempt], [])
    : prepareLearningRecords(userId, [], [attempt]);
  if (!records.length) return { ok: false };
  const record = records[0];
  const { error } = await supabase.rpc("save_learning_records", {
    p_expected_user_id: userId,
    p_records: [{
      client_record_id: record.client_record_id,
      record_type: record.record_type,
      activity_id: record.activity_id,
      payload: record.payload,
      completed_at: record.completed_at,
    }],
  });
  if (error) throw error;
  return { ok: true };
}

export async function updateCloudLanguage(userId, language) {
  const supabase = await loadSupabase();
  if (!supabase || !UUID.test(userId)) return;
  await saveLearnerProfile(supabase, userId, language);
}

export async function deleteCloudLearningHistory(userId) {
  const supabase = await loadSupabase();
  if (!supabase || !UUID.test(userId)) return;
  const { error } = await supabase.rpc("delete_learning_history", {
    p_expected_user_id: userId,
  });
  if (error) throw error;
}
