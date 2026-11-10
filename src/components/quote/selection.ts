import type {
  EducationValue,
  ExperienceValue,
  GroupKey,
  IndustryValue,
  LanguageValue,
  RegionValue,
} from "@/content/quote/catalog";

export type SelectedState = {
  industries: readonly IndustryValue[];
  languages: readonly LanguageValue[];
  experience: ExperienceValue | null;
  region: RegionValue | null;
  education: EducationValue | null;
};

export const EMPTY_SELECTED: SelectedState = {
  industries: [],
  languages: [],
  experience: null,
  region: null,
  education: null,
};

export function valuesForGroup(s: SelectedState, key: GroupKey): string[] {
  switch (key) {
    case "industries":
      return [...s.industries];
    case "languages":
      return [...s.languages];
    case "experience":
      return s.experience ? [s.experience] : [];
    case "region":
      return s.region ? [s.region] : [];
    case "education":
      return s.education ? [s.education] : [];
  }
}

export function isValueSelected(s: SelectedState, key: GroupKey, value: string): boolean {
  return valuesForGroup(s, key).includes(value);
}

export function applyAdd(s: SelectedState, key: GroupKey, value: string): SelectedState {
  switch (key) {
    case "industries": {
      const v = value as IndustryValue;
      return s.industries.includes(v) ? s : { ...s, industries: [...s.industries, v] };
    }
    case "languages": {
      const v = value as LanguageValue;
      return s.languages.includes(v) ? s : { ...s, languages: [...s.languages, v] };
    }
    case "experience":
      return { ...s, experience: value as ExperienceValue };
    case "region":
      return { ...s, region: value as RegionValue };
    case "education":
      return { ...s, education: value as EducationValue };
  }
}

export function applyRemove(s: SelectedState, key: GroupKey, value: string): SelectedState {
  switch (key) {
    case "industries":
      return { ...s, industries: s.industries.filter((v) => v !== value) };
    case "languages":
      return { ...s, languages: s.languages.filter((v) => v !== value) };
    case "experience":
      return { ...s, experience: null };
    case "region":
      return { ...s, region: null };
    case "education":
      return { ...s, education: null };
  }
}
