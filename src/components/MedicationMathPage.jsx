import { useRef, useState } from "react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  Calculator,
  CheckCircle,
  Flask,
  Info,
  ShieldWarning,
  XCircle,
} from "@phosphor-icons/react";
import { dosePracticeExercises } from "../data/dose-practice.js";
import { gradeDosePracticeAnswer } from "../lib/dose-calculator.js";
import "./medication-math.css";

const EMPTY_ANSWERS = Object.freeze({ requiredDoseMg: "", calculatedVolumeMl: "" });

const SOURCE_LINKS = Object.freeze([
  Object.freeze({
    href: "https://home.ecri.org/blogs/ismp-resources/targeted-medication-safety-best-practices-for-hospitals",
    en: "ISMP Targeted Medication Safety Best Practices for Hospitals",
    ar: "أفضل ممارسات سلامة الدواء المستهدفة للمستشفيات من ISMP",
  }),
  Object.freeze({
    href: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/dosage-delivery-devices-orally-ingested-otc-liquid-drug-products",
    en: "FDA guidance on oral liquid dosing devices",
    ar: "إرشادات FDA لأدوات قياس السوائل الفموية",
  }),
]);

const pageCopy = {
  en: {
    eyebrow: "Medication-math learning tool",
    title: "Paediatric medication-math practice",
    lead: "Solve authored exercises with fictional values, then compare your answer with a transparent, unit-by-unit worked solution.",
    boundaryTitle: "Arithmetic practice — not a dose recommendation",
    boundaryBody: "This tool uses fixed fictional problems. It does not select a medicine or dose, validate an order, or check indication, age limits, allergies, contraindications, maximum dose, interval, route, organ function, interactions, formulation, concentration, measuring device or local policy. Do not use it during patient care or an emergency.",
    privacyNote: "Use the exercise values only. Your two numeric answers stay in this page until you reset or leave; they are not saved to your learning history. Never enter patient information.",
    problemTitle: "Fictional practice problem",
    suppliedOrder: "Exercise amount",
    fictionalWeight: "Fictional weight",
    fictionalLabel: "Fictional label",
    doseUnitWarning: "This exercise uses mg/kg/dose — never substitute a per-day value.",
    answerTitle: "Your arithmetic",
    requiredDoseMg: "Calculated amount (mg/dose)",
    calculatedVolumeMl: "Calculated volume (mL/dose)",
    answerHint: "Enter a positive decimal number. Use a dot or Arabic decimal mark and no thousands separator.",
    acknowledge: "I understand this is fictional arithmetic practice and must not be used to calculate or verify a real patient's medication.",
    check: "Check my calculation",
    reset: "Clear answer",
    next: "Next fictional problem",
    errorTitle: "Check the highlighted answers.",
    required: "Enter your answer.",
    invalid: "Use a positive decimal number without a thousands separator.",
    acknowledgeError: "Confirm the educational-use statement before checking your answer.",
    resultCorrect: "Both arithmetic answers match",
    resultReview: "Review the worked solution",
    firstStep: "Step 1 · Calculate the amount in mg/dose",
    secondStep: "Step 2 · Convert the fictional label to mL/dose",
    yourAnswer: "Your answer",
    expectedAnswer: "Worked answer",
    correct: "Matches",
    review: "Review",
    displayRounding: "Answers are compared to two decimal places for this exercise. No intermediate value is rounded.",
    resultBoundary: "A matching equation does not establish that any real order, medicine, concentration or administration is safe.",
    checklistTitle: "Before real medication administration",
    checklistBody: "Leave this website and use your authorised medication system, original order and product label. Apply current approved references, facility policy and the required independent check with the responsible clinician or pharmacist.",
    sourceTitle: "Safety sources for how this exercise is presented",
    sourceNote: "These sources support unit and measurement safety principles; they do not validate the fictional dose values.",
  },
  ar: {
    eyebrow: "أداة تعليمية للحساب الدوائي",
    title: "تدريب على حساب جرعات الأطفال",
    lead: "حل مسائل مؤلفة بقيم خيالية، ثم قارن إجابتك بحل واضح يبيّن الوحدات خطوة بخطوة.",
    boundaryTitle: "تدريب حسابي — وليس توصية بجرعة",
    boundaryBody: "تستخدم الأداة مسائل خيالية ثابتة. ولا تختار دواءً أو جرعة، ولا تتحقق من صحة الأمر أو الاستطباب أو حدود العمر أو الحساسية أو موانع الاستعمال أو الحد الأقصى أو الفاصل أو الطريق أو وظائف الأعضاء أو التداخلات أو المستحضر أو التركيز أو أداة القياس أو سياسة المنشأة. لا تستخدمها أثناء رعاية مريض أو في الطوارئ.",
    privacyNote: "استخدم قيم التمرين فقط. تبقى إجابتك الرقمية داخل الصفحة حتى تمسحها أو تغادر، ولا تُحفظ في سجل تعلمك. لا تدخل أي معلومات تخص مريضاً.",
    problemTitle: "مسألة تدريب خيالية",
    suppliedOrder: "كمية التمرين",
    fictionalWeight: "الوزن الخيالي",
    fictionalLabel: "الملصق الخيالي",
    doseUnitWarning: "يستخدم هذا التمرين mg/kg/dose — لا تستبدلها أبداً بقيمة مكتوبة لكل يوم.",
    answerTitle: "حسابك",
    requiredDoseMg: "الكمية المحسوبة (mg/dose)",
    calculatedVolumeMl: "الحجم المحسوب (mL/dose)",
    answerHint: "أدخل رقماً عشرياً موجباً بالنقطة أو العلامة العشرية العربية، ومن دون فاصل آلاف.",
    acknowledge: "أفهم أن هذا تدريب حسابي خيالي ولا يجوز استخدامه لحساب دواء مريض حقيقي أو التحقق منه.",
    check: "تحقق من حسابي",
    reset: "مسح الإجابة",
    next: "مسألة خيالية تالية",
    errorTitle: "راجع الإجابات المحددة.",
    required: "أدخل إجابتك.",
    invalid: "استخدم رقماً عشرياً موجباً من دون فاصل آلاف.",
    acknowledgeError: "أكد عبارة الاستخدام التعليمي قبل التحقق من إجابتك.",
    resultCorrect: "تطابقت الإجابتان الحسابيتان",
    resultReview: "راجع الحل الموضح",
    firstStep: "الخطوة 1 · حساب الكمية بوحدة mg/dose",
    secondStep: "الخطوة 2 · التحويل من الملصق الخيالي إلى mL/dose",
    yourAnswer: "إجابتك",
    expectedAnswer: "الإجابة المحلولة",
    correct: "مطابقة",
    review: "تحتاج مراجعة",
    displayRounding: "تُقارن الإجابات حتى خانتين عشريتين في هذا التمرين، ولا تُقرّب القيم الوسيطة.",
    resultBoundary: "تطابق المعادلة لا يعني أن أي أمر أو دواء أو تركيز أو إعطاء حقيقي آمن.",
    checklistTitle: "قبل إعطاء دواء حقيقي",
    checklistBody: "غادر هذا الموقع واستخدم نظام الدواء المعتمد والأمر الأصلي وملصق المنتج. طبّق المراجع الحالية المعتمدة وسياسة المنشأة والمراجعة المستقلة المطلوبة مع الممارس المسؤول أو الصيدلي.",
    sourceTitle: "مصادر السلامة المستخدمة في عرض التمرين",
    sourceNote: "تدعم هذه المصادر مبادئ سلامة الوحدات والقياس، ولا تعتمد قيم الجرعات الخيالية.",
  },
};

function localize(value, lang) {
  return value?.[lang] ?? value?.en ?? value?.ar ?? "";
}

function formatValue(value, lang, maximumFractionDigits = 4) {
  return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", {
    maximumFractionDigits,
    useGrouping: false,
  }).format(value);
}

function AnswerField({ name, value, label, hint, error, onChange, lang }) {
  const inputId = `dose-practice-${name}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  return <div className={`dose-field ${error ? "has-error" : ""}`}>
    <label htmlFor={inputId}>{label}</label>
    <input
      id={inputId}
      name={name}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      spellCheck="false"
      value={value}
      onChange={onChange}
      aria-invalid={Boolean(error)}
      aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
      dir="ltr"
      lang={lang === "ar" ? "ar" : "en"}
    />
    <small id={hintId}>{hint}</small>
    {error ? <span id={errorId} className="dose-field-error">{error}</span> : null}
  </div>;
}

function AnswerReview({ label, submitted, expected, isCorrect, text, lang, unit }) {
  return <div className={`dose-answer-review ${isCorrect ? "is-correct" : "needs-review"}`}>
    <div><strong>{label}</strong><span>{isCorrect ? text.correct : text.review}</span></div>
    <dl>
      <div><dt>{text.yourAnswer}</dt><dd dir="ltr">{formatValue(submitted, lang)} {unit}</dd></div>
      <div><dt>{text.expectedAnswer}</dt><dd dir="ltr">{formatValue(expected, lang)} {unit}</dd></div>
    </dl>
  </div>;
}

export function MedicationMathPage({ lang }) {
  const text = pageCopy[lang] ?? pageCopy.en;
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [acknowledged, setAcknowledged] = useState(false);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const formRef = useRef(null);
  const resultRef = useRef(null);
  const exercise = dosePracticeExercises[exerciseIndex];

  function clearAnswer() {
    setAnswers(EMPTY_ANSWERS);
    setErrors({});
    setResult(null);
  }

  function handleInput(event) {
    const { name, value } = event.target;
    setAnswers((current) => ({ ...current, [name]: value }));
    setErrors({});
    setResult(null);
  }

  function fieldError(name) {
    const code = errors[name];
    return code ? (text[code] ?? text.invalid) : "";
  }

  function submit(event) {
    event.preventDefault();
    if (!acknowledged) {
      setErrors({ acknowledgement: "required" });
      setResult(null);
      window.requestAnimationFrame(() => formRef.current?.querySelector('input[type="checkbox"]')?.focus());
      return;
    }
    const graded = gradeDosePracticeAnswer(exercise, answers);
    if (!graded.ok) {
      setErrors(graded.errors);
      setResult(null);
      window.requestAnimationFrame(() => formRef.current?.querySelector('input[aria-invalid="true"]')?.focus());
      return;
    }
    setErrors({});
    setResult(graded);
    window.requestAnimationFrame(() => resultRef.current?.focus({ preventScroll: true }));
  }

  function nextProblem() {
    setExerciseIndex((current) => (current + 1) % dosePracticeExercises.length);
    clearAnswer();
  }

  const hasErrors = Object.keys(errors).some((key) => errors[key]);
  const calculation = result?.calculation;
  const values = calculation?.values;

  return <div className="page-container dose-practice-page">
    <header className="section-intro dose-practice-intro">
      <p className="eyebrow"><Calculator size={18} weight="bold" aria-hidden="true" /> {text.eyebrow}</p>
      <h1>{text.title}</h1>
      <p className="section-lead">{text.lead}</p>
    </header>

    <section className="dose-boundary" role="note">
      <ShieldWarning size={30} weight="fill" aria-hidden="true" />
      <div><h2>{text.boundaryTitle}</h2><p>{text.boundaryBody}</p></div>
    </section>

    <div className="dose-practice-layout">
      <form ref={formRef} className="dose-calculator-card" onSubmit={submit} noValidate>
        <div className="dose-card-heading">
          <span className="dose-card-icon" aria-hidden="true"><Flask size={25} weight="duotone" /></span>
          <p>{text.privacyNote}</p>
        </div>

        {hasErrors ? <div className="dose-error-summary" role="alert">
          <ShieldWarning size={21} weight="fill" aria-hidden="true" />
          <p>{errors.acknowledgement ? text.acknowledgeError : text.errorTitle}</p>
        </div> : null}

        <fieldset className="dose-problem-card">
          <legend>{text.problemTitle}</legend>
          <h2>{localize(exercise.label, lang)}</h2>
          <dl className="dose-problem-values">
            <div><dt>{text.fictionalWeight}</dt><dd dir="ltr">{formatValue(exercise.weightKg, lang)} kg</dd></div>
            <div><dt>{text.suppliedOrder}</dt><dd dir="ltr">{formatValue(exercise.orderedMgPerKg, lang)} mg/kg/dose</dd></div>
            <div><dt>{text.fictionalLabel}</dt><dd dir="ltr">{formatValue(exercise.stockStrengthMg, lang)} mg / {formatValue(exercise.stockVolumeMl, lang)} mL</dd></div>
          </dl>
          <p className="dose-unit-warning"><ShieldWarning size={17} weight="fill" aria-hidden="true" /> {text.doseUnitWarning}</p>
        </fieldset>

        <fieldset className="dose-answer-fields">
          <legend>{text.answerTitle}</legend>
          <div className="dose-field-grid">
            <AnswerField name="requiredDoseMg" value={answers.requiredDoseMg} label={text.requiredDoseMg} hint={text.answerHint} error={fieldError("requiredDoseMg")} onChange={handleInput} lang={lang} />
            <AnswerField name="calculatedVolumeMl" value={answers.calculatedVolumeMl} label={text.calculatedVolumeMl} hint={text.answerHint} error={fieldError("calculatedVolumeMl")} onChange={handleInput} lang={lang} />
          </div>
        </fieldset>

        <label className={`dose-acknowledgement ${errors.acknowledgement ? "has-error" : ""}`}>
          <input type="checkbox" checked={acknowledged} onChange={(event) => { setAcknowledged(event.target.checked); setErrors((current) => ({ ...current, acknowledgement: undefined })); }} />
          <span>{text.acknowledge}</span>
        </label>

        <div className="dose-form-actions">
          <button type="submit" className="button button-primary"><Calculator size={19} aria-hidden="true" /> {text.check}</button>
          <button type="button" className="button button-secondary" onClick={nextProblem}>{text.next} <ArrowRight className="directional-icon" size={18} aria-hidden="true" /></button>
          <button type="button" className="dose-reset-button" onClick={clearAnswer}><ArrowCounterClockwise size={18} aria-hidden="true" /> {text.reset}</button>
        </div>
      </form>

      <aside className="dose-safety-card">
        <Info size={28} weight="fill" aria-hidden="true" />
        <div><h2>{text.checklistTitle}</h2><p>{text.checklistBody}</p></div>
      </aside>
    </div>

    {result ? <section ref={resultRef} className={`dose-result-card ${result.isFullyCorrect ? "is-correct" : "needs-review"}`} tabIndex="-1" aria-live="polite">
      <div className="dose-result-heading">{result.isFullyCorrect ? <CheckCircle size={32} weight="fill" aria-hidden="true" /> : <XCircle size={32} weight="fill" aria-hidden="true" />}<h2>{result.isFullyCorrect ? text.resultCorrect : text.resultReview}</h2></div>
      <div className="dose-answer-review-grid">
        <AnswerReview label={text.requiredDoseMg} submitted={result.submitted.requiredDoseMg} expected={result.expected.requiredDoseMg} isCorrect={result.correct.requiredDoseMg} text={text} lang={lang} unit="mg/dose" />
        <AnswerReview label={text.calculatedVolumeMl} submitted={result.submitted.calculatedVolumeMl} expected={result.expected.calculatedVolumeMl} isCorrect={result.correct.calculatedVolumeMl} text={text} lang={lang} unit="mL/dose" />
      </div>
      <ol className="dose-working">
        <li><strong>{text.firstStep}</strong><code dir="ltr">{formatValue(values.weightKg, lang)} kg × {formatValue(values.orderedMgPerKg, lang)} mg/kg/dose = {formatValue(calculation.requiredDoseMg, lang)} mg/dose</code></li>
        <li><strong>{text.secondStep}</strong><code dir="ltr">{formatValue(calculation.requiredDoseMg, lang)} mg/dose × {formatValue(values.stockVolumeMl, lang)} mL ÷ {formatValue(values.stockStrengthMg, lang)} mg = {formatValue(calculation.calculatedVolumeMl, lang)} mL/dose</code></li>
      </ol>
      <p className="dose-display-rounding">{text.displayRounding}</p>
      <p className="dose-result-warning"><ShieldWarning size={20} weight="fill" aria-hidden="true" /> {text.resultBoundary}</p>
    </section> : null}

    <section className="dose-sources" aria-labelledby="dose-sources-title">
      <h2 id="dose-sources-title">{text.sourceTitle}</h2>
      <p>{text.sourceNote}</p>
      <ul>{SOURCE_LINKS.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source[lang] ?? source.en}</a></li>)}</ul>
    </section>
  </div>;
}
