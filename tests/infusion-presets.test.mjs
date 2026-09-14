import assert from "node:assert/strict";
import test from "node:test";
import {
  getInfusionConcentrationPreset,
  INFUSION_CONCENTRATION_PRESETS,
} from "../src/data/infusion-presets.js";

const ALLOWED_AMOUNT_UNITS = new Set(["mcg", "mg", "unit"]);
const ALLOWED_CONCENTRATION_UNITS = new Set(["mcg/mL", "mg/mL", "unit/mL"]);
const FORBIDDEN_FIELDS = new Set([
  "rateValue",
  "rateUnit",
  "weight",
  "weightKg",
  "dose",
  "orderedDose",
  "recommendedDose",
  "recommendation",
  "min",
  "max",
  "titration",
]);

test("contains the 23 requested bilingual concentration shortcuts with unique IDs", () => {
  assert.equal(INFUSION_CONCENTRATION_PRESETS.length, 23);
  assert.equal(
    new Set(INFUSION_CONCENTRATION_PRESETS.map(({ id }) => id)).size,
    23,
  );

  for (const preset of INFUSION_CONCENTRATION_PRESETS) {
    assert.match(preset.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(typeof preset.name.ar, "string");
    assert.equal(typeof preset.name.en, "string");
    assert.ok(preset.name.ar.trim());
    assert.ok(preset.name.en.trim());
    assert.equal(typeof preset.category.ar, "string");
    assert.equal(typeof preset.category.en, "string");
    assert.ok(preset.category.ar.trim());
    assert.ok(preset.category.en.trim());
  }
});

test("uses positive concentrations, compatible units, and exact source pointers", () => {
  for (const preset of INFUSION_CONCENTRATION_PRESETS) {
    assert.ok(Number.isFinite(preset.concentrationValue));
    assert.ok(preset.concentrationValue > 0);
    assert.ok(ALLOWED_AMOUNT_UNITS.has(preset.concentrationAmountUnit));
    assert.ok(ALLOWED_CONCENTRATION_UNITS.has(preset.concentrationUnit));
    assert.equal(preset.concentrationUnit, `${preset.concentrationAmountUnit}/mL`);
    assert.equal(preset.sourceId, "ksamc-formulary-2025-2026");
    assert.ok(Number.isInteger(preset.sourcePage));
    assert.ok(preset.sourcePage > 0);
    assert.ok(Array.isArray(preset.flags));
  }
});

test("keeps exactly 21 source-matched shortcuts enabled and two review items locked", () => {
  const enabled = INFUSION_CONCENTRATION_PRESETS.filter(
    ({ calculatorEnabled, reviewStatus }) =>
      calculatorEnabled && reviewStatus === "source_matched",
  );
  const locked = INFUSION_CONCENTRATION_PRESETS.filter(
    ({ calculatorEnabled, reviewStatus }) =>
      !calculatorEnabled && reviewStatus === "needs_review",
  );

  assert.equal(enabled.length, 21);
  assert.deepEqual(
    locked.map(({ id }) => id).sort(),
    ["ketamine-syringe-pump-10-mg-ml", "omeprazole-0-4-mg-ml"],
  );

  for (const preset of INFUSION_CONCENTRATION_PRESETS) {
    assert.equal(
      preset.calculatorEnabled,
      preset.reviewStatus === "source_matched",
    );
  }
});

test("marks LASA and independent-check shortcuts explicitly", () => {
  const lasa = INFUSION_CONCENTRATION_PRESETS
    .filter(({ flags }) => flags.includes("lasa"))
    .map(({ id }) => id)
    .sort();
  const independentCheck = INFUSION_CONCENTRATION_PRESETS
    .filter(({ flags }) => flags.includes("independent_check"))
    .map(({ id }) => id)
    .sort();

  assert.deepEqual(lasa, ["dobutamine-5-mg-ml", "dopamine-6000-mcg-ml"]);
  assert.deepEqual(independentCheck, [
    "fentanyl-fluid-restricted-50-mcg-ml",
    "fentanyl-regular-20-mcg-ml",
    "ketamine-standard-2-mg-ml",
    "ketamine-syringe-pump-10-mg-ml",
  ]);
});

test("stores concentration metadata only, never a dose, rate, weight, limit, or titration", () => {
  const allowedFields = [
    "calculatorEnabled",
    "category",
    "concentrationAmountUnit",
    "concentrationUnit",
    "concentrationValue",
    "flags",
    "id",
    "name",
    "reviewStatus",
    "sourceId",
    "sourcePage",
  ].sort();

  for (const preset of INFUSION_CONCENTRATION_PRESETS) {
    assert.deepEqual(Object.keys(preset).sort(), allowedFields);
    for (const forbiddenField of FORBIDDEN_FIELDS) {
      assert.equal(forbiddenField in preset, false, `${preset.id} contains ${forbiddenField}`);
    }
  }
});

test("preserves representative concentrations and their precise source pages", () => {
  assert.deepEqual(getInfusionConcentrationPreset("nitroglycerin-400-mcg-ml"), {
    id: "nitroglycerin-400-mcg-ml",
    name: { ar: "نيتروغليسرين", en: "Nitroglycerin" },
    category: { ar: "موسع للأوعية", en: "Vasodilator" },
    concentrationValue: 400,
    concentrationAmountUnit: "mcg",
    concentrationUnit: "mcg/mL",
    calculatorEnabled: true,
    reviewStatus: "source_matched",
    sourceId: "ksamc-formulary-2025-2026",
    sourcePage: 20,
    flags: [],
  });

  const vasopressin = getInfusionConcentrationPreset("vasopressin-0-4-unit-ml");
  assert.equal(vasopressin.concentrationValue, 0.4);
  assert.equal(vasopressin.concentrationAmountUnit, "unit");
  assert.equal(vasopressin.concentrationUnit, "unit/mL");
  assert.equal(vasopressin.sourcePage, 24);

  const amiodarone = getInfusionConcentrationPreset("amiodarone-1-8-mg-ml");
  assert.equal(amiodarone.concentrationValue, 1.8);
  assert.equal(amiodarone.concentrationUnit, "mg/mL");
  assert.equal(amiodarone.sourcePage, 83);
  assert.equal(getInfusionConcentrationPreset("not-a-preset"), null);
});
