export const DOSE_PRACTICE_LIMITS = Object.freeze({
  weightKg: Object.freeze({ min: 0.1, max: 300 }),
  orderedMgPerKg: Object.freeze({ min: 0.001, max: 1_000 }),
  stockStrengthMg: Object.freeze({ min: 0.001, max: 100_000 }),
  stockVolumeMl: Object.freeze({ min: 0.001, max: 1_000 }),
  calculatedVolumeMl: Object.freeze({ max: 1_000 }),
});

const ARABIC_INDIC_DIGITS = /[٠-٩]/g;
const EASTERN_ARABIC_INDIC_DIGITS = /[۰-۹]/g;
const DECIMAL_PATTERN = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

export function parseDoseDecimal(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : Number.NaN;
  if (typeof value !== "string") return Number.NaN;

  const normalized = value
    .trim()
    .replace(ARABIC_INDIC_DIGITS, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(EASTERN_ARABIC_INDIC_DIGITS, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replaceAll("٫", ".")
    .replaceAll(" ", "");

  if (!DECIMAL_PATTERN.test(normalized)) return Number.NaN;
  return Number(normalized);
}

function validateField(rawValue, limits) {
  if (rawValue === null || rawValue === undefined || String(rawValue).trim() === "") {
    return { value: Number.NaN, error: "required" };
  }

  const value = parseDoseDecimal(rawValue);
  if (!Number.isFinite(value)) return { value, error: "invalid" };
  if (value < limits.min || value > limits.max) return { value, error: "outsideLimits" };
  return { value, error: null };
}

export function calculateDosePractice(input = {}) {
  const fields = {
    weightKg: validateField(input.weightKg, DOSE_PRACTICE_LIMITS.weightKg),
    orderedMgPerKg: validateField(input.orderedMgPerKg, DOSE_PRACTICE_LIMITS.orderedMgPerKg),
    stockStrengthMg: validateField(input.stockStrengthMg, DOSE_PRACTICE_LIMITS.stockStrengthMg),
    stockVolumeMl: validateField(input.stockVolumeMl, DOSE_PRACTICE_LIMITS.stockVolumeMl),
  };
  const errors = Object.fromEntries(
    Object.entries(fields)
      .filter(([, field]) => field.error)
      .map(([key, field]) => [key, field.error]),
  );

  if (Object.keys(errors).length) return { ok: false, errors };

  const values = Object.fromEntries(
    Object.entries(fields).map(([key, field]) => [key, field.value]),
  );
  const requiredDoseMg = values.weightKg * values.orderedMgPerKg;
  const calculatedVolumeMl = (requiredDoseMg * values.stockVolumeMl) / values.stockStrengthMg;

  if (!Number.isFinite(requiredDoseMg) || !Number.isFinite(calculatedVolumeMl)) {
    return { ok: false, errors: { calculation: "notFinite" } };
  }
  if (calculatedVolumeMl <= 0 || calculatedVolumeMl > DOSE_PRACTICE_LIMITS.calculatedVolumeMl.max) {
    return { ok: false, errors: { calculation: "outsideLimits" } };
  }

  return {
    ok: true,
    errors: {},
    values,
    requiredDoseMg,
    calculatedVolumeMl,
  };
}

function roundTo(value, decimalPlaces) {
  const factor = 10 ** decimalPlaces;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function gradeDosePracticeAnswer(exercise, answers = {}) {
  const calculation = calculateDosePractice(exercise);
  if (!calculation.ok) return { ok: false, errors: { exercise: "invalidExercise" } };

  const answerDecimals = Number.isInteger(exercise?.answerDecimals)
    ? Math.min(Math.max(exercise.answerDecimals, 0), 4)
    : 2;
  const parsedAnswers = {
    requiredDoseMg: parseDoseDecimal(answers.requiredDoseMg),
    calculatedVolumeMl: parseDoseDecimal(answers.calculatedVolumeMl),
  };
  const errors = {};
  for (const [key, value] of Object.entries(parsedAnswers)) {
    const rawValue = answers[key];
    if (rawValue === null || rawValue === undefined || String(rawValue).trim() === "") errors[key] = "required";
    else if (!Number.isFinite(value) || value <= 0 || value > 100_000) errors[key] = "invalid";
  }
  if (Object.keys(errors).length) return { ok: false, errors };

  const expected = {
    requiredDoseMg: roundTo(calculation.requiredDoseMg, answerDecimals),
    calculatedVolumeMl: roundTo(calculation.calculatedVolumeMl, answerDecimals),
  };
  const submitted = {
    requiredDoseMg: roundTo(parsedAnswers.requiredDoseMg, answerDecimals),
    calculatedVolumeMl: roundTo(parsedAnswers.calculatedVolumeMl, answerDecimals),
  };
  const correct = {
    requiredDoseMg: submitted.requiredDoseMg === expected.requiredDoseMg,
    calculatedVolumeMl: submitted.calculatedVolumeMl === expected.calculatedVolumeMl,
  };

  return {
    ok: true,
    errors: {},
    answerDecimals,
    expected,
    submitted,
    correct,
    isFullyCorrect: correct.requiredDoseMg && correct.calculatedVolumeMl,
    calculation,
  };
}
