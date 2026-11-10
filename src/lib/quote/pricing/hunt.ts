/**
 * Hunt strategy — prices headhunt placements as a per-position fee.
 *
 * Mirrors the Mass strategy's shape (same multiplier layout, same no-match
 * contract) so the orchestrator treats both uniformly. The formula here is a
 * placeholder; BA will later swap in the real one (TODO(BA): the real Hunt
 * price typically depends on target salary, which is NOT collected in Phase 1).
 */

import type { NormalizedLine } from "../normalize";
import type { PriceBreakdown, PriceResult, PricingSeed, PricingStrategy } from "./types";

const ROUND_STEP = 100_000;

function pickQuantityMultiplier(
  bands: PricingSeed["hunt"]["quantityDiscount"],
  qty: number,
): number {
  let mult = 1;
  for (const b of bands) {
    if (qty >= b.minQty) mult = b.multiplier;
  }
  return mult;
}

function pickLanguageMultiplier(
  mult: PricingSeed["hunt"]["languageMultiplier"],
  languageCount: number,
): number {
  if (languageCount >= 2) return mult.multi;
  if (languageCount === 1) return mult.one;
  return mult.none;
}

export const HUNT_STRATEGY: PricingStrategy = {
  type: "hunt",
  price(line: NormalizedLine, seed: PricingSeed): PriceResult {
    const { hunt, currency, version } = seed;

    const bases = line.industries
      .map((i) => hunt.baseByIndustry[i])
      .filter((x): x is number => typeof x === "number");

    if (bases.length === 0) {
      return {
        matched: false,
        type: "hunt",
        reason: "Chưa có đơn giá Hunt cho tổ hợp ngành nghề này.",
        pricingVersion: version,
      };
    }

    const base = Math.max(...bases);

    const factors: PriceBreakdown["factors"] = [
      { label: "Kinh nghiệm", multiplier: hunt.experienceMultiplier[line.experience] },
      { label: "Bằng cấp", multiplier: hunt.educationMultiplier[line.education] },
      { label: "Khu vực", multiplier: hunt.regionMultiplier[line.region] },
      {
        label: "Ngôn ngữ",
        multiplier: pickLanguageMultiplier(hunt.languageMultiplier, line.languages.length),
      },
    ];

    const unitBeforeQuantity = factors.reduce((acc, f) => acc * f.multiplier, base);
    const quantityDiscountMultiplier = pickQuantityMultiplier(hunt.quantityDiscount, line.quantity);
    const rawUnit = unitBeforeQuantity * quantityDiscountMultiplier;
    const unitPrice = Math.round(rawUnit / ROUND_STEP) * ROUND_STEP;
    const subtotal = unitPrice * line.quantity;

    return {
      matched: true,
      type: "hunt",
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
