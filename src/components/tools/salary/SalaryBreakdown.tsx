import type { SalaryResult } from "@/lib/salary/calc";
import { socialCap } from "@/lib/salary/rules";
import { formatMillions, formatMoney, formatRate } from "@/lib/salary/format";

const fmt = (n: number, sign: "" | "-" | "+" = "") => `${n > 0 && sign ? `${sign} ` : ""}${formatMoney(n)}`;

function bracketLabel(from: number, to: number) {
  if (from === 0) return `Đến ${formatMillions(to)}`;
  if (to === Infinity) return `Trên ${formatMillions(from)}`;
  return `${formatMillions(from).replace(" triệu", "")} – ${formatMillions(to)}`;
}

/** Ba thẻ diễn giải: từng bước Gross → Net, thuế theo bậc, chi phí doanh nghiệp. */
export function SalaryBreakdown({ result: r }: { result: SalaryResult }) {
  const e = r.rules.employee;
  const er = r.rules.employer;
  const capped = r.insuranceBase > socialCap(r.rules);
  const maxTax = Math.max(1, ...r.brackets.map((b) => b.tax));

  return (
    <div className="lht-breakdown">
      <article className="lht-card">
        <header className="lht-card__head">
          <span className="lht-step">Diễn giải</span>
          <h3>Từ Gross đến Net</h3>
        </header>
        <table className="lht-table">
          <caption className="sr-only">Diễn giải chi tiết (VNĐ)</caption>
          <tbody>
            <tr className="lht-table__strong">
              <th scope="row">Lương Gross</th>
              <td>{fmt(r.gross)}</td>
            </tr>
            <tr>
              <th scope="row">BHXH ({formatRate(e.social)})</th>
              <td>{fmt(r.employee.social, "-")}</td>
            </tr>
            <tr>
              <th scope="row">BHYT ({formatRate(e.health)})</th>
              <td>{fmt(r.employee.health, "-")}</td>
            </tr>
            <tr>
              <th scope="row">BHTN ({formatRate(e.unemployment)})</th>
              <td>{fmt(r.employee.unemployment, "-")}</td>
            </tr>
            <tr className="lht-table__sub">
              <th scope="row">Thu nhập trước thuế</th>
              <td>{fmt(r.preTax)}</td>
            </tr>
            <tr>
              <th scope="row">Giảm trừ bản thân</th>
              <td>{fmt(r.personalDeduction, "-")}</td>
            </tr>
            <tr>
              <th scope="row">Giảm trừ người phụ thuộc</th>
              <td>{fmt(r.dependentDeduction, "-")}</td>
            </tr>
            <tr className="lht-table__sub">
              <th scope="row">Thu nhập tính thuế</th>
              <td>{fmt(r.taxable)}</td>
            </tr>
            <tr>
              <th scope="row">Thuế TNCN</th>
              <td>{fmt(r.tax, "-")}</td>
            </tr>
            <tr className="lht-table__total">
              <th scope="row">Lương Net</th>
              <td>{fmt(r.net)}</td>
            </tr>
          </tbody>
        </table>
        {capped && (
          <p className="lht-note">
            Lương đóng bảo hiểm vượt mức trần — BHXH, BHYT chỉ tính trên {formatMoney(socialCap(r.rules))} đ.
          </p>
        )}
        {r.belowRegionalMinimum && (
          <p className="lht-note lht-note--warn">
            Lương đóng bảo hiểm thấp hơn lương tối thiểu vùng ({formatMoney(r.regionalMinimum)} đ) — chưa đúng quy định.
          </p>
        )}
      </article>

      <article className="lht-card">
        <header className="lht-card__head">
          <span className="lht-step">Thuế TNCN</span>
          <h3>Biểu lũy tiến {r.brackets.length} bậc</h3>
        </header>
        <ol className="lht-brackets">
          {r.brackets.map((b) => {
            const active = b.amount > 0;
            return (
              <li key={b.from} className={active ? "lht-bracket is-active" : "lht-bracket"}>
                <div className="lht-bracket__top">
                  <span className="lht-bracket__rate">{formatRate(b.rate)}</span>
                  <span className="lht-bracket__range">{bracketLabel(b.from, b.to)}</span>
                  <span className="lht-bracket__tax">{formatMoney(b.tax)}</span>
                </div>
                <div className="lht-bracket__bar" aria-hidden="true">
                  <span style={{ width: `${(b.tax / maxTax) * 100}%` }} />
                </div>
                {active && <div className="lht-bracket__amt">Chịu thuế {formatMoney(b.amount)} đ</div>}
              </li>
            );
          })}
        </ol>
        <div className="lht-card__foot">
          <span>Tổng thuế</span>
          <strong>{formatMoney(r.tax)} đ</strong>
        </div>
      </article>

      <article className="lht-card lht-card--navy">
        <header className="lht-card__head">
          <span className="lht-step lht-step--gold">Doanh nghiệp</span>
          <h3>Chi phí doanh nghiệp chi trả</h3>
        </header>
        <table className="lht-table lht-table--dark">
          <caption className="sr-only">Người sử dụng lao động trả (VNĐ)</caption>
          <tbody>
            <tr className="lht-table__strong">
              <th scope="row">Lương Gross</th>
              <td>{fmt(r.gross)}</td>
            </tr>
            <tr>
              <th scope="row">BHXH ({formatRate(er.social)})</th>
              <td>{fmt(r.employer.social, "+")}</td>
            </tr>
            <tr>
              <th scope="row">Tai nạn lao động – BNN ({formatRate(er.accident)})</th>
              <td>{fmt(r.employer.accident, "+")}</td>
            </tr>
            <tr>
              <th scope="row">BHYT ({formatRate(er.health)})</th>
              <td>{fmt(r.employer.health, "+")}</td>
            </tr>
            <tr>
              <th scope="row">BHTN ({formatRate(er.unemployment)})</th>
              <td>{fmt(r.employer.unemployment, "+")}</td>
            </tr>
            <tr className="lht-table__total">
              <th scope="row">Tổng chi phí / tháng</th>
              <td>{fmt(r.employerCost)}</td>
            </tr>
            <tr>
              <th scope="row">Ước tính / năm (12 tháng)</th>
              <td>{fmt(r.employerCost * 12)}</td>
            </tr>
          </tbody>
        </table>
        <p className="lht-note lht-note--dark">
          Dùng con số này khi lập ngân sách tuyển dụng — chưa gồm thưởng, phúc lợi và phí dịch vụ tuyển dụng.
        </p>
      </article>
    </div>
  );
}
