import { useEffect, useRef, useState } from "react";
import {
  ArrowSquareOut,
  ChatCircleDots,
  MagnifyingGlass,
  PaperPlaneTilt,
  ShieldWarning,
  Sparkle,
  SpinnerGap,
  Trash,
  X,
} from "@phosphor-icons/react";
import "./nursing-assistant.css";

const MAX_QUESTION_LENGTH = 1200;
const CLIENT_TIMEOUT_MS = 45_000;

const COPY = {
  en: {
    open: "Ask the nursing assistant",
    title: "Nursing learning assistant",
    subtitle: "Evidence-aware explanations in English and Arabic",
    close: "Close assistant",
    safetyTitle: "Education only",
    safety: "Not for diagnosis, treatment, triage or emergencies. Never enter information that identifies a real patient or person, or confidential workplace information. Automated screening is limited. Follow the responsible clinical team and local emergency pathway.",
    privacy: "Your question is sent to OpenAI for processing and web search. This site does not save it in learning history or browser storage. OpenAI abuse-monitoring logs may retain prompts and responses for up to 30 days under the API account's data controls, so never enter patient or confidential data.",
    processing: "Sending asks OpenAI to search and answer. This site does not save the question in your learning record.",
    consent: "I confirm this is a general educational question with no real-patient, personal, confidential workplace or protected exam information.",
    consentRequired: "Confirm the privacy statement before sending.",
    examples: "Try an example",
    inputLabel: "Your nursing or health question",
    placeholder: "Example: Explain the nursing priorities for suspected sepsis.",
    counter: "characters",
    submit: "Search & explain",
    loading: "Searching the web for current sources…",
    cancel: "Cancel search",
    answer: "Educational explanation",
    sources: "Sources to review",
    sourceOpens: "opens in a new tab",
    noSources: "No direct source links were returned. Do not rely on this answer; try the search again.",
    another: "Ask another question",
    clear: "Clear this question and answer",
    aiCaution: "AI can make mistakes. Check the linked source and current local policy before using this for learning.",
    empty: "Enter a question before sending.",
    tooLong: "Keep the question within 1,200 characters.",
    offline: "You appear to be offline. Reconnect and try again.",
    patientData: "Possible patient-identifying information was detected. Remove it and ask only a general educational question.",
    rateLimited: "Too many requests right now. Wait a moment and try again.",
    unavailable: "The assistant is temporarily unavailable. Please try again later.",
    billingRequired: "The site's OpenAI API billing is not active yet. The site owner must activate API billing before answers can run.",
    timeout: "The search took too long. Please retry.",
    invalid: "The response did not include complete bilingual text with usable authoritative source links. Please try again.",
    genericError: "The question could not be answered right now. Please try again.",
    cancelled: "Search cancelled. Your question was not added to learning history.",
    answerReady: "The bilingual answer is ready. Review its source links.",
    englishAnswer: "English explanation",
    arabicAnswer: "الشرح العربي",
  },
  ar: {
    open: "اسأل المساعد التمريضي",
    title: "مساعد التعلم التمريضي",
    subtitle: "شرح مدعوم بالمصادر بالعربية والإنجليزية",
    close: "إغلاق المساعد",
    safetyTitle: "للتعليم فقط",
    safety: "ليس للتشخيص أو العلاج أو الفرز أو الطوارئ. لا تُدخل أي معلومات تحدد مريضاً أو شخصاً حقيقياً، ولا معلومات عمل سرية. الكشف الآلي محدود. اتبع الفريق السريري المسؤول ومسار الطوارئ المحلي.",
    privacy: "يُرسل سؤالك إلى OpenAI للمعالجة والبحث على الويب، ولا يحفظه هذا الموقع في سجل التعلم أو تخزين المتصفح. قد تحتفظ سجلات مراقبة إساءة الاستخدام لدى OpenAI بالسؤال والإجابة حتى 30 يوماً وفق ضوابط حساب API؛ لذلك لا تُدخل بيانات مريض أو معلومات سرية.",
    processing: "عند الإرسال سيبحث OpenAI ويجيب. لا يحفظ الموقع السؤال في سجل تعلمك.",
    consent: "أؤكد أن هذا سؤال تعليمي عام ولا يتضمن بيانات مريض حقيقي أو معلومات شخصية أو معلومات عمل سرية أو محتوى اختبار سرياً أو محمياً.",
    consentRequired: "أكد بيان الخصوصية قبل الإرسال.",
    examples: "جرّب مثالاً",
    inputLabel: "سؤالك التمريضي أو الصحي",
    placeholder: "مثال: اشرح أولويات التمريض عند الاشتباه بالإنتان.",
    counter: "حرف",
    submit: "ابحث واشرح",
    loading: "جارٍ البحث على الويب عن مصادر حالية…",
    cancel: "إلغاء البحث",
    answer: "الشرح التعليمي",
    sources: "مصادر للمراجعة",
    sourceOpens: "يفتح في علامة تبويب جديدة",
    noSources: "لم تُعد روابط مصادر مباشرة. لا تعتمد على هذه الإجابة، وأعد البحث.",
    another: "اسأل سؤالاً آخر",
    clear: "مسح السؤال والإجابة",
    aiCaution: "قد يخطئ الذكاء الاصطناعي. راجع المصدر المرتبط والسياسة المحلية الحالية قبل استخدام الشرح للتعلم.",
    empty: "اكتب سؤالاً قبل الإرسال.",
    tooLong: "اجعل السؤال في حدود 1200 حرف.",
    offline: "يبدو أن الاتصال بالإنترنت غير متاح. أعد الاتصال وحاول مجدداً.",
    patientData: "اكتُشفت معلومات قد تعرّف بمريض. احذفها واسأل سؤالاً تعليمياً عاماً فقط.",
    rateLimited: "توجد طلبات كثيرة الآن. انتظر قليلاً ثم حاول مجدداً.",
    unavailable: "المساعد غير متاح مؤقتاً. حاول لاحقاً.",
    billingRequired: "فوترة OpenAI API الخاصة بالموقع غير مفعلة بعد. يلزم أن يفعّل مالك الموقع فوترة الواجهة قبل تشغيل الإجابات.",
    timeout: "استغرق البحث وقتاً طويلاً. حاول مجدداً.",
    invalid: "لم تتضمن الاستجابة نصاً ثنائي اللغة كاملاً وروابط صالحة لمصادر مرجعية. حاول مجدداً.",
    genericError: "تعذر الرد على السؤال الآن. حاول مجدداً.",
    cancelled: "أُلغي البحث، ولم يُضف سؤالك إلى سجل التعلم.",
    answerReady: "أصبحت الإجابة ثنائية اللغة جاهزة. راجع روابط مصادرها.",
    englishAnswer: "English explanation",
    arabicAnswer: "الشرح العربي",
  },
};

const EXAMPLES = {
  en: [
    "Explain the nursing priorities for suspected sepsis.",
    "How do preload and afterload differ in nursing assessment?",
    "What should I review about high-alert medications for an exam?",
  ],
  ar: [
    "اشرح أولويات التمريض عند الاشتباه بالإنتان.",
    "ما الفرق بين preload و afterload في التقييم التمريضي؟",
    "ماذا أراجع عن الأدوية عالية الخطورة للاختبار؟",
  ],
};

const ERROR_COPY = {
  patient_data_detected: "patientData",
  assistant_busy: "rateLimited",
  assistant_not_configured: "unavailable",
  assistant_billing_required: "unavailable",
  assistant_unavailable: "unavailable",
  assistant_timeout: "timeout",
  assistant_incomplete: "invalid",
  invalid_assistant_response: "invalid",
};

function safeWebUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

function safeSources(sources) {
  const safe = [];
  for (const source of Array.isArray(sources) ? sources : []) {
    const url = safeWebUrl(source?.url);
    if (!url) continue;
    const cleanTitle = typeof source?.title === "string"
      ? source.title
        .replace(/[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 240)
      : "";
    safe.push({
      url: url.toString(),
      hostname: url.hostname.replace(/^www\./, ""),
      title: cleanTitle || url.hostname.replace(/^www\./, ""),
    });
  }
  return safe.slice(0, 10);
}

function BilingualAnswer({ answer, citations, sources, copy, lang }) {
  const safeSourceUrls = new Set(sources.map((source) => source.url));

  function renderSection(language) {
    const sectionAnswer = answer[language];
    const validCitations = (Array.isArray(citations?.[language]) ? citations[language] : [])
      .filter((citation) => Number.isInteger(citation?.start)
        && Number.isInteger(citation?.end)
        && citation.start >= 0
        && citation.end > citation.start
        && citation.end <= sectionAnswer.length
        && safeWebUrl(citation?.url)?.toString() === citation.url
        && safeSourceUrls.has(citation.url))
      .sort((left, right) => left.start - right.start || left.end - right.end);
    const parts = [];
    let cursor = 0;
    for (const [index, citation] of validCitations.entries()) {
      if (citation.start < cursor) continue;
      if (citation.start > cursor) parts.push(sectionAnswer.slice(cursor, citation.start));
      parts.push(<a
        className="nursing-assistant-inline-citation"
        href={citation.url}
        key={`${language}:${citation.url}:${citation.start}:${index}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        title={citation.title}
      >{sectionAnswer.slice(citation.start, citation.end)}<span className="sr-only"> ({copy.sourceOpens})</span></a>);
      cursor = citation.end;
    }
    if (cursor < sectionAnswer.length) parts.push(sectionAnswer.slice(cursor));
    return <section
      className="nursing-assistant-language-block"
      dir={language === "ar" ? "rtl" : "ltr"}
      lang={language}
      aria-label={language === "ar" ? copy.arabicAnswer : copy.englishAnswer}
      key={language}
    >
      <h4>{language === "ar" ? copy.arabicAnswer : copy.englishAnswer}</h4>
      <p>{parts.length ? parts : sectionAnswer}</p>
    </section>;
  }

  return <div className="nursing-assistant-answer-text">
    {(lang === "ar" ? ["ar", "en"] : ["en", "ar"]).map(renderSection)}
  </div>;
}

export function NursingAssistant({ lang = "en" }) {
  const copy = COPY[lang] ?? COPY.en;
  const dialogRef = useRef(null);
  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const titleRef = useRef(null);
  const resultHeadingRef = useRef(null);
  const controllerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [question, setQuestion] = useState("");
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => () => controllerRef.current?.abort(), []);

  useEffect(() => {
    const footer = document.querySelector(".site-footer");
    if (!footer || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (status === "success" && result) window.requestAnimationFrame(() => resultHeadingRef.current?.focus());
  }, [result, status]);

  function openAssistant() {
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
    setIsOpen(true);
    window.requestAnimationFrame(() => titleRef.current?.focus());
  }

  function closeAssistant() {
    controllerRef.current?.abort();
    if (dialogRef.current?.open) dialogRef.current.close();
  }

  function handleDialogClose() {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setIsOpen(false);
    setStatus((current) => current === "loading" ? "idle" : current);
    launcherRef.current?.focus();
  }

  function clearAssistant() {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setQuestion("");
    setPrivacyConfirmed(false);
    setResult(null);
    setMessage("");
    setStatus("idle");
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function cancelSearch() {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setStatus("idle");
    setMessage(copy.cancelled);
  }

  async function submitQuestion(event) {
    event.preventDefault();
    if (status === "loading") return;
    const normalizedQuestion = question.trim();
    if (!normalizedQuestion) {
      setMessage(copy.empty);
      inputRef.current?.focus();
      return;
    }
    if (normalizedQuestion.length > MAX_QUESTION_LENGTH) {
      setMessage(copy.tooLong);
      inputRef.current?.focus();
      return;
    }
    if (!privacyConfirmed) {
      setMessage(copy.consentRequired);
      return;
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setMessage(copy.offline);
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
    setStatus("loading");
    setMessage("");
    setResult(null);

    try {
      const response = await fetch("/api/nursing-assistant", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: normalizedQuestion, language: lang === "ar" ? "ar" : "en" }),
        signal: controller.signal,
      });
      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }
      if (!response.ok) {
        const copyKey = ERROR_COPY[payload?.error?.code]
          ?? (response.status === 429 ? "rateLimited" : response.status >= 500 ? "unavailable" : "genericError");
        throw new Error(copyKey);
      }
      const englishAnswer = typeof payload?.answer?.en === "string" ? payload.answer.en.trim() : "";
      const arabicAnswer = typeof payload?.answer?.ar === "string" ? payload.answer.ar.trim() : "";
      if (!englishAnswer || !arabicAnswer) throw new Error("invalid");

      setResult({
        answer: { en: englishAnswer, ar: arabicAnswer },
        citations: {
          en: Array.isArray(payload?.citations?.en) ? payload.citations.en : [],
          ar: Array.isArray(payload?.citations?.ar) ? payload.citations.ar : [],
        },
        sources: safeSources(payload.sources),
      });
      setStatus("success");
    } catch (error) {
      if (controllerRef.current !== controller) return;
      if (error?.name === "AbortError") setMessage(copy.timeout);
      else if (error instanceof TypeError && typeof navigator !== "undefined" && navigator.onLine === false) setMessage(copy.offline);
      else setMessage(copy[error?.message] ?? copy.genericError);
      setStatus("idle");
    } finally {
      window.clearTimeout(timeout);
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }

  return <div className={`nursing-assistant${footerVisible ? " nursing-assistant--footer-visible" : ""}`} dir={lang === "ar" ? "rtl" : "ltr"}>
    <button
      ref={launcherRef}
      type="button"
      className="nursing-assistant-launcher"
      aria-label={copy.open}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls="nursing-assistant-dialog"
      onClick={openAssistant}
    >
      <span className="nursing-assistant-launcher-icon"><ChatCircleDots size={25} weight="duotone" aria-hidden="true" /></span>
      <span>{copy.open}</span>
    </button>

    <dialog
      ref={dialogRef}
      id="nursing-assistant-dialog"
      className="nursing-assistant-dialog"
      aria-labelledby="nursing-assistant-title"
      aria-describedby="nursing-assistant-subtitle nursing-assistant-safety-text nursing-assistant-processing-note"
      onCancel={(event) => { event.preventDefault(); closeAssistant(); }}
      onClose={handleDialogClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeAssistant();
        }
      }}
    >
      <header className="nursing-assistant-header">
        <span className="nursing-assistant-mark"><Sparkle size={25} weight="duotone" aria-hidden="true" /></span>
        <div>
          <h2 ref={titleRef} id="nursing-assistant-title" tabIndex="-1">{copy.title}</h2>
          <p id="nursing-assistant-subtitle">{copy.subtitle}</p>
        </div>
        <button type="button" className="nursing-assistant-close" onClick={closeAssistant} aria-label={copy.close}>
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      <div className="nursing-assistant-scroll">
        <section className="nursing-assistant-safety" aria-label={copy.safetyTitle}>
          <ShieldWarning size={23} weight="fill" aria-hidden="true" />
          <div><strong>{copy.safetyTitle}</strong><p id="nursing-assistant-safety-text">{copy.safety}</p></div>
        </section>

        {!result ? <div className="nursing-assistant-examples">
          <span>{copy.examples}</span>
          <div>{EXAMPLES[lang === "ar" ? "ar" : "en"].map((example) => <button key={example} type="button" onClick={() => { setQuestion(example); setPrivacyConfirmed(false); setMessage(""); inputRef.current?.focus(); }}>{example}</button>)}</div>
        </div> : null}

        <form className="nursing-assistant-form" onSubmit={submitQuestion} aria-busy={status === "loading"}>
          <label htmlFor="nursing-assistant-question">{copy.inputLabel}</label>
          <textarea
            ref={inputRef}
            id="nursing-assistant-question"
            value={question}
            maxLength={MAX_QUESTION_LENGTH}
            rows="4"
            placeholder={copy.placeholder}
            aria-describedby="nursing-assistant-safety-text nursing-assistant-processing-note"
            disabled={status === "loading"}
            onChange={(event) => { setQuestion(event.target.value); setPrivacyConfirmed(false); setMessage(""); }}
          />
          <div className="nursing-assistant-form-meta">
            <span>{question.length.toLocaleString(lang === "ar" ? "ar-SA" : "en-US")} / {MAX_QUESTION_LENGTH.toLocaleString(lang === "ar" ? "ar-SA" : "en-US")} {copy.counter}</span>
            {status === "loading" ? <button type="button" className="nursing-assistant-cancel" onClick={cancelSearch}>{copy.cancel}</button> : null}
          </div>
          <p id="nursing-assistant-processing-note" className="nursing-assistant-processing-note">{copy.processing}</p>
          <label className="nursing-assistant-consent">
            <input type="checkbox" checked={privacyConfirmed} disabled={status === "loading"} onChange={(event) => { setPrivacyConfirmed(event.target.checked); setMessage(""); }} />
            <span>{copy.consent}</span>
          </label>
          <button type="submit" className="nursing-assistant-submit" disabled={status === "loading" || !question.trim() || !privacyConfirmed}>
            {status === "loading" ? <SpinnerGap className="nursing-assistant-spinner" size={19} aria-hidden="true" /> : <PaperPlaneTilt size={19} weight="fill" aria-hidden="true" />}
            {status === "loading" ? copy.loading : copy.submit}
          </button>
        </form>

        <div className="nursing-assistant-status" role="status" aria-live="polite" aria-atomic="true">
          {status === "loading" ? <p className="nursing-assistant-progress">{copy.loading}</p> : null}
          {message ? <p className="nursing-assistant-message">{message}</p> : null}
          {status === "success" ? <span className="sr-only">{copy.answerReady}</span> : null}
        </div>

        {result ? <section className="nursing-assistant-result" aria-labelledby="nursing-assistant-answer-title">
          <div className="nursing-assistant-result-heading"><Sparkle size={20} weight="duotone" aria-hidden="true" /><h3 ref={resultHeadingRef} id="nursing-assistant-answer-title" tabIndex="-1">{copy.answer}</h3></div>
          <BilingualAnswer answer={result.answer} citations={result.citations} sources={result.sources} copy={copy} lang={lang} />
          <p className="nursing-assistant-ai-caution"><ShieldWarning size={17} weight="fill" aria-hidden="true" />{copy.aiCaution}</p>
          <div className="nursing-assistant-source-section">
            <h3><MagnifyingGlass size={18} aria-hidden="true" />{copy.sources}</h3>
            {result.sources.length ? <ol>{result.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer nofollow"><span><span dir="auto">{source.title}</span><small dir="ltr">{source.hostname}</small></span><ArrowSquareOut size={15} aria-hidden="true" /><span className="sr-only"> ({copy.sourceOpens})</span></a></li>)}</ol> : <p className="nursing-assistant-no-sources">{copy.noSources}</p>}
          </div>
          <button type="button" className="nursing-assistant-another" onClick={() => { setResult(null); setQuestion(""); setPrivacyConfirmed(false); setMessage(""); setStatus("idle"); window.requestAnimationFrame(() => inputRef.current?.focus()); }}>{copy.another}</button>
        </section> : null}

        <details className="nursing-assistant-privacy">
          <summary>{lang === "ar" ? "كيف يُعالج السؤال؟" : "How is the question handled?"}</summary>
          <p>{copy.privacy}</p>
        </details>
      </div>

      <footer className="nursing-assistant-footer">
        <button type="button" onClick={clearAssistant}><Trash size={16} aria-hidden="true" />{copy.clear}</button>
      </footer>
    </dialog>
  </div>;
}
