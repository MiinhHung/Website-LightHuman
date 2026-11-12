import { Check } from "lucide-react";
import { pitTool } from "@/content/tools";
import { CURRENT_RULE, salaryRules } from "@/lib/salary/rules";
import { formatMillions, formatRate } from "@/lib/salary/format";
import type { PitCase } from "@/lib/salary/pit";

const CASES: PitCase[] = ["resident", "short", "nonresident"];

/** Three cases side by side, the 3-step method, the 2026 brackets, exempt income and advice. */
export function PitGuide() {
  const { cases, steps, exemptList, advice } = pitTool;
  const rules = salaryRules[CURRENT_RULE];
  return (
    <section className="lh-section lh-section--surface lht-guide">
      <div className="lh-container">
        <div className="lht-guide__head">
          <span className="lh-eyebrow">Cách công cụ tính</span>
          <h2 className="lh-h2 lh-mt-md">
            Ba trường hợp, <em>ba cách tính</em>
          </h2>
        </div>
        <ul className="lht-pit-cases">
          {CASES.map((c) => (
            <li key={c} className="lht-pit-case">
              <span className="lht-pit-case__rate">{cases[c].short}</span>
              <h3>{cases[c].label}</h3>
              <p>{cases[c].desc}</p>
            </li>
          ))}
        </ul>

        <h3 className="lht-pit-subhead">Với hợp đồng từ 3 tháng: 3 bước</h3>
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

            <h3 className="lht-ratecard__title lht-pit-exempt__title">{exemptList.title}</h3>
            <ul className="lht-checklist lht-pit-exempt">
              {exemptList.items.map((item) => (
                <li key={item}>
                  <Check size={16} strokeWidth={2.25} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="lht-note">{exemptList.source}</p>
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
