import { computePit, taxUnderRules } from "@/lib/salary/pit";
import { CURRENT_RULE } from "@/lib/salary/rules";
import { formatMoney } from "@/lib/salary/format";

/** Floating "tax slip" on the hero photo: real numbers from the tool's own engine. */
export function PitBadge({ income, dependents }: { income: number; dependents: number }) {
  const r = computePit({ case: "resident", income, exempt: 0, dependents, region: 1, insuranceBase: null, ruleId: CURRENT_RULE });
  const old = taxUnderRules(r, dependents, "2025");
  return (
    <div
      className="lht-payslip"
      aria-label={`Ví dụ: thu nhập ${formatMoney(income)} đồng, ${dependents} người phụ thuộc, thuế ${formatMoney(r.tax)} đồng`}
    >
      <div className="lht-payslip__head">
        <span>Tờ thuế mẫu</span>
        <span className="lht-payslip__tag">{r.rules.shortLabel}</span>
      </div>
      <dl>
        <div>
          <dt>Thu nhập · {dependents} NPT</dt>
          <dd>{formatMoney(r.income)}</dd>
        </div>
        <div className="is-minus">
          <dt>Tính thuế</dt>
          <dd>{formatMoney(r.assessable)}</dd>
        </div>
        <div className="is-minus">
          <dt>Luật cũ</dt>
          <dd>{formatMoney(old)}</dd>
        </div>
        <div className="is-total">
          <dt>Thuế 2026</dt>
          <dd>{formatMoney(r.tax)}</dd>
        </div>
      </dl>
    </div>
  );
}
