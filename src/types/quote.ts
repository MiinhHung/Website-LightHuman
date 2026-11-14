import type {
  EducationValue,
  ExperienceValue,
  GroupKey,
  IndustryValue,
  LanguageValue,
  Option,
  RegionValue,
} from "@/content/quote/catalog";
import type { QuoteType } from "@/lib/quote/classify";
import type { DiscountProgram } from "@/content/quote/discounts";

export type {
  EducationValue,
  ExperienceValue,
  GroupKey,
  IndustryValue,
  LanguageValue,
  Option,
  RegionValue,
  QuoteType,
  DiscountProgram,
};

export type Currency = "VND";

export type FeeCellValue =
  | { readonly kind: "vnd"; readonly amount: number | null }
  | { readonly kind: "salary"; readonly multiplier: number | null; readonly minFee: number | null };

export type LineFees = {
  readonly plan1: readonly FeeCellValue[];
  /** [tier][column] */
  readonly plan2: readonly (readonly FeeCellValue[])[];
  /** Hunt "Mức sàn"; null when the type has no minimum-fee block. */
  readonly floor: { readonly below: number | null; readonly charge: number | null } | null;
};

export type AppliedSurcharge = {
  readonly id: string;
  readonly label: string;
  readonly pct: number;
};

export type SnapshotLine = {
  readonly type: QuoteType;
  readonly position: string;
  readonly quantity: number;
  readonly industries: readonly IndustryValue[];
  readonly languages: readonly LanguageValue[];
  readonly experience: ExperienceValue;
  readonly region: RegionValue;
  readonly education: EducationValue;
  readonly surcharges: readonly AppliedSurcharge[];
  readonly fees: LineFees;
};

export type QuoteSnapshot = {
  readonly v: number;
  readonly code: string;
  readonly createdAt: string;
  readonly pricingVersion: string;
  readonly contact: {
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly company: string;
  };
  readonly discount: DiscountProgram | null;
  readonly lines: readonly SnapshotLine[];
};
