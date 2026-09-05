import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import worker, { createWorker, extractAssistantResult } from "../worker/index.js";

function assistantEnv(overrides = {}) {
  return {
    OPENAI_API_KEY: "test-only-key",
    ASSETS: {
      fetch: async () => {
        throw new Error("Assistant requests must not reach static assets");
      },
    },
    ...overrides,
  };
}

function assistantRequest(payload, options = {}) {
  return new Request("https://example.test/api/nursing-assistant", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://example.test",
      ...options.headers,
    },
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });
}

function successfulAssistantPayload() {
  const englishCitation = "WHO guidance";
  const arabicCitation = "إرشادات منظمة الصحة العالمية";
  const text = `[[EN]]\nGeneral sepsis education should emphasise prompt escalation. ${englishCitation}\n[[/EN]]\n[[AR]]\nالتثقيف العام عن الإنتان يؤكد أهمية التصعيد المبكر. ${arabicCitation}\n[[/AR]]`;
  return {
    status: "completed",
    output: [
      {
        type: "web_search_call",
        action: {
          type: "search",
          sources: [
            { url: "https://www.who.int/publications/example", title: "WHO clinical guidance" },
            { url: "http://insecure.example/source", title: "Ignored source" },
          ],
        },
      },
      {
        type: "message",
        content: [{
          type: "output_text",
          text,
          annotations: [
            {
              type: "url_citation",
              start_index: text.indexOf(englishCitation),
              end_index: text.indexOf(englishCitation) + englishCitation.length,
              url: "https://www.who.int/publications/example#section",
              title: "WHO clinical\u202E guidance",
            },
            {
              type: "url_citation",
              start_index: text.indexOf(arabicCitation),
              end_index: text.indexOf(arabicCitation) + arabicCitation.length,
              url: "https://www.who.int/publications/example#section",
              title: "إرشادات منظمة الصحة العالمية",
            },
          ],
        }],
      },
    ],
  };
}

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.match(response.headers.get("content-security-policy"), /frame-ancestors 'none'/);
  assert.match(response.headers.get("content-security-policy"), /https:\/\/dclenqffdwrnyzhkwjuf\.supabase\.co/);
  assert.doesNotMatch(response.headers.get("content-security-policy"), /\*\.supabase\.co/);
});

test("falls back to index.html for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? "app" : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/index.html"]);
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
});

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
  }
});

test("handles the nursing assistant before static assets and sends a private grounded request", async () => {
  let upstreamUrl = "";
  let upstreamOptions;
  const assistantWorker = createWorker({
    fetchImpl: async (url, options) => {
      upstreamUrl = url;
      upstreamOptions = options;
      return Response.json(successfulAssistantPayload());
    },
  });
  const response = await assistantWorker.fetch(
    assistantRequest({ question: "What are the nursing priorities for suspected sepsis?", language: "en" }),
    assistantEnv(),
  );

  assert.equal(response.status, 200);
  assert.equal(upstreamUrl, "https://api.openai.com/v1/responses");
  assert.equal(upstreamOptions.headers.Authorization, "Bearer test-only-key");
  const upstreamBody = JSON.parse(upstreamOptions.body);
  assert.equal(upstreamBody.model, "gpt-5.6-luna");
  assert.equal(upstreamBody.store, false);
  assert.equal(upstreamBody.tool_choice, "required");
  assert.equal(upstreamBody.tools[0].type, "web_search");
  assert.ok(upstreamBody.tools[0].filters.allowed_domains.includes("who.int"));
  assert.equal(upstreamBody.tools[0].filters.blocked_domains, undefined);
  assert.deepEqual(upstreamBody.include, ["web_search_call.action.sources"]);
  assert.match(upstreamBody.instructions, /general nursing and health education only/i);
  assert.match(upstreamBody.input[0].content[0].text, /suspected sepsis/);
  assert.doesNotMatch(upstreamOptions.body, /test-only-key/);

  const result = await response.json();
  assert.match(result.answer.en, /prompt escalation/);
  assert.match(result.answer.ar, /التصعيد المبكر/);
  assert.equal(result.sources.length, 1);
  assert.equal(result.sources[0].url, "https://www.who.int/publications/example");
  assert.equal(result.citations.en.length, 1);
  assert.equal(result.citations.ar.length, 1);
  assert.equal(response.headers.get("cache-control"), "no-store, max-age=0");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("rejects unsupported nursing assistant requests before using the provider", async () => {
  let upstreamCalls = 0;
  const assistantWorker = createWorker({
    fetchImpl: async () => {
      upstreamCalls += 1;
      return Response.json(successfulAssistantPayload());
    },
  });

  const requests = [
    [new Request("https://example.test/api/nursing-assistant"), 405, "method_not_allowed"],
    [assistantRequest({ question: "Explain sepsis" }, { headers: { origin: "https://evil.example" } }), 403, "cross_origin_forbidden"],
    [assistantRequest({ question: "Explain sepsis" }, { headers: { origin: "" } }), 403, "cross_origin_forbidden"],
    [new Request("https://example.test/api/nursing-assistant", { method: "POST", headers: { "content-type": "text/plain", origin: "https://example.test" }, body: "question" }), 415, "unsupported_media_type"],
    [assistantRequest({ question: "Explain sepsis" }, { headers: { "content-type": "application/jsonp" } }), 415, "unsupported_media_type"],
    [assistantRequest("not-json"), 400, "invalid_json"],
    [assistantRequest({ question: "  " }), 400, "invalid_question"],
    [assistantRequest({ question: "x".repeat(1201) }), 400, "question_too_long"],
    [assistantRequest({ question: "Please review patient MRN 123456 and recommend treatment" }), 400, "patient_data_detected"],
  ];

  for (const [request, expectedStatus, expectedCode] of requests) {
    const response = await assistantWorker.fetch(request, assistantEnv());
    assert.equal(response.status, expectedStatus);
    assert.equal((await response.json()).error.code, expectedCode);
  }
  assert.equal(upstreamCalls, 0);
});

test("rejects oversized assistant request bodies", async () => {
  const assistantWorker = createWorker({ fetchImpl: async () => Response.json(successfulAssistantPayload()) });
  const declaredLengthResponse = await assistantWorker.fetch(
    assistantRequest({ question: "Explain sepsis" }, { headers: { "content-length": "9000" } }),
    assistantEnv(),
  );
  assert.equal(declaredLengthResponse.status, 413);
  assert.equal((await declaredLengthResponse.json()).error.code, "payload_too_large");

  const streamedBodyResponse = await assistantWorker.fetch(
    assistantRequest({ question: `Explain sepsis ${"x".repeat(9_000)}` }),
    assistantEnv(),
  );
  assert.equal(streamedBodyResponse.status, 413);
  assert.equal((await streamedBodyResponse.json()).error.code, "payload_too_large");
});

test("fails safely when the provider key is missing or rejected", async () => {
  let upstreamCalls = 0;
  const assistantWorker = createWorker({
    fetchImpl: async () => {
      upstreamCalls += 1;
      return new Response("provider private error detail", { status: 401 });
    },
  });
  const requestPayload = { question: "Explain sepsis for nursing learners", language: "en" };

  const missingKey = await assistantWorker.fetch(assistantRequest(requestPayload), assistantEnv({ OPENAI_API_KEY: "" }));
  assert.equal(missingKey.status, 503);
  assert.equal((await missingKey.json()).error.code, "assistant_not_configured");
  assert.equal(upstreamCalls, 0);

  const rejectedKey = await assistantWorker.fetch(assistantRequest(requestPayload), assistantEnv());
  assert.equal(rejectedKey.status, 503);
  const rejectedPayload = await rejectedKey.text();
  assert.match(rejectedPayload, /assistant_not_configured/);
  assert.doesNotMatch(rejectedPayload, /provider private error detail/);
  assert.equal(upstreamCalls, 1);
});

test("distinguishes inactive provider billing from a temporary rate limit without leaking details", async () => {
  const requestPayload = { question: "Explain sepsis for nursing learners", language: "en" };
  const billingWorker = createWorker({
    fetchImpl: async () => Response.json({
      error: { code: "billing_not_active", message: "private provider billing detail" },
    }, { status: 429 }),
  });
  const billingResponse = await billingWorker.fetch(assistantRequest(requestPayload), assistantEnv());
  const billingText = await billingResponse.text();
  assert.equal(billingResponse.status, 503);
  assert.match(billingText, /assistant_billing_required/);
  assert.doesNotMatch(billingText, /private provider billing detail/);

  const busyWorker = createWorker({
    fetchImpl: async () => Response.json({ error: { code: "rate_limit_exceeded" } }, { status: 429 }),
  });
  const busyResponse = await busyWorker.fetch(assistantRequest(requestPayload), assistantEnv());
  assert.equal(busyResponse.status, 429);
  assert.equal((await busyResponse.json()).error.code, "assistant_busy");
});

test("turns provider timeouts into a bounded generic error", async () => {
  const assistantWorker = createWorker({
    timeoutMs: 5,
    fetchImpl: async (_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    }),
  });
  const response = await assistantWorker.fetch(
    assistantRequest({ question: "Explain sepsis for nursing learners" }),
    assistantEnv(),
  );
  assert.equal(response.status, 504);
  assert.equal((await response.json()).error.code, "assistant_timeout");
});

test("extracts, deduplicates, and sanitizes assistant citations", () => {
  const result = extractAssistantResult(successfulAssistantPayload());
  assert.equal(result.sources.length, 1);
  assert.equal(result.sources[0].url, "https://www.who.int/publications/example");
  assert.equal(result.sources[0].title, "WHO clinical guidance");
  assert.equal(result.citations.en[0].url, "https://www.who.int/publications/example");
  assert.equal(result.answer.en.slice(result.citations.en[0].start, result.citations.en[0].end), "WHO guidance");
  assert.equal(result.answer.ar.slice(result.citations.ar[0].start, result.citations.ar[0].end), "إرشادات منظمة الصحة العالمية");
});

test("rejects incomplete, monolingual, uncited, and non-authoritative assistant output", () => {
  const incomplete = successfulAssistantPayload();
  incomplete.status = "incomplete";
  incomplete.incomplete_details = { reason: "max_output_tokens" };
  assert.throws(() => extractAssistantResult(incomplete), /assistant_incomplete/);

  const uncited = successfulAssistantPayload();
  uncited.output[1].content[0].annotations = [];
  assert.throws(() => extractAssistantResult(uncited), /invalid_assistant_response/);

  const monolingual = successfulAssistantPayload();
  monolingual.output[1].content[0].text = "General nursing education with WHO guidance.";
  assert.throws(() => extractAssistantResult(monolingual), /invalid_assistant_response/);

  const weakSource = successfulAssistantPayload();
  weakSource.output[0].action.sources[0].url = "https://untrusted.example/article";
  for (const annotation of weakSource.output[1].content[0].annotations) annotation.url = "https://untrusted.example/article";
  assert.throws(() => extractAssistantResult(weakSource), /invalid_assistant_response/);
});

test("keeps a cited authoritative source when search returns more than ten sources", () => {
  const payload = successfulAssistantPayload();
  const citationUrl = "https://www.who.int/publications/example#section";
  payload.output[0].action.sources = Array.from({ length: 12 }, (_, index) => ({
    url: `https://www.cdc.gov/example-${index}`,
    title: `CDC source ${index}`,
  }));
  payload.output[0].action.sources.push({ url: citationUrl, title: "WHO guidance" });
  const result = extractAssistantResult(payload);
  assert.equal(result.sources.length, 10);
  assert.equal(result.sources[0].url, "https://www.who.int/publications/example");
  assert.equal(result.citations.en.length, 1);
  assert.equal(result.citations.ar.length, 1);
});

test("the assistant UI keeps free text out of browser persistence and unsafe HTML", async () => {
  const source = await readFile(new URL("../src/components/NursingAssistant.jsx", import.meta.url), "utf8");
  assert.match(source, /fetch\("\/api\/nursing-assistant"/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
  assert.doesNotMatch(source, /dangerouslySetInnerHTML/);
  assert.match(source, /noopener noreferrer nofollow/);
  assert.match(source, /payload\?\.answer\?\.en/);
  assert.match(source, /lang=\{language\}/);
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));

  const [sourceWorker, builtWorker] = await Promise.all([
    readFile(new URL("../worker/index.js", import.meta.url), "utf8"),
    readFile(new URL("../dist/server/index.js", import.meta.url), "utf8"),
  ]);
  assert.equal(builtWorker, sourceWorker, "the packaged worker must match the reviewed source worker");
});
