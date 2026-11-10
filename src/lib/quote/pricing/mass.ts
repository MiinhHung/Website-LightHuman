/**
 * Mass strategy — prices labor-pool placements by industry + quantity band.
 *
 * Returns `matched:false` if no selected industry has a seeded base, so the
 * orchestrator can fall through to `manual_required` instead of inventing a
 * number. Never throws.
 */

import type { NormalizedLine } from "../normalize";
import type { PriceBreakdown, PriceResult, PricingSeed, PricingStrategy } from "./types";

const ROUND_STEP = 1_000;

function pickQuantityMultiplier(
  bands: PricingSeed["mass"]["quantityDiscount"],
  qty: number,
): number {
  // Bands are sorted ascending by `minQty`; take the highest one whose
  // threshold the customer reaches.
  let mult = 1;
  for (const b of bands) {
    if (qty >= b.minQty) mult = b.multiplier;
  }
  return mult;
}

function pickLanguageMultiplier(
  mult: PricingSeed["mass"]["languageMultiplier"],
  languageCount: number,
): number {
  if (languageCount >= 2) return mult.multi;
  if (languageCount === 1) return mult.one;
  return mult.none;
}

export const MASS_STRATEGY: PricingStrategy = {
  type: "mass",
  price(line: NormalizedLine, seed: PricingSeed): PriceResult {
    const { mass, currency, version } = seed;

    // Use MAX base across selected industries: picking a broader focus should
    // not accidentally cheapen the quote.
    const bases = line.industries
      .map((i) => mass.baseByIndustry[i])
      .filter((x): x is number => typeof x === "number");

    if (bases.length === 0) {
      return {
        matched: false,
        type: "mass",
        reason: "Chưa có đơn giá Mass cho tổ hợp ngành nghề này.",
        pricingVersion: version,
      };
    }

    const base = Math.max(...bases);

    const factors: PriceBreakdown["factors"] = [
      { label: "Kinh nghiệm", multiplier: mass.experienceMultiplier[line.experience] },
      { label: "Bằng cấp", multiplier: mass.educationMultiplier[line.education] },
      { label: "Khu vực", multiplier: mass.regionMultiplier[line.region] },
      {
        label: "Ngôn ngữ",
        multiplier: pickLanguageMultiplier(mass.languageMultiplier, line.languages.length),
      },
    ];

    const unitBeforeQuantity = factors.reduce((acc, f) => acc * f.multiplier, base);
    const quantityDiscountMultiplier = pickQuantityMultiplier(mass.quantityDiscount, line.quantity);
    const rawUnit = unitBeforeQuantity * quantityDiscountMultiplier;
    const unitPrice = Math.round(rawUnit / ROUND_STEP) * ROUND_STEP;
    const subtotal = unitPrice * line.quantity;

    return {
      matched: true,
      type: "mass",
      currency,
      unitPrice,
      subtotal,
      breakdown: {
        base,
        factors,
        unitBeforeQuantity,
        quantity: line.quantity,
        quantityDiscountMultiplier,
        unitPrice,
        subtotal,
      },
      pricingVersion: version,
    };
  },
};
