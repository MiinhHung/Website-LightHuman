import type { ReactNode } from "react";
import type { CompoundResult } from "@/lib/finance/compound";
import { FREQUENCY_LABEL, PERIODS_PER_YEAR } from "@/lib/finance/compound";
import { formatMoney } from "@/lib/salary/format";
import { compoundTool } from "@/content/tools";

const num = (n: number, d = 6) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: d }).format(n);
const money = (n: number) => formatMoney(Math.floor(n));

/** Công thức tổng quát + cùng công thức điền sẵn số của người dùng, tính từng bước. */
export function FormulaCard({ result: r }: { result: CompoundResult }) {
  const { principal, ratePct, frequency, years, timing, monthly } = r.input;
  const m = PERIODS_PER_YEAR[frequency];
  const growth = Math.pow(1 + r.periodRate, r.periods);
  const principalPart = principal * growth;
  const annuityPart = r.futureValue - principalPart;
  const begin = timing === "begin";

  return (
    <article className="lht-card lht-formula">
      <header className="lht-card__head">
        <span className="lht-step">Công thức</span>
        <h3>Cách tính, từng bước</h3>
      </header>

      <div className="lht-formula__main" aria-label="Công thức lãi kép có góp định kỳ">
        <span className="lht-formula__lhs">FV</span>
        <span>=</span>
        <span>
          P × (1 + <Frac top="i" bottom="m" />)<sup>n×m</sup>
        </span>
        <span>+</span>
        <span>
          D × <Frac top={<>(1 + i/m)<sup>n×m</sup> − 1</>} bottom="i/m" />
          {begin && <> × (1 + i/m)</>}
        </span>
      </div>

      <dl className="lht-formula__vars">
        {compoundTool.variables.map((v) => (
          <div key={v.sym}>
            <dt>{v.sym}</dt>
            <dd>
              <strong>{v.name}</strong>
              <span>{v.desc}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="lht-formula__apply">
        <h4>Áp dụng với số của bạn</h4>
        <ol>
          <li>
            <span>Lãi suất mỗi kỳ</span>
            <code>
              i/m = {num(ratePct)}% ÷ {m} = {num(r.periodRate * 100, 4)}%
            </code>
          </li>
          <li>
            <span>Số kỳ ghép lãi ({FREQUENCY_LABEL[frequency].toLowerCase()})</span>
            <code>
              n×m = {years} × {m} = {num(r.periods, 0)} kỳ
            </code>
          </li>
          <li>
            <span>Hệ số tăng trưởng</span>
            <code>
              (1 + {num(r.periodRate, 6)})<sup>{num(r.periods, 0)}</sup> = {num(growth, 4)}
            </code>
          </li>
          <li>
            <span>Phần tiền gốc</span>
            <code>
              {money(principal)} × {num(growth, 4)} = {money(principalPart)}
            </code>
          </li>
          <li>
            <span>Tiền góp mỗi kỳ</span>
            <code>
              D = {money(monthly)} × 12 ÷ {m} = {money(r.perPeriodDeposit)}
            </code>
          </li>
          <li>
            <span>Phần tiền góp</span>
            <code>
              {r.periodRate > 0 ? (
                <>
                  {money(r.perPeriodDeposit)} × ({num(growth, 4)} − 1) ÷ {num(r.periodRate, 6)}
                  {begin && <> × {num(1 + r.periodRate, 6)}</>} = {money(annuityPart)}
                </>
              ) : (
                <>
                  {money(r.perPeriodDeposit)} × {num(r.periods, 0)} kỳ = {money(annuityPart)}
                </>
              )}
            </code>
          </li>
          <li className="is-total">
            <span>Tổng giá trị FV</span>
            <code>
              {money(principalPart)} + {money(annuityPart)} = {money(r.futureValue)} đ
            </code>
          </li>
        </ol>
      </div>
    </article>
  );
}

function Frac({ top, bottom }: { top: ReactNode; bottom: ReactNode }) {
  return (
    <span className="lht-frac">
      <span>{top}</span>
      <span>{bottom}</span>
    </span>
  );
}
