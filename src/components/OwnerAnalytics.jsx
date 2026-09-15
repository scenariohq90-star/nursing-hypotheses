import { useEffect, useMemo, useState } from "react";
import { ChartLineUp, ClockClockwise, LockKey, Warning } from "@phosphor-icons/react";
import { scenarios } from "../data/scenarios.js";
import { examTracks } from "../data/question-bank.js";
import "./owner-analytics.css";

const text = {
  en: {
    title: "Visitor experience", period: "Period", refresh: "Refresh", sessions: "Approx. visit sessions", views: "Page openings", starts: "Practice starts", completions: "Practice completions", active: "Activity by day", scenarios: "Scenarios", exams: "Exam practice", pages: "Most opened pages", gaps: "Review areas", languages: "Languages", started: "Started", completed: "Completed", average: "Avg. score", unavailable: "Analytics are unavailable right now. Try refreshing later.", empty: "No events have been recorded in this period yet. Tracking starts only after this dashboard is published.", note: "Counts are anonymous events, not unique people. Starts and completions may belong to different days; automated visits can affect counts. Scores are shown only with at least five completions.", gapsNote: "A review area appears only after at least five anonymous completed practice events and five gap signals.", signIn: "Sign in as the site owner", denied: "This dashboard is available only to the site owner.", sepsis: "Sepsis Quiz", questions: "Question bank", scenarioName: "Scenario", pageName: "Page", scoreHidden: "More data needed", visitors: "No names, answers or patient information are collected.", days7: "Last 7 days", days30: "Last 30 days", days90: "Last 90 days", today: "Today", trendCaption: "Approximate visit sessions per UTC day",
  },
  ar: {
    title: "تجربة الزوار", period: "الفترة", refresh: "تحديث", sessions: "جلسات زيارة تقريبية", views: "مرات فتح الصفحات", starts: "بدايات التدريب", completions: "إكمالات التدريب", active: "النشاط اليومي", scenarios: "السيناريوهات", exams: "التدرب على الاختبارات", pages: "الصفحات الأكثر فتحًا", gaps: "مجالات تحتاج مراجعة", languages: "اللغات", started: "بدأ", completed: "أكمل", average: "متوسط النتيجة", unavailable: "تعذر تحميل الإحصاءات الآن. جرّب التحديث لاحقًا.", empty: "ما سُجلت أحداث خلال هذه الفترة بعد. يبدأ القياس بعد نشر هذه اللوحة فقط.", note: "هذه أعداد أحداث مجهولة، وليست أشخاصًا فريدين. قد تقع البداية والإكمال في يومين مختلفين، وقد تؤثر الزيارات الآلية في العد. لا نعرض متوسط النتائج قبل خمس إكمالات.", gapsNote: "لا يظهر مجال المراجعة قبل خمس إكمالات تدريبية مجهولة وخمس إشارات ضعف على الأقل.", signIn: "سجل الدخول كمالك للموقع", denied: "هذه اللوحة متاحة لمالك الموقع فقط.", sepsis: "اختبار Sepsis", questions: "بنك الأسئلة", scenarioName: "سيناريو", pageName: "صفحة", scoreHidden: "نحتاج بيانات أكثر", visitors: "لا تُجمع أسماء أو إجابات أو بيانات مرضى.", days7: "آخر ٧ أيام", days30: "آخر ٣٠ يومًا", days90: "آخر ٩٠ يومًا", today: "اليوم", trendCaption: "جلسات الزيارة التقريبية لكل يوم بحسب UTC",
  },
};

const pageLabels = {
  en: { home: "Home", scenarios: "Scenarios", scenario: "Scenario", result: "Scenario result", questions: "Question bank", "sepsis-quiz": "Sepsis Quiz", "dose-practice": "Medication math", learning: "My learning", resources: "References", about: "About", privacy: "Privacy", terms: "Terms", contact: "Contact" },
  ar: { home: "الرئيسية", scenarios: "السيناريوهات", scenario: "السيناريو", result: "نتيجة السيناريو", questions: "بنك الأسئلة", "sepsis-quiz": "اختبار Sepsis", "dose-practice": "حساب الأدوية", learning: "تعلمي", resources: "المراجع", about: "عن المنصة", privacy: "الخصوصية", terms: "الشروط", contact: "التواصل" },
};
const gapLabels = {
  en: { "assessment-recognition": "Assessment and recognition", "prioritization-response": "Prioritisation and response", "escalation-coordination": "Escalation and coordination", "reassessment-monitoring": "Reassessment and monitoring", "communication-handover": "Communication and handover", "safety-quality": "Safety and quality", "person-centred-care": "Person-centred care", "adult-medical-surgical": "Adult medical–surgical", "emergency-critical-care": "Emergency and critical care", pediatrics: "Paediatrics", "maternal-newborn": "Maternal and newborn", "mental-health": "Mental health", pharmacology: "Pharmacology", fundamentals: "Fundamentals", "management-safety": "Management and safety" },
  ar: { "assessment-recognition": "التقييم والتعرف على العلامات", "prioritization-response": "الأولويات والاستجابة", "escalation-coordination": "التصعيد والتنسيق", "reassessment-monitoring": "إعادة التقييم والمراقبة", "communication-handover": "التواصل والتسليم", "safety-quality": "السلامة والجودة", "person-centred-care": "الرعاية المتمحورة حول الشخص", "adult-medical-surgical": "باطنية وجراحة الكبار", "emergency-critical-care": "الطوارئ والعناية الحرجة", pediatrics: "الأطفال", "maternal-newborn": "الأمومة وحديثو الولادة", "mental-health": "الصحة النفسية", pharmacology: "الأدوية", fundamentals: "الأساسيات", "management-safety": "الإدارة والسلامة" },
};

function summarize(rows) {
  const byEvent = new Map();
  const visitsByDay = new Map();
  const visitsByLanguage = new Map();
  for (const row of rows) {
    if (!Number.isFinite(row.count) || row.count <= 0) continue;
    const key = `${row.event}:${row.dimension}`;
    const current = byEvent.get(key) ?? { event: row.event, dimension: row.dimension, count: 0, scoreSum: 0 };
    current.count += row.count;
    current.scoreSum += Number(row.scoreSum) || 0;
    byEvent.set(key, current);
    if (row.event === "visit") {
      visitsByDay.set(row.day, (visitsByDay.get(row.day) ?? 0) + row.count);
      visitsByLanguage.set(row.language, (visitsByLanguage.get(row.language) ?? 0) + row.count);
    }
  }
  const get = (event, dimension) => byEvent.get(`${event}:${dimension}`) ?? { count: 0, scoreSum: 0 };
  const list = (event) => [...byEvent.values()].filter((item) => item.event === event).sort((a, b) => b.count - a.count);
  const scenarioRows = list("scenario_start").map((item) => ({ dimension: item.dimension, started: item.count, completed: get("scenario_complete", item.dimension).count, scoreSum: get("scenario_complete", item.dimension).scoreSum }));
  for (const item of list("scenario_complete")) if (!scenarioRows.some((row) => row.dimension === item.dimension)) scenarioRows.push({ dimension: item.dimension, started: 0, completed: item.count, scoreSum: item.scoreSum });
  const examRows = ["saudi-nursing", "international-rn", "computerized-practice"].map((dimension) => ({ dimension, started: get("question_start", dimension).count, completed: get("question_complete", dimension).count, scoreSum: get("question_complete", dimension).scoreSum })).filter((item) => item.started || item.completed);
  const sepsis = { dimension: "sepsis", started: get("sepsis_start", "sepsis").count, completed: get("sepsis_complete", "sepsis").count, scoreSum: get("sepsis_complete", "sepsis").scoreSum };
  if (sepsis.started || sepsis.completed) examRows.push(sepsis);
  return {
    sessions: get("visit", "all").count,
    views: list("page").reduce((sum, item) => sum + item.count, 0),
    starts: scenarioRows.reduce((sum, item) => sum + item.started, 0) + examRows.reduce((sum, item) => sum + item.started, 0),
    completions: scenarioRows.reduce((sum, item) => sum + item.completed, 0) + examRows.reduce((sum, item) => sum + item.completed, 0),
    visitsByDay: [...visitsByDay.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    visitsByLanguage: [...visitsByLanguage.entries()],
    scenarioRows: scenarioRows.sort((a, b) => b.started - a.started),
    examRows,
    pages: list("page"),
    gaps: list("focus_gap"),
  };
}

function format(value, lang) { return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US").format(value); }
function displayScore(item, lang, copy) { return item.completed >= 5 ? `${format(Math.round(item.scoreSum / item.completed), lang)}%` : copy.scoreHidden; }

export function OwnerAnalytics({ lang }) {
  const copy = text[lang] ?? text.en;
  const [days, setDays] = useState(30);
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState({ status: "loading", rows: [], through: "" });
  useEffect(() => {
    const controller = new AbortController();
    setState((current) => ({ ...current, status: "loading" }));
    fetch(`/api/owner-analytics?days=${days}`, { signal: controller.signal, credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) return { status: "signin" };
        if (response.status === 403) return { status: "denied" };
        if (!response.ok) throw new Error("unavailable");
        const payload = await response.json();
        return { status: "ready", rows: Array.isArray(payload.rows) ? payload.rows : [], through: payload.through ?? "" };
      })
      .then((next) => { if (!controller.signal.aborted) setState(next); })
      .catch(() => { if (!controller.signal.aborted) setState({ status: "error", rows: [], through: "" }); });
    return () => controller.abort();
  }, [days, revision]);
  const summary = useMemo(() => summarize(state.rows ?? []), [state.rows]);
  const maxDaily = Math.max(1, ...summary.visitsByDay.map(([, count]) => count));
  const scenarioLabel = (id) => scenarios.find((scenario) => scenario.id === id)?.title?.[lang] ?? id;
  const examLabel = (id) => id === "sepsis" ? copy.sepsis : examTracks.find((track) => track.id === id)?.label?.[lang] ?? id;
  return <div className="page-container owner-analytics" dir={lang === "ar" ? "rtl" : "ltr"}>
    <div className="oa-heading"><div><span className="oa-owner-mark"><LockKey size={18} weight="duotone" /> {lang === "ar" ? "لوحة المالك" : "Owner dashboard"}</span><h1>{copy.title}</h1><p>{copy.visitors}</p></div><div className="oa-controls"><label htmlFor="oa-period">{copy.period}<select id="oa-period" value={days} onChange={(event) => setDays(Number(event.target.value))}><option value="7">{copy.days7}</option><option value="30">{copy.days30}</option><option value="90">{copy.days90}</option></select></label><button type="button" onClick={() => setRevision((current) => current + 1)}><ClockClockwise size={18} />{copy.refresh}</button></div></div>
    {state.status === "loading" ? <p className="oa-state" role="status">{lang === "ar" ? "جارٍ تحميل البيانات…" : "Loading analytics…"}</p> : null}
    {state.status === "signin" ? <p className="oa-state" role="status"><a href="/signin-with-chatgpt?return_to=%2Fowner-dashboard" target="_top">{copy.signIn}</a></p> : null}
    {state.status === "denied" ? <p className="oa-state" role="alert">{copy.denied}</p> : null}
    {state.status === "error" ? <p className="oa-state" role="alert"><Warning size={18} />{copy.unavailable}</p> : null}
    {state.status === "ready" ? <>
      <div className="oa-metrics"><article><span>{copy.sessions}</span><strong>{format(summary.sessions, lang)}</strong></article><article><span>{copy.views}</span><strong>{format(summary.views, lang)}</strong></article><article><span>{copy.starts}</span><strong>{format(summary.starts, lang)}</strong></article><article><span>{copy.completions}</span><strong>{format(summary.completions, lang)}</strong></article></div>
      {summary.views === 0 && summary.starts === 0 ? <p className="oa-state">{copy.empty}</p> : <>
        <div className="oa-grid"><section className="oa-panel oa-trend"><div className="oa-panel-heading"><ChartLineUp size={22} /><h2>{copy.active}</h2></div><div className="oa-bars" role="img" aria-label={copy.trendCaption}>{summary.visitsByDay.map(([day, count]) => <div key={day} className="oa-bar-item" title={`${day}: ${count}`}><span style={{ height: `${Math.max(8, count / maxDaily * 100)}%` }} /><small>{day.slice(5)}</small></div>)}</div><p>{copy.trendCaption}</p></section><section className="oa-panel"><h2>{copy.languages}</h2><div className="oa-simple-rows">{summary.visitsByLanguage.map(([language, count]) => <div key={language}><span>{language === "ar" ? "العربية" : "English"}</span><strong>{format(count, lang)}</strong></div>)}</div></section></div>
        <div className="oa-grid"><section className="oa-panel"><h2>{copy.scenarios}</h2><div className="oa-list">{summary.scenarioRows.length ? summary.scenarioRows.map((item) => <div key={item.dimension}><strong>{scenarioLabel(item.dimension)}</strong><span>{copy.started}: {format(item.started, lang)} · {copy.completed}: {format(item.completed, lang)}</span><small>{copy.average}: {displayScore(item, lang, copy)}</small></div>) : <p>—</p>}</div></section><section className="oa-panel"><h2>{copy.exams}</h2><div className="oa-list">{summary.examRows.length ? summary.examRows.map((item) => <div key={item.dimension}><strong>{examLabel(item.dimension)}</strong><span>{copy.started}: {format(item.started, lang)} · {copy.completed}: {format(item.completed, lang)}</span><small>{copy.average}: {displayScore(item, lang, copy)}</small></div>) : <p>—</p>}</div></section></div>
        <div className="oa-grid"><section className="oa-panel"><h2>{copy.pages}</h2><div className="oa-simple-rows">{summary.pages.slice(0, 8).map((item) => <div key={item.dimension}><span>{pageLabels[lang]?.[item.dimension] ?? item.dimension}</span><strong>{format(item.count, lang)}</strong></div>)}</div></section><section className="oa-panel"><h2>{copy.gaps}</h2>{summary.completions >= 5 && summary.gaps.some((item) => item.count >= 5) ? <div className="oa-simple-rows">{summary.gaps.filter((item) => item.count >= 5).slice(0, 8).map((item) => <div key={item.dimension}><span>{gapLabels[lang]?.[item.dimension] ?? item.dimension}</span><strong>{format(item.count, lang)}</strong></div>)}</div> : <p className="oa-quiet">{copy.gapsNote}</p>}</section></div>
      </>}
      <p className="oa-footnote">{copy.note}</p>
    </> : null}
  </div>;
}
