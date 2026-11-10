import { Check } from "lucide-react";
import { salaryTool } from "@/content/tools";
import { salaryRules, CURRENT_RULE } from "@/lib/salary/rules";
import { formatMillions, formatRate } from "@/lib/salary/format";

/** Hướng dẫn 3 bước + biểu thuế + góc tư vấn Gross/Net của Light Human. */
export function SalaryGuide() {
  const { steps, advice } = salaryTool;
  const rules = salaryRules[CURRENT_RULE];
  return (
    <section className="lh-section lh-section--surface lht-guide lht-noprint">
      <div className="lh-container">
        <div className="lht-guide__head">
          <span className="lh-eyebrow">Cách công cụ tính</span>
          <h2 className="lh-h2 lh-mt-md">
            Gross ra Net trong <em>3 bước</em>
          </h2>
        </div>
        <ol className="lht-steps">
          {steps.map((s) => (
            <li key={s.n} className="lht-steps__item">
              <span className="lht-steps__n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="lht-guide__split">
          <div className="lht-ratecard">
            <h3 className="lht-ratecard__title">Biểu thuế TNCN từ kỳ tính thuế 2026</h3>
            <table className="lht-table">
              <thead>
                <tr>
                  <th scope="col">Thu nhập tính thuế / tháng</th>
                  <th scope="col">Thuế suất</th>
                </tr>
              </thead>
              <tbody>
                {rules.brackets.map((b, i) => {
                  const from = i === 0 ? 0 : rules.brackets[i - 1].upTo;
                  const label =
                    from === 0
                      ? `Đến ${formatMillions(b.upTo)}`
                      : b.upTo === Infinity
                        ? `Trên ${formatMillions(from)}`
                        : `Trên ${formatMillions(from)} đến ${formatMillions(b.upTo)}`;
                  return (
                    <tr key={b.rate}>
                      <th scope="row">{label}</th>
                      <td>{formatRate(b.rate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="lht-advice">
            <span className="lh-eyebrow">{advice.eyebrow}</span>
            <h3 className="lht-advice__title">
              {advice.title} <em>{advice.titleEm}</em>
            </h3>
            {advice.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <ul className="lht-checklist">
              {advice.checklist.map((c) => (
                <li key={c}>
                  <Check size={16} strokeWidth={2.25} aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
