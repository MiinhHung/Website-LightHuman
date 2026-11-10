import { grossToNet } from "@/lib/salary/calc";
import { CURRENT_RULE } from "@/lib/salary/rules";
import { formatMoney } from "@/lib/salary/format";

/** Thẻ "phiếu lương" nổi trên ảnh hero — số liệu thật, tính bằng lõi của công cụ. */
export function PayslipBadge({ gross }: { gross: number }) {
  const r = grossToNet(gross, { dependents: 0, region: 1, insuranceBase: null, ruleId: CURRENT_RULE });
  return (
    <div className="lht-payslip" aria-label={`Ví dụ: Gross ${formatMoney(r.gross)} đồng, Net ${formatMoney(r.net)} đồng`}>
      <div className="lht-payslip__head">
        <span>Phiếu lương mẫu</span>
        <span className="lht-payslip__tag">{r.rules.shortLabel}</span>
      </div>
      <dl>
        <div>
          <dt>Gross</dt>
          <dd>{formatMoney(r.gross)}</dd>
        </div>
        <div className="is-minus">
          <dt>Bảo hiểm</dt>
          <dd>− {formatMoney(r.employee.total)}</dd>
        </div>
        <div className="is-minus">
          <dt>Thuế TNCN</dt>
          <dd>− {formatMoney(r.tax)}</dd>
        </div>
        <div className="is-total">
          <dt>Net</dt>
          <dd>{formatMoney(r.net)}</dd>
        </div>
      </dl>
    </div>
  );
}
