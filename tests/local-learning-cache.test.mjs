import assert from "node:assert/strict";
import test from "node:test";

import { signOutAndClearLocalLearningCache } from "../src/lib/local-learning-cache.js";

function fakeStorage(entries) {
  const values = new Map(Object.entries(entries));
  return {
    removeItem(key) { values.delete(key); },
    snapshot() { return Object.fromEntries(values); },
  };
}

test("account learning keys are cleared after a successful local sign-out", async () => {
  const storage = fakeStorage({ profile: "a", exam: "b", unrelated: "keep" });
  const result = await signOutAndClearLocalLearningCache({
    signOut: async () => ({ ok: true }),
    storage,
    keys: ["profile", "exam", "profile"],
  });

  assert.deepEqual(result, {
    ok: true,
    authRequestSucceeded: true,
    cacheCleared: true,
    error: null,
  });
  assert.deepEqual(storage.snapshot(), { unrelated: "keep" });
});

test("account learning keys are still cleared when the auth provider reports an error", async () => {
  const authError = new Error("provider unavailable");
  const storage = fakeStorage({ profile: "a", exam: "b", session: "c" });
  const result = await signOutAndClearLocalLearningCache({
    signOut: async () => ({ ok: false, error: authError }),
    storage,
    keys: ["profile", "exam", "session"],
  });

  assert.equal(result.ok, false);
  assert.equal(result.authRequestSucceeded, false);
  assert.equal(result.cacheCleared, true);
  assert.equal(result.error, authError);
  assert.deepEqual(storage.snapshot(), {});
});

test("account learning keys are cleared when the auth call throws", async () => {
  const storage = fakeStorage({ profile: "a" });
  const result = await signOutAndClearLocalLearningCache({
    signOut: async () => { throw new Error("offline"); },
    storage,
    keys: ["profile"],
  });

  assert.equal(result.ok, false);
  assert.equal(result.cacheCleared, true);
  assert.deepEqual(storage.snapshot(), {});
});
