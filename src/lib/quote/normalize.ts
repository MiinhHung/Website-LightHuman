/**
 * Normalize a raw quote line into a canonical shape before classification and
 * pricing. Keeps dedupe, order preservation, and the "multi-language" flag in
 * one place so the pricing matrix and PDF never re-derive them.
 */

import type {
  EducationValue,
  ExperienceValue,
  IndustryValue,
  LanguageValue,
  RegionValue,
} from "@/content/quote/catalog";

export type RawLine = {
  readonly industries: readonly IndustryValue[];
  readonly languages?: readonly LanguageValue[];
  readonly experience: ExperienceValue;
  readonly region: RegionValue;
  readonly education: EducationValue;
  readonly quantity: number;
};

export type NormalizedLine = {
  readonly industries: readonly IndustryValue[];
  readonly languages: readonly LanguageValue[];
  readonly experience: ExperienceValue;
  readonly region: RegionValue;
  readonly education: EducationValue;
  readonly quantity: number;
  /** Auto-derived: true when the customer asked for ≥ 2 languages. */
  readonly multiLanguage: boolean;
};

function uniq<T>(xs: readonly T[]): T[] {
  // Preserve first-occurrence order so the UI/PDF ordering stays stable.
  return Array.from(new Set(xs));
}

export function normalizeLine(raw: RawLine): NormalizedLine {
  const industries = uniq(raw.industries);
  const languages = uniq(raw.languages ?? []);
  return {
    industries,
    languages,
    experience: raw.experience,
    region: raw.region,
    education: raw.education,
    quantity: raw.quantity,
    multiLanguage: languages.length >= 2,
  };
}
