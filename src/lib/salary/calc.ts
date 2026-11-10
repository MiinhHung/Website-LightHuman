/**
 * Lõi tính lương Gross ⇄ Net (hàm thuần, không phụ thuộc React — dùng chung cho
 * máy tính, so sánh offer và kiểm thử).
 *
 * Gross → Net:
 *   Bảo hiểm NLĐ   = 8% BHXH + 1,5% BHYT (trên min(lương đóng BH, 20 × lương cơ sở))
 *                  + 1% BHTN (trên min(lương đóng BH, 20 × lương tối thiểu vùng))
 *   Thu nhập trước thuế = Gross − Bảo hiểm NLĐ
 *   Thu nhập tính thuế  = max(0, Thu nhập trước thuế − giảm trừ bản thân − giảm trừ NPT)
 *   Thuế TNCN           = biểu lũy tiến từng phần
 *   Net                 = Thu nhập trước thuế − Thuế TNCN
 *
 * Net → Gross: giải ngược từng đoạn tuyến tính (không lặp dò), sau đó chỉnh ±vài đồng
 * để bù sai số làm tròn của từng khoản bảo hiểm.
 */

import { salaryRules, socialCap, unemploymentCap, type Region, type SalaryRuleSet } from "./rules";

export type SalaryInput = {
  /** Số tiền người dùng nhập — là Gross hoặc Net tùy `mode`. */
  amount: number;
  mode: "gross-to-net" | "net-to-gross";
  dependents: number;
  region: Region;
  /** `null` = đóng bảo hiểm trên lương chính thức (Gross). */
  insuranceBase: number | null;
  ruleId: SalaryRuleSet["id"];
};

export type BracketRow = {
  from: number;
  to: number;
  rate: number;
  /** Phần thu nhập rơi vào bậc này. */
  amount: number;
  tax: number;
};

export type SalaryResult = {
  rules: SalaryRuleSet;
  gross: number;
  net: number;
  insuranceBase: number;
  employee: { social: number; health: number; unemployment: number; total: number };
  preTax: number;
  personalDeduction: number;
  dependentDeduction: number;
  taxable: number;
  tax: number;
  brackets: BracketRow[];
  employer: { social: number; accident: number; health: number; unemployment: number; total: number };
  /** Tổng chi phí doanh nghiệp = Gross + phần bảo hiểm doanh nghiệp đóng. */
  employerCost: number;
  /** Lương tối thiểu của vùng đang chọn. */
  regionalMinimum: number;
  /** Lương đóng BH thấp hơn lương tối thiểu vùng — cảnh báo cho người dùng. */
  belowRegionalMinimum: boolean;
};

const round = Math.round;

export function progressiveTax(taxable: number, rules: SalaryRuleSet): { tax: number; rows: BracketRow[] } {
  let from = 0;
  let tax = 0;
  const rows = rules.brackets.map(({ upTo, rate }) => {
    const amount = Math.max(0, Math.min(taxable, upTo) - from);
    const t = amount * rate;
    tax += t;
    const row = { from, to: upTo, rate, amount, tax: round(t) };
    from = upTo;
    return row;
  });
  return { tax: round(tax), rows };
}

function employeeInsurance(base: number, rules: SalaryRuleSet, region: Region) {
  const s = Math.min(base, socialCap(rules));
  const u = Math.min(base, unemploymentCap(rules, region));
  const social = round(s * rules.employee.social);
  const health = round(s * rules.employee.health);
  const unemployment = round(u * rules.employee.unemployment);
  return { social, health, unemployment, total: social + health + unemployment };
}

export function grossToNet(gross: number, opts: Omit<SalaryInput, "amount" | "mode">): SalaryResult {
  const rules = salaryRules[opts.ruleId];
  const region = opts.region;
  const insuranceBase = opts.insuranceBase ?? gross;
  const employee = employeeInsurance(insuranceBase, rules, region);
  const preTax = gross - employee.total;
  const personalDeduction = rules.personalDeduction;
  const dependentDeduction = rules.dependentDeduction * opts.dependents;
  const taxable = Math.max(0, preTax - personalDeduction - dependentDeduction);
  const { tax, rows } = progressiveTax(taxable, rules);

  const s = Math.min(insuranceBase, socialCap(rules));
  const u = Math.min(insuranceBase, unemploymentCap(rules, region));
  const er = {
    social: round(s * rules.employer.social),
    accident: round(s * rules.employer.accident),
    health: round(s * rules.employer.health),
    unemployment: round(u * rules.employer.unemployment),
  };
  const erTotal = er.social + er.accident + er.health + er.unemployment;

  return {
    rules,
    gross,
    net: preTax - tax,
    insuranceBase,
    employee,
    preTax,
    personalDeduction,
    dependentDeduction,
    taxable,
    tax,
    brackets: rows,
    employer: { ...er, total: erTotal },
    employerCost: gross + erTotal,
    regionalMinimum: rules.regionalMinimum[region],
    belowRegionalMinimum: insuranceBase > 0 && insuranceBase < rules.regionalMinimum[region],
  };
}

/** Thu nhập trước thuế cần có để còn lại `net` sau thuế. */
function preTaxFromNet(net: number, deductions: number, rules: SalaryRuleSet) {
  if (net <= deductions) return net;
  const afterTax = net - deductions;
  let lower = 0;
  let cumTax = 0;
  for (const { upTo, rate } of rules.brackets) {
    // Thu nhập sau thuế tối đa của bậc này (bậc cuối không có trần — tránh Infinity − Infinity = NaN).
    const maxAfter = upTo === Infinity ? Infinity : upTo - cumTax - rate * (upTo - lower);
    if (afterTax <= maxAfter) {
      const taxable = (afterTax + cumTax - rate * lower) / (1 - rate);
      return taxable + deductions;
    }
    cumTax += rate * (upTo - lower);
    lower = upTo;
  }
  return afterTax + deductions; // không xảy ra: bậc cuối là Infinity
}

export function netToGross(net: number, opts: Omit<SalaryInput, "amount" | "mode">): SalaryResult {
  const rules = salaryRules[opts.ruleId];
  const deductions = rules.personalDeduction + rules.dependentDeduction * opts.dependents;
  const preTax = preTaxFromNet(net, deductions, rules);

  let gross: number;
  if (opts.insuranceBase !== null) {
    gross = preTax + employeeInsurance(opts.insuranceBase, rules, opts.region).total;
  } else {
    // Bảo hiểm là hàm tuyến tính từng đoạn của Gross, gãy tại 2 mức trần.
    const e = rules.employee;
    const S = socialCap(rules);
    const U = unemploymentCap(rules, opts.region);
    const ins = (g: number) => (e.social + e.health) * Math.min(g, S) + e.unemployment * Math.min(g, U);
    const points = [0, Math.min(S, U), Math.max(S, U), Number.MAX_SAFE_INTEGER];
    gross = preTax;
    for (let i = 0; i < points.length - 1; i++) {
      const [a, b] = [points[i], points[i + 1]];
      const slope = b > a ? (ins(b) - ins(a)) / (b - a) : 0;
      const intercept = ins(a) - slope * a;
      const g = (preTax + intercept) / (1 - slope);
      if (g <= b) {
        gross = g;
        break;
      }
    }
  }

  // Bù sai số làm tròn: chọn Gross nguyên gần nhất cho đúng Net mong muốn.
  const target = round(net);
  let best = grossToNet(round(gross), opts);
  for (const d of [1, -1, 2, -2, 3, -3, 4, -4, 5, -5]) {
    if (best.net === target) break;
    const r = grossToNet(round(gross) + d, opts);
    if (Math.abs(r.net - target) < Math.abs(best.net - target)) best = r;
  }
  return best;
}

export function calculate(input: SalaryInput): SalaryResult {
  const opts = {
    dependents: input.dependents,
    region: input.region,
    insuranceBase: input.insuranceBase,
    ruleId: input.ruleId,
  };
  return input.mode === "gross-to-net" ? grossToNet(input.amount, opts) : netToGross(input.amount, opts);
}
