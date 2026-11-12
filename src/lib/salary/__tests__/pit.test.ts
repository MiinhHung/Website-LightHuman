import { describe, expect, it } from "vitest";
import { computePit, marginalTax, taxFreeThreshold, taxUnderRules, type PitInput } from "../pit";

const base: PitInput = {
  case: "resident",
  income: 30_000_000,
  exempt: 0,
  dependents: 1,
  region: 1,
  insuranceBase: null,
  ruleId: "2026",
};

describe("computePit — resident", () => {
  it("matches the published example: 30M gross, 1 dependent, 2026 rules", () => {
    const r = computePit(base);
    expect(r.insurance.total).toBe(3_150_000);
    expect(r.assessable).toBe(5_150_000);
    expect(r.tax).toBe(257_500);
    expect(r.net).toBe(26_592_500);
    expect(r.topRate).toBe(0.05);
  });

  it("subtracts exempt income from taxable income but not from the insurance base", () => {
    const r = computePit({ ...base, exempt: 2_000_000 });
    expect(r.insurance.total).toBe(3_150_000);
    expect(r.assessable).toBe(3_150_000);
    expect(r.tax).toBe(157_500);
  });

  it("caps exempt income at the income itself", () => {
    expect(computePit({ ...base, income: 5_000_000, exempt: 9_000_000 }).taxableIncome).toBe(0);
  });

  it("reports the old-law tax on the same insurance (7 brackets, 11M / 4.4M)", () => {
    expect(taxUnderRules(computePit(base), 1, "2025")).toBe(967_500);
  });

  it("finds the tax-free threshold for 0 dependents (≈ 17,32 triệu)", () => {
    expect(taxFreeThreshold({ exempt: 0, dependents: 0, region: 1, insuranceBase: null, ruleId: "2026" })).toBe(17_318_000);
  });

  it("marginal tax of +1M in the 5% bracket is 5% of the post-insurance raise", () => {
    expect(marginalTax(base)).toBe(Math.round((1_000_000 - 105_000) * 0.05));
  });
});

describe("computePit — flat cases", () => {
  it("withholds 10% on short-term payments from 2M", () => {
    expect(computePit({ ...base, case: "short", income: 20_000_000 }).tax).toBe(2_000_000);
    expect(computePit({ ...base, case: "short", income: 1_999_000 }).tax).toBe(0);
  });

  it("taxes non-residents 20% of taxable income with no deductions", () => {
    const r = computePit({ ...base, case: "nonresident", exempt: 1_000_000 });
    expect(r.tax).toBe(5_800_000);
    expect(r.personalDeduction).toBe(0);
    expect(r.insurance.total).toBe(0);
  });
});
