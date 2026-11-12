import type { PitResult } from "@/lib/salary/pit";
import { SHORT_TERM_THRESHOLD } from "@/lib/salary/pit";
import { formatMillions, formatMoney, formatRate } from "@/lib/salary/format";

const fmt = (n: number, sign: "" | "-" = "") => `${n > 0 && sign ? `${sign} ` : ""}${formatMoney(n)}`;

function bracketLabel(from: number, to: number) {
  if (from === 0) return `Đến ${formatMillions(to)}`;
  if (to === Infinity) return `Trên ${formatMillions(from)}`;
  return `${formatMillions(from).replace(" triệu", "")} – ${formatMillions(to)}`;
}

/** Step-by-step table, then the bracket ladder (resident) or the flat-rate explanation. */
export function PitBreakdown({ result: r, dependents }: { result: PitResult; dependents: number }) {
  const e = r.rules.employee;
  const maxTax = Math.max(1, ...r.brackets.map((b) => b.tax));

  return (
    <div className="lht-breakdown lht-breakdown--two">
      <article className="lht-card">
        <header className="lht-card__head">
          <span className="lht-step">Diễn giải</span>
          <h3>Từ thu nhập đến số thuế</h3>
        </header>
        <table className="lht-table">
          <caption className="sr-only">Diễn giải chi tiết (VNĐ)</caption>
          <tbody>
            <tr className="lht-table__strong">
              <th scope="row">{r.case === "short" ? "Số tiền chi trả" : "Tổng thu nhập"}</th>
              <td>{fmt(r.income)}</td>
            </tr>
            {r.case !== "short" && (
              <>
                <tr>
                  <th scope="row">Thu nhập miễn thuế</th>
                  <td>{fmt(r.exempt, "-")}</td>
                </tr>
                <tr className="lht-table__sub">
                  <th scope="row">Thu nhập chịu thuế</th>
                  <td>{fmt(r.taxableIncome)}</td>
                </tr>
              </>
            )}
            {r.case === "resident" && (
              <>
                <tr>
                  <th scope="row">BHXH ({formatRate(e.social)})</th>
                  <td>{fmt(r.insurance.social, "-")}</td>
                </tr>
                <tr>
                  <th scope="row">BHYT ({formatRate(e.health)})</th>
                  <td>{fmt(r.insurance.health, "-")}</td>
                </tr>
                <tr>
                  <th scope="row">BHTN ({formatRate(e.unemployment)})</th>
                  <td>{fmt(r.insurance.unemployment, "-")}</td>
                </tr>
                <tr>
                  <th scope="row">Giảm trừ bản thân</th>
                  <td>{fmt(r.personalDeduction, "-")}</td>
                </tr>
                <tr>
                  <th scope="row">Giảm trừ {dependents} người phụ thuộc</th>
                  <td>{fmt(r.dependentDeduction, "-")}</td>
                </tr>
              </>
            )}
            <tr className="lht-table__sub">
              <th scope="row">Thu nhập tính thuế</th>
              <td>{fmt(r.assessable)}</td>
            </tr>
            <tr>
              <th scope="row">Thuế TNCN{r.flatRate !== null ? ` (${formatRate(r.flatRate)})` : ""}</th>
              <td>{fmt(r.tax, "-")}</td>
            </tr>
            <tr className="lht-table__total">
              <th scope="row">Thực nhận</th>
              <td>{fmt(r.net)}</td>
            </tr>
          </tbody>
        </table>
      </article>

      {r.case === "resident" ? (
        <article className="lht-card">
          <header className="lht-card__head">
            <span className="lht-step">Thuế theo bậc</span>
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
                  {active && <div className="lht-bracket__amt">Tính thuế {formatMoney(b.amount)} đ</div>}
                </li>
              );
            })}
          </ol>
          <div className="lht-card__foot">
            <span>Tổng thuế</span>
            <strong>{formatMoney(r.tax)} đ</strong>
          </div>
        </article>
      ) : (
        <article className="lht-card lht-card--navy">
          <header className="lht-card__head">
            <span className="lht-step lht-step--gold">Thuế suất cố định</span>
            <h3>{formatRate(r.flatRate ?? 0)} trên {r.case === "short" ? "tổng thu nhập" : "thu nhập chịu thuế"}</h3>
          </header>
          {r.case === "short" ? (
            <ul className="lht-pit-notes">
              <li>Áp dụng cho mỗi lần chi trả từ {formatMoney(SHORT_TERM_THRESHOLD)} đ trở lên, không trừ bảo hiểm hay giảm trừ gia cảnh.</li>
              <li>Đây là khoản tạm khấu trừ. Cuối năm, nếu tổng thu nhập sau giảm trừ chưa đến mức chịu thuế, bạn được hoàn khi quyết toán.</li>
              <li>Chỉ có một nguồn thu nhập và ước tính cả năm chưa đến mức chịu thuế: có thể làm cam kết mẫu 08/CK-TNCN để không bị khấu trừ.</li>
            </ul>
          ) : (
            <ul className="lht-pit-notes">
              <li>Không được giảm trừ gia cảnh cho bản thân và người phụ thuộc.</li>
              <li>Thu nhập chịu thuế xác định như với cá nhân cư trú: tổng thu nhập trừ các khoản được miễn.</li>
              <li>Ở Việt Nam từ 183 ngày trong năm hoặc có nơi ở thường xuyên thì là cá nhân cư trú: chọn &quot;HĐLĐ từ 3 tháng&quot;.</li>
            </ul>
          )}
        </article>
      )}
    </div>
  );
}
