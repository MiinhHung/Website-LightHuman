/**
 * Orchestrator — stitches normalize → classify → price for every line of a
 * validated quote request, and freezes the PDF snapshot.
 *
 * No persistence: the snapshot travels inside the signed download token.
 */

import { ACTIVE_DISCOUNT } from "@/content/quote/discounts";
import { draftFees, draftWarrantyPct } from "@/content/quote/fee-schedule";
import { PRICING_SEED } from "@/content/quote/pricing.seed";
import { classify, type QuoteType } from "./classify";
import { normalizeLine } from "./normalize";
import { priceLine } from "./pricing";
import { isPriceMatch } from "./pricing/types";
import { generateQuoteCode } from "./quote-code";
import type { QuoteInput } from "./schema";
import { SNAPSHOT_VERSION, type QuoteSnapshot, type SnapshotLine } from "./snapshot";
import { computeSurcharges } from "./surcharges";

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
  readonly snapshot: QuoteSnapshot;
};

export function createQuote(input: QuoteInput, now: Date = new Date()): CreateQuoteResult {
  const code = generateQuoteCode(now);
  const createdAt = now.toISOString();

  const snapshotLines: SnapshotLine[] = [];
  const lines: QuoteLineOutcome[] = input.lines.map((raw) => {
    const normalized = normalizeLine(raw);
    const type = classify({
      education: normalized.education,
      experience: normalized.experience,
      languages: normalized.languages,
    });

    snapshotLines.push({
      type,
      position: raw.position,
      quantity: normalized.quantity,
      industries: normalized.industries,
      languages: normalized.languages,
      experience: normalized.experience,
      region: normalized.region,
      education: normalized.education,
      surcharges: computeSurcharges({ type, ...normalized }),
      fees: draftFees(type),
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

  // Aggregate rule: "priced" only when EVERY line matched.
  const status: CreateQuoteResult["status"] = lines.every((l) => l.matched)
    ? "priced"
    : "manual_required";

  const snapshot: QuoteSnapshot = {
    v: SNAPSHOT_VERSION,
    code,
    createdAt,
    pricingVersion: PRICING_SEED.version,
    contact: {
      name: input.contact.name,
      company: input.contact.company,
      email: input.contact.email ?? "",
      phone: input.contact.phone ?? "",
    },
    discount: ACTIVE_DISCOUNT,
    warrantyPct: draftWarrantyPct(),
    lines: snapshotLines,
  };

  return {
    code,
    createdAt,
    status,
    type: lines[0].type,
    lines,
    snapshot,
  };
}
