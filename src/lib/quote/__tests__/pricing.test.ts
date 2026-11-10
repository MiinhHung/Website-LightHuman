import { describe, expect, it } from "vitest";
import { PRICING_SEED } from "@/content/quote/pricing.seed";
import { normalizeLine, type RawLine } from "../normalize";
import { priceLine } from "../pricing";
import { isPriceMatch } from "../pricing/types";

const baseRaw: RawLine = {
  industries: ["SAN_XUAT"],
  experience: "NONE",
  region: "DOMESTIC",
  education: "NONE",
  quantity: 1,
};

function priceFor(
  type: "mass" | "hunt",
  overrides: Partial<RawLine> = {},
  seed = PRICING_SEED,
) {
  const line = normalizeLine({ ...baseRaw, ...overrides });
  return priceLine(type, line, seed);
}

describe("priceLine — Mass strategy", () => {
  it("prices the baseline Mass line at the seeded industry base", () => {
    const r = priceFor("mass");
    expect(r.matched).toBe(true);
    if (!isPriceMatch(r)) return;
    expect(r.type).toBe("mass");
    expect(r.currency).toBe("VND");
    // All four factors are 1.0 → base (rounded to nearest 1000) equals seed base.
    expect(r.unitPrice).toBe(PRICING_SEED.mass.baseByIndustry.SAN_XUAT);
    expect(r.subtotal).toBe(r.unitPrice);
    expect(r.breakdown.factors).toHaveLength(4);
    expect(r.breakdown.quantityDiscountMultiplier).toBe(1);
    expect(r.pricingVersion).toBe(PRICING_SEED.version);
  });

  it("uses the MAX base when several industries are selected", () => {
    const r = priceFor("mass", { industries: ["GIAO_DUC", "CNTT"] });
    if (!isPriceMatch(r)) throw new Error("expected match");
    expect(r.breakdown.base).toBe(PRICING_SEED.mass.baseByIndustry.CNTT);
  });

  it("falls back to the seeded industry when some entries are missing", () => {
    // POD is intentionally unseeded; SAN_XUAT is → should still match.
    const r = priceFor("mass", { industries: ["POD", "SAN_XUAT"] });
    expect(r.matched).toBe(true);
  });

  it("returns matched:false when NO selected industry has a seeded base", () => {
    const r = priceFor("mass", { industries: ["POD"] });
    expect(r.matched).toBe(false);
    if (r.matched) return;
    expect(r.type).toBe("mass");
    expect(r.reason).toMatch(/Chưa có/);
    expect(r.pricingVersion).toBe(PRICING_SEED.version);
  });

  it("applies quantity discount bands (highest reached applies)", () => {
    const qty1 = priceFor("mass", { quantity: 1 });
    const qty50 = priceFor("mass", { quantity: 50 });
    const qty100 = priceFor("mass", { quantity: 100 });
    if (!isPriceMatch(qty1) || !isPriceMatch(qty50) || !isPriceMatch(qty100)) {
      throw new Error("expected matches");
    }
    expect(qty1.breakdown.quantityDiscountMultiplier).toBe(1);
    expect(qty50.breakdown.quantityDiscountMultiplier).toBe(0.9);
    expect(qty100.breakdown.quantityDiscountMultiplier).toBe(0.85);
    expect(qty50.unitPrice).toBeLessThan(qty1.unitPrice);
    expect(qty100.unitPrice).toBeLessThan(qty50.unitPrice);
  });

  it("applies the multi-language multiplier for 2+ languages", () => {
    const noLang = priceFor("mass", { languages: [] });
    const oneLang = priceFor("mass", { languages: ["TRUNG"] });
    const multiLang = priceFor("mass", { languages: ["TRUNG", "HAN"] });
    if (!isPriceMatch(noLang) || !isPriceMatch(oneLang) || !isPriceMatch(multiLang)) {
      throw new Error("expected matches");
    }
    expect(oneLang.unitPrice).toBeGreaterThan(noLang.unitPrice);
    expect(multiLang.unitPrice).toBeGreaterThan(oneLang.unitPrice);
  });

  it("applies the overseas region multiplier", () => {
    const home = priceFor("mass", { region: "DOMESTIC" });
    const away = priceFor("mass", { region: "OVERSEAS" });
    if (!isPriceMatch(home) || !isPriceMatch(away)) throw new Error("expected matches");
    expect(away.unitPrice).toBeGreaterThan(home.unitPrice);
  });

  it("rounds unit price to the nearest 1 000 VND", () => {
    const r = priceFor("mass", {
      industries: ["SAN_XUAT"],
      experience: "UNDER_1",
      languages: ["TRUNG"],
    });
    if (!isPriceMatch(r)) throw new Error("expected match");
    expect(r.unitPrice % 1_000).toBe(0);
  });
});

describe("priceLine — Hunt strategy", () => {
  it("prices the baseline Hunt line at the seeded industry base", () => {
    const r = priceFor("hunt");
    if (!isPriceMatch(r)) throw new Error("expected match");
    expect(r.type).toBe("hunt");
    expect(r.unitPrice).toBe(PRICING_SEED.hunt.baseByIndustry.SAN_XUAT);
  });

  it("returns matched:false for a Hunt line with no seeded industry", () => {
    const r = priceFor("hunt", { industries: ["POD"] });
    expect(r.matched).toBe(false);
    if (r.matched) return;
    expect(r.type).toBe("hunt");
  });

  it("experience OVER_3 raises Hunt price significantly", () => {
    const junior = priceFor("hunt", { experience: "NONE" });
    const senior = priceFor("hunt", { experience: "OVER_3" });
    if (!isPriceMatch(junior) || !isPriceMatch(senior)) throw new Error("expected matches");
    expect(senior.unitPrice).toBeGreaterThan(junior.unitPrice);
  });

  it("rounds Hunt unit price to the nearest 100 000 VND", () => {
    const r = priceFor("hunt", {
      industries: ["CNTT"],
      experience: "ONE_TO_THREE",
      education: "DAI_HOC",
      languages: ["TRUNG"],
    });
    if (!isPriceMatch(r)) throw new Error("expected match");
    expect(r.unitPrice % 100_000).toBe(0);
  });

  it("carries the seed version into the result", () => {
    const r = priceFor("hunt");
    if (!isPriceMatch(r)) throw new Error("expected match");
    expect(r.pricingVersion).toBe(PRICING_SEED.version);
  });
});
