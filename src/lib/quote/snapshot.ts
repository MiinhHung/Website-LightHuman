/**
 * Quote snapshot — everything the PDF needs, frozen at creation time and
 * carried inside the signed download token (there is no database).
 * Bump `v` on any breaking shape change; old tokens then fail verification.
 */

import type {
  EducationValue,
  ExperienceValue,
  IndustryValue,
  LanguageValue,
  RegionValue,
} from "@/content/quote/catalog";
import type { DiscountProgram } from "@/content/quote/discounts";
import type { QuoteType } from "./classify";

export const SNAPSHOT_VERSION = 1;

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
  readonly v: typeof SNAPSHOT_VERSION;
  readonly code: string;
  /** ISO-8601 UTC. */
  readonly createdAt: string;
  readonly pricingVersion: string;
  readonly contact: {
    readonly name: string;
    readonly company: string;
    readonly email: string;
    readonly phone: string;
  };
  readonly discount: DiscountProgram | null;
  /** The template has one warranty table per document, so it is per type, not per line. */
  readonly warrantyPct: Readonly<Record<QuoteType, readonly (number | null)[]>>;
  readonly lines: readonly SnapshotLine[];
};

function cellComplete(c: FeeCellValue): boolean {
  return c.kind === "vnd" ? c.amount !== null : c.multiplier !== null && c.minFee !== null;
}

export function isLineFeesComplete(fees: LineFees): boolean {
  return (
    fees.plan1.every(cellComplete) &&
    fees.plan2.every((tier) => tier.every(cellComplete)) &&
    (fees.floor === null || (fees.floor.below !== null && fees.floor.charge !== null))
  );
}

export function isDiscountComplete(d: DiscountProgram | null): boolean {
  return d === null || (d.pct !== null && d.capPerCandidate !== null);
}

/**
 * True when every price the PDF(s) would print is filled. With `type`, only
 * that document is checked; otherwise every type present in the snapshot.
 */
export function isPricingComplete(snapshot: QuoteSnapshot, type?: QuoteType): boolean {
  const lines = type ? snapshot.lines.filter((l) => l.type === type) : snapshot.lines;
  const types = new Set(lines.map((l) => l.type));
  return (
    isDiscountComplete(snapshot.discount) &&
    [...types].every((t) => snapshot.warrantyPct[t].every((p) => p !== null)) &&
    lines.every((l) => isLineFeesComplete(l.fees))
  );
}
