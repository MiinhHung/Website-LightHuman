/**
 * Lõi tính lãi kép có góp thêm định kỳ (hàm thuần — dùng chung cho UI và kiểm thử).
 *
 *   FV = P·(1 + r)^N  +  D·[(1 + r)^N − 1] / r      (góp cuối kỳ)
 *   FV = P·(1 + r)^N  +  D·[(1 + r)^N − 1] / r · (1 + r)   (góp đầu kỳ)
 *
 *   r = i / m   — lãi suất mỗi kỳ ghép lãi (i: lãi suất năm, m: số kỳ/năm)
 *   N = n · m   — tổng số kỳ (n: số năm)
 *   D = C · 12 / m — tiền góp quy về mỗi kỳ ghép lãi (C: tiền góp mỗi tháng)
 *
 * Mô phỏng từng kỳ để lập bảng theo năm; kết quả khớp công thức đóng ở trên.
 */

export type Frequency = "year" | "quarter" | "month" | "day";

export const PERIODS_PER_YEAR: Record<Frequency, number> = { year: 1, quarter: 4, month: 12, day: 365 };

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  year: "Hằng năm",
  quarter: "Hằng quý",
  month: "Hằng tháng",
  day: "Hằng ngày",
};

export type CompoundInput = {
  principal: number;
  /** Tiền góp thêm mỗi tháng. */
  monthly: number;
  years: number;
  /** Lãi suất %/năm, ví dụ 8 = 8%/năm. */
  ratePct: number;
  frequency: Frequency;
  /** Góp vào cuối kỳ (mặc định, giống ngân hàng trả lãi cuối kỳ) hay đầu kỳ. */
  timing: "end" | "begin";
  /** Lạm phát dự kiến %/năm — 0 để bỏ qua. */
  inflationPct: number;
};

export type YearRow = {
  year: number;
  /** Tổng tiền đã bỏ vào (gốc + góp) tới cuối năm. */
  contributed: number;
  /** Lãi phát sinh trong năm. */
  interestYear: number;
  /** Lãi lũy kế. */
  interestTotal: number;
  balance: number;
  /** Số dư nếu chỉ tính lãi đơn — để vẽ đường so sánh. */
  simpleBalance: number;
};

export type CompoundResult = {
  input: CompoundInput;
  futureValue: number;
  contributed: number;
  totalDeposits: number;
  interest: number;
  /** Lợi nhuận trên tổng vốn bỏ ra (0.5 = 50%). */
  roi: number;
  /** Cùng dữ liệu nhưng lãi đơn — để so sánh. */
  simpleValue: number;
  /** Giá trị tương đương sức mua hôm nay (đã trừ lạm phát). */
  realValue: number;
  /** Số năm để tiền gốc tăng gấp đôi (công thức chính xác ln2 / ln(1+r)·m). */
  doublingYears: number | null;
  /** Lãi suất thực nhận/năm sau khi ghép lãi (APY). */
  effectiveRate: number;
  periodRate: number;
  periods: number;
  perPeriodDeposit: number;
  rows: YearRow[];
};

export const MAX_YEARS = 50;

export function compound(input: CompoundInput): CompoundResult {
  const m = PERIODS_PER_YEAR[input.frequency];
  const years = Math.max(0, Math.min(MAX_YEARS, Math.round(input.years)));
  const r = input.ratePct / 100 / m;
  const N = years * m;
  const D = (input.monthly * 12) / m;

  let balance = input.principal;
  let contributed = input.principal;
  let simpleInterest = 0;
  let yearStartInterest = 0;
  const rows: YearRow[] = [];

  for (let k = 1; k <= N; k++) {
    if (input.timing === "begin") {
      balance += D;
      contributed += D;
    }
    simpleInterest += contributed * r;
    balance *= 1 + r;
    if (input.timing === "end") {
      balance += D;
      contributed += D;
    }
    if (k % m === 0) {
      const interestTotal = balance - contributed;
      rows.push({
        year: k / m,
        contributed,
        interestYear: interestTotal - yearStartInterest,
        interestTotal,
        balance,
        simpleBalance: contributed + simpleInterest,
      });
      yearStartInterest = interestTotal;
    }
  }

  const interest = balance - contributed;
  const g = 1 + r;
  return {
    input: { ...input, years },
    futureValue: balance,
    contributed,
    totalDeposits: contributed - input.principal,
    interest,
    roi: contributed > 0 ? interest / contributed : 0,
    simpleValue: contributed + simpleInterest,
    realValue: balance / Math.pow(1 + input.inflationPct / 100, years),
    doublingYears: r > 0 ? Math.log(2) / Math.log(g) / m : null,
    effectiveRate: Math.pow(g, m) - 1,
    periodRate: r,
    periods: N,
    perPeriodDeposit: D,
    rows,
  };
}
