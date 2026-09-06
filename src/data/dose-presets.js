export const namedDosePresets = Object.freeze([
  Object.freeze({
    id: "paracetamol",
    stockStrengthMg: 120,
    stockVolumeMl: 5,
    label: Object.freeze({
      en: "Paracetamol oral liquid (Fevadol / Panadol) — 120 mg / 5 mL",
      ar: "باراسيتامول شراب (فيفادول / بنادول) — 120 mg / 5 mL",
    }),
  }),
  Object.freeze({
    id: "ibuprofen",
    stockStrengthMg: 100,
    stockVolumeMl: 5,
    label: Object.freeze({
      en: "Ibuprofen oral liquid (Brufen) — 100 mg / 5 mL",
      ar: "إيبوبروفين شراب (بروفين) — 100 mg / 5 mL",
    }),
  }),
  Object.freeze({
    id: "custom",
    stockStrengthMg: null,
    stockVolumeMl: null,
    label: Object.freeze({
      en: "Another medicine — enter the exact label concentration",
      ar: "دواء آخر — أدخل تركيز الملصق الفعلي",
    }),
  }),
]);

const PRESETS_BY_ID = new Map(namedDosePresets.map((preset) => [preset.id, preset]));

export function getNamedDosePreset(presetId) {
  return PRESETS_BY_ID.get(presetId) ?? PRESETS_BY_ID.get("custom");
}
