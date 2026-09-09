import { parseDoseDecimal } from "./dose-calculator.js";

export const INFUSION_RATE_UNITS = Object.freeze([
  "mcg/min",
  "mcg/kg/min",
  "mg/hr",
]);

export const INFUSION_AMOUNT_UNITS = Object.freeze(["mcg", "mg"]);

/**
 * Computational guards only. These values are not clinical dose, concentration,
 * or pump-rate recommendations and must not be presented as safe ranges.
 */
export const INFUSION_CALCULATOR_LIMITS = Object.freeze({
  weightKg: Object.freeze({ min: 0.01, max: 1_000 }),
  rateValue: Object.freeze({ min: 0.000001, max: 1_000_000 }),
  drugAmount: Object.freeze({ min: 0.000001, max: 1_000_000 }),
  finalVolumeMl: Object.freeze({ min: 0.001, max: 100_000 }),
  calculatedMlPerHour: Object.freeze({ max: 1_000_000 }),
});

const RATE_UNIT_SET = new Set(INFUSION_RATE_UNITS);
const AMOUNT_UNIT_SET = new Set(INFUSION_AMOUNT_UNITS);

function validateDecimal(rawValue, limits) {
  if (rawValue === null || rawValue === undefined || String(rawValue).trim() === "") {
    return { value: Number.NaN, error: "required" };
  }

  const value = parseDoseDecimal(rawValue);
  if (!Number.isFinite(value)) return { value, error: "invalid" };
  if (value < limits.min || value > limits.max) return { value, error: "outsideLimits" };
  return { value, error: null };
}

function toMicrograms(amount, amountUnit) {
  return amountUnit === "mg" ? amount * 1_000 : amount;
}

function toMicrogramsPerMinute(rateValue, rateUnit, weightKg) {
  if (rateUnit === "mcg/kg/min") return rateValue * weightKg;
  if (rateUnit === "mg/hr") return (rateValue * 1_000) / 60;
  return rateValue;
}

export function calculateInfusionRate(input = {}) {
  const errors = {};
  const rateUnit = input.rateUnit;
  const drugAmountUnit = input.drugAmountUnit;

  if (rateUnit === null || rateUnit === undefined || String(rateUnit).trim() === "") {
    errors.rateUnit = "required";
  } else if (!RATE_UNIT_SET.has(rateUnit)) {
    errors.rateUnit = "unsupportedRateUnit";
  }
  if (drugAmountUnit === null || drugAmountUnit === undefined || String(drugAmountUnit).trim() === "") {
    errors.drugAmountUnit = "required";
  } else if (!AMOUNT_UNIT_SET.has(drugAmountUnit)) {
    errors.drugAmountUnit = "unsupportedAmountUnit";
  }

  const fields = {
    rateValue: validateDecimal(input.rateValue, INFUSION_CALCULATOR_LIMITS.rateValue),
    drugAmount: validateDecimal(input.drugAmount, INFUSION_CALCULATOR_LIMITS.drugAmount),
    finalVolumeMl: validateDecimal(input.finalVolumeMl, INFUSION_CALCULATOR_LIMITS.finalVolumeMl),
  };

  if (rateUnit === "mcg/kg/min") {
    fields.weightKg = validateDecimal(input.weightKg, INFUSION_CALCULATOR_LIMITS.weightKg);
  }

  for (const [key, field] of Object.entries(fields)) {
    if (field.error) errors[key] = field.error;
  }

  if (Object.keys(errors).length) return { ok: false, errors };

  const values = Object.fromEntries(
    Object.entries(fields).map(([key, field]) => [key, field.value]),
  );
  const drugAmountMcg = toMicrograms(values.drugAmount, drugAmountUnit);
  const concentrationMcgPerMl = drugAmountMcg / values.finalVolumeMl;
  const rateMcgPerMin = toMicrogramsPerMinute(
    values.rateValue,
    rateUnit,
    values.weightKg,
  );
  const rateMgPerHour = rateUnit === "mg/hr"
    ? values.rateValue
    : (rateMcgPerMin * 60) / 1_000;
  const mlPerHour = (rateMgPerHour * 1_000 * values.finalVolumeMl) / drugAmountMcg;
  const rateMcgPerKgMin = rateUnit === "mcg/kg/min" ? values.rateValue : null;

  const calculatedValues = [
    drugAmountMcg,
    concentrationMcgPerMl,
    rateMcgPerMin,
    rateMgPerHour,
    mlPerHour,
  ];
  if (calculatedValues.some((value) => !Number.isFinite(value) || value <= 0)) {
    return { ok: false, errors: { calculation: "notFinite" } };
  }
  if (mlPerHour > INFUSION_CALCULATOR_LIMITS.calculatedMlPerHour.max) {
    return { ok: false, errors: { calculation: "mlPerHourOutsideTechnicalLimits" } };
  }

  return {
    ok: true,
    errors: {},
    values: {
      ...values,
      rateUnit,
      drugAmountUnit,
      weightKg: values.weightKg ?? null,
    },
    drugAmountMcg,
    concentrationMcgPerMl,
    rateMcgPerMin,
    rateMcgPerKgMin,
    rateMgPerHour,
    mlPerHour,
  };
}
