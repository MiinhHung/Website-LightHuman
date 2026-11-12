"use client";

import { useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Info, Link2, Minus, Plus, RotateCcw } from "lucide-react";
import {
  computePit,
  marginalTax,
  SHORT_TERM_THRESHOLD,
  taxFreeThreshold,
  taxUnderRules,
  type PitCase,
  type PitInput,
  type PitResult,
} from "@/lib/salary/pit";
import { CURRENT_RULE, regionHelp, salaryRules, type Region } from "@/lib/salary/rules";
import { formatMillions, formatMoney, formatRate, regionLabel } from "@/lib/salary/format";
import { pitTool } from "@/content/tools";
import { AnimatedNumber } from "../AnimatedNumber";
import { MoneyField, Segmented } from "../ui";
import { PitBreakdown } from "./PitBreakdown";

type RuleId = PitInput["ruleId"];

type State = {
  case: PitCase;
  income: number;
  exempt: number;
  dependents: number;
  region: Region;
  insCustom: boolean;
  insAmount: number;
  ruleId: RuleId;
};

const DEFAULTS: State = {
  case: "resident",
  income: 30_000_000,
  exempt: 0,
  dependents: 0,
  region: 1,
  insCustom: false,
  insAmount: 0,
  ruleId: CURRENT_RULE,
};

const MAX_DEPENDENTS = 15;
const CASES: PitCase[] = ["resident", "short", "nonresident"];
const CASE_CODE: Record<PitCase, string> = { resident: "cu", short: "ng", nonresident: "kh" };

/** Share link: ?k=cu|ng|kh&v=&x=&d=&g=&b=&y= */
function stateFromParams(sp: URLSearchParams): Partial<State> {
  const out: Partial<State> = {};
  const k = CASES.find((c) => CASE_CODE[c] === sp.get("k"));
  if (k) out.case = k;
  const v = Number(sp.get("v"));
  if (v > 0) out.income = Math.min(v, 99_999_999_999);
  const x = Number(sp.get("x"));
  if (x > 0) out.exempt = Math.min(x, 99_999_999_999);
  const d = Number(sp.get("d"));
  if (Number.isInteger(d) && d >= 0) out.dependents = Math.min(d, MAX_DEPENDENTS);
  const g = Number(sp.get("g"));
  if ([1, 2, 3, 4].includes(g)) out.region = g as Region;
  const b = Number(sp.get("b"));
  if (b > 0) {
    out.insCustom = true;
    out.insAmount = b;
  }
  const y = sp.get("y");
  if (y === "2025" || y === "2026") out.ruleId = y;
  return out;
}

function toParams(s: State) {
  const p = new URLSearchParams({ k: CASE_CODE[s.case], v: String(s.income), d: String(s.dependents), g: String(s.region), y: s.ruleId });
  if (s.exempt > 0) p.set("x", String(s.exempt));
  if (s.insCustom && s.insAmount > 0) p.set("b", String(s.insAmount));
  return p.toString();
}

function toInput(s: State): PitInput {
  return {
    case: s.case,
    income: s.income,
    exempt: s.exempt,
    dependents: s.dependents,
    region: s.region,
    insuranceBase: s.insCustom ? s.insAmount : null,
    ruleId: s.ruleId,
  };
}

export function PitCalculatorWithQuery() {
  const sp = useSearchParams();
  return <PitCalculator initial={stateFromParams(new URLSearchParams(sp.toString()))} />;
}

export function PitCalculator({ initial }: { initial?: Partial<State> }) {
  const [s, setS] = useState<State>({ ...DEFAULTS, ...initial });
  const [copied, setCopied] = useState(false);
  const depId = useId();
  const update = (patch: Partial<State>) => setS((prev) => ({ ...prev, ...patch }));

  const resident = s.case === "resident";
  const ready = s.income > 0 && (!resident || !s.insCustom || s.insAmount > 0);
  const input = toInput(s);
  const result = ready ? computePit(input) : null;
  const caseCopy = pitTool.cases[s.case];

  const copyLink = async () => {
    const qs = toParams(s);
    window.history.replaceState(null, "", `?${qs}`);
    await navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}?${qs}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="lh-section lht-calc" id="may-tinh" aria-label="Máy tính thuế thu nhập cá nhân">
      <div className="lh-container">
        <div className="lht-calc__grid">
          <form className="lht-panel" onSubmit={(e) => e.preventDefault()} noValidate>
            <div className="lht-panel__head">
              <span className="lht-step">Thông tin thu nhập</span>
              <button type="button" className="lht-link-btn" onClick={() => setS(DEFAULTS)}>
                <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
                Đặt lại
              </button>
            </div>

            <Segmented
              label="Bạn thuộc trường hợp nào?"
              value={s.case}
              onChange={(c) => update({ case: c })}
              options={CASES.map((c) => ({ value: c, label: pitTool.cases[c].label }))}
              wide
            />
            <p className="lht-hint">
              <Info size={14} strokeWidth={2} aria-hidden="true" />
              {caseCopy.desc}
            </p>

            <MoneyField
              label={s.case === "short" ? "Số tiền mỗi lần chi trả" : "Tổng thu nhập / tháng (Gross)"}
              value={s.income}
              onChange={(n) => update({ income: n })}
              presets={pitTool.presets}
              presetLabel={formatMillions}
            />

            {s.case !== "short" && (
              <MoneyField
                label="Trong đó: thu nhập miễn thuế"
                hint={pitTool.exemptHint}
                value={s.exempt}
                onChange={(n) => update({ exempt: n })}
                placeholder="Không có thì để trống"
                size="sm"
              />
            )}

            {resident && (
              <>
                <div className="lht-row">
                  <div className="lht-field">
                    <span className="lht-label" id={depId}>
                      Người phụ thuộc
                    </span>
                    <div className="lht-stepper" role="group" aria-labelledby={depId}>
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
                      <input type="radio" name="pit-ins" checked={!s.insCustom} onChange={() => update({ insCustom: false })} />
                      <span>
                        <strong>Trên toàn bộ thu nhập</strong>
                        <small>Có mức trần theo quy định</small>
                      </span>
                    </label>
                    <label className="lht-choice__item">
                      <input type="radio" name="pit-ins" checked={s.insCustom} onChange={() => update({ insCustom: true })} />
                      <span>
                        <strong>Mức khác</strong>
                        <small>Doanh nghiệp đóng trên lương cơ bản</small>
                      </span>
                    </label>
                  </div>
                  {s.insCustom && (
                    <MoneyField
                      label="Mức lương đóng bảo hiểm"
                      value={s.insAmount}
                      onChange={(n) => update({ insAmount: n })}
                      placeholder={`Tối thiểu ${formatMoney(salaryRules[s.ruleId].regionalMinimum[s.region])}`}
                      size="sm"
                    />
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
              </>
            )}
          </form>

          <aside className="lht-result" aria-live="polite">
            <div className="lht-result__glow" aria-hidden="true" />
            {result ? (
              <ResultPanel result={result} state={s} input={input} copied={copied} onCopyLink={copyLink} />
            ) : (
              <div className="lht-result__empty">
                <span className="lht-result__eyebrow">Kết quả</span>
                <p>Nhập thu nhập{s.insCustom && resident ? " và lương đóng bảo hiểm" : ""} để xem số thuế phải nộp.</p>
              </div>
            )}
          </aside>
        </div>

        {result && <PitBreakdown result={result} dependents={s.dependents} />}
      </div>
    </section>
  );
}

function ResultPanel({
  result: r,
  state: s,
  input,
  copied,
  onCopyLink,
}: {
  result: PitResult;
  state: State;
  input: PitInput;
  copied: boolean;
  onCopyLink: () => void;
}) {
  const resident = r.case === "resident";
  const perPayment = r.case === "short";
  const old = resident && s.ruleId === "2026" ? taxUnderRules(r, s.dependents, "2025") : null;
  const saved = old === null ? 0 : old - r.tax;
  const extra = resident || r.case === "nonresident" ? marginalTax(input) : null;
  const threshold = resident
    ? taxFreeThreshold({ exempt: s.exempt, dependents: s.dependents, region: s.region, insuranceBase: null, ruleId: s.ruleId })
    : null;

  return (
    <>
      <span className="lht-result__eyebrow">
        Thuế TNCN {perPayment ? "khấu trừ mỗi lần chi trả" : "mỗi tháng"} · {pitTool.cases[r.case].short}
      </span>
      <div className="lht-result__big">
        <AnimatedNumber value={r.tax} />
        <span className="lht-result__unit">{perPayment ? "đ/lần" : "đ/tháng"}</span>
      </div>
      <p className="lht-result__sub">
        {r.tax > 0 ? (
          <>
            Thuế suất thực tế <strong>{formatRate(r.effectiveRate, 2)}</strong>
            {resident && <> · bậc cao nhất {formatRate(r.topRate)}</>}
            {!perPayment && <> · {formatMoney(r.tax * 12)} đ/năm</>}
          </>
        ) : perPayment ? (
          <>Dưới {formatMoney(SHORT_TERM_THRESHOLD)} đ mỗi lần chi trả nên chưa bị khấu trừ.</>
        ) : (
          <>Bạn chưa phải nộp thuế với mức thu nhập này.</>
        )}
      </p>

      <div className="lht-split" role="img" aria-label={`Thực nhận ${formatMoney(r.net)}, bảo hiểm ${formatMoney(r.insurance.total)}, thuế ${formatMoney(r.tax)}`}>
        {[
          { tone: "net", v: r.net },
          { tone: "ins", v: r.insurance.total },
          { tone: "tax", v: r.tax },
        ].map((p) => (
          <span key={p.tone} className={`lht-split__seg lht-split__seg--${p.tone}`} style={{ width: `${(Math.max(0, p.v) / Math.max(1, r.income)) * 100}%` }} />
        ))}
      </div>
      <dl className="lht-legend">
        <Legend tone="net" label="Thực nhận" value={r.net} />
        {resident && <Legend tone="ins" label="Bảo hiểm (NLĐ)" value={r.insurance.total} />}
        <Legend tone="tax" label="Thuế TNCN" value={r.tax} />
      </dl>

      <div className="lht-pit-facts">
        {extra !== null && (
          <div>
            <span>Mỗi 1 triệu tăng thêm</span>
            <strong>+{formatMoney(extra)} đ thuế</strong>
          </div>
        )}
        {threshold !== null && (
          <div>
            <span>Chưa nộp thuế nếu thu nhập ≤</span>
            <strong>{formatMoney(threshold)} đ</strong>
          </div>
        )}
      </div>

      {saved > 0 && (
        <p className="lht-delta">
          <span className="lht-delta__badge">▼ {formatMoney(saved)} đ</span>
          Nộp ít hơn mỗi tháng so với luật cũ (giảm trừ 11 triệu, biểu 7 bậc) — {formatMoney(saved * 12)} đ mỗi năm.
        </p>
      )}

      <div className="lht-actions">
        <button type="button" className="lht-action" onClick={onCopyLink}>
          {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
          {copied ? "Đã sao chép" : "Chia sẻ link"}
        </button>
      </div>
    </>
  );
}

function Legend({ tone, label, value }: { tone: string; label: string; value: number }) {
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
