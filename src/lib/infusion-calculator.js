import { parseDoseDecimal } from "./dose-calculator.js";

const RATE_UNIT_DEFINITIONS = Object.freeze({
  "mcg/min": Object.freeze({ amountUnit: "mcg", dimension: "mass", perWeight: false, perMinute: true }),
  "mcg/kg/min": Object.freeze({ amountUnit: "mcg", dimension: "mass", perWeight: true, perMinute: true }),
  "mcg/hr": Object.freeze({ amountUnit: "mcg", dimension: "mass", perWeight: false, perMinute: false }),
  "mcg/kg/hr": Object.freeze({ amountUnit: "mcg", dimension: "mass", perWeight: true, perMinute: false }),
  "mg/min": Object.freeze({ amountUnit: "mg", dimension: "mass", perWeight: false, perMinute: true }),
  "mg/kg/min": Object.freeze({ amountUnit: "mg", dimension: "mass", perWeight: true, perMinute: true }),
  "mg/hr": Object.freeze({ amountUnit: "mg", dimension: "mass", perWeight: false, perMinute: false }),
  "mg/kg/hr": Object.freeze({ amountUnit: "mg", dimension: "mass", perWeight: true, perMinute: false }),
  "unit/min": Object.freeze({ amountUnit: "unit", dimension: "activity", perWeight: false, perMinute: true }),
  "unit/kg/min": Object.freeze({ amountUnit: "unit", dimension: "activity", perWeight: true, perMinute: true }),
  "unit/hr": Object.freeze({ amountUnit: "unit", dimension: "activity", perWeight: false, perMinute: false }),
  "unit/kg/hr": Object.freeze({ amountUnit: "unit", dimension: "activity", perWeight: true, perMinute: false }),
});

export const INFUSION_RATE_UNITS = Object.freeze(Object.keys(RATE_UNIT_DEFINITIONS));
export const INFUSION_AMOUNT_UNITS = Object.freeze(["mcg", "mg", "unit"]);

/**
 * Computational guards only. These values are not clinical dose, concentration,
 * or pump-rate recommendations and must not be presented as safe ranges.
 */
export const INFUSION_CALCULATOR_LIMITS = Object.freeze({
  weightKg: Object.freeze({ min: 0.01, max: 1_000 }),
  rateValue: Object.freeze({ min: 0.000001, max: 1_000_000 }),
  drugAmount: Object.freeze({ min: 0.000001, max: 1_000_000 }),
  concentrationValue: Object.freeze({ min: 0.000001, max: 1_000_000 }),
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

function amountDimension(amountUnit) {
  return amountUnit === "unit" ? "activity" : "mass";
}

function normalizeAmount(amount, amountUnit) {
  return amountUnit === "mg" ? amount * 1_000 : amount;
}

function normalizedAmountUnit(amountUnit) {
  return amountUnit === "unit" ? "unit" : "mcg";
}

function isDirectConcentrationInput(input) {
  return input.concentrationValue !== null
    && input.concentrationValue !== undefined
    && String(input.concentrationValue).trim() !== "";
}

export function isWeightBasedInfusionRateUnit(rateUnit) {
  return Boolean(RATE_UNIT_DEFINITIONS[rateUnit]?.perWeight);
}

export function infusionRateUnitDimension(rateUnit) {
  return RATE_UNIT_DEFINITIONS[rateUnit]?.dimension ?? null;
}

export function calculateInfusionRate(input = {}) {
  const errors = {};
  const rateUnit = input.rateUnit;
  const usesDirectConcentration = isDirectConcentrationInput(input);
  const concentrationAmountUnit = usesDirectConcentration
    ? input.concentrationAmountUnit
    : input.drugAmountUnit;

  if (rateUnit === null || rateUnit === undefined || String(rateUnit).trim() === "") {
    errors.rateUnit = "required";
  } else if (!RATE_UNIT_SET.has(rateUnit)) {
    errors.rateUnit = "unsupportedRateUnit";
  }

  if (concentrationAmountUnit === null
    || concentrationAmountUnit === undefined
    || String(concentrationAmountUnit).trim() === "") {
    errors[usesDirectConcentration ? "concentrationAmountUnit" : "drugAmountUnit"] = "required";
  } else if (!AMOUNT_UNIT_SET.has(concentrationAmountUnit)) {
    errors[usesDirectConcentration ? "concentrationAmountUnit" : "drugAmountUnit"] = "unsupportedAmountUnit";
  }

  const fields = {
    rateValue: validateDecimal(input.rateValue, INFUSION_CALCULATOR_LIMITS.rateValue),
  };

  if (usesDirectConcentration) {
    fields.concentrationValue = validateDecimal(
      input.concentrationValue,
      INFUSION_CALCULATOR_LIMITS.concentrationValue,
    );
  } else {
    fields.drugAmount = validateDecimal(input.drugAmount, INFUSION_CALCULATOR_LIMITS.drugAmount);
    fields.finalVolumeMl = validateDecimal(
      input.finalVolumeMl,
      INFUSION_CALCULATOR_LIMITS.finalVolumeMl,
    );
  }

  if (isWeightBasedInfusionRateUnit(rateUnit)) {
    fields.weightKg = validateDecimal(input.weightKg, INFUSION_CALCULATOR_LIMITS.weightKg);
  }

  for (const [key, field] of Object.entries(fields)) {
    if (field.error) errors[key] = field.error;
  }

  const rateDefinition = RATE_UNIT_DEFINITIONS[rateUnit];
  if (rateDefinition
    && AMOUNT_UNIT_SET.has(concentrationAmountUnit)
    && rateDefinition.dimension !== amountDimension(concentrationAmountUnit)) {
    errors.calculation = "incompatibleUnits";
  }

  if (Object.keys(errors).length) return { ok: false, errors };

  const values = Object.fromEntries(
    Object.entries(fields).map(([key, field]) => [key, field.value]),
  );
  const normalizedUnit = normalizedAmountUnit(concentrationAmountUnit);
  const concentrationPerMl = usesDirectConcentration
    ? normalizeAmount(values.concentrationValue, concentrationAmountUnit)
    : normalizeAmount(values.drugAmount, concentrationAmountUnit) / values.finalVolumeMl;

  let normalizedRate = normalizeAmount(values.rateValue, rateDefinition.amountUnit);
  if (rateDefinition.perWeight) normalizedRate *= values.weightKg;
  const ratePerHour = rateDefinition.perMinute ? normalizedRate * 60 : normalizedRate;
  const ratePerMinute = ratePerHour / 60;
  const mlPerHour = usesDirectConcentration
    ? ratePerHour / concentrationPerMl
    : (ratePerHour * values.finalVolumeMl)
      / normalizeAmount(values.drugAmount, concentrationAmountUnit);

  const calculatedValues = [concentrationPerMl, ratePerHour, ratePerMinute, mlPerHour];
  if (!usesDirectConcentration) {
    calculatedValues.push(normalizeAmount(values.drugAmount, concentrationAmountUnit));
  }
  if (calculatedValues.some((value) => !Number.isFinite(value) || value <= 0)) {
    return { ok: false, errors: { calculation: "notFinite" } };
  }
  if (mlPerHour > INFUSION_CALCULATOR_LIMITS.calculatedMlPerHour.max) {
    return { ok: false, errors: { calculation: "mlPerHourOutsideTechnicalLimits" } };
  }

  const isMass = normalizedUnit === "mcg";
  const drugAmountNormalized = usesDirectConcentration
    ? null
    : normalizeAmount(values.drugAmount, concentrationAmountUnit);

  return {
    ok: true,
    errors: {},
    inputMode: usesDirectConcentration ? "preset" : "manual",
    values: {
      ...values,
      rateUnit,
      drugAmountUnit: usesDirectConcentration ? null : concentrationAmountUnit,
      concentrationAmountUnit,
      weightKg: values.weightKg ?? null,
    },
    normalizedUnit,
    concentrationPerMl,
    ratePerHour,
    ratePerMinute,
    mlPerHour,
    drugAmountNormalized,
    drugAmountMcg: isMass ? drugAmountNormalized : null,
    concentrationMcgPerMl: isMass ? concentrationPerMl : null,
    rateMcgPerMin: isMass ? ratePerMinute : null,
    rateMcgPerKgMin: rateUnit === "mcg/kg/min" ? values.rateValue : null,
    rateMgPerHour: isMass ? ratePerHour / 1_000 : null,
  };
}
