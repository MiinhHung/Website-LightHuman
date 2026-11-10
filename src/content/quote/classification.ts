/**
 * Mass vs. Hunt classification rules.
 *
 * Expressed as data so BA can tune without touching logic.
 * Rules (ASSUMED, TODO(BA)): a line is Hunt if ANY of the following holds:
 *   1. degree is in a "hunt tier" (CAO_DANG / DAI_HOC / SAU_DAI_HOC), or
 *   2. experience is in a "hunt tier" (ONE_TO_THREE / OVER_3), or
 *   3. the customer picked at least one foreign language.
 * Otherwise the line is Mass.
 */

import type { EducationValue, ExperienceValue } from "./catalog";

export type ClassificationRules = {
  readonly huntEducation: readonly EducationValue[];
  readonly huntExperience: readonly ExperienceValue[];
  readonly huntOnAnyLanguage: boolean;
};

export const RULES: ClassificationRules = {
  huntEducation: ["CAO_DANG", "DAI_HOC", "SAU_DAI_HOC"],
  huntExperience: ["ONE_TO_THREE", "OVER_3"],
  huntOnAnyLanguage: true,
};
