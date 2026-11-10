/**
 * Pure Mass/Hunt classifier.
 *
 * Shared by the client-side preview inside <QuoteBuilder /> and by the server-side
 * quote orchestrator. The server always runs this again — the client result is
 * advisory and NEVER trusted as input.
 */

import type { EducationValue, ExperienceValue, LanguageValue } from "@/content/quote/catalog";
import { RULES, type ClassificationRules } from "@/content/quote/classification";

export type QuoteType = "mass" | "hunt";

export type ClassifyInput = {
  readonly education: EducationValue;
  readonly experience: ExperienceValue;
  readonly languages: readonly LanguageValue[];
};

export function classify(input: ClassifyInput, rules: ClassificationRules = RULES): QuoteType {
  if (rules.huntEducation.includes(input.education)) return "hunt";
  if (rules.huntExperience.includes(input.experience)) return "hunt";
  if (rules.huntOnAnyLanguage && input.languages.length > 0) return "hunt";
  return "mass";
}
