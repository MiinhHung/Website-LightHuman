/**
 * Fee values printed in the PDF tables. Every amount is `null` for now — BD
 * fills prices later. Shapes follow `TABLE_LAYOUT`, so lengths always match.
 *
 * TODO(BA): fees are expected to depend on the dragged-in criteria (industry,
 * experience, …). Fees are resolved per line in create-quote and frozen in
 * the snapshot, so a criteria-based lookup can replace `draftFees` there.
 *
 * Observation from mass-filled-example.png (NOT implemented, for BA): plan 1
 * 7/14/30 ngày ≈ 3 ngày × 1.1 / 1.5 / 2; plan 2 rows ≈ ×1.2/1.3/1.5 and tiers ×1.15/×1.25.
 */

import type { QuoteType } from "@/lib/quote/classify";
import type { FeeCellValue, LineFees } from "@/lib/quote/snapshot";
import { TABLE_LAYOUT } from "./tableLayout";

// TODO(BA): the filled Mass example shows 15% / 25% / 50% for 3 / 7 / 14 ngày.
const WARRANTY_PCT: Record<QuoteType, readonly (number | null)[]> = {
  mass: [null, null, null],
  hunt: [null, null, null],
};

function emptyCell(type: QuoteType): FeeCellValue {
  return TABLE_LAYOUT[type].feeKind === "vnd"
    ? { kind: "vnd", amount: null }
    : { kind: "salary", multiplier: null, minFee: null };
}

export function draftFees(type: QuoteType): LineFees {
  const layout = TABLE_LAYOUT[type];
  return {
    plan1: layout.plan1.feeColumns.map(() => emptyCell(type)),
    plan2: layout.plan2.tiers.map(() => layout.plan2.feeColumns.map(() => emptyCell(type))),
    floor: layout.showMinimumFee ? { below: null, charge: null } : null,
  };
}

export function draftWarrantyPct(): Record<QuoteType, (number | null)[]> {
  return {
    mass: TABLE_LAYOUT.mass.warranty.rows.map((_, i) => WARRANTY_PCT.mass[i] ?? null),
    hunt: TABLE_LAYOUT.hunt.warranty.rows.map((_, i) => WARRANTY_PCT.hunt[i] ?? null),
  };
}
