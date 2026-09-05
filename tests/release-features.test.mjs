import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createReleaseFeatures } from "../src/config/release-features.js";

test("public release features fail closed unless explicitly enabled", () => {
  assert.deepEqual(createReleaseFeatures(), {
    learningAccounts: false,
    nursingAssistant: false,
  });
  assert.deepEqual(createReleaseFeatures({
    VITE_LEARNING_ACCOUNTS_ENABLED: "true",
    VITE_NURSING_ASSISTANT_ENABLED: "true",
  }), {
    learningAccounts: true,
    nursingAssistant: true,
  });
  assert.deepEqual(createReleaseFeatures({
    VITE_LEARNING_ACCOUNTS_ENABLED: "TRUE",
    VITE_NURSING_ASSISTANT_ENABLED: "1",
  }), {
    learningAccounts: false,
    nursingAssistant: false,
  });
});

test("the public beta gates account and assistant UI behind release features", async () => {
  const [appSource, authSource, supabaseSource] = await Promise.all([
    readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/hooks/useAuthSession.js", import.meta.url), "utf8"),
    readFile(new URL("../src/lib/supabase-client.js", import.meta.url), "utf8"),
  ]);

  assert.match(appSource, /enabled: releaseFeatures\.learningAccounts/);
  assert.match(appSource, /accountsEnabled \? <Suspense/);
  assert.match(appSource, /releaseFeatures\.nursingAssistant \? <Suspense/);
  assert.match(authSource, /if \(!authEnabled\)/);
  assert.match(supabaseSource, /releaseFeatures\.learningAccounts/);
});
