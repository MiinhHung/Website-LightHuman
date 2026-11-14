import type {
  Currency,
  EducationValue,
  ExperienceValue,
  IndustryValue,
  QuoteType,
  RegionValue,
} from "./quote";
import type { NormalizedLine } from "@/lib/quote/normalize";

export type PriceFactor = {
  readonly code: string;
  readonly label: string;
  readonly rate: number;
};

export type PriceBreakdown = {
  readonly baseVnd: number;
  readonly factors: readonly PriceFactor[];
  readonly unitVnd: number;
  readonly lineTotalVnd: number;
};

export type PriceMatch = {
  readonly matched: true;
  readonly fee: number;
  readonly breakdown?: PriceBreakdown;
};

export type PriceNoMatch = {
  readonly matched: false;
  readonly reason: "unsupported_industry" | "out_of_bounds" | "manual_required";
  readonly message?: string;
};

export type PriceResult = PriceMatch | PriceNoMatch;

export type IndustryBaseMap = Partial<Record<IndustryValue, number>>;

export type LanguageMultiplier = {
  readonly none: number;
  readonly one: number;
  readonly multi: number;
};

export type PricingQuantityBand = {
  readonly minQty: number;
  readonly multiplier: number;
};

export type TypePricing = {
  readonly baseByIndustry: IndustryBaseMap;
  readonly experienceMultiplier: Record<ExperienceValue, number>;
  readonly educationMultiplier: Record<EducationValue, number>;
  readonly regionMultiplier: Record<RegionValue, number>;
  readonly languageMultiplier: LanguageMultiplier;
  readonly quantityDiscount: readonly PricingQuantityBand[];
};

export type PricingSeed = {
  readonly version: string;
  readonly disclaimer: string;
  readonly currency: Currency;
  readonly mass: TypePricing;
  readonly hunt: TypePricing;
};

export type PricingStrategy = {
  readonly type: QuoteType;
  price(line: NormalizedLine, seed: PricingSeed): PriceResult;
};
