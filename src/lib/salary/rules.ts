/**
 * Thông số pháp lý dùng cho công cụ tính lương Gross ⇄ Net.
 * Khi Nhà nước thay đổi mức lương cơ sở, lương tối thiểu vùng, giảm trừ gia cảnh
 * hoặc biểu thuế: chỉ cần thêm / sửa một mục trong `salaryRules`.
 */

export type Region = 1 | 2 | 3 | 4;

export type TaxBracket = {
  /** Cận trên của bậc (đồng/tháng). `Infinity` cho bậc cuối. */
  upTo: number;
  rate: number;
};

export type SalaryRuleSet = {
  id: "2026" | "2025";
  label: string;
  shortLabel: string;
  /** Lương cơ sở — trần đóng BHXH, BHYT = 20 × lương cơ sở. */
  baseSalary: number;
  /** Lương tối thiểu vùng I → IV — trần đóng BHTN = 20 × lương tối thiểu vùng. */
  regionalMinimum: Record<Region, number>;
  personalDeduction: number;
  dependentDeduction: number;
  brackets: TaxBracket[];
  /** Tỉ lệ người lao động đóng. */
  employee: { social: number; health: number; unemployment: number };
  /** Tỉ lệ doanh nghiệp đóng. `accident` = quỹ tai nạn lao động – bệnh nghề nghiệp. */
  employer: { social: number; accident: number; health: number; unemployment: number };
  /** Căn cứ pháp lý hiển thị dưới công cụ. */
  legalBasis: string[];
};

const CAP_MULTIPLIER = 20;

const employee = { social: 0.08, health: 0.015, unemployment: 0.01 };
const employer = { social: 0.17, accident: 0.005, health: 0.03, unemployment: 0.01 };

export const salaryRules: Record<SalaryRuleSet["id"], SalaryRuleSet> = {
  "2026": {
    id: "2026",
    label: "Năm 2026",
    shortLabel: "2026",
    baseSalary: 2_530_000,
    regionalMinimum: { 1: 5_310_000, 2: 4_730_000, 3: 4_140_000, 4: 3_700_000 },
    personalDeduction: 15_500_000,
    dependentDeduction: 6_200_000,
    brackets: [
      { upTo: 10_000_000, rate: 0.05 },
      { upTo: 30_000_000, rate: 0.1 },
      { upTo: 60_000_000, rate: 0.2 },
      { upTo: 100_000_000, rate: 0.3 },
      { upTo: Infinity, rate: 0.35 },
    ],
    employee,
    employer,
    legalBasis: [
      "Luật Thuế thu nhập cá nhân số 109/2025/QH15 — biểu thuế lũy tiến 5 bậc, áp dụng cho tiền lương, tiền công từ kỳ tính thuế năm 2026",
      "Nghị quyết 110/2025/UBTVQH15 — giảm trừ 15.500.000đ/tháng cho bản thân, 6.200.000đ/tháng cho mỗi người phụ thuộc",
      "Nghị định 161/2026/NĐ-CP — lương cơ sở 2.530.000đ/tháng từ 01/07/2026",
      "Nghị định 293/2025/NĐ-CP — lương tối thiểu vùng từ 01/01/2026",
      "Luật Bảo hiểm xã hội 2024, Luật Bảo hiểm y tế, Luật Việc làm — tỉ lệ trích đóng bảo hiểm",
    ],
  },
  "2025": {
    id: "2025",
    label: "07–12/2025",
    shortLabel: "2025",
    baseSalary: 2_340_000,
    regionalMinimum: { 1: 4_960_000, 2: 4_410_000, 3: 3_860_000, 4: 3_450_000 },
    personalDeduction: 11_000_000,
    dependentDeduction: 4_400_000,
    brackets: [
      { upTo: 5_000_000, rate: 0.05 },
      { upTo: 10_000_000, rate: 0.1 },
      { upTo: 18_000_000, rate: 0.15 },
      { upTo: 32_000_000, rate: 0.2 },
      { upTo: 52_000_000, rate: 0.25 },
      { upTo: 80_000_000, rate: 0.3 },
      { upTo: Infinity, rate: 0.35 },
    ],
    employee,
    employer,
    legalBasis: [
      "Luật Thuế thu nhập cá nhân 2007 (sửa đổi) — biểu thuế lũy tiến 7 bậc",
      "Nghị quyết 954/2020/UBTVQH14 — giảm trừ 11.000.000đ/tháng cho bản thân, 4.400.000đ/tháng cho mỗi người phụ thuộc",
      "Nghị định 73/2024/NĐ-CP — lương cơ sở 2.340.000đ/tháng",
      "Nghị định 74/2024/NĐ-CP — lương tối thiểu vùng",
    ],
  },
};

export const CURRENT_RULE: SalaryRuleSet["id"] = "2026";

export function socialCap(rules: SalaryRuleSet) {
  return rules.baseSalary * CAP_MULTIPLIER;
}

export function unemploymentCap(rules: SalaryRuleSet, region: Region) {
  return rules.regionalMinimum[region] * CAP_MULTIPLIER;
}

export const regionHelp =
  "Vùng xác định theo nơi doanh nghiệp đặt trụ sở / chi nhánh (địa bàn cấp xã) — tra cứu tại Phụ lục Nghị định 128/2025/NĐ-CP. Vùng chỉ ảnh hưởng trần đóng bảo hiểm thất nghiệp.";
