import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  INFUSION_CALCULATOR_LIMITS,
  calculateInfusionRate,
} from "../src/lib/infusion-calculator.js";

test("converts a prescribed mcg/min rate to mL/hr", () => {
  const result = calculateInfusionRate({
    rateValue: "30",
    rateUnit: "mcg/min",
    drugAmount: "25",
    drugAmountUnit: "mg",
    finalVolumeMl: "250",
  });

  assert.equal(result.ok, true);
  assert.equal(result.drugAmountMcg, 25_000);
  assert.equal(result.concentrationMcgPerMl, 100);
  assert.equal(result.rateMcgPerMin, 30);
  assert.equal(result.mlPerHour, 18);
  assert.equal(result.values.weightKg, null);
});

test("converts a prescribed mcg/kg/min rate to mL/hr", () => {
  const result = calculateInfusionRate({
    rateValue: "0.2",
    rateUnit: "mcg/kg/min",
    weightKg: "95",
    drugAmount: "0.4",
    drugAmountUnit: "mg",
    finalVolumeMl: "50",
  });

  assert.equal(result.ok, true);
  assert.equal(result.drugAmountMcg, 400);
  assert.equal(result.concentrationMcgPerMl, 8);
  assert.equal(result.rateMcgPerMin, 19);
  assert.equal(result.rateMcgPerKgMin, 0.2);
  assert.equal(result.mlPerHour, 142.5);
});

test("treats 0.4 mg and 400 mcg as equivalent solution amounts", () => {
  const common = {
    rateValue: "0.2",
    rateUnit: "mcg/kg/min",
    weightKg: "95",
    finalVolumeMl: "50",
  };
  const inMilligrams = calculateInfusionRate({
    ...common,
    drugAmount: "0.4",
    drugAmountUnit: "mg",
  });
  const inMicrograms = calculateInfusionRate({
    ...common,
    drugAmount: "400",
    drugAmountUnit: "mcg",
  });

  assert.equal(inMilligrams.ok, true);
  assert.equal(inMicrograms.ok, true);
  assert.equal(inMilligrams.drugAmountMcg, inMicrograms.drugAmountMcg);
  assert.equal(inMilligrams.concentrationMcgPerMl, inMicrograms.concentrationMcgPerMl);
  assert.equal(inMilligrams.mlPerHour, inMicrograms.mlPerHour);
});

test("converts an mg/hr order without requiring weight", () => {
  const result = calculateInfusionRate({
    rateValue: "2",
    rateUnit: "mg/hr",
    drugAmount: "25",
    drugAmountUnit: "mg",
    finalVolumeMl: "250",
  });

  assert.equal(result.ok, true);
  assert.equal(result.rateMgPerHour, 2);
  assert.equal(result.mlPerHour, 20);
  assert.equal(result.values.weightKg, null);
});

test("requires weight only for a weight-based rate", () => {
  const weighted = calculateInfusionRate({
    rateValue: "0.2",
    rateUnit: "mcg/kg/min",
    drugAmount: "400",
    drugAmountUnit: "mcg",
    finalVolumeMl: "50",
  });
  const unweighted = calculateInfusionRate({
    rateValue: "19",
    rateUnit: "mcg/min",
    weightKg: "not-used",
    drugAmount: "400",
    drugAmountUnit: "mcg",
    finalVolumeMl: "50",
  });

  assert.equal(weighted.ok, false);
  assert.deepEqual(weighted.errors, { weightKg: "required" });
  assert.equal(unweighted.ok, true);
  assert.equal(unweighted.values.weightKg, null);
});

test("accepts Arabic-Indic digits and the Arabic decimal mark", () => {
  const result = calculateInfusionRate({
    rateValue: "٠٫٢",
    rateUnit: "mcg/kg/min",
    weightKg: "٩٥",
    drugAmount: "٠٫٤",
    drugAmountUnit: "mg",
    finalVolumeMl: "٥٠",
  });

  assert.equal(result.ok, true);
  assert.equal(result.rateMcgPerMin, 19);
  assert.equal(result.mlPerHour, 142.5);
});

test("returns field-specific errors for missing, zero, text and unsupported units", () => {
  const result = calculateInfusionRate({
    rateValue: "dose",
    rateUnit: "mg/kg/dose",
    weightKg: "",
    drugAmount: "0",
    drugAmountUnit: "g",
    finalVolumeMl: "",
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, {
    rateUnit: "unsupportedRateUnit",
    drugAmountUnit: "unsupportedAmountUnit",
    rateValue: "invalid",
    drugAmount: "outsideLimits",
    finalVolumeMl: "required",
  });
});

test("requires both units to be selected explicitly", () => {
  const result = calculateInfusionRate({
    rateValue: "30",
    rateUnit: "",
    drugAmount: "25",
    drugAmountUnit: "",
    finalVolumeMl: "250",
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, {
    rateUnit: "required",
    drugAmountUnit: "required",
  });
});

test("enforces explicit technical input and calculated-rate limits", () => {
  const inputLimit = calculateInfusionRate({
    rateValue: String(INFUSION_CALCULATOR_LIMITS.rateValue.max + 1),
    rateUnit: "mcg/min",
    drugAmount: "1",
    drugAmountUnit: "mcg",
    finalVolumeMl: "1",
  });
  const outputLimit = calculateInfusionRate({
    rateValue: String(INFUSION_CALCULATOR_LIMITS.rateValue.max),
    rateUnit: "mcg/min",
    drugAmount: String(INFUSION_CALCULATOR_LIMITS.drugAmount.min),
    drugAmountUnit: "mcg",
    finalVolumeMl: String(INFUSION_CALCULATOR_LIMITS.finalVolumeMl.max),
  });

  assert.deepEqual(inputLimit.errors, { rateValue: "outsideLimits" });
  assert.deepEqual(outputLimit.errors, { calculation: "mlPerHourOutsideTechnicalLimits" });
});

test("does not round concentration or pump rate during calculation", () => {
  const result = calculateInfusionRate({
    rateValue: "1",
    rateUnit: "mcg/min",
    drugAmount: "7",
    drugAmountUnit: "mcg",
    finalVolumeMl: "3",
  });

  assert.equal(result.ok, true);
  assert.equal(result.concentrationMcgPerMl, 7 / 3);
  assert.equal(result.mlPerHour, 180 / 7);
});

test("the bilingual UI keeps infusion units explicit and does not persist calculator entries", async () => {
  const [source, appSource] = await Promise.all([
    readFile(new URL("../src/components/MedicationMathPage.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  ]);

  assert.match(source, /Nitroglycerin \(Glyceryl trinitrate\)/);
  assert.match(source, /mcg\/min/);
  assert.match(source, /mcg\/kg\/min/);
  assert.match(source, /mg\/hr/);
  assert.match(source, /التسريب الوريدي/);
  assert.match(source, /IV infusion/);
  assert.match(source, /final total volume, not the volume of diluent added/i);
  assert.match(source, /الحجم النهائي الكلي، وليس حجم المذيب المضاف/);
  assert.match(source, /calculatorCalculationOutside/);
  assert.match(source, /rateUnit: ""/);
  assert.match(source, /drugAmountUnit: ""/);
  assert.match(source, /<option value="" disabled>\{text\.selectRateUnit\}<\/option>/);
  assert.match(source, /<option value="" disabled>\{text\.selectAmountUnit\}<\/option>/);
  assert.match(source, /maximumSignificantDigits: 8/);
  assert.match(source, /event\.key === "ArrowDown"/);
  assert.match(source, /hidden=\{activeMode !== "infusion"\}/);
  assert.match(source, /initialMode = "infusion"/);
  assert.match(source, /Single liquid dose \(mg\/kg\/dose\)/);
  assert.match(source, /جرعة سائلة مفردة \(mg\/kg\/dose\)/);
  assert.match(source, /IV infusion \(mcg\/min, mcg\/kg\/min, or mg\/hr\)/);
  assert.match(source, /openInfusionCalculator/);
  assert.match(source, /namedCalculatorErrorSummary/);
  assert.match(source, /infusionCalculatorErrorSummary/);
  assert.match(source, /#\/dose-practice\/\$\{nextMode\}/);
  assert.doesNotMatch(source, /preventScroll/);
  assert.doesNotMatch(source, /Nitro drip|µg|localStorage|sessionStorage/);
  assert.match(appSource, /either a single dose or an IV infusion/i);
  assert.match(appSource, /لجرعة مفردة أو تسريب وريدي/);
  assert.match(appSource, /const doseMode = route\.id \|\| "infusion"/);
  assert.match(appSource, /initialMode=\{doseMode\}/);
});
