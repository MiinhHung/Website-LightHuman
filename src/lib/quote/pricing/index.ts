/**
 * Pricing entry point. Routes a normalized quote line through the strategy
 * matching its (already server-computed) QuoteType.
 */

import { PRICING_SEED } from "@/content/quote/pricing.seed";
import type { QuoteType } from "../classify";
import type { NormalizedLine } from "../normalize";
import { HUNT_STRATEGY } from "./hunt";
import { MASS_STRATEGY } from "./mass";
import type { PriceResult, PricingSeed, PricingStrategy } from "./types";

export const STRATEGIES: Record<QuoteType, PricingStrategy> = {
  mass: MASS_STRATEGY,
  hunt: HUNT_STRATEGY,
};

export function priceLine(
  type: QuoteType,
  line: NormalizedLine,
  seed: PricingSeed = PRICING_SEED,
): PriceResult {
  return STRATEGIES[type].price(line, seed);
}

export * from "./types";
