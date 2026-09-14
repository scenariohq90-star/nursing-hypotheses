import { getInfusionConcentrationPreset } from "../data/infusion-presets.js";
import { calculateInfusionRate } from "./infusion-calculator.js";

export function calculatePresetInfusionRate(presetId, input = {}) {
  const preset = getInfusionConcentrationPreset(presetId);

  if (!preset) {
    return { ok: false, errors: { medicineId: "unknownPreset" } };
  }
  if (!preset.calculatorEnabled) {
    return { ok: false, errors: { calculation: "presetLocked" } };
  }

  return calculateInfusionRate({
    rateValue: input.rateValue,
    rateUnit: input.rateUnit,
    weightKg: input.weightKg,
    concentrationValue: preset.concentrationValue,
    concentrationAmountUnit: preset.concentrationAmountUnit,
  });
}
