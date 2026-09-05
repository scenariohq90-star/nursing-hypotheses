const ASSISTANT_PATH = "/api/nursing-assistant";
const MAX_REQUEST_BYTES = 8 * 1024;
const MAX_QUESTION_LENGTH = 1200;
const DEFAULT_TIMEOUT_MS = 35_000;
const DEFAULT_MODEL = "gpt-5.6-luna";
const AUTHORITATIVE_DOMAINS = [
  "moh.gov.sa",
  "scfhs.org.sa",
  "sfda.gov.sa",
  "who.int",
  "cdc.gov",
  "nih.gov",
  "ncbi.nlm.nih.gov",
  "ahrq.gov",
  "nice.org.uk",
  "nhs.uk",
  "gov.uk",
  "heart.org",
  "resus.org.uk",
  "aap.org",
  "acog.org",
  "rcog.org.uk",
  "idsociety.org",
  "sccm.org",
  "survivingsepsis.org",
  "ismp.org",
  "jointcommission.org",
  "cochranelibrary.com",
  "bmj.com",
  "jamanetwork.com",
  "nejm.org",
  "thelancet.com",
  "kdigo.org",
  "escardio.org",
  "acc.org",
  "aacn.org",
  "nursingworld.org",
  "rnao.ca",
  "health.qld.gov.au",
  "health.nsw.gov.au",
];

const SECURITY_HEADERS = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self' https://dclenqffdwrnyzhkwjuf.supabase.co wss://dclenqffdwrnyzhkwjuf.supabase.co",
    "font-src 'self' data:",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "object-src 'none'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "upgrade-insecure-requests",
  ].join("; "),
  "Cross-Origin-Opener-Policy": "same-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

const ASSISTANT_INSTRUCTIONS = `You are the Nursing Hypotheses educational research assistant for nursing learners and licensed healthcare professionals.

Hard boundaries:
- Provide general nursing and health education only. Never diagnose, prescribe, triage, or make a patient-specific care decision.
- Never replace the responsible clinical team, authorised orders, current facility policy, scope of practice, or local emergency pathway.
- If the question suggests an active emergency or an identifiable real patient, lead with a brief instruction to contact the responsible clinical team and local emergency service now, then keep any remaining explanation general.
- Never request or repeat names, record numbers, contact details, dates of birth, clinical notes, or other identifying patient information.
- Do not provide a patient-specific medication dose. For educational calculations, explain the general method only and require verification of the current order, concentration, patient factors, local policy, and an authorised second check when applicable.
- Decline requests to reproduce recalled, secure, leaked, or official examination items. You may explain the underlying nursing concept using original wording.

Evidence rules:
- You must use web search for every answer.
- Prefer current primary or authoritative sources: Saudi Ministry of Health, SCFHS, SFDA, WHO, government health agencies, recognised guideline organisations, professional societies, and peer-reviewed literature indexed in PubMed.
- Avoid commercial test banks, anonymous blogs, Wikipedia, Reddit, Quora, and unsourced study notes.
- Support clinical or time-sensitive claims with the web-search citations. If sources conflict, are old, or do not directly answer the question, say so.
- Distinguish a general learning principle from a local protocol or prescriber-dependent action.

Response rules:
- Stay within nursing or general health education. Politely decline unrelated requests.
- Give a concise, structured plain-text explanation. Do not use a Markdown table and do not output HTML.
- Always return exactly two complete language blocks in this fixed machine-readable order, with no text outside them: [[EN]] English explanation [[/EN]] then [[AR]] Arabic explanation [[/AR]]. Keep these exact ASCII markers on their own lines.
- Cite at least one supporting authoritative source inside each language block. The interface will present the selected language first.
- Use clear headings, practical exam-learning points, and a short safety/escalation note when relevant.
- Do not claim certainty beyond the cited evidence and never claim that the learner is clinically competent or ready to pass an examination.`;

const IDENTIFIER_PATTERNS = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:\+?966[\s-]?)?5\d(?:[\s-]?\d){7}\b/,
  /\b(?:MRN|medical\s+record(?:\s+number)?|patient\s+id)\s*[:#-]?\s*[A-Z0-9-]{5,}\b/i,
  /\b(?:national\s+id|iqama|passport(?:\s+number)?)\s*[:#-]?\s*[A-Z0-9-]{5,}\b/i,
  /(?:رقم\s*(?:الملف|السجل|الهوية)|سجل\s*مدني)\s*[:#-]?\s*[٠-٩0-9-]{5,}/i,
];

class AssistantRequestError extends Error {
  constructor(code, status) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return withSecurityHeaders(new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "application/json; charset=utf-8",
      "Vary": "Origin",
      ...extraHeaders,
    },
  }));
}

async function readRequestTextWithLimit(request, byteLimit) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > byteLimit) {
    throw new AssistantRequestError("payload_too_large", 413);
  }
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let byteCount = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteCount += value.byteLength;
      if (byteCount > byteLimit) {
        await reader.cancel();
        throw new AssistantRequestError("payload_too_large", 413);
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

function hasPotentialPatientIdentifier(question) {
  return IDENTIFIER_PATTERNS.some((pattern) => pattern.test(question));
}

function validateAssistantPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new AssistantRequestError("invalid_request", 400);
  }
  if (typeof payload.question !== "string") {
    throw new AssistantRequestError("invalid_question", 400);
  }

  const question = payload.question.normalize("NFKC").replace(/\u0000/g, "").trim();
  if (question.length < 3) throw new AssistantRequestError("invalid_question", 400);
  if (question.length > MAX_QUESTION_LENGTH) throw new AssistantRequestError("question_too_long", 400);
  if (hasPotentialPatientIdentifier(question)) {
    throw new AssistantRequestError("patient_data_detected", 400);
  }

  return {
    question,
    language: payload.language === "ar" ? "ar" : "en",
  };
}

function safeHttpsUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function isAuthoritativeSource(urlValue) {
  try {
    const hostname = new URL(urlValue).hostname.toLowerCase().replace(/\.$/, "");
    return AUTHORITATIVE_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

function sourceTitle(source, url) {
  const title = typeof source?.title === "string"
    ? source.title
      .replace(/[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")
      .replace(/\s+/g, " ")
      .trim()
    : "";
  if (title) return title.slice(0, 240);
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Source";
  }
}

function parseBilingualSections(rawAnswer) {
  const enOpenToken = "[[EN]]";
  const enCloseToken = "[[/EN]]";
  const arOpenToken = "[[AR]]";
  const arCloseToken = "[[/AR]]";
  const enOpen = rawAnswer.indexOf(enOpenToken);
  const enClose = rawAnswer.indexOf(enCloseToken, enOpen + enOpenToken.length);
  const arOpen = rawAnswer.indexOf(arOpenToken, enClose + enCloseToken.length);
  const arClose = rawAnswer.indexOf(arCloseToken, arOpen + arOpenToken.length);

  if (enOpen < 0 || enClose < 0 || arOpen < 0 || arClose < 0
    || rawAnswer.lastIndexOf(enOpenToken) !== enOpen
    || rawAnswer.lastIndexOf(enCloseToken) !== enClose
    || rawAnswer.lastIndexOf(arOpenToken) !== arOpen
    || rawAnswer.lastIndexOf(arCloseToken) !== arClose
    || rawAnswer.slice(0, enOpen).trim()
    || rawAnswer.slice(enClose + enCloseToken.length, arOpen).trim()
    || rawAnswer.slice(arClose + arCloseToken.length).trim()) {
    throw new AssistantRequestError("invalid_assistant_response", 502);
  }

  function sectionBetween(openIndex, openToken, closeIndex) {
    const rawStart = openIndex + openToken.length;
    const rawContent = rawAnswer.slice(rawStart, closeIndex);
    const leadingWhitespace = rawContent.match(/^\s*/)?.[0].length ?? 0;
    const trailingWhitespace = rawContent.match(/\s*$/)?.[0].length ?? 0;
    const start = rawStart + leadingWhitespace;
    const end = closeIndex - trailingWhitespace;
    return { start, end, text: rawAnswer.slice(start, end) };
  }

  const en = sectionBetween(enOpen, enOpenToken, enClose);
  const ar = sectionBetween(arOpen, arOpenToken, arClose);
  if (en.text.length < 20 || ar.text.length < 20 || !/[A-Za-z]/.test(en.text) || !/[\u0600-\u06FF]/.test(ar.text)) {
    throw new AssistantRequestError("invalid_assistant_response", 502);
  }
  return { en, ar };
}

function citationsForSection(rawCitations, section, allowedUrls) {
  const sorted = rawCitations
    .filter((citation) => citation.start >= section.start
      && citation.end <= section.end
      && allowedUrls.has(citation.url))
    .sort((left, right) => left.start - right.start || left.end - right.end);
  const citations = [];
  let lastAcceptedEnd = -1;
  for (const citation of sorted) {
    const start = citation.start - section.start;
    const end = citation.end - section.start;
    if (start < lastAcceptedEnd) continue;
    citations.push({ ...citation, start, end });
    lastAcceptedEnd = end;
    if (citations.length === 10) break;
  }
  return citations;
}

export function extractAssistantResult(payload) {
  if (payload?.status !== "completed" || payload?.error || payload?.incomplete_details) {
    throw new AssistantRequestError("assistant_incomplete", 502);
  }

  const textBlocks = [];
  const rawCitations = [];
  const rawSources = [];
  let combinedLength = 0;

  for (const item of Array.isArray(payload?.output) ? payload.output : []) {
    if (item?.type === "message") {
      for (const content of Array.isArray(item.content) ? item.content : []) {
        if (content?.type !== "output_text" || typeof content.text !== "string") continue;
        const separatorLength = textBlocks.length ? 2 : 0;
        const blockStart = combinedLength + separatorLength;
        textBlocks.push(content.text);
        combinedLength = blockStart + content.text.length;

        for (const annotation of Array.isArray(content.annotations) ? content.annotations : []) {
          const citation = typeof annotation?.url === "string" ? annotation : annotation?.url_citation;
          const url = safeHttpsUrl(citation?.url);
          if (!url || !isAuthoritativeSource(url)) continue;
          const start = Number(citation?.start_index);
          const end = Number(citation?.end_index);
          rawSources.push({ url, title: sourceTitle(citation, url) });
          if (Number.isInteger(start) && Number.isInteger(end) && start >= 0 && end > start && end <= content.text.length) {
            rawCitations.push({ start: blockStart + start, end: blockStart + end, url, title: sourceTitle(citation, url) });
          }
        }
      }
    }

    if (item?.type === "web_search_call") {
      const actionSources = item.action?.sources ?? item.action?.search?.sources ?? [];
      for (const source of Array.isArray(actionSources) ? actionSources : []) {
        const url = safeHttpsUrl(source?.url);
        if (url && isAuthoritativeSource(url)) rawSources.push({ url, title: sourceTitle(source, url) });
      }
    }
  }

  const rawAnswer = textBlocks.join("\n\n");
  if (!rawAnswer || rawAnswer.length > 16_000) {
    throw new AssistantRequestError("invalid_assistant_response", 502);
  }
  const sections = parseBilingualSections(rawAnswer);

  const sourceMap = new Map();
  for (const source of [...rawCitations, ...rawSources]) {
    if (!sourceMap.has(source.url)) sourceMap.set(source.url, source);
  }
  const sources = [...sourceMap.values()].slice(0, 10);
  const allowedUrls = new Set(sources.map((source) => source.url));
  const citations = {
    en: citationsForSection(rawCitations, sections.en, allowedUrls),
    ar: citationsForSection(rawCitations, sections.ar, allowedUrls),
  };

  if (citations.en.length === 0 || citations.ar.length === 0 || sources.length === 0) {
    throw new AssistantRequestError("invalid_assistant_response", 502);
  }
  return {
    answer: { en: sections.en.text, ar: sections.ar.text },
    citations,
    sources,
  };
}

function buildOpenAIRequest({ question, language }, model) {
  return {
    model,
    store: false,
    reasoning: { effort: "low" },
    text: { verbosity: "low" },
    tools: [{
      type: "web_search",
      search_context_size: "medium",
      user_location: { type: "approximate", country: "SA" },
      filters: { allowed_domains: AUTHORITATIVE_DOMAINS },
    }],
    tool_choice: "required",
    include: ["web_search_call.action.sources"],
    max_tool_calls: 3,
    max_output_tokens: 1_800,
    instructions: ASSISTANT_INSTRUCTIONS,
    input: [{
      role: "user",
      content: [{
        type: "input_text",
        text: `Interface language: ${language === "ar" ? "Arabic" : "English"}\nEducational nursing or health question:\n${question}`,
      }],
    }],
  };
}

async function requestAssistantAnswer(input, env, { fetchImpl, timeoutMs }) {
  const apiKey = typeof env?.OPENAI_API_KEY === "string" ? env.OPENAI_API_KEY.trim() : "";
  if (!apiKey) throw new AssistantRequestError("assistant_not_configured", 503);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetchImpl("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildOpenAIRequest(input, env?.OPENAI_MODEL?.trim() || DEFAULT_MODEL)),
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted || error?.name === "AbortError") {
      throw new AssistantRequestError("assistant_timeout", 504);
    }
    throw new AssistantRequestError("assistant_unavailable", 503);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    if (response.status === 429) {
      let providerCode = "";
      try {
        const providerPayload = await response.json();
        providerCode = typeof providerPayload?.error?.code === "string" ? providerPayload.error.code : "";
      } catch {
        // Provider details are intentionally neither logged nor returned to the browser.
      }
      if (["billing_not_active", "insufficient_quota"].includes(providerCode)) {
        throw new AssistantRequestError("assistant_billing_required", 503);
      }
      throw new AssistantRequestError("assistant_busy", 429);
    }
    if (response.status === 401 || response.status === 403) {
      throw new AssistantRequestError("assistant_not_configured", 503);
    }
    throw new AssistantRequestError("assistant_unavailable", response.status >= 500 ? 503 : 502);
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new AssistantRequestError("invalid_assistant_response", 502);
  }
  return extractAssistantResult(payload);
}

async function handleNursingAssistant(request, env, dependencies) {
  if (request.method !== "POST") {
    return jsonResponse({ error: { code: "method_not_allowed" } }, 405, { Allow: "POST" });
  }

  const origin = request.headers.get("origin");
  let isSameOrigin = false;
  try {
    isSameOrigin = Boolean(origin) && new URL(origin).origin === new URL(request.url).origin;
  } catch {
    isSameOrigin = false;
  }
  if (!isSameOrigin) return jsonResponse({ error: { code: "cross_origin_forbidden" } }, 403);

  const mediaType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (mediaType !== "application/json") {
    return jsonResponse({ error: { code: "unsupported_media_type" } }, 415);
  }

  try {
    const rawBody = await readRequestTextWithLimit(request, MAX_REQUEST_BYTES);
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      throw new AssistantRequestError("invalid_json", 400);
    }
    const input = validateAssistantPayload(payload);
    const result = await requestAssistantAnswer(input, env, dependencies);
    return jsonResponse(result);
  } catch (error) {
    const status = error instanceof AssistantRequestError ? error.status : 500;
    const code = error instanceof AssistantRequestError ? error.code : "assistant_unavailable";
    return jsonResponse({ error: { code } }, status);
  }
}

export function createWorker({ fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      if (url.pathname.replace(/\/+$/, "") === ASSISTANT_PATH) {
        return handleNursingAssistant(request, env, { fetchImpl, timeoutMs });
      }

      const response = await env.ASSETS.fetch(request);
      const acceptsHtml = request.headers.get("accept")?.includes("text/html");

      if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
        return withSecurityHeaders(response);
      }

      const indexUrl = new URL(request.url);
      indexUrl.pathname = "/index.html";
      indexUrl.search = "";
      return withSecurityHeaders(await env.ASSETS.fetch(new Request(indexUrl, request)));
    },
  };
}

export default createWorker();
