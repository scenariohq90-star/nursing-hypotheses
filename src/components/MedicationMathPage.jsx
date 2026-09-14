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
import {
  getInfusionConcentrationPreset,
  INFUSION_CONCENTRATION_PRESETS,
  INFUSION_PRESET_SOURCE,
} from "../data/infusion-presets.js";
import { calculateDosePractice, gradeDosePracticeAnswer } from "../lib/dose-calculator.js";
import { calculatePresetInfusionRate } from "../lib/infusion-preset-calculator.js";
import {
  calculateInfusionRate,
  INFUSION_RATE_UNITS,
  infusionRateUnitDimension,
  isWeightBasedInfusionRateUnit,
} from "../lib/infusion-calculator.js";
import "./medication-math.css";

const EMPTY_ANSWERS = Object.freeze({ requiredDoseMg: "", calculatedVolumeMl: "" });
const EMPTY_CALCULATOR = Object.freeze({
  medicineId: "custom",
  weightKg: "",
  orderedMgPerKg: "",
  stockStrengthMg: "",
  stockVolumeMl: "",
});
const EMPTY_INFUSION = Object.freeze({
  medicineId: "custom",
  rateValue: "",
  rateUnit: "",
  weightKg: "",
  drugAmount: "",
  drugAmountUnit: "",
  finalVolumeMl: "",
});
const DOSE_MODES = Object.freeze(["calculator", "infusion", "practice"]);
const NAMED_CALCULATOR_FIELD_KEYS = Object.freeze([
  "weightKg",
  "orderedMgPerKg",
  "stockStrengthMg",
  "stockVolumeMl",
]);
const INFUSION_FIELD_LABEL_KEYS = Object.freeze({
  rateValue: "prescribedRate",
  rateUnit: "rateUnit",
  weightKg: "infusionWeight",
  drugAmount: "drugAmount",
  drugAmountUnit: "amountUnit",
  finalVolumeMl: "finalVolume",
});

const INFUSION_RATE_UNIT_LABELS = Object.freeze({
  "mcg/min": Object.freeze({ en: "mcg/min — micrograms/minute", ar: "mcg/min — ميكروغرام/دقيقة" }),
  "mcg/kg/min": Object.freeze({ en: "mcg/kg/min — micrograms/kg/minute", ar: "mcg/kg/min — ميكروغرام/كجم/دقيقة" }),
  "mcg/hr": Object.freeze({ en: "mcg/hr — micrograms/hour", ar: "mcg/hr — ميكروغرام/ساعة" }),
  "mcg/kg/hr": Object.freeze({ en: "mcg/kg/hr — micrograms/kg/hour", ar: "mcg/kg/hr — ميكروغرام/كجم/ساعة" }),
  "mg/min": Object.freeze({ en: "mg/min — milligrams/minute", ar: "mg/min — ملغ/دقيقة" }),
  "mg/kg/min": Object.freeze({ en: "mg/kg/min — milligrams/kg/minute", ar: "mg/kg/min — ملغ/كجم/دقيقة" }),
  "mg/hr": Object.freeze({ en: "mg/hr — milligrams/hour", ar: "mg/hr — ملغ/ساعة" }),
  "mg/kg/hr": Object.freeze({ en: "mg/kg/hr — milligrams/kg/hour", ar: "mg/kg/hr — ملغ/كجم/ساعة" }),
  "unit/min": Object.freeze({ en: "units/min — units/minute", ar: "units/min — وحدة/دقيقة" }),
  "unit/kg/min": Object.freeze({ en: "units/kg/min — units/kg/minute", ar: "units/kg/min — وحدة/كجم/دقيقة" }),
  "unit/hr": Object.freeze({ en: "units/hr — units/hour", ar: "units/hr — وحدة/ساعة" }),
  "unit/kg/hr": Object.freeze({ en: "units/kg/hr — units/kg/hour", ar: "units/kg/hr — وحدة/كجم/ساعة" }),
});

const INFUSION_PRESET_GROUPS = Object.freeze(
  INFUSION_CONCENTRATION_PRESETS.reduce((groups, preset) => {
    const existingGroup = groups.find((group) => group.category.en === preset.category.en);
    if (existingGroup) existingGroup.presets.push(preset);
    else groups.push({ category: preset.category, presets: [preset] });
    return groups;
  }, []).map((group) => Object.freeze({
    category: group.category,
    presets: Object.freeze(group.presets),
  })),
);

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
  Object.freeze({
    href: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3f2c9570-a544-1982-e063-6294a90a3067",
    en: "DailyMed nitroglycerin label and infusion-rate equations",
    ar: "ملصق DailyMed للنايتروغليسرين ومعادلات معدل التسريب",
  }),
  Object.freeze({
    href: "https://www.ismp.org/system/files/resources/2024-04/ISMP_ErrorProneAbbreviation_List.pdf",
    en: "ISMP list of error-prone abbreviations and medicine names",
    ar: "قائمة ISMP للاختصارات وأسماء الأدوية المعرّضة للخطأ",
  }),
]);

const pageCopy = {
  en: {
    eyebrow: "Medication calculations",
    title: "Medication calculators and arithmetic practice",
    lead: "Calculate a liquid dose or an IV infusion rate from values you enter, and keep practising with authored fictional exercises.",
    boundaryTitle: "Calculation only — not a dose recommendation",
    boundaryBody: "The tools perform arithmetic only from values and units you enter. Named options never choose a dose or confirm a prepared concentration. The tools do not validate an order, indication, age limits, allergies, contraindications, maximum dose, interval, route, organ function, interactions, device, tubing or local policy. Do not rely on this website during patient care or an emergency.",
    calculatorTab: "Single liquid dose (mg/kg/dose)",
    infusionTab: "IV infusion rate",
    practiceTab: "Fictional exercises",
    calculatorTitle: "Single-dose liquid calculator",
    calculatorLead: "Select a listed medicine or enter another one. Presets populate the label concentration only; they never choose the prescribed amount.",
    calculatorPrivacy: "The values stay in this page until reset or navigation and are not saved to learning history. Do not enter names, record numbers or clinical notes.",
    singleDoseOnlyTitle: "This calculator accepts mg/kg/dose only",
    singleDoseOnlyBody: "If the source order is written as mcg/min, mcg/kg/min or mg/hr—including a nitroglycerin infusion—use the separate IV infusion calculator.",
    openInfusionCalculator: "Open IV infusion calculator",
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
    calculatorMissingFields: "Complete these required fields:",
    calculatorInvalidFields: "Correct these fields:",
    calculatorCalculationOutside: "The calculated result exceeds this single-dose calculator's technical limit of 1,000 mL/dose. Check every value and unit. For a timed order such as mcg/min or mcg/kg/min, use the separate IV infusion tab.",
    outsideLimits: "This value is outside the supported arithmetic range.",
    calculatorAcknowledgeError: "Confirm the order and current product label before calculating.",
    calculatorResultTitle: "Calculated result",
    calculatedDose: "Calculated amount",
    calculatedLiquid: "Calculated liquid volume",
    calculatorSecondStep: "Step 2 · Convert the current product label to mL/dose",
    calculatorResultBoundary: "This result confirms arithmetic only. Recheck it against the original order, the current product label, an approved drug reference and local policy before use.",
    infusionTitle: "IV infusion-rate calculator",
    infusionLead: "Choose one of 23 concentration shortcuts or enter the prepared solution manually, then convert a rate already written in the source order into mL/hr. A shortcut never selects the prescribed rate.",
    infusionPrivacy: "These numeric values remain only in page memory until reset or navigation and are not added to learning history. Do not enter patient identifiers or clinical notes.",
    infusionMedicineLabel: "Medication concentration shortcut",
    otherInfusionOption: "Other IV infusion — enter the prepared solution manually",
    infusionMedicineHint: "A named shortcut fills only its reference concentration. The ordered rate, rate unit and weight always remain for you to enter.",
    selectedConcentration: "Selected concentration",
    reviewedConcentration: "Reference value under review",
    shortcutReady: "Concentration shortcut",
    shortcutLocked: "Requires review",
    shortcutLockedTitle: "This shortcut is listed but not enabled",
    shortcutLockedBody: "The current source does not confirm this value as an explicit final prepared concentration. Choose the manual option and enter the actual verified preparation instead.",
    useManualPreparation: "Use manual preparation entry",
    lasaBadge: "LASA name",
    independentCheckBadge: "Independent check",
    shortcutSource: "Concentration source",
    shortcutPage: "p.",
    infusionPresetConcentrationHint: "Only the concentration is supplied by this shortcut. It does not supply a dose, target, titration or pump setting.",
    infusionValuesCleared: "Previous order values were cleared because the concentration shortcut changed.",
    manualPreparationReady: "Manual preparation entry is ready. Focus moved to the total drug amount.",
    sourceOrderLegend: "Source order",
    prescribedRate: "Rate written in the source order",
    rateUnit: "Order rate unit",
    selectRateUnit: "Select the exact order unit",
    rateUnitRequired: "Select the unit exactly as written in the source order.",
    rateUnitHint: "Choose the unit exactly as written. Available units are filtered to match the selected concentration dimension.",
    infusionWeight: "Weight used by the source order (kg)",
    weightRequiredHint: "Required only when the source order is weight based (/kg/).",
    drugAmount: "Total drug amount in the prepared solution",
    amountUnit: "Drug amount unit",
    selectAmountUnit: "Select the exact amount unit",
    amountUnitRequired: "Select the unit shown for the total prepared drug amount.",
    amountUnitHint: "Choose mg, mcg or units exactly as shown on the preparation label.",
    preparedSolutionLegend: "Prepared solution",
    finalVolume: "Final total prepared solution volume (mL)",
    finalVolumeHint: "Enter the final total volume, not the volume of diluent added.",
    infusionAcknowledge: "I independently verified the source-order rate and unit, total drug amount, and final prepared volume. I understand this tool only converts those values.",
    infusionPresetAcknowledge: "I independently verified the source-order rate and unit and confirmed that the current prepared solution exactly matches the selected concentration. I understand this tool only converts those values.",
    infusionAcknowledgeError: "Confirm the independently checked order unit and prepared-solution values before calculating.",
    infusionError: "Review the highlighted infusion values.",
    infusionCalculationOutside: "The calculated infusion rate is outside this tool's technical display range. Recheck the units and concentration values.",
    infusionIncompatibleUnits: "The ordered-rate unit does not match the selected concentration dimension. Use mass units with mg/mL or mcg/mL, and activity units with unit/mL.",
    infusionCalculate: "Calculate mL/hr",
    infusionReset: "Reset infusion calculator",
    infusionResultTitle: "Calculated infusion rate",
    concentrationResult: "Prepared concentration",
    normalizedDoseResult: "Rate after unit conversion",
    pumpRateResult: "Calculated pump rate",
    weightBasedOrderResult: "Entered weight-based rate",
    amountConversionStep: "Step 1 · Normalize the total drug amount",
    concentrationStep: "Step 2 · Calculate the prepared concentration",
    presetConcentrationStep: "Step 1 · Use the selected concentration shortcut",
    doseNormalizationStep: "Normalize the source-order rate to an hourly amount",
    pumpRateStep: "Final step · Convert the hourly amount to mL/hr",
    infusionDisplayRounding: "Calculated values are displayed with up to eight significant digits. No intermediate value is rounded.",
    infusionResultBoundary: "Arithmetic only. This result does not validate the order, medicine, concentration, container, tubing or safe administration. Independently check the original order, actual preparation, infusion-pump library, current product information and local policy.",
    nitroglycerinDeviceNote: "For Nitroglycerin (Glyceryl trinitrate), the product information warns that the container and administration set can affect delivered drug. Follow the current product label and local policy.",
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
    checklistBody: "Do not use this website to program an infusion pump. Use the authorised medication system, original order, current product or preparation label, approved reference, applicable pump library, facility policy and required independent check.",
    sourceTitle: "Medication calculation and measurement safety sources",
    sourceNote: "These sources support unit, naming, infusion-equation and measurement-safety principles; they do not validate a user-entered order, amount, product or exercise value.",
  },
  ar: {
    eyebrow: "حسابات الدواء",
    title: "حاسبات الدواء والتدريب الحسابي",
    lead: "احسب جرعة سائلة أو معدل تسريب وريدي من القيم التي تدخلها، واستمر في التدريب على مسائل تعليمية مؤلفة.",
    boundaryTitle: "عملية حسابية فقط — وليست توصية بجرعة",
    boundaryBody: "تنفذ الأدوات عملية حسابية فقط من القيم والوحدات التي تدخلها. لا تختار الخيارات المسماة جرعة ولا تؤكد تركيز التحضير. ولا تعتمد الأدوات الأمر أو الاستطباب أو العمر أو الحساسية أو الموانع أو الحد الأقصى أو الفاصل أو الطريق أو وظائف الأعضاء أو التداخلات أو الجهاز أو الأنابيب أو سياسة المنشأة. لا تعتمد على الموقع أثناء رعاية مريض أو في الطوارئ.",
    calculatorTab: "جرعة سائلة مفردة (mg/kg/dose)",
    infusionTab: "معدل التسريب الوريدي",
    practiceTab: "تمارين خيالية",
    calculatorTitle: "حاسبة الجرعة السائلة المفردة",
    calculatorLead: "اختر دواءً مدرجاً أو أدخل دواءً آخر. تعبئ الخيارات تركيز الملصق فقط، ولا تختار أبداً الكمية الموصوفة.",
    calculatorPrivacy: "تبقى القيم داخل هذه الصفحة حتى المسح أو الانتقال ولا تُحفظ في سجل التعلم. لا تدخل أسماء أو أرقام ملفات أو ملاحظات سريرية.",
    singleDoseOnlyTitle: "هذه الحاسبة تقبل mg/kg/dose فقط",
    singleDoseOnlyBody: "إذا كان الأمر الأصلي مكتوباً بوحدة mcg/min أو mcg/kg/min أو mg/hr—ومن ذلك تسريب النايتروغليسرين—فاستخدم حاسبة التسريب الوريدي المنفصلة.",
    openInfusionCalculator: "فتح حاسبة التسريب الوريدي",
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
    calculatorMissingFields: "أكمل الحقول المطلوبة التالية:",
    calculatorInvalidFields: "صحح الحقول التالية:",
    calculatorCalculationOutside: "تجاوز الناتج الحد التقني لهذه الحاسبة المخصصة للجرعة الواحدة، وهو 1000 mL/dose. راجع كل قيمة ووحدة. إذا كان الأمر زمنياً مثل mcg/min أو mcg/kg/min فاستخدم تبويب التسريب الوريدي المنفصل.",
    outsideLimits: "تقع هذه القيمة خارج النطاق الحسابي المدعوم.",
    calculatorAcknowledgeError: "أكد التحقق من الأمر وملصق المنتج الحالي قبل الحساب.",
    calculatorResultTitle: "الناتج المحسوب",
    calculatedDose: "الكمية المحسوبة",
    calculatedLiquid: "حجم السائل المحسوب",
    calculatorSecondStep: "الخطوة 2 · التحويل من ملصق المنتج الحالي إلى mL/dose",
    calculatorResultBoundary: "يؤكد هذا الناتج العملية الحسابية فقط. أعد مطابقته مع الأمر الأصلي وملصق المنتج الحالي ومرجع دوائي معتمد وسياسة المنشأة قبل الاستخدام.",
    infusionTitle: "حاسبة معدل التسريب الوريدي",
    infusionLead: "اختر واحداً من 23 اختصار تركيز أو أدخل المحلول المحضّر يدوياً، ثم حوّل المعدل المكتوب في الأمر الأصلي إلى mL/hr. لا يختار الاختصار معدل الأمر أبداً.",
    infusionPrivacy: "تبقى هذه القيم الرقمية في ذاكرة الصفحة فقط حتى المسح أو الانتقال، ولا تضاف إلى سجل التعلم. لا تدخل معرّفات مريض أو ملاحظات سريرية.",
    infusionMedicineLabel: "اختصار تركيز الدواء",
    otherInfusionOption: "تسريب وريدي آخر — أدخل المحلول المحضّر يدوياً",
    infusionMedicineHint: "يعبئ الاختصار المسمى تركيزه المرجعي فقط، بينما يبقى معدل الأمر ووحدته والوزن لإدخالها يدوياً.",
    selectedConcentration: "التركيز المحدد",
    reviewedConcentration: "قيمة مرجعية قيد المراجعة",
    shortcutReady: "اختصار تركيز",
    shortcutLocked: "يحتاج مراجعة",
    shortcutLockedTitle: "الاختصار موجود لكنه غير مفعّل",
    shortcutLockedBody: "لا يثبت المصدر الحالي هذه القيمة كتركيز نهائي محضّر ومذكور صراحة. اختر الإدخال اليدوي وأدخل بيانات التحضير الفعلي المتحقق منه.",
    useManualPreparation: "استخدام إدخال التحضير اليدوي",
    lasaBadge: "اسم LASA متشابه",
    independentCheckBadge: "تحقق مستقل",
    shortcutSource: "مصدر التركيز",
    shortcutPage: "ص.",
    infusionPresetConcentrationHint: "يوفر الاختصار التركيز فقط، ولا يوفر جرعة أو هدفاً أو معايرة أو إعداد مضخة.",
    infusionValuesCleared: "مُسحت قيم الأمر السابقة لأن اختصار التركيز تغيّر.",
    manualPreparationReady: "أصبح الإدخال اليدوي جاهزاً، وانتقل التركيز إلى حقل إجمالي كمية الدواء.",
    sourceOrderLegend: "الأمر الأصلي",
    prescribedRate: "المعدل المكتوب في الأمر الأصلي",
    rateUnit: "وحدة معدل الأمر",
    selectRateUnit: "اختر وحدة الأمر الدقيقة",
    rateUnitRequired: "اختر الوحدة كما كُتبت تماماً في الأمر الأصلي.",
    rateUnitHint: "اختر الوحدة كما كُتبت تماماً؛ تُرشح الوحدات لتطابق بُعد التركيز المحدد.",
    infusionWeight: "الوزن المستخدم في الأمر الأصلي (kg)",
    weightRequiredHint: "مطلوب فقط عندما يكون معدل الأمر معتمداً على الوزن (/kg/).",
    drugAmount: "إجمالي كمية الدواء في المحلول المحضّر",
    amountUnit: "وحدة كمية الدواء",
    selectAmountUnit: "اختر وحدة الكمية الدقيقة",
    amountUnitRequired: "اختر الوحدة المكتوبة لإجمالي كمية الدواء المحضّر.",
    amountUnitHint: "اختر mg أو mcg أو units تماماً كما تظهر على ملصق التحضير.",
    preparedSolutionLegend: "المحلول المحضّر",
    finalVolume: "الحجم النهائي الكلي للمحلول المحضّر (mL)",
    finalVolumeHint: "أدخل الحجم النهائي الكلي، وليس حجم المذيب المضاف.",
    infusionAcknowledge: "تحققت بصورة مستقلة من معدل الأمر الأصلي ووحدته، وإجمالي كمية الدواء، والحجم النهائي المحضّر. وأفهم أن الأداة تحوّل هذه القيم فقط.",
    infusionPresetAcknowledge: "تحققت بصورة مستقلة من معدل الأمر الأصلي ووحدته، وتأكدت أن المحلول المحضّر الحالي يطابق تماماً التركيز المحدد، وأفهم أن الأداة تحوّل هذه القيم حسابياً فقط.",
    infusionAcknowledgeError: "أكد التحقق المستقل من وحدة الأمر وقيم المحلول المحضّر قبل الحساب.",
    infusionError: "راجع قيم التسريب المحددة.",
    infusionCalculationOutside: "يقع معدل التسريب المحسوب خارج نطاق العرض التقني للأداة. راجع الوحدات وقيم التركيز.",
    infusionIncompatibleUnits: "لا تتطابق وحدة معدل الأمر مع بُعد التركيز المحدد. استخدم وحدات الكتلة مع mg/mL أو mcg/mL، ووحدات النشاط مع unit/mL.",
    infusionCalculate: "احسب mL/hr",
    infusionReset: "إعادة ضبط حاسبة التسريب",
    infusionResultTitle: "معدل التسريب المحسوب",
    concentrationResult: "تركيز المحلول المحضّر",
    normalizedDoseResult: "المعدل بعد تحويل الوحدة",
    pumpRateResult: "معدل المضخة المحسوب",
    weightBasedOrderResult: "المعدل الوزني المدخل",
    amountConversionStep: "الخطوة 1 · توحيد إجمالي كمية الدواء",
    concentrationStep: "الخطوة 2 · حساب تركيز المحلول المحضّر",
    presetConcentrationStep: "الخطوة 1 · استخدام اختصار التركيز المحدد",
    doseNormalizationStep: "توحيد معدل الأمر الأصلي إلى كمية في الساعة",
    pumpRateStep: "الخطوة النهائية · تحويل الكمية في الساعة إلى mL/hr",
    infusionDisplayRounding: "تعرض القيم المحسوبة حتى ثمانية أرقام معنوية، ولا تُقرّب أي قيمة وسيطة.",
    infusionResultBoundary: "عملية حسابية فقط. لا يعتمد الناتج الأمر أو الدواء أو التركيز أو العبوة أو الأنابيب أو سلامة الإعطاء. طابق بصورة مستقلة الأمر الأصلي والتحضير الفعلي ومكتبة مضخة التسريب ومعلومات المنتج الحالية وسياسة المنشأة.",
    nitroglycerinDeviceNote: "بالنسبة إلى نايتروغليسرين (Nitroglycerin / Glyceryl trinitrate)، تحذّر معلومات المنتج من أن العبوة ومجموعة الإعطاء قد تؤثران في الكمية الواصلة. اتبع ملصق المنتج الحالي وسياسة المنشأة.",
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
    checklistBody: "لا تستخدم الموقع لبرمجة مضخة التسريب. استخدم نظام الدواء المعتمد والأمر الأصلي وملصق المنتج أو المحلول الحالي والمرجع المعتمد ومكتبة المضخة المطبقة وسياسة المنشأة والمراجعة المستقلة المطلوبة.",
    sourceTitle: "مصادر سلامة حساب الدواء وقياسه",
    sourceNote: "تدعم هذه المصادر مبادئ سلامة الوحدات والتسمية ومعادلات التسريب والقياس، ولا تعتمد أمراً أو كمية أو منتجاً أدخله المستخدم أو قيمة تمرين.",
  },
};

function localize(value, lang) {
  return value?.[lang] ?? value?.en ?? value?.ar ?? "";
}

function normalizeDoseMode(value) {
  return DOSE_MODES.includes(value) ? value : "infusion";
}

function formatValue(value, lang, maximumFractionDigits = 4) {
  return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", {
    maximumFractionDigits,
    useGrouping: false,
  }).format(value);
}

function formatCalculatedValue(value, lang) {
  return new Intl.NumberFormat(lang === "ar" ? "ar-SA" : "en-US", {
    maximumSignificantDigits: 8,
    useGrouping: false,
  }).format(value);
}

function displayInfusionAmountUnit(unit) {
  return unit === "unit" ? "units" : unit;
}

function displayInfusionConcentrationUnit(unit) {
  return unit === "unit/mL" ? "units/mL" : unit;
}

function displayInfusionRateUnit(unit) {
  return unit?.startsWith("unit/") ? `units/${unit.slice(5)}` : unit;
}

function infusionPresetOptionLabel(preset, lang) {
  return `${localize(preset.name, lang)} — ${formatCalculatedValue(preset.concentrationValue, lang)} ${displayInfusionConcentrationUnit(preset.concentrationUnit)}`;
}

function buildPresetConcentrationEquation(preset, result, lang) {
  const selected = `${formatCalculatedValue(preset.concentrationValue, lang)} ${displayInfusionConcentrationUnit(preset.concentrationUnit)}`;
  if (preset.concentrationAmountUnit !== "mg") return `${selected} = ${formatCalculatedValue(result.concentrationPerMl, lang)} ${displayInfusionAmountUnit(result.normalizedUnit)}/mL`;
  return `${selected} × 1,000 mcg/mg = ${formatCalculatedValue(result.concentrationPerMl, lang)} mcg/mL`;
}

function buildRateNormalizationEquation(result, lang) {
  const { rateUnit, rateValue, weightKg } = result.values;
  const parts = [`${formatCalculatedValue(rateValue, lang)} ${displayInfusionRateUnit(rateUnit)}`];
  if (rateUnit.includes("/kg/")) parts.push(`× ${formatCalculatedValue(weightKg, lang)} kg`);
  if (rateUnit.startsWith("mg/")) parts.push("× 1,000 mcg/mg");
  if (rateUnit.endsWith("/min")) parts.push("× 60 min/hr");
  parts.push(`= ${formatCalculatedValue(result.ratePerHour, lang)} ${displayInfusionAmountUnit(result.normalizedUnit)}/hr`);
  return parts.join(" ");
}

function namedCalculatorErrorSummary(errors, text, lang) {
  const affectedFields = NAMED_CALCULATOR_FIELD_KEYS.filter((key) => errors[key]);
  if (!affectedFields.length) return text.calculatorError;
  const onlyMissing = affectedFields.every((key) => errors[key] === "required");
  const prefix = onlyMissing ? text.calculatorMissingFields : text.calculatorInvalidFields;
  const labels = affectedFields.map((key) => text[key]).join(lang === "ar" ? "، " : ", ");
  return `${prefix} ${labels}`;
}

function infusionCalculatorErrorSummary(errors, text, lang) {
  const affectedFields = Object.entries(INFUSION_FIELD_LABEL_KEYS).filter(([key]) => errors[key]);
  if (!affectedFields.length) return text.infusionError;
  const onlyMissing = affectedFields.every(([key]) => errors[key] === "required");
  const prefix = onlyMissing ? text.calculatorMissingFields : text.calculatorInvalidFields;
  const labels = affectedFields.map(([, labelKey]) => text[labelKey]).join(lang === "ar" ? "، " : ", ");
  return `${prefix} ${labels}`;
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
      required
      aria-required="true"
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

function NamedMedicationCalculator({ lang, text, onOpenInfusion }) {
  const [fields, setFields] = useState(EMPTY_CALCULATOR);
  const [acknowledged, setAcknowledged] = useState(false);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const formRef = useRef(null);
  const errorSummaryRef = useRef(null);
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
      window.requestAnimationFrame(() => {
        if (calculation.errors.calculation) errorSummaryRef.current?.focus();
        else formRef.current?.querySelector('input[aria-invalid="true"]')?.focus();
      });
      return;
    }

    setErrors({});
    setResult(calculation);
    window.requestAnimationFrame(() => resultRef.current?.focus());
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

      <div className="dose-mode-guidance" role="note">
        <ShieldWarning size={21} weight="fill" aria-hidden="true" />
        <div>
          <strong>{text.singleDoseOnlyTitle}</strong>
          <p>{text.singleDoseOnlyBody}</p>
          <button type="button" onClick={onOpenInfusion}><Calculator size={17} aria-hidden="true" /> {text.openInfusionCalculator}</button>
        </div>
      </div>

      {hasErrors ? <div ref={errorSummaryRef} className="dose-error-summary" role="alert" tabIndex="-1">
        <ShieldWarning size={21} weight="fill" aria-hidden="true" />
        <p>{errors.acknowledgement
          ? text.calculatorAcknowledgeError
          : errors.calculation
            ? text.calculatorCalculationOutside
            : namedCalculatorErrorSummary(errors, text, lang)}</p>
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

function InfusionPresetSummary({ lang, preset, text, onUseManual }) {
  const isLocked = !preset.calculatorEnabled;
  return <section className={`infusion-preset-summary ${isLocked ? "is-locked" : ""}`} aria-live="polite">
    <div className="infusion-preset-summary-main">
      <div>
        <span className="infusion-preset-kicker">{isLocked ? text.shortcutLocked : text.shortcutReady}</span>
        <strong>{localize(preset.name, lang)}</strong>
        <span>{localize(preset.category, lang)}</span>
      </div>
      <div className="infusion-preset-concentration">
        <span>{isLocked ? text.reviewedConcentration : text.selectedConcentration}</span>
        <strong dir="ltr">{formatCalculatedValue(preset.concentrationValue, lang)} {displayInfusionConcentrationUnit(preset.concentrationUnit)}</strong>
      </div>
    </div>
    {preset.flags.length ? <div className="infusion-preset-badges" aria-label={lang === "ar" ? "تنبيهات الاختصار" : "Shortcut notices"}>
      {preset.flags.includes("lasa") ? <span className="infusion-preset-badge is-lasa">{text.lasaBadge}</span> : null}
      {preset.flags.includes("independent_check") ? <span className="infusion-preset-badge">{text.independentCheckBadge}</span> : null}
    </div> : null}
    <p className="infusion-preset-source">
      <span>{text.shortcutSource}</span>
      <strong>{localize(INFUSION_PRESET_SOURCE.name, lang)} · {text.shortcutPage} {preset.sourcePage}</strong>
    </p>
    <p>{isLocked ? text.shortcutLockedBody : text.infusionPresetConcentrationHint}</p>
    {isLocked ? <button type="button" className="infusion-use-manual" onClick={onUseManual}>{text.useManualPreparation}</button> : null}
  </section>;
}

function InfusionRateCalculator({ lang, text }) {
  const [fields, setFields] = useState(EMPTY_INFUSION);
  const [acknowledged, setAcknowledged] = useState(false);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [statusKey, setStatusKey] = useState("");
  const formRef = useRef(null);
  const errorSummaryRef = useRef(null);
  const resultRef = useRef(null);
  const selectedPreset = getInfusionConcentrationPreset(fields.medicineId);
  const isCustomPreparation = selectedPreset === null;
  const isLockedPreset = Boolean(selectedPreset && !selectedPreset.calculatorEnabled);
  const selectedDimension = selectedPreset
    ? (selectedPreset.concentrationAmountUnit === "unit" ? "activity" : "mass")
    : fields.drugAmountUnit
      ? (fields.drugAmountUnit === "unit" ? "activity" : "mass")
      : null;
  const availableRateUnits = selectedDimension
    ? INFUSION_RATE_UNITS.filter((unit) => infusionRateUnitDimension(unit) === selectedDimension)
    : INFUSION_RATE_UNITS;

  function clearResult() {
    setAcknowledged(false);
    setErrors({});
    setResult(null);
  }

  function selectMedicine(medicineId, moveFocusToManual = false) {
    setFields({ ...EMPTY_INFUSION, medicineId });
    clearResult();
    setStatusKey(medicineId === "custom" ? "manualPreparationReady" : "infusionValuesCleared");
    if (moveFocusToManual) {
      window.requestAnimationFrame(() => formRef.current?.querySelector("#infusion-drugAmount")?.focus());
    }
  }

  function handleMedicineChange(event) {
    selectMedicine(event.target.value);
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFields((current) => {
      if (name !== "drugAmountUnit") return { ...current, [name]: value };
      const nextDimension = value === "unit" ? "activity" : "mass";
      const currentRateDimension = infusionRateUnitDimension(current.rateUnit);
      return {
        ...current,
        [name]: value,
        rateUnit: currentRateDimension && currentRateDimension !== nextDimension ? "" : current.rateUnit,
      };
    });
    clearResult();
  }

  function handleAcknowledgementChange(event) {
    const checked = event.target.checked;
    setAcknowledged(checked);
    setErrors((current) => ({ ...current, acknowledgement: undefined }));
    if (!checked) setResult(null);
  }

  function resetCalculator() {
    setFields(EMPTY_INFUSION);
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
    if (isLockedPreset) return;
    if (!acknowledged) {
      setErrors({ acknowledgement: "required" });
      setResult(null);
      window.requestAnimationFrame(() => formRef.current?.querySelector('input[type="checkbox"]')?.focus());
      return;
    }

    const calculation = selectedPreset
      ? calculatePresetInfusionRate(selectedPreset.id, {
          rateValue: fields.rateValue,
          rateUnit: fields.rateUnit,
          weightKg: fields.weightKg,
        })
      : calculateInfusionRate(fields);
    if (!calculation.ok) {
      setErrors(calculation.errors);
      setResult(null);
      window.requestAnimationFrame(() => {
        if (calculation.errors.calculation) errorSummaryRef.current?.focus();
        else formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    setErrors({});
    setResult(calculation);
    window.requestAnimationFrame(() => resultRef.current?.focus());
  }

  const hasErrors = Object.keys(errors).some((key) => errors[key]);
  const isWeightBased = isWeightBasedInfusionRateUnit(fields.rateUnit);
  const isNitroglycerin = fields.medicineId === "nitroglycerin-400-mcg-ml";
  const medicineLabel = selectedPreset ? infusionPresetOptionLabel(selectedPreset, lang) : text.otherInfusionOption;
  const normalizedUnit = result ? displayInfusionAmountUnit(result.normalizedUnit) : "";

  return <div className="dose-tools-stack">
    <form ref={formRef} className="dose-calculator-card infusion-calculator" onSubmit={submit} noValidate>
      <div className="dose-card-heading">
        <span className="dose-card-icon" aria-hidden="true"><Calculator size={25} weight="duotone" /></span>
        <div><h2>{text.infusionTitle}</h2><p>{text.infusionLead}</p></div>
      </div>

      <p className="dose-page-memory-note">{text.infusionPrivacy}</p>
      <p className="sr-only" role="status" aria-live="polite">{statusKey ? text[statusKey] : ""}</p>

      {hasErrors ? <div ref={errorSummaryRef} className="dose-error-summary" role="alert" tabIndex="-1">
        <ShieldWarning size={21} weight="fill" aria-hidden="true" />
        <p>{errors.acknowledgement
          ? text.infusionAcknowledgeError
          : errors.calculation === "incompatibleUnits"
            ? text.infusionIncompatibleUnits
            : errors.calculation
              ? text.infusionCalculationOutside
              : infusionCalculatorErrorSummary(errors, text, lang)}</p>
      </div> : null}

      <div className="dose-field dose-medicine-field">
        <label htmlFor="infusion-medicine">{text.infusionMedicineLabel}</label>
        <select id="infusion-medicine" name="medicineId" value={fields.medicineId} onChange={handleMedicineChange} aria-describedby="infusion-medicine-hint">
          <option value="custom">{text.otherInfusionOption}</option>
          {INFUSION_PRESET_GROUPS.map((group) => <optgroup key={group.category.en} label={localize(group.category, lang)}>
            {group.presets.map((preset) => <option key={preset.id} value={preset.id}>
              {infusionPresetOptionLabel(preset, lang)}{preset.calculatorEnabled ? "" : ` — ${text.shortcutLocked}`}
            </option>)}
          </optgroup>)}
        </select>
        <small id="infusion-medicine-hint">{text.infusionMedicineHint}</small>
      </div>

      {selectedPreset ? <InfusionPresetSummary lang={lang} preset={selectedPreset} text={text} onUseManual={() => selectMedicine("custom", true)} /> : null}

      {!isLockedPreset ? <>
        <fieldset>
          <legend>{text.sourceOrderLegend}</legend>
          <div className="dose-field-grid infusion-order-grid">
            <DecimalField idPrefix="infusion" name="rateValue" value={fields.rateValue} label={text.prescribedRate} hint={text.calculatorFieldHint} error={fieldError("rateValue")} onChange={handleFieldChange} lang={lang} />
            <div className={`dose-field ${errors.rateUnit ? "has-error" : ""}`}>
              <label htmlFor="infusion-rate-unit">{text.rateUnit}</label>
              <select id="infusion-rate-unit" name="rateUnit" value={fields.rateUnit} onChange={handleFieldChange} aria-invalid={Boolean(errors.rateUnit)} aria-describedby={`infusion-rate-unit-hint${errors.rateUnit ? " infusion-rate-unit-error" : ""}`} required dir="ltr">
                <option value="" disabled>{text.selectRateUnit}</option>
                {availableRateUnits.map((unit) => <option key={unit} value={unit}>{localize(INFUSION_RATE_UNIT_LABELS[unit], lang)}</option>)}
              </select>
              <small id="infusion-rate-unit-hint">{text.rateUnitHint}</small>
              {errors.rateUnit ? <span id="infusion-rate-unit-error" className="dose-field-error">{errors.rateUnit === "required" ? text.rateUnitRequired : fieldError("rateUnit")}</span> : null}
            </div>
            {isWeightBased ? <DecimalField idPrefix="infusion" name="weightKg" value={fields.weightKg} label={text.infusionWeight} hint={text.weightRequiredHint} error={fieldError("weightKg")} onChange={handleFieldChange} lang={lang} /> : null}
          </div>
        </fieldset>

        {isCustomPreparation ? <fieldset>
          <legend>{text.preparedSolutionLegend}</legend>
          <div className="dose-field-grid infusion-preparation-grid">
            <DecimalField idPrefix="infusion" name="drugAmount" value={fields.drugAmount} label={text.drugAmount} hint={text.calculatorFieldHint} error={fieldError("drugAmount")} onChange={handleFieldChange} lang={lang} />
            <div className={`dose-field ${errors.drugAmountUnit ? "has-error" : ""}`}>
              <label htmlFor="infusion-amount-unit">{text.amountUnit}</label>
              <select id="infusion-amount-unit" name="drugAmountUnit" value={fields.drugAmountUnit} onChange={handleFieldChange} aria-invalid={Boolean(errors.drugAmountUnit)} aria-describedby={`infusion-amount-unit-hint${errors.drugAmountUnit ? " infusion-amount-unit-error" : ""}`} required dir="ltr">
                <option value="" disabled>{text.selectAmountUnit}</option>
                <option value="mg">{lang === "ar" ? "mg — ملغ" : "mg — milligrams"}</option>
                <option value="mcg">{lang === "ar" ? "mcg — ميكروغرام" : "mcg — micrograms"}</option>
                <option value="unit">{lang === "ar" ? "units — وحدة" : "units — activity units"}</option>
              </select>
              <small id="infusion-amount-unit-hint">{text.amountUnitHint}</small>
              {errors.drugAmountUnit ? <span id="infusion-amount-unit-error" className="dose-field-error">{errors.drugAmountUnit === "required" ? text.amountUnitRequired : fieldError("drugAmountUnit")}</span> : null}
            </div>
            <DecimalField idPrefix="infusion" name="finalVolumeMl" value={fields.finalVolumeMl} label={text.finalVolume} hint={text.finalVolumeHint} error={fieldError("finalVolumeMl")} onChange={handleFieldChange} lang={lang} />
          </div>
        </fieldset> : null}

        {isNitroglycerin ? <p className="dose-unit-warning"><ShieldWarning size={17} weight="fill" aria-hidden="true" /> {text.nitroglycerinDeviceNote}</p> : null}

        <label className={`dose-acknowledgement ${errors.acknowledgement ? "has-error" : ""}`}>
          <input type="checkbox" checked={acknowledged} onChange={handleAcknowledgementChange} />
          <span>{selectedPreset ? text.infusionPresetAcknowledge : text.infusionAcknowledge}</span>
        </label>

        <div className="dose-form-actions">
          <button type="submit" className="button button-primary"><Calculator size={19} aria-hidden="true" /> {text.infusionCalculate}</button>
          <button type="button" className="dose-reset-button" onClick={resetCalculator}><ArrowCounterClockwise size={18} aria-hidden="true" /> {text.infusionReset}</button>
        </div>
      </> : null}
    </form>

    {result ? <section ref={resultRef} className="dose-result-card infusion-result is-correct" tabIndex="-1" aria-live="polite">
      <div className="dose-result-heading"><CheckCircle size={32} weight="fill" aria-hidden="true" /><div><p className="dose-result-medicine">{medicineLabel}</p><h2>{text.infusionResultTitle}</h2></div></div>
      <dl className="dose-calculated-values infusion-calculated-values">
        <div><dt>{text.concentrationResult}</dt><dd dir="ltr">{selectedPreset
          ? `${formatCalculatedValue(selectedPreset.concentrationValue, lang)} ${displayInfusionConcentrationUnit(selectedPreset.concentrationUnit)}`
          : `${formatCalculatedValue(result.concentrationPerMl, lang)} ${normalizedUnit}/mL`}</dd></div>
        <div><dt>{text.normalizedDoseResult}</dt><dd dir="ltr">{formatCalculatedValue(result.ratePerHour, lang)} {normalizedUnit}/hr</dd></div>
        <div className="infusion-primary-result"><dt>{text.pumpRateResult}</dt><dd dir="ltr">{formatCalculatedValue(result.mlPerHour, lang)} mL/hr</dd></div>
      </dl>
      <ol className="dose-working">
        {selectedPreset ? <li><strong>{text.presetConcentrationStep}</strong><code dir="ltr">{buildPresetConcentrationEquation(selectedPreset, result, lang)}</code></li> : <>
          <li><strong>{text.amountConversionStep}</strong><code dir="ltr">{formatCalculatedValue(result.values.drugAmount, lang)} {displayInfusionAmountUnit(result.values.drugAmountUnit)} × {result.values.drugAmountUnit === "mg" ? "1,000 mcg/mg" : `1 ${normalizedUnit}/${normalizedUnit}`} = {formatCalculatedValue(result.drugAmountNormalized, lang)} {normalizedUnit}</code></li>
          <li><strong>{text.concentrationStep}</strong><code dir="ltr">{formatCalculatedValue(result.drugAmountNormalized, lang)} {normalizedUnit} ÷ {formatCalculatedValue(result.values.finalVolumeMl, lang)} mL = {formatCalculatedValue(result.concentrationPerMl, lang)} {normalizedUnit}/mL</code></li>
        </>}
        <li><strong>{text.doseNormalizationStep}</strong><code dir="ltr">{buildRateNormalizationEquation(result, lang)}</code></li>
        <li><strong>{text.pumpRateStep}</strong><code dir="ltr">{formatCalculatedValue(result.ratePerHour, lang)} {normalizedUnit}/hr ÷ {formatCalculatedValue(result.concentrationPerMl, lang)} {normalizedUnit}/mL = {formatCalculatedValue(result.mlPerHour, lang)} mL/hr</code></li>
      </ol>
      <p className="dose-display-rounding">{text.infusionDisplayRounding}</p>
      <p className="dose-result-warning"><ShieldWarning size={20} weight="fill" aria-hidden="true" /> {text.infusionResultBoundary}</p>
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

export function MedicationMathPage({ lang, initialMode = "infusion" }) {
  const text = pageCopy[lang] ?? pageCopy.en;
  const [activeMode, setActiveMode] = useState(() => normalizeDoseMode(initialMode));
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
    window.requestAnimationFrame(() => resultRef.current?.focus());
  }

  function nextProblem() {
    setExerciseIndex((current) => (current + 1) % dosePracticeExercises.length);
    clearAnswer();
  }

  function selectDoseMode(mode, moveFocus = false) {
    const nextMode = normalizeDoseMode(mode);
    setActiveMode(nextMode);
    window.history.replaceState(null, "", `#/dose-practice/${nextMode}`);
    if (moveFocus) {
      window.requestAnimationFrame(() => document.getElementById(`dose-${nextMode}-tab`)?.focus());
    }
  }

  function handleModeKeyDown(event) {
    const forwardKey = lang === "ar" ? "ArrowLeft" : "ArrowRight";
    const backwardKey = lang === "ar" ? "ArrowRight" : "ArrowLeft";
    const currentIndex = Math.max(0, DOSE_MODES.indexOf(activeMode));
    let nextIndex = null;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = DOSE_MODES.length - 1;
    if (event.key === forwardKey || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % DOSE_MODES.length;
    if (event.key === backwardKey || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + DOSE_MODES.length) % DOSE_MODES.length;
    if (nextIndex === null) return;
    event.preventDefault();
    const nextMode = DOSE_MODES[nextIndex];
    selectDoseMode(nextMode, true);
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
      <button id="dose-calculator-tab" type="button" role="tab" aria-selected={activeMode === "calculator"} aria-controls="dose-calculator-panel" tabIndex={activeMode === "calculator" ? 0 : -1} onClick={() => selectDoseMode("calculator")} onKeyDown={handleModeKeyDown}><Pill size={19} aria-hidden="true" /> {text.calculatorTab}</button>
      <button id="dose-infusion-tab" type="button" role="tab" aria-selected={activeMode === "infusion"} aria-controls="dose-infusion-panel" tabIndex={activeMode === "infusion" ? 0 : -1} onClick={() => selectDoseMode("infusion")} onKeyDown={handleModeKeyDown}><Calculator size={19} aria-hidden="true" /> {text.infusionTab}</button>
      <button id="dose-practice-tab" type="button" role="tab" aria-selected={activeMode === "practice"} aria-controls="dose-practice-panel" tabIndex={activeMode === "practice" ? 0 : -1} onClick={() => selectDoseMode("practice")} onKeyDown={handleModeKeyDown}><Flask size={19} aria-hidden="true" /> {text.practiceTab}</button>
    </div>

    <section id="dose-calculator-panel" role="tabpanel" aria-labelledby="dose-calculator-tab" hidden={activeMode !== "calculator"}>
      <div className="dose-practice-layout">
        <NamedMedicationCalculator lang={lang} text={text} onOpenInfusion={() => selectDoseMode("infusion", true)} />
        <DoseSafetyAside text={text} />
      </div>
    </section>

    <section id="dose-infusion-panel" role="tabpanel" aria-labelledby="dose-infusion-tab" hidden={activeMode !== "infusion"}>
      <div className="dose-practice-layout">
        <InfusionRateCalculator lang={lang} text={text} />
        <DoseSafetyAside text={text} />
      </div>
    </section>

    <section id="dose-practice-panel" role="tabpanel" aria-labelledby="dose-practice-tab" hidden={activeMode !== "practice"}>
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
    </section>

    <section className="dose-sources" aria-labelledby="dose-sources-title">
      <h2 id="dose-sources-title">{text.sourceTitle}</h2>
      <p>{text.sourceNote}</p>
      <ul>{SOURCE_LINKS.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer nofollow">{source[lang] ?? source.en}</a></li>)}</ul>
    </section>
  </div>;
}
