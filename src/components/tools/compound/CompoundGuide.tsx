import { compound } from "@/lib/finance/compound";
import { formatMoney } from "@/lib/salary/format";
import { compoundTool } from "@/content/tools";

const YEARS = [1, 5, 10, 20, 30];

/** Bảng so sánh lãi đơn / lãi kép (số tính bằng chính công cụ) + 4 lời khuyên tích lũy. */
export function CompoundGuide() {
  const { compare, tips } = compoundTool;
  const rows = YEARS.map((y) => {
    const r = compound({ principal: 100_000_000, monthly: 0, years: y, ratePct: 8, frequency: "year", timing: "end", inflationPct: 0 });
    return { y, simple: r.simpleValue, comp: r.futureValue };
  });
  const maxComp = rows[rows.length - 1].comp;

  return (
    <section className="lh-section lh-section--surface lht-guide lht-noprint">
      <div className="lh-container">
        <div className="lht-guide__split lht-guide__split--top">
          <div>
            <span className="lh-eyebrow">{compare.eyebrow}</span>
            <h2 className="lh-h2 lh-mt-md">
              {compare.title} <em>{compare.titleEm}</em>
            </h2>
            <p className="lht-guide__lede">{compare.body}</p>
          </div>
          <div className="lht-ratecard">
            <table className="lht-table lht-vs">
              <thead>
                <tr>
                  <th scope="col">Sau</th>
                  <th scope="col">Lãi đơn</th>
                  <th scope="col">Lãi kép</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.y}>
                    <th scope="row">{r.y} năm</th>
                    <td>{formatMoney(Math.floor(r.simple))}</td>
                    <td>
                      <strong>{formatMoney(Math.floor(r.comp))}</strong>
                      <span className="lht-vs__bar" aria-hidden="true">
                        <span style={{ width: `${(r.comp / maxComp) * 100}%` }} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="lht-vs__note">Ví dụ: 100.000.000đ, lãi suất 8%/năm, ghép lãi hằng năm, không góp thêm.</p>
          </div>
        </div>

        <ul className="lht-tips">
          {tips.map((t, i) => (
            <li key={t.title} className="lht-steps__item">
              <span className="lht-steps__n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
