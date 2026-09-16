import {
  ArrowLeft,
  ArrowRight,
  ChartLineUp,
  ChatCircleDots,
  ClipboardText,
  FirstAidKit,
  Gauge,
  Play,
  Pulse,
  Wind,
} from "@phosphor-icons/react";
import "./home-experience.css";

function fallbackLocalize(value, lang) {
  return value && typeof value === "object"
    ? value[lang] || value.en || value.ar || ""
    : String(value ?? "");
}

function getCopy(t, key, fallback) {
  const translated = typeof t === "function" ? t(key) : "";
  return translated && translated !== key ? translated : fallback;
}

function formatVital(vital, lang, localize) {
  if (!vital) return "—";
  const rawValue = vital.value;
  const value = typeof rawValue === "number"
    ? new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US").format(rawValue)
    : localize(rawValue, lang);
  const unit = localize(vital.unit, lang)
    .replace(/on room air/gi, "")
    .replace(/على هواء الغرفة/g, "")
    .trim();
  if (unit === "%") return `${value}%`;
  return unit ? `${value} ${unit}` : value;
}

function selectFeaturedVitals(featured, lang, localize) {
  const preferredStep = featured?.steps?.[1];
  const stepWithVitals = Array.isArray(preferredStep?.vitals) && preferredStep.vitals.length
    ? preferredStep
    : featured?.steps?.find((step) => Array.isArray(step.vitals) && step.vitals.length);
  const vitals = stepWithVitals?.vitals || [];
  const normalizedLabel = (vital) => `${localize(vital?.label, "en")} ${localize(vital?.label, "ar")}`.toLowerCase();
  const oxygen = vitals.find((vital) => /spo2|oxygen|أكسجين|تشبع/.test(normalizedLabel(vital)));
  const respiratory = vitals.find((vital) => /respiratory|breathing|تنفس/.test(normalizedLabel(vital)));
  const selected = [oxygen, respiratory].filter(Boolean);

  for (const vital of vitals) {
    if (selected.length === 2) break;
    if (!selected.includes(vital)) selected.push(vital);
  }

  return selected.map((vital) => ({
    id: localize(vital.label, "en") || localize(vital.label, lang),
    label: localize(vital.label, lang),
    value: formatVital(vital, lang, localize),
    Icon: /spo2|oxygen|أكسجين|تشبع/.test(normalizedLabel(vital)) ? Gauge : Wind,
  }));
}

/**
 * Immersive, mobile-first entry point for the featured nursing simulation.
 * Navigation is passed in so the component stays independent from the app router.
 */
export function HomeExperience({
  lang = "ar",
  t,
  featured,
  onStart,
  onNavigate,
  localize = fallbackLocalize,
  heroImage,
}) {
  if (!featured) return null;

  const isArabic = lang === "ar";
  const direction = isArabic ? "rtl" : "ltr";
  const steps = Array.isArray(featured.steps) ? featured.steps : [];
  const vitals = selectFeaturedVitals(featured, lang, localize);
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
  const context = localize(featured.department, lang);
  const title = getCopy(t, "homeDecisionTitle", isArabic ? "هل تلاحظ علامة الخطر؟" : "Can you spot the warning sign?");
  const practiceCase = getCopy(t, "practiceCase", isArabic ? "حالة تدريبية" : "Practice case");

  return (
    <div className="home-experience" dir={direction}>
      <section className="home-experience__hero" aria-labelledby="home-decision-title">
        {heroImage ? (
          <img
            className="home-experience__image"
            src={heroImage}
            alt=""
            aria-hidden="true"
          />
        ) : null}
        <div className="home-experience__veil" aria-hidden="true" />

        <div className="home-experience__content">
          <div className="home-experience__context">
            <FirstAidKit size={18} weight="duotone" aria-hidden="true" />
            <span>{context}</span>
            <span className="home-experience__context-dot" aria-hidden="true" />
            <span>{practiceCase}</span>
          </div>

          <div className="home-experience__heading">
            <span className="home-experience__pulse" aria-hidden="true">
              <Pulse size={30} weight="duotone" />
            </span>
            <div>
              <p className="home-experience__eyebrow">
                {getCopy(t, "featured", isArabic ? "المحاكاة المختارة" : "Featured simulation")}
              </p>
              <h1 id="home-decision-title">{title}</h1>
            </div>
          </div>

          <p className="home-experience__summary">
            {getCopy(
              t,
              "homeDecisionBody",
              isArabic
                ? "اقرأ المؤشرات، رتّب أولوياتك، ثم اتخذ القرار التمريضي الأنسب."
                : "Read the cues, set your priorities, then choose the best nursing response.",
            )}
          </p>

          <div className="home-experience__vitals" aria-label={getCopy(t, "keyVitals", isArabic ? "المؤشرات الحيوية" : "Key vital signs")}>
            {vitals.map((vital) => (
              <div className="home-experience__vital" key={vital.id}>
                <span className="home-experience__vital-icon" aria-hidden="true"><vital.Icon size={29} weight="duotone" /></span>
                <span className="home-experience__vital-copy"><small>{vital.label}</small><strong dir="ltr">{vital.value}</strong></span>
              </div>
            ))}
          </div>

          {steps.length ? (
            <div className="home-experience__path">
              <div className="home-experience__path-labels">
                <span>{getCopy(t, "decisionPath", isArabic ? "مسار الحالة" : "Case pathway")}</span>
                <span>
                  {new Intl.NumberFormat(isArabic ? "ar-SA" : "en-US").format(steps.length)} {getCopy(t, "decisions", isArabic ? "قرارات" : "decisions")}
                </span>
              </div>
              <ol
                className="home-experience__steps"
                style={{ "--step-count": steps.length }}
                aria-label={getCopy(t, "decisionPath", isArabic ? "مسار الحالة" : "Case pathway")}
              >
                {steps.map((step, index) => (
                  <li className={index === 0 ? "is-active" : ""} key={step.id || index}>
                    <span aria-hidden="true">{index + 1}</span>
                    <span className="sr-only">
                      {getCopy(t, "decision", isArabic ? "القرار" : "Decision")} {index + 1}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <button
            type="button"
            className="home-experience__start"
            onClick={() => onStart?.(featured.id)}
          >
            <Play size={20} weight="fill" aria-hidden="true" />
            <span>{getCopy(t, "startFirstDecision", isArabic ? "ابدأ القرار الأول" : "Start the first decision")}</span>
            <ArrowIcon size={20} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </section>

      <nav className="home-experience__shortcuts" aria-label={getCopy(t, "quickLinks", isArabic ? "روابط سريعة" : "Quick links")}>
        <button type="button" onClick={() => onNavigate?.("questions")}>
          <span className="home-experience__shortcut-icon"><ClipboardText size={24} weight="duotone" aria-hidden="true" /></span>
          <span>
            <strong>{getCopy(t, "questionBank", isArabic ? "بنك الأسئلة" : "Question bank")}</strong>
            <small>{getCopy(t, "homeQuestionsHint", isArabic ? "تدرّب باختبارات قصيرة ومتنوعة" : "Practise with short, varied quizzes")}</small>
          </span>
          <ArrowIcon size={19} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => onNavigate?.("learning")}>
          <span className="home-experience__shortcut-icon"><ChartLineUp size={24} weight="duotone" aria-hidden="true" /></span>
          <span>
            <strong>{getCopy(t, "learning", isArabic ? "تعلّمي" : "My learning")}</strong>
            <small>{getCopy(t, "homeLearningHint", isArabic ? "تابع تقدمك وحدد نقاط التحسين" : "Track progress and focus areas")}</small>
          </span>
          <ArrowIcon size={19} aria-hidden="true" />
        </button>
      </nav>
      <section className="home-experience__assistant" aria-labelledby="home-assistant-title">
        <span className="home-experience__assistant-icon" aria-hidden="true">
          <ChatCircleDots size={26} weight="duotone" />
        </span>
        <div className="home-experience__assistant-copy">
          <div className="home-experience__assistant-heading">
            <h2 id="home-assistant-title">
              {getCopy(t, "assistantComingSoonTitle", isArabic ? "المساعد الذكي" : "Smart nursing assistant")}
            </h2>
            <span className="home-experience__assistant-badge">
              {getCopy(t, "assistantComingSoonLabel", isArabic ? "قريبًا" : "Coming soon")}
            </span>
          </div>
          <p>{getCopy(
            t,
            "assistantComingSoonBody",
            isArabic
              ? "اسأل عن موضوع تمريضي عام. سيبحث المساعد عن مصادر حديثة ويشرح الإجابة بالعربية والإنجليزية، مع روابط تقدر ترجع لها."
              : "Ask a general nursing question. The assistant will search current sources and explain the answer in English and Arabic, with links you can review.",
          )}</p>
        </div>
      </section>
    </div>
  );
}

export default HomeExperience;
