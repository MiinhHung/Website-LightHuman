/**
 * Personal income tax (thuế TNCN) on employment income, three cases:
 *
 *  - resident   Hợp đồng lao động từ 3 tháng: (thu nhập − miễn thuế − bảo hiểm
 *               − giảm trừ gia cảnh) × biểu lũy tiến.
 *  - short      Không HĐLĐ / HĐ dưới 3 tháng: khấu trừ 10% trên tổng thu nhập
 *               mỗi lần chi trả từ 2.000.000đ (Thông tư 111/2013/TT-BTC).
 *  - nonresident Cá nhân không cư trú: 20% trên thu nhập chịu thuế, không giảm trừ.
 *
 * Pure functions; insurance and brackets come from the Gross ⇄ Net engine.
 */

import { grossToNet, progressiveTax, type BracketRow } from "./calc";
import { salaryRules, type Region, type SalaryRuleSet } from "./rules";

export type PitCase = "resident" | "short" | "nonresident";

export const SHORT_TERM_RATE = 0.1;
/** Withholding applies to each payment of at least this amount. */
export const SHORT_TERM_THRESHOLD = 2_000_000;
export const NON_RESIDENT_RATE = 0.2;

export type PitInput = {
  case: PitCase;
  /** Total monthly employment income (Gross), including the exempt part. */
  income: number;
  /** Tax-exempt part of `income` (overtime premium, hazard allowance…). */
  exempt: number;
  dependents: number;
  region: Region;
  /** `null` = insurance on the full income. Resident case only. */
  insuranceBase: number | null;
  ruleId: SalaryRuleSet["id"];
};

export type PitResult = {
  case: PitCase;
  rules: SalaryRuleSet;
  income: number;
  exempt: number;
  insurance: { social: number; health: number; unemployment: number; total: number };
  /** Thu nhập chịu thuế = thu nhập − phần miễn thuế. */
  taxableIncome: number;
  personalDeduction: number;
  dependentDeduction: number;
  /** Thu nhập tính thuế: the amount the rate or brackets apply to. */
  assessable: number;
  tax: number;
  /** Progressive rows (resident only). */
  brackets: BracketRow[];
  /** Flat rate for the short-term and non-resident cases. */
  flatRate: number | null;
  net: number;
  /** tax / income. */
  effectiveRate: number;
  /** Highest rate the income reaches (0 when no tax). */
  topRate: number;
};

const NO_INSURANCE = { social: 0, health: 0, unemployment: 0, total: 0 };

export function computePit(input: PitInput): PitResult {
  const rules = salaryRules[input.ruleId];
  const income = Math.max(0, input.income);
  const exempt = Math.min(Math.max(0, input.exempt), income);

  if (input.case === "short") {
    const tax = income >= SHORT_TERM_THRESHOLD ? Math.round(income * SHORT_TERM_RATE) : 0;
    return {
      case: "short",
      rules,
      income,
      exempt: 0,
      insurance: NO_INSURANCE,
      taxableIncome: income,
      personalDeduction: 0,
      dependentDeduction: 0,
      assessable: income,
      tax,
      brackets: [],
      flatRate: SHORT_TERM_RATE,
      net: income - tax,
      effectiveRate: income > 0 ? tax / income : 0,
      topRate: tax > 0 ? SHORT_TERM_RATE : 0,
    };
  }

  if (input.case === "nonresident") {
    const taxableIncome = income - exempt;
    const tax = Math.round(taxableIncome * NON_RESIDENT_RATE);
    return {
      case: "nonresident",
      rules,
      income,
      exempt,
      insurance: NO_INSURANCE,
      taxableIncome,
      personalDeduction: 0,
      dependentDeduction: 0,
      assessable: taxableIncome,
      tax,
      brackets: [],
      flatRate: NON_RESIDENT_RATE,
      net: income - tax,
      effectiveRate: income > 0 ? tax / income : 0,
      topRate: tax > 0 ? NON_RESIDENT_RATE : 0,
    };
  }

  const insurance = grossToNet(income, {
    dependents: input.dependents,
    region: input.region,
    insuranceBase: input.insuranceBase,
    ruleId: input.ruleId,
  }).employee;
  const taxableIncome = income - exempt;
  const personalDeduction = rules.personalDeduction;
  const dependentDeduction = rules.dependentDeduction * input.dependents;
  const assessable = Math.max(0, taxableIncome - insurance.total - personalDeduction - dependentDeduction);
  const { tax, rows } = progressiveTax(assessable, rules);
  const reached = rows.filter((r) => r.amount > 0);

  return {
    case: "resident",
    rules,
    income,
    exempt,
    insurance,
    taxableIncome,
    personalDeduction,
    dependentDeduction,
    assessable,
    tax,
    brackets: rows,
    flatRate: null,
    net: income - insurance.total - tax,
    effectiveRate: income > 0 ? tax / income : 0,
    topRate: reached.length ? reached[reached.length - 1].rate : 0,
  };
}

/**
 * Resident tax on the same income under another rule set's deductions and
 * brackets, keeping this result's insurance: isolates the effect of the tax law.
 */
export function taxUnderRules(r: PitResult, dependents: number, ruleId: SalaryRuleSet["id"]): number {
  const rules = salaryRules[ruleId];
  const assessable = Math.max(
    0,
    r.taxableIncome - r.insurance.total - rules.personalDeduction - rules.dependentDeduction * dependents,
  );
  return progressiveTax(assessable, rules).tax;
}

/** Extra tax caused by one more `step` of income (what a raise really costs in tax). */
export function marginalTax(input: PitInput, step = 1_000_000): number {
  return computePit({ ...input, income: input.income + step }).tax - computePit(input).tax;
}

/**
 * Highest monthly income with no tax for a resident (bisection; tax is monotonic
 * in income). Returns the income in đồng, rounded down to the nearest 1.000đ.
 */
export function taxFreeThreshold(input: Omit<PitInput, "income" | "case">): number {
  let lo = 0;
  let hi = 1_000_000_000;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (computePit({ ...input, case: "resident", income: mid, insuranceBase: null }).assessable > 0) hi = mid;
    else lo = mid;
  }
  return Math.floor(lo / 1000) * 1000;
}
