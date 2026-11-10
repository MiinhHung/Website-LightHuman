"use client";

import { useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeftRight, Check, Copy, Info, Link2, Minus, Plus, Printer, RotateCcw } from "lucide-react";
import { calculate, type SalaryInput, type SalaryResult } from "@/lib/salary/calc";
import { CURRENT_RULE, regionHelp, salaryRules, type Region } from "@/lib/salary/rules";
import { formatMillions, formatMoney, formatRate, parseMoney, regionLabel } from "@/lib/salary/format";
import { salaryTool } from "@/content/tools";
import { AnimatedNumber } from "../AnimatedNumber";
import { Segmented } from "../ui";
import { SalaryBreakdown } from "./SalaryBreakdown";
import { OfferCompare } from "./OfferCompare";

type Mode = SalaryInput["mode"];
type RuleId = SalaryInput["ruleId"];

type CalcState = {
  mode: Mode;
  amount: number;
  dependents: number;
  region: Region;
  insCustom: boolean;
  insAmount: number;
  ruleId: RuleId;
};

const DEFAULTS: CalcState = {
  mode: "gross-to-net",
  amount: 30_000_000,
  dependents: 0,
  region: 1,
  insCustom: false,
  insAmount: 0,
  ruleId: CURRENT_RULE,
};

const MAX_DEPENDENTS = 15;

/** Đọc trạng thái từ link chia sẻ: ?m=gn|ng&v=&d=&r=&b=&y= */
function stateFromParams(sp: URLSearchParams): Partial<CalcState> {
  const out: Partial<CalcState> = {};
  const m = sp.get("m");
  if (m === "gn") out.mode = "gross-to-net";
  if (m === "ng") out.mode = "net-to-gross";
  const v = Number(sp.get("v"));
  if (v > 0) out.amount = Math.min(v, 99_999_999_999);
  const d = Number(sp.get("d"));
  if (Number.isInteger(d) && d >= 0) out.dependents = Math.min(d, MAX_DEPENDENTS);
  const r = Number(sp.get("r"));
  if ([1, 2, 3, 4].includes(r)) out.region = r as Region;
  const b = Number(sp.get("b"));
  if (b > 0) {
    out.insCustom = true;
    out.insAmount = b;
  }
  const y = sp.get("y");
  if (y === "2025" || y === "2026") out.ruleId = y;
  return out;
}

function toParams(s: CalcState) {
  const p = new URLSearchParams({
    m: s.mode === "gross-to-net" ? "gn" : "ng",
    v: String(s.amount),
    d: String(s.dependents),
    r: String(s.region),
    y: s.ruleId,
  });
  if (s.insCustom && s.insAmount > 0) p.set("b", String(s.insAmount));
  return p.toString();
}

function toInput(s: CalcState, ruleId: RuleId = s.ruleId): SalaryInput {
  return {
    amount: s.amount,
    mode: s.mode,
    dependents: s.dependents,
    region: s.region,
    insuranceBase: s.insCustom ? s.insAmount : null,
    ruleId,
  };
}

function summaryText(r: SalaryResult, s: CalcState) {
  const ins = s.insCustom ? `đóng BH trên ${formatMoney(s.insAmount)} đ` : "đóng BH trên lương chính thức";
  return [
    `LIGHT HUMAN · Bảng quy đổi lương (quy định ${r.rules.shortLabel})`,
    `Lương Gross: ${formatMoney(r.gross)} đ`,
    `Bảo hiểm NLĐ đóng: -${formatMoney(r.employee.total)} đ`,
    `Thuế TNCN: -${formatMoney(r.tax)} đ`,
    `Lương Net: ${formatMoney(r.net)} đ`,
    `Tổng chi phí doanh nghiệp: ${formatMoney(r.employerCost)} đ`,
    `(${s.dependents} người phụ thuộc · ${regionLabel(s.region)} · ${ins})`,
  ].join("\n");
}

export function SalaryCalculatorWithQuery() {
  const sp = useSearchParams();
  return <SalaryCalculator initial={stateFromParams(new URLSearchParams(sp.toString()))} />;
}

export function SalaryCalculator({ initial }: { initial?: Partial<CalcState> }) {
  const [s, setS] = useState<CalcState>({ ...DEFAULTS, ...initial });
  const [amountText, setAmountText] = useState(formatMoney(s.amount));
  const [insText, setInsText] = useState(s.insAmount ? formatMoney(s.insAmount) : "");
  const [flash, setFlash] = useState<"copy" | "link" | null>(null);
  const ids = { amount: useId(), ins: useId(), dep: useId() };

  const update = (patch: Partial<CalcState>) => setS((prev) => ({ ...prev, ...patch }));

  const ready = s.amount > 0 && (!s.insCustom || s.insAmount > 0);
  const result = ready ? calculate(toInput(s)) : null;
  const other = ready && s.ruleId === "2026" ? calculate(toInput(s, "2025")) : null;
  const isG2N = s.mode === "gross-to-net";

  const notify = (kind: "copy" | "link") => {
    setFlash(kind);
    window.setTimeout(() => setFlash(null), 1800);
  };

  const copyResult = async () => {
    if (!result) return;
    const url = `${window.location.origin}${window.location.pathname}?${toParams(s)}`;
    await navigator.clipboard?.writeText(`${summaryText(result, s)}\nXem chi tiết: ${url}`);
    notify("copy");
  };

  const copyLink = async () => {
    const qs = toParams(s);
    const url = `${window.location.origin}${window.location.pathname}?${qs}`;
    window.history.replaceState(null, "", `?${qs}`);
    await navigator.clipboard?.writeText(url);
    notify("link");
  };

  const reset = () => {
    setS(DEFAULTS);
    setAmountText(formatMoney(DEFAULTS.amount));
    setInsText("");
  };

  const swapMode = (mode: Mode) => {
    if (mode === s.mode) return;
    // Giữ số tiền "đối xứng": chuyển sang chiều ngược lại với kết quả hiện tại.
    const next = result ? (mode === "gross-to-net" ? result.gross : result.net) : s.amount;
    update({ mode, amount: next });
    setAmountText(formatMoney(next));
  };

  const pctNet = result && result.gross > 0 ? result.net / result.gross : 0;

  return (
    <section className="lh-section lht-calc" id="may-tinh" aria-label="Máy tính lương Gross Net">
      <div className="lh-container">
        <div className="lht-print-head" aria-hidden="true">
          <strong>LIGHT HUMAN</strong> · Bảng quy đổi lương Gross ⇄ Net · {s.dependents} người phụ thuộc · {regionLabel(s.region)} ·
          lighthuman.vn/cong-cu/tinh-luong-gross-net
        </div>
        <div className="lht-calc__grid">
          <form className="lht-panel lht-noprint" onSubmit={(e) => e.preventDefault()} noValidate>
            <div className="lht-panel__head">
              <span className="lht-step">Thông tin lương</span>
              <button type="button" className="lht-link-btn" onClick={reset}>
                <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
                Đặt lại
              </button>
            </div>

            <Segmented
              label="Chiều quy đổi"
              value={s.mode}
              onChange={swapMode}
              options={[
                { value: "gross-to-net", label: "Gross → Net" },
                { value: "net-to-gross", label: "Net → Gross" },
              ]}
              icon={<ArrowLeftRight size={16} strokeWidth={2} aria-hidden="true" />}
              wide
            />

            <div className="lht-field">
              <label htmlFor={ids.amount} className="lht-label">
                {isG2N ? "Lương Gross / tháng" : "Lương Net mong muốn / tháng"}
              </label>
              <div className="lht-money">
                <input
                  id={ids.amount}
                  className="lht-money__input"
                  inputMode="numeric"
                  autoComplete="off"
                  value={amountText}
                  placeholder="VD: 30.000.000 hoặc 30tr"
                  onChange={(e) => {
                    const n = parseMoney(e.target.value);
                    setAmountText(e.target.value);
                    update({ amount: n });
                  }}
                  onBlur={() => setAmountText(s.amount ? formatMoney(s.amount) : "")}
                />
                <span className="lht-money__unit">VNĐ</span>
              </div>
              <div className="lht-presets" aria-label="Mức lương gợi ý">
                {salaryTool.presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="lht-preset"
                    aria-pressed={s.amount === p}
                    onClick={() => {
                      update({ amount: p });
                      setAmountText(formatMoney(p));
                    }}
                  >
                    {formatMillions(p)}
                  </button>
                ))}
              </div>
            </div>

            <div className="lht-row">
              <div className="lht-field">
                <span className="lht-label" id={ids.dep}>
                  Người phụ thuộc
                </span>
                <div className="lht-stepper" role="group" aria-labelledby={ids.dep}>
                  <button
                    type="button"
                    aria-label="Giảm người phụ thuộc"
                    disabled={s.dependents <= 0}
                    onClick={() => update({ dependents: Math.max(0, s.dependents - 1) })}
                  >
                    <Minus size={16} strokeWidth={2} aria-hidden="true" />
                  </button>
                  <output aria-live="polite">{s.dependents}</output>
                  <button
                    type="button"
                    aria-label="Tăng người phụ thuộc"
                    disabled={s.dependents >= MAX_DEPENDENTS}
                    onClick={() => update({ dependents: Math.min(MAX_DEPENDENTS, s.dependents + 1) })}
                  >
                    <Plus size={16} strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="lht-field">
                <Segmented
                  label="Vùng"
                  value={String(s.region)}
                  onChange={(v) => update({ region: Number(v) as Region })}
                  options={[1, 2, 3, 4].map((r) => ({ value: String(r), label: regionLabel(r as Region).replace("Vùng ", "") }))}
                  wide
                />
              </div>
            </div>
            <p className="lht-hint">
              <Info size={14} strokeWidth={2} aria-hidden="true" />
              {regionHelp}
            </p>

            <fieldset className="lht-field lht-fieldset">
              <legend className="lht-label">Lương đóng bảo hiểm</legend>
              <div className="lht-choice">
                <label className="lht-choice__item">
                  <input type="radio" name="ins" checked={!s.insCustom} onChange={() => update({ insCustom: false })} />
                  <span>
                    <strong>Trên lương chính thức</strong>
                    <small>Đóng trên toàn bộ lương Gross (có mức trần)</small>
                  </span>
                </label>
                <label className="lht-choice__item">
                  <input type="radio" name="ins" checked={s.insCustom} onChange={() => update({ insCustom: true })} />
                  <span>
                    <strong>Mức khác</strong>
                    <small>Doanh nghiệp đóng trên lương cơ bản thấp hơn</small>
                  </span>
                </label>
              </div>
              {s.insCustom && (
                <div className="lht-money lht-money--sm">
                  <input
                    id={ids.ins}
                    aria-label="Mức lương đóng bảo hiểm"
                    className="lht-money__input"
                    inputMode="numeric"
                    autoComplete="off"
                    value={insText}
                    placeholder={`Tối thiểu ${formatMoney(salaryRules[s.ruleId].regionalMinimum[s.region])}`}
                    onChange={(e) => {
                      setInsText(e.target.value);
                      update({ insAmount: parseMoney(e.target.value) });
                    }}
                    onBlur={() => setInsText(s.insAmount ? formatMoney(s.insAmount) : "")}
                  />
                  <span className="lht-money__unit">VNĐ</span>
                </div>
              )}
            </fieldset>

            <Segmented
              label="Áp dụng quy định"
              value={s.ruleId}
              onChange={(v) => update({ ruleId: v as RuleId })}
              options={[
                { value: "2026", label: salaryRules["2026"].label },
                { value: "2025", label: salaryRules["2025"].label },
              ]}
              wide
            />
          </form>

          <aside className="lht-result" aria-live="polite">
            <div className="lht-result__glow" aria-hidden="true" />
            {result ? (
              <>
                <span className="lht-result__eyebrow">
                  {isG2N ? "Lương Net thực nhận" : "Lương Gross cần thỏa thuận"} · {result.rules.shortLabel}
                </span>
                <div className="lht-result__big">
                  <AnimatedNumber value={isG2N ? result.net : result.gross} />
                  <span className="lht-result__unit">đ/tháng</span>
                </div>
                <p className="lht-result__sub">
                  {isG2N ? (
                    <>
                      Nhận về <strong>{formatRate(pctNet)}</strong> lương Gross · {formatMoney(result.net * 12)} đ/năm
                    </>
                  ) : (
                    <>
                      Để thực nhận <strong>{formatMoney(result.net)} đ</strong> mỗi tháng
                    </>
                  )}
                </p>

                <SplitBar result={result} />

                <dl className="lht-legend">
                  <LegendRow tone="net" label="Lương Net" value={result.net} />
                  <LegendRow tone="ins" label="Bảo hiểm (NLĐ)" value={result.employee.total} />
                  <LegendRow tone="tax" label="Thuế TNCN" value={result.tax} />
                </dl>

                <div className="lht-result__cost">
                  <span>Tổng chi phí doanh nghiệp</span>
                  <strong>{formatMoney(result.employerCost)} đ</strong>
                </div>

                {other && <DeltaNote current={result} previous={other} isG2N={isG2N} />}

                <div className="lht-actions lht-noprint">
                  <button type="button" className="lht-action" onClick={copyResult}>
                    {flash === "copy" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                    {flash === "copy" ? "Đã sao chép" : "Sao chép"}
                  </button>
                  <button type="button" className="lht-action" onClick={copyLink}>
                    {flash === "link" ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
                    {flash === "link" ? "Đã sao chép" : "Chia sẻ link"}
                  </button>
                  <button type="button" className="lht-action" onClick={() => window.print()}>
                    <Printer size={16} aria-hidden="true" />
                    In / PDF
                  </button>
                </div>
              </>
            ) : (
              <div className="lht-result__empty">
                <span className="lht-result__eyebrow">Kết quả</span>
                <p>Nhập mức lương{s.insCustom ? " và lương đóng bảo hiểm" : ""} để xem kết quả quy đổi.</p>
              </div>
            )}
          </aside>
        </div>

        {result && <SalaryBreakdown result={result} />}

        <OfferCompare dependents={s.dependents} region={s.region} ruleId={s.ruleId} />
      </div>
    </section>
  );
}

function SplitBar({ result }: { result: SalaryResult }) {
  const total = Math.max(1, result.gross);
  const parts = [
    { tone: "net", v: result.net },
    { tone: "ins", v: result.employee.total },
    { tone: "tax", v: result.tax },
  ];
  return (
    <div className="lht-split" role="img" aria-label={`Net ${formatMoney(result.net)}, bảo hiểm ${formatMoney(result.employee.total)}, thuế ${formatMoney(result.tax)}`}>
      {parts.map((p) => (
        <span key={p.tone} className={`lht-split__seg lht-split__seg--${p.tone}`} style={{ width: `${(Math.max(0, p.v) / total) * 100}%` }} />
      ))}
    </div>
  );
}

function LegendRow({ tone, label, value }: { tone: string; label: string; value: number }) {
  return (
    <div className="lht-legend__row">
      <dt>
        <span className={`lht-dot lht-dot--${tone}`} aria-hidden="true" />
        {label}
      </dt>
      <dd>{formatMoney(value)} đ</dd>
    </div>
  );
}

function DeltaNote({ current, previous, isG2N }: { current: SalaryResult; previous: SalaryResult; isG2N: boolean }) {
  const diff = isG2N ? current.net - previous.net : previous.gross - current.gross;
  if (Math.abs(diff) < 1) return null;
  return (
    <p className="lht-delta">
      <span className="lht-delta__badge">{diff > 0 ? "▲" : "▼"} {formatMoney(Math.abs(diff))} đ</span>
      {isG2N
        ? diff > 0
          ? "Net cao hơn so với cách tính năm 2025 nhờ giảm trừ và biểu thuế mới."
          : "Net thấp hơn so với cách tính năm 2025."
        : diff > 0
          ? "Gross cần trả thấp hơn so với cách tính năm 2025."
          : "Gross cần trả cao hơn so với cách tính năm 2025."}
    </p>
  );
}
