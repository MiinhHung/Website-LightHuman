import { INDUSTRY_LABELS, LANGUAGE_LABELS, type IndustryValue, type LanguageValue } from "@/content/quote/catalog";
import {
  INDUSTRY_SURCHARGE_GROUPS,
  LANGUAGE_SURCHARGE_PCT,
  QUANTITY_SURCHARGE_BANDS,
  SURCHARGE_LABELS,
} from "@/content/quote/surcharges";
import type { QuoteType } from "./classify";
import type { AppliedSurcharge } from "./snapshot";

export type SurchargeInput = {
  readonly type: QuoteType;
  readonly quantity: number;
  readonly industries: readonly IndustryValue[];
  readonly languages: readonly LanguageValue[];
};

/** Lists triggered surcharges; deliberately never combines them (TODO(BA)). */
export function computeSurcharges(line: SurchargeInput): AppliedSurcharge[] {
  const out: AppliedSurcharge[] = [];

  if (line.type === "mass") {
    const band = QUANTITY_SURCHARGE_BANDS.find(
      (b) => line.quantity >= b.min && (b.max === null || line.quantity < b.max),
    );
    if (band) out.push({ id: `quantity-${band.min}`, label: band.label, pct: band.pct });
  }

  for (const group of INDUSTRY_SURCHARGE_GROUPS) {
    const hits = line.industries.filter((i) => group.industries.includes(i));
    if (hits.length > 0) {
      out.push({
        id: group.id,
        label: `${SURCHARGE_LABELS.industry} (${hits.map((i) => INDUSTRY_LABELS[i]).join(", ")})`,
        pct: group.pct,
      });
    }
  }

  if (line.languages.length > 0) {
    out.push({
      id: "language",
      label: `${SURCHARGE_LABELS.language} (${line.languages.map((l) => LANGUAGE_LABELS[l]).join(", ")})`,
      pct: LANGUAGE_SURCHARGE_PCT,
    });
  }

  return out;
}
