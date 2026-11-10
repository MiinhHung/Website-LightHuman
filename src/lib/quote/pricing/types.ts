/**
 * Pricing engine types.
 *
 * The engine is a strategy-per-type function set (`mass`, `hunt`) sharing a
 * single seed shape. A strategy either returns a priced result or a no-match
 * result — it NEVER throws, so `create-quote` can safely fall through to the
 * `manual_required` path.
 *
 * NOTE: the actual formulas are MẪU / placeholder. The shape of the seed is
 * what matters for downstream code; BA will replace the numbers later.
 */

import type {
  EducationValue,
  ExperienceValue,
  IndustryValue,
  RegionValue,
} from "@/content/quote/catalog";
import type { QuoteType } from "../classify";
import type { NormalizedLine } from "../normalize";

export type Currency = "VND";

export type PriceFactor = {
  /** Vietnamese label used in the PDF breakdown row. */
  readonly label: string;
  readonly multiplier: number;
};

export type PriceBreakdown = {
  readonly base: number;
  readonly factors: readonly PriceFactor[];
  readonly unitBeforeQuantity: number;
  readonly quantity: number;
  readonly quantityDiscountMultiplier: number;
  readonly unitPrice: number;
  readonly subtotal: number;
};

export type PriceMatch = {
  readonly matched: true;
  readonly type: QuoteType;
  readonly currency: Currency;
  readonly unitPrice: number;
  readonly subtotal: number;
  readonly breakdown: PriceBreakdown;
  readonly pricingVersion: string;
};

export type PriceNoMatch = {
  readonly matched: false;
  readonly type: QuoteType;
  readonly reason: string;
  readonly pricingVersion: string;
};

export type PriceResult = PriceMatch | PriceNoMatch;

export function isPriceMatch(r: PriceResult): r is PriceMatch {
  return r.matched === true;
}

// -- Seed shape -------------------------------------------------------------

export type IndustryBaseMap = Partial<Record<IndustryValue, number>>;

export type LanguageMultiplier = {
  readonly none: number;
  readonly one: number;
  readonly multi: number;
};

/**
 * Quantity discount band: the highest band whose `minQty <= quantity` applies.
 * Bands must be sorted by `minQty` ascending.
 */
export type QuantityBand = {
  readonly minQty: number;
  readonly multiplier: number;
};

export type TypePricing = {
  readonly baseByIndustry: IndustryBaseMap;
  readonly experienceMultiplier: Record<ExperienceValue, number>;
  readonly educationMultiplier: Record<EducationValue, number>;
  readonly regionMultiplier: Record<RegionValue, number>;
  readonly languageMultiplier: LanguageMultiplier;
  readonly quantityDiscount: readonly QuantityBand[];
};

export type PricingSeed = {
  /** Version string stored in every signed snapshot so BA can tell which seed priced a quote. */
  readonly version: string;
  /** Disclaimer embedded in the PDF footer while seed is a draft. */
  readonly disclaimer: string;
  readonly currency: Currency;
  readonly mass: TypePricing;
  readonly hunt: TypePricing;
};

export type PricingStrategy = {
  readonly type: QuoteType;
  price(line: NormalizedLine, seed: PricingSeed): PriceResult;
};
