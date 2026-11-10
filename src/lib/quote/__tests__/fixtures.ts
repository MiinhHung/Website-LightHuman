import { draftFees, draftWarrantyPct } from "@/content/quote/fee-schedule";
import type { QuoteType } from "../classify";
import { computeSurcharges } from "../surcharges";
import { SNAPSHOT_VERSION, type LineFees, type QuoteSnapshot, type SnapshotLine } from "../snapshot";

export function makeLine(overrides: Partial<SnapshotLine> & { type?: QuoteType } = {}): SnapshotLine {
  const type = overrides.type ?? "mass";
  const base = {
    type,
    position: "Telesale tài chính",
    quantity: 1,
    industries: ["TAI_CHINH"] as SnapshotLine["industries"],
    languages: [] as SnapshotLine["languages"],
    experience: "NONE" as const,
    region: "DOMESTIC" as const,
    education: "THPT" as const,
    ...overrides,
  };
  return {
    ...base,
    surcharges: overrides.surcharges ?? computeSurcharges(base),
    fees: overrides.fees ?? draftFees(type),
  };
}

export function makeSnapshot(overrides: Partial<QuoteSnapshot> = {}): QuoteSnapshot {
  return {
    v: SNAPSHOT_VERSION,
    code: "BG-261109-AB12",
    createdAt: "2026-11-09T03:00:00.000Z",
    pricingVersion: "2026-11-draft-1",
    contact: { name: "Ms. May", company: "HD SAIGON", email: "may@example.com", phone: "0901234567" },
    discount: null,
    warrantyPct: draftWarrantyPct(),
    lines: [makeLine()],
    ...overrides,
  };
}

/** Mass fees copied from docs/quote-templates/mass-filled-example.png. */
export const MASS_SAMPLE_FEES: LineFees = {
  plan1: [3_690_000, 4_059_000, 5_535_000, 7_380_000].map((amount) => ({ kind: "vnd" as const, amount })),
  plan2: [
    [4_428_000, 4_797_000, 5_535_000],
    [5_092_200, 5_516_550, 6_365_250],
    [5_535_000, 5_996_250, 6_918_750],
  ].map((tier) => tier.map((amount) => ({ kind: "vnd" as const, amount }))),
  floor: null,
};

export const MASS_SAMPLE_WARRANTY = { mass: [15, 25, 50], hunt: [0, 0, 0] };

export function filledHuntFees(): LineFees {
  const cell = { kind: "salary" as const, multiplier: 1.25, minFee: 10_000_000 };
  return {
    plan1: [cell],
    plan2: [0, 1, 2].map(() => [cell, cell, cell, cell]),
    floor: { below: 10_000_000, charge: 10_000_000 },
  };
}
