import { useRef, useState } from "react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  Calculator,
  CheckCircle,
  Flask,
  Info,
  Pill,
  ShieldWarning,
  XCircle,
} from "@phosphor-icons/react";
import { dosePracticeExercises } from "../data/dose-practice.js";
import { getNamedDosePreset, namedDosePresets } from "../data/dose-presets.js";
import { calculateDosePractice, gradeDosePracticeAnswer } from "../lib/dose-calculator.js";
import "./medication-math.css";

const EMPTY_ANSWERS = Object.freeze({ requiredDoseMg: "", calculatedVolumeMl: "" });
const EMPTY_CALCULATOR = Object.freeze({
  medicineId: "custom",
  weightKg: "",
  orderedMgPerKg: "",
  stockStrengthMg: "",
  stockVolumeMl: "",
});

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
  Object.freeze({
    href: "https://sfda.gov.sa/sites/default/files/2025-10/Paracetamol%20SFDA%20Drug%20Safety%20Communication.pdf",
    en: "SFDA safety communication on paediatric paracetamol concentration errors",
    ar: "تنبيه الهيئة العامة للغذاء والدواء عن أخطاء تركيز الباراسيتامول للأطفال",
  }),
]);

const pageCopy = {
  en: {
    eyebrow: "Paediatric medication math",
    title: "Medication calculator and arithmetic practice",
    lead: "Use a named label-concentration preset or enter another label, and keep practising with authored fictional exercises.",
    boundaryTitle: "Calculation only — not a dose recommendation",
    boundaryBody: "The named medicine options fill concentration fields only. You must enter the authorised mg/kg/dose amount and verify the exact product label. This calculator does not choose a dose or check indication, age limits, allergies, contraindications, maximum daily dose, interval, route, organ function, interactions, formulation, measuring device or local policy. Do not rely on it as the only check during patient care or an emergency.",
    calculatorTab: "My calculator",
    practiceTab: "Fictional exercises",
    calculatorTitle: "Named-medicine liquid calculator",
    calculatorLead: "Select a listed medicine or enter another one. Presets populate the label concentration only; they never choose the prescribed amount.",
    calculatorPrivacy: "The values stay in this page until reset or navigation and are not saved to learning history. Do not enter names, record numbers or clinical notes.",
    medicineLabel: "Medicine and label preset",
    medicineHint: "Concentrations vary by product and country. The medicine name alone never confirms the concentration.",
    weightKg: "Weight (kg)",
    orderedMgPerKg: "Authorised amount for one dose (mg/kg/dose)",
    stockStrengthMg: "Strength printed on the label (mg)",
    stockVolumeMl: "Liquid volume paired with that strength (mL)",
    calculatorFieldHint: "Enter a positive decimal number with no unit or thousands separator.",
    presetConcentrationHint: "This preset is fixed. Choose Another medicine to enter a different product-label concentration.",
    calculatorUnitWarning: "Use an order written per dose. Do not enter an mg/kg/day value.",
    calculatorAcknowledge: "I independently verified that the order is mg/kg/dose and that the current product label exactly matches the concentration entered above.",
    calculate: "Calculate arithmetic result",
    calculatorReset: "Reset calculator",
    calculatorError: "Review the highlighted calculator values.",
    outsideLimits: "This value is outside the supported arithmetic range.",
    calculatorAcknowledgeError: "Confirm the order and current product label before calculating.",
    calculatorResultTitle: "Calculated result",
    calculatedDose: "Calculated amount",
    calculatedLiquid: "Calculated liquid volume",
    calculatorSecondStep: "Step 2 · Convert the current product label to mL/dose",
    calculatorResultBoundary: "This result confirms arithmetic only. Recheck it against the original order, the current product label, an approved drug reference and local policy before use.",
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
    sourceTitle: "Medication calculation and measurement safety sources",
    sourceNote: "These sources support unit and measurement safety principles; they do not validate a user-entered amount, product or fictional exercise value.",
  },
  ar: {
    eyebrow: "حسابات أدوية الأطفال",
    title: "حاسبة الدواء والتدريب الحسابي",
    lead: "استخدم خيار دواء وتركيز مسمى أو أدخل ملصقاً آخر، واستمر في التدريب على مسائل تعليمية مؤلفة.",
    boundaryTitle: "عملية حسابية فقط — وليست توصية بجرعة",
    boundaryBody: "تعبئ خيارات الأدوية المسماة حقول التركيز فقط. يجب أن تدخل أنت كمية mg/kg/dose المعتمدة وتتحقق من ملصق المنتج الفعلي. لا تختار الحاسبة الجرعة ولا تتحقق من الاستطباب أو العمر أو الحساسية أو الموانع أو الحد اليومي الأقصى أو الفاصل أو الطريق أو وظائف الأعضاء أو التداخلات أو المستحضر أو أداة القياس أو سياسة المنشأة. لا تعتمد عليها وحدها أثناء رعاية مريض أو في الطوارئ.",
    calculatorTab: "حاسبتي",
    practiceTab: "تمارين خيالية",
    calculatorTitle: "حاسبة الأدوية السائلة المسماة",
    calculatorLead: "اختر دواءً مدرجاً أو أدخل دواءً آخر. تعبئ الخيارات تركيز الملصق فقط، ولا تختار أبداً الكمية الموصوفة.",
    calculatorPrivacy: "تبقى القيم داخل هذه الصفحة حتى المسح أو الانتقال ولا تُحفظ في سجل التعلم. لا تدخل أسماء أو أرقام ملفات أو ملاحظات سريرية.",
    medicineLabel: "الدواء وخيار تركيز الملصق",
    medicineHint: "تختلف التركيزات باختلاف المنتج والدولة؛ اسم الدواء وحده لا يؤكد التركيز.",
    weightKg: "الوزن (kg)",
    orderedMgPerKg: "الكمية المعتمدة للجرعة الواحدة (mg/kg/dose)",
    stockStrengthMg: "التركيز المكتوب على الملصق (mg)",
    stockVolumeMl: "حجم السائل المقابل للتركيز (mL)",
    calculatorFieldHint: "أدخل رقماً عشرياً موجباً من دون وحدة أو فاصل آلاف.",
    presetConcentrationHint: "تركيز هذا الخيار ثابت. اختر دواء آخر لإدخال تركيز مختلف من ملصق المنتج.",
    calculatorUnitWarning: "استخدم أمراً مكتوباً لكل جرعة، ولا تدخل قيمة mg/kg/day.",
    calculatorAcknowledge: "تحققت بصورة مستقلة أن الأمر مكتوب بوحدة mg/kg/dose وأن ملصق المنتج الحالي يطابق تماماً التركيز المدخل أعلاه.",
    calculate: "احسب الناتج الحسابي",
    calculatorReset: "إعادة ضبط الحاسبة",
    calculatorError: "راجع قيم الحاسبة المحددة.",
    outsideLimits: "تقع هذه القيمة خارج النطاق الحسابي المدعوم.",
    calculatorAcknowledgeError: "أكد التحقق من الأمر وملصق المنتج الحالي قبل الحساب.",
    calculatorResultTitle: "الناتج المحسوب",
    calculatedDose: "الكمية المحسوبة",
    calculatedLiquid: "حجم السائل المحسوب",
    calculatorSecondStep: "الخطوة 2 · التحويل من ملصق المنتج الحالي إلى mL/dose",
    calculatorResultBoundary: "يؤكد هذا الناتج العملية الحسابية فقط. أعد مطابقته مع الأمر الأصلي وملصق المنتج الحالي ومرجع دوائي معتمد وسياسة المنشأة قبل الاستخدام.",
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
    sourceTitle: "مصادر سلامة حساب الدواء وقياسه",
    sourceNote: "تدعم هذه المصادر مبادئ سلامة الوحدات والقياس، ولا تعتمد كمية أدخلها المستخدم أو منتجاً أو قيمة تمرين خيالي.",
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

function DecimalField({ idPrefix = "dose-practice", name, value, label, hint, error, onChange, lang, readOnly = false }) {
  const inputId = `${idPrefix}-${name}`;
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
      readOnly={readOnly}
      aria-invalid={Boolean(error)}
      aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
      dir="ltr"
      lang={lang === "ar" ? "ar" : "en"}
    />
    <small id={hintId}>{hint}</small>
    {error ? <span id={errorId} className="dose-field-error">{error}</span> : null}
  </div>;
}

function DoseSafetyAside({ text }) {
  return <aside className="dose-safety-card">
    <Info size={28} weight="fill" aria-hidden="true" />
    <div><h2>{text.checklistTitle}</h2><p>{text.checklistBody}</p></div>
  </aside>;
}

function NamedMedicationCalculator({ lang, text }) {
  const [fields, setFields] = useState(EMPTY_CALCULATOR);
  const [acknowledged, setAcknowledged] = useState(false);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const formRef = useRef(null);
  const resultRef = useRef(null);

  function clearResult() {
    setAcknowledged(false);
    setErrors({});
    setResult(null);
  }

  function handleMedicineChange(event) {
    const preset = getNamedDosePreset(event.target.value);
    setFields((current) => ({
      ...current,
      medicineId: preset.id,
      stockStrengthMg: preset.stockStrengthMg === null ? "" : String(preset.stockStrengthMg),
      stockVolumeMl: preset.stockVolumeMl === null ? "" : String(preset.stockVolumeMl),
    }));
    clearResult();
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;
    if (fields.medicineId !== "custom" && (name === "stockStrengthMg" || name === "stockVolumeMl")) return;
    setFields((current) => ({ ...current, [name]: value }));
    clearResult();
  }

  function handleAcknowledgementChange(event) {
    const checked = event.target.checked;
    setAcknowledged(checked);
    setErrors((current) => ({ ...current, acknowledgement: undefined }));
    if (!checked) setResult(null);
  }

  function resetCalculator() {
    setFields(EMPTY_CALCULATOR);
    clearResult();
  }

  function fieldError(name) {
    const code = errors[name];
    if (!code) return "";
    if (code === "required") return text.required;
    if (code === "outsideLimits") return text.outsideLimits;
    return text.invalid;
  }

  function submit(event) {
    event.preventDefault();
    if (!acknowledged) {
      setErrors({ acknowledgement: "required" });
      setResult(null);
      window.requestAnimationFrame(() => formRef.current?.querySelector('input[type="checkbox"]')?.focus());
      return;
    }

    const calculation = calculateDosePractice(fields);
    if (!calculation.ok) {
      setErrors(calculation.errors);
      setResult(null);
      window.requestAnimationFrame(() => formRef.current?.querySelector('input[aria-invalid="true"]')?.focus());
      return;
    }

    setErrors({});
    setResult(calculation);
    window.requestAnimationFrame(() => resultRef.current?.focus({ preventScroll: true }));
  }

  const hasErrors = Object.keys(errors).some((key) => errors[key]);
  const selectedPreset = getNamedDosePreset(fields.medicineId);
  const isNamedPreset = fields.medicineId !== "custom";

  return <div className="dose-tools-stack">
    <form ref={formRef} className="dose-calculator-card named-dose-calculator" onSubmit={submit} noValidate>
      <div className="dose-card-heading">
        <span className="dose-card-icon" aria-hidden="true"><Pill size={25} weight="duotone" /></span>
        <div><h2>{text.calculatorTitle}</h2><p>{text.calculatorLead}</p></div>
      </div>

      <p className="dose-page-memory-note">{text.calculatorPrivacy}</p>

      {hasErrors ? <div className="dose-error-summary" role="alert">
        <ShieldWarning size={21} weight="fill" aria-hidden="true" />
        <p>{errors.acknowledgement ? text.calculatorAcknowledgeError : text.calculatorError}</p>
      </div> : null}

      <div className="dose-field dose-medicine-field">
        <label htmlFor="named-dose-medicine">{text.medicineLabel}</label>
        <select id="named-dose-medicine" value={fields.medicineId} onChange={handleMedicineChange}>
          {namedDosePresets.map((preset) => <option key={preset.id} value={preset.id}>{localize(preset.label, lang)}</option>)}
        </select>
        <small>{text.medicineHint}</small>
      </div>

      <div className="dose-field-grid named-dose-grid">
        <DecimalField idPrefix="named-dose" name="weightKg" value={fields.weightKg} label={text.weightKg} hint={text.calculatorFieldHint} error={fieldError("weightKg")} onChange={handleFieldChange} lang={lang} />
        <DecimalField idPrefix="named-dose" name="orderedMgPerKg" value={fields.orderedMgPerKg} label={text.orderedMgPerKg} hint={text.calculatorFieldHint} error={fieldError("orderedMgPerKg")} onChange={handleFieldChange} lang={lang} />
        <DecimalField idPrefix="named-dose" name="stockStrengthMg" value={fields.stockStrengthMg} label={text.stockStrengthMg} hint={isNamedPreset ? text.presetConcentrationHint : text.calculatorFieldHint} error={fieldError("stockStrengthMg")} onChange={handleFieldChange} lang={lang} readOnly={isNamedPreset} />
        <DecimalField idPrefix="named-dose" name="stockVolumeMl" value={fields.stockVolumeMl} label={text.stockVolumeMl} hint={isNamedPreset ? text.presetConcentrationHint : text.calculatorFieldHint} error={fieldError("stockVolumeMl")} onChange={handleFieldChange} lang={lang} readOnly={isNamedPreset} />
      </div>

      <p className="dose-unit-warning"><ShieldWarning size={17} weight="fill" aria-hidden="true" /> {text.calculatorUnitWarning}</p>

      <label className={`dose-acknowledgement ${errors.acknowledgement ? "has-error" : ""}`}>
        <input type="checkbox" checked={acknowledged} onChange={handleAcknowledgementChange} />
        <span>{text.calculatorAcknowledge}</span>
      </label>

      <div className="dose-form-actions">
        <button type="submit" className="button button-primary"><Calculator size={19} aria-hidden="true" /> {text.calculate}</button>
        <button type="button" className="dose-reset-button" onClick={resetCalculator}><ArrowCounterClockwise size={18} aria-hidden="true" /> {text.calculatorReset}</button>
      </div>
    </form>

    {result ? <section ref={resultRef} className="dose-result-card named-dose-result is-correct" tabIndex="-1" aria-live="polite">
      <div className="dose-result-heading"><CheckCircle size={32} weight="fill" aria-hidden="true" /><div><p className="dose-result-medicine">{localize(selectedPreset.label, lang)}</p><h2>{text.calculatorResultTitle}</h2></div></div>
      <dl className="dose-calculated-values">
        <div><dt>{text.calculatedDose}</dt><dd dir="ltr">{formatValue(result.requiredDoseMg, lang)} mg/dose</dd></div>
        <div><dt>{text.calculatedLiquid}</dt><dd dir="ltr">{formatValue(result.calculatedVolumeMl, lang)} mL/dose</dd></div>
      </dl>
      <ol className="dose-working">
        <li><strong>{text.firstStep}</strong><code dir="ltr">{formatValue(result.values.weightKg, lang)} kg × {formatValue(result.values.orderedMgPerKg, lang)} mg/kg/dose = {formatValue(result.requiredDoseMg, lang)} mg/dose</code></li>
        <li><strong>{text.calculatorSecondStep}</strong><code dir="ltr">{formatValue(result.requiredDoseMg, lang)} mg/dose × {formatValue(result.values.stockVolumeMl, lang)} mL ÷ {formatValue(result.values.stockStrengthMg, lang)} mg = {formatValue(result.calculatedVolumeMl, lang)} mL/dose</code></li>
      </ol>
      <p className="dose-result-warning"><ShieldWarning size={20} weight="fill" aria-hidden="true" /> {text.calculatorResultBoundary}</p>
    </section> : null}
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
  const [activeMode, setActiveMode] = useState("calculator");
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

  function handleModeKeyDown(event) {
    const forwardKey = lang === "ar" ? "ArrowLeft" : "ArrowRight";
    const backwardKey = lang === "ar" ? "ArrowRight" : "ArrowLeft";
    let nextMode = null;
    if (event.key === forwardKey || event.key === "End") nextMode = "practice";
    if (event.key === backwardKey || event.key === "Home") nextMode = "calculator";
    if (!nextMode) return;
    event.preventDefault();
    setActiveMode(nextMode);
    window.requestAnimationFrame(() => document.getElementById(`dose-${nextMode}-tab`)?.focus());
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

    <div className="dose-mode-tabs" role="tablist" aria-label={text.title}>
      <button id="dose-calculator-tab" type="button" role="tab" aria-selected={activeMode === "calculator"} aria-controls="dose-calculator-panel" tabIndex={activeMode === "calculator" ? 0 : -1} onClick={() => setActiveMode("calculator")} onKeyDown={handleModeKeyDown}><Pill size={19} aria-hidden="true" /> {text.calculatorTab}</button>
      <button id="dose-practice-tab" type="button" role="tab" aria-selected={activeMode === "practice"} aria-controls="dose-practice-panel" tabIndex={activeMode === "practice" ? 0 : -1} onClick={() => setActiveMode("practice")} onKeyDown={handleModeKeyDown}><Flask size={19} aria-hidden="true" /> {text.practiceTab}</button>
    </div>

    {activeMode === "calculator" ? <section id="dose-calculator-panel" role="tabpanel" aria-labelledby="dose-calculator-tab">
      <div className="dose-practice-layout">
        <NamedMedicationCalculator lang={lang} text={text} />
        <DoseSafetyAside text={text} />
      </div>
    </section> : <section id="dose-practice-panel" role="tabpanel" aria-labelledby="dose-practice-tab">
      <div className="dose-practice-layout">
        <div className="dose-tools-stack">
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
                <DecimalField name="requiredDoseMg" value={answers.requiredDoseMg} label={text.requiredDoseMg} hint={text.answerHint} error={fieldError("requiredDoseMg")} onChange={handleInput} lang={lang} />
                <DecimalField name="calculatedVolumeMl" value={answers.calculatedVolumeMl} label={text.calculatedVolumeMl} hint={text.answerHint} error={fieldError("calculatedVolumeMl")} onChange={handleInput} lang={lang} />
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
        </div>
        <DoseSafetyAside text={text} />
      </div>
    </section>}

    <section className="dose-sources" aria-labelledby="dose-sources-title">
      <h2 id="dose-sources-title">{text.sourceTitle}</h2>
      <p>{text.sourceNote}</p>
      <ul>{SOURCE_LINKS.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source[lang] ?? source.en}</a></li>)}</ul>
    </section>
  </div>;
}
