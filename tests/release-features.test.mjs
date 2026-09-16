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

test("the home page describes the assistant as coming soon without an active input", async () => {
  const [appSource, homeSource] = await Promise.all([
    readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/HomeExperience.jsx", import.meta.url), "utf8"),
  ]);
  assert.match(appSource, /assistantComingSoonLabel: "Coming soon"/);
  assert.match(appSource, /assistantComingSoonLabel: "قريبًا"/);
  assert.match(appSource, /assistantComingSoonBody: "Ask a general nursing question/);
  assert.match(appSource, /assistantComingSoonBody: "اسأل عن موضوع تمريضي عام/);
  const card = homeSource.split('<section className="home-experience__assistant"')[1]?.split("</section>")[0];
  assert.ok(card, "the static preview should be visible on the home page");
  assert.match(card, /aria-labelledby="home-assistant-title"/);
  assert.doesNotMatch(card, /<button|<a\s|<form|onClick|fetch\(/);
  assert.match(appSource, /releaseFeatures\.nursingAssistant \? <Suspense/);
});
