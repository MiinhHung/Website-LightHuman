import { compound } from "@/lib/finance/compound";
import { formatMoney } from "@/lib/salary/format";

/**
 * Minh họa cho hero trang lãi kép: thẻ kính navy với đường tăng trưởng thật
 * (tính bằng lõi công cụ) — thay cho ảnh chụp, không trùng ảnh với trang khác.
 */
export function GrowthArt({ principal, ratePct, years }: { principal: number; ratePct: number; years: number }) {
  const r = compound({ principal, monthly: 0, years, ratePct, frequency: "year", timing: "end", inflationPct: 0 });
  const pts = [principal, ...r.rows.map((x) => x.balance)];
  const simple = [principal, ...r.rows.map((x) => x.simpleBalance)];
  const W = 420;
  const H = 220;
  const max = Math.max(...pts) * 1.08;
  const xy = (v: number, i: number) => `${(i / years) * W},${H - (v / max) * H}`;
  const line = pts.map(xy).join(" ");
  const area = `0,${H} ${line} ${W},${H}`;
  const multiple = r.futureValue / principal;

  return (
    <div className="lht-art" aria-hidden="true">
      <div className="lht-art__top">
        <span>Tăng trưởng {years} năm · {ratePct}%/năm</span>
        <span className="lht-payslip__tag">×{new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(multiple)}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="lht-art__svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lht-art-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f2cf63" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f2cf63" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1="0" x2={W} y1={H * t} y2={H * t} stroke="#ffffff1f" strokeDasharray="3 5" />
        ))}
        <polygon points={area} fill="url(#lht-art-fill)" />
        <polyline points={simple.map(xy).join(" ")} fill="none" stroke="#ffffff73" strokeWidth="2" strokeDasharray="6 6" />
        <polyline points={line} fill="none" stroke="#f2cf63" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={W} cy={H - (r.futureValue / max) * H} r="6" fill="#f2cf63" stroke="#0d1a3d" strokeWidth="3" />
      </svg>
      <div className="lht-art__foot">
        <div>
          <span>Hôm nay</span>
          <strong>{formatMoney(principal)}</strong>
        </div>
        <div className="is-gold">
          <span>Sau {years} năm</span>
          <strong>{formatMoney(Math.floor(r.futureValue))}</strong>
        </div>
      </div>
    </div>
  );
}
