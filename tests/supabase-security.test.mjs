import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const migrationUrl = new URL(
  "../supabase/migrations/202609050002_harden_learning_sync.sql",
  import.meta.url,
);
const repositoryUrl = new URL("../src/lib/progress-repository.js", import.meta.url);
const appUrl = new URL("../src/App.jsx", import.meta.url);

test("cloud learning writes are constrained to identity-bound RPCs", async () => {
  const [sql, repository, app] = await Promise.all([
    readFile(migrationUrl, "utf8"),
    readFile(repositoryUrl, "utf8"),
    readFile(appUrl, "utf8"),
  ]);
  const profileFunction = sql.match(
    /create or replace function public\.save_learner_profile\([\s\S]*?\$\$;/i,
  )?.[0] ?? "";

  assert.match(sql, /revoke insert, update, delete on table public\.learning_records from authenticated/i);
  assert.match(sql, /revoke insert, update on table public\.learner_profiles from authenticated/i);
  assert.match(sql, /security definer\s+set search_path = ''/i);
  assert.match(sql, /v_user_id is null or v_user_id <> p_expected_user_id/i);
  assert.match(profileFunction, /save_learner_profile\(\s*p_expected_user_id uuid,\s*p_preferred_language text\s*\)/i);
  assert.match(profileFunction, /security definer\s+set search_path = ''/i);
  assert.match(profileFunction, /v_user_id is null or v_user_id <> p_expected_user_id/i);
  assert.match(sql, /grant execute on function public\.save_learner_profile\(uuid, text\) to authenticated/i);
  assert.match(sql, /grant execute on function public\.save_learning_records\(uuid, jsonb\) to authenticated/i);
  assert.match(sql, /grant execute on function public\.delete_learning_history\(uuid\) to authenticated/i);
  assert.match(sql, /history_cleared_at = now\(\)/i);
  assert.doesNotMatch(sql, /on conflict[\s\S]*?do update set\s+record_type\s*=/i);
  assert.match(repository, /rpc\("save_learner_profile",\s*\{\s*p_expected_user_id: userId,\s*p_preferred_language:/i);
  assert.doesNotMatch(repository, /\.from\(\s*["']learner_profiles["']\s*\)\s*\.upsert\s*\(/i);
  assert.match(app, /selectOwnedEntitlement\(entitlementState, auth\.user\?\.id\)/);
});

test("history clearing preserves active sessions and gates concurrent completion", async () => {
  const app = await readFile(appUrl, "utf8");
  const clearFunction = app.match(
    /async function clearLearningHistory\(\)[\s\S]*?\n  async function signOutCurrentDevice\(\)/,
  )?.[0] ?? "";

  assert.match(clearFunction, /historyClearPendingRef\.current = true/);
  assert.match(clearFunction, /scenarioAttemptIdsToClear/);
  assert.match(clearFunction, /questionSetIdsToClear/);
  assert.match(clearFunction, /retainAttemptsAfterHistoryClear/);
  assert.doesNotMatch(clearFunction, /setSession\(/);
  assert.match(app, /function completeScenario\([^)]*\) \{\s*if \(historyClearPendingRef\.current\)/);
  assert.match(app, /function completeQuestionSet\([^)]*\) \{\s*if \(historyClearPendingRef\.current\) return false/);
  assert.match(app, /historyClearPending=\{historyClearPending\}/);
  assert.match(app, /\[historyClearPending, isExpired, session\?\.id\]/);
});
