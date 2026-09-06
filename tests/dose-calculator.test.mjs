import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { calculateDosePractice, gradeDosePracticeAnswer, parseDoseDecimal } from "../src/lib/dose-calculator.js";
import { dosePracticeExercises } from "../src/data/dose-practice.js";

test("calculates a fictional mg/kg/dose exercise in two explicit steps", () => {
  const result = calculateDosePractice({
    weightKg: "12",
    orderedMgPerKg: "15",
    stockStrengthMg: "120",
    stockVolumeMl: "5",
  });

  assert.equal(result.ok, true);
  assert.equal(result.requiredDoseMg, 180);
  assert.equal(result.calculatedVolumeMl, 7.5);
});

test("accepts Arabic-Indic digits and the Arabic decimal mark", () => {
  assert.equal(parseDoseDecimal("١٢٫٥"), 12.5);
  assert.equal(parseDoseDecimal("۱۲٫۵"), 12.5);
});

test("rejects missing, non-decimal, zero and out-of-limit inputs", () => {
  const result = calculateDosePractice({
    weightKg: "",
    orderedMgPerKg: "15mg",
    stockStrengthMg: "0",
    stockVolumeMl: "1,000",
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, {
    weightKg: "required",
    orderedMgPerKg: "invalid",
    stockStrengthMg: "outsideLimits",
    stockVolumeMl: "invalid",
  });
});

test("blocks calculated volumes outside the arithmetic training boundary", () => {
  const result = calculateDosePractice({
    weightKg: "300",
    orderedMgPerKg: "1000",
    stockStrengthMg: "1",
    stockVolumeMl: "1000",
  });

  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, { calculation: "outsideLimits" });
});

test("grades both learner answers against an authored fictional exercise", () => {
  const result = gradeDosePracticeAnswer(dosePracticeExercises[0], {
    requiredDoseMg: "١٨٠",
    calculatedVolumeMl: "٧٫٥",
  });

  assert.equal(result.ok, true);
  assert.equal(result.isFullyCorrect, true);
  assert.deepEqual(result.correct, { requiredDoseMg: true, calculatedVolumeMl: true });
});

test("reports each arithmetic answer independently", () => {
  const result = gradeDosePracticeAnswer(dosePracticeExercises[0], {
    requiredDoseMg: "180",
    calculatedVolumeMl: "5",
  });

  assert.equal(result.ok, true);
  assert.equal(result.isFullyCorrect, false);
  assert.deepEqual(result.correct, { requiredDoseMg: true, calculatedVolumeMl: false });
});

test("every authored exercise is generic and mathematically valid", () => {
  assert.ok(dosePracticeExercises.length >= 5);
  for (const exercise of dosePracticeExercises) {
    assert.match(exercise.id, /^fictional-/);
    assert.ok(exercise.label.en.includes("Fictional"));
    assert.ok(exercise.label.ar.includes("الخيالي"));
    assert.equal(calculateDosePractice(exercise).ok, true);
  }
});

test("the public page avoids named-drug presets and states the educational boundary bilingually", async () => {
  const [source, appSource] = await Promise.all([
    readFile(new URL("../src/components/MedicationMathPage.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(source, /paracetamol|ibuprofen/i);
  assert.match(source, /not a dose recommendation/i);
  assert.match(source, /وليس توصية بجرعة/);
  assert.match(source, /must not be used to calculate or verify a real patient's medication/i);
  assert.match(source, /لا يجوز استخدامه لحساب دواء مريض حقيقي أو التحقق منه/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
  assert.match(appSource, /\["dose-practice", "dosePractice", Calculator\]/);
  assert.match(appSource, /route\.page === "dose-practice"/);
});
