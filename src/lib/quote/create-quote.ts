/**
 * Orchestrator — stitches normalize → classify → price for every line of a
 * validated quote request.
 *
 * Phase 3 minimal variant: no persistence, no PDF, no webhook. Those arrive in
 * phase 5–6 via the token/notifier/repository modules. The shape of the result
 * here is already stable so the Server Action and the UI can be built against
 * it.
 */

import { classify, type QuoteType } from "./classify";
import { normalizeLine } from "./normalize";
import { priceLine } from "./pricing";
import { isPriceMatch } from "./pricing/types";
import { generateQuoteCode } from "./quote-code";
import type { QuoteInput } from "./schema";

export type QuoteLineOutcome = {
  readonly type: QuoteType;
  readonly matched: boolean;
  readonly unitPrice?: number;
  readonly subtotal?: number;
  readonly quantity: number;
  readonly currency?: "VND";
  readonly reason?: string;
  readonly pricingVersion: string;
};

export type CreateQuoteResult = {
  readonly code: string;
  readonly createdAt: string;
  readonly status: "priced" | "manual_required";
  readonly type: QuoteType;
  readonly lines: readonly QuoteLineOutcome[];
};

export function createQuote(input: QuoteInput): CreateQuoteResult {
  const code = generateQuoteCode();
  const createdAt = new Date().toISOString();

  const lines: QuoteLineOutcome[] = input.lines.map((raw) => {
    const normalized = normalizeLine(raw);
    const type = classify({
      education: normalized.education,
      experience: normalized.experience,
      languages: normalized.languages,
    });
    const priced = priceLine(type, normalized);
    if (isPriceMatch(priced)) {
      return {
        type,
        matched: true,
        unitPrice: priced.unitPrice,
        subtotal: priced.subtotal,
        quantity: normalized.quantity,
        currency: priced.currency,
        pricingVersion: priced.pricingVersion,
      };
    }
    return {
      type,
      matched: false,
      quantity: normalized.quantity,
      reason: priced.reason,
      pricingVersion: priced.pricingVersion,
    };
  });

  // Phase 1 UI submits one line; the shape supports more.
  // Aggregate rule: "priced" only when EVERY line matched.
  const status: CreateQuoteResult["status"] = lines.every((l) => l.matched)
    ? "priced"
    : "manual_required";

  return {
    code,
    createdAt,
    status,
    type: lines[0].type,
    lines,
  };
}
