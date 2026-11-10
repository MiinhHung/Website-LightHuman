"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy, Hourglass, Link2, Printer, RotateCcw, SlidersHorizontal, TrendingUp, Wallet } from "lucide-react";
import {
  compound,
  FREQUENCY_LABEL,
  MAX_YEARS,
  type CompoundInput,
  type CompoundResult,
  type Frequency,
} from "@/lib/finance/compound";
import { formatMillions, formatMoney, formatRate } from "@/lib/salary/format";
import { compoundTool } from "@/content/tools";
import { AnimatedNumber } from "../AnimatedNumber";
import { MoneyField, RangeField, Segmented } from "../ui";
import { GrowthChart, formatCompact } from "./GrowthChart";
import { FormulaCard } from "./FormulaCard";

const DEFAULTS: CompoundInput = {
  principal: 100_000_000,
  monthly: 3_000_000,
  years: 10,
  ratePct: 7,
  frequency: "month",
  timing: "end",
  inflationPct: 0,
};

const FREQS: Frequency[] = ["year", "quarter", "month", "day"];
const SHORT_FREQ: Record<Frequency, string> = { year: "Năm", quarter: "Quý", month: "Tháng", day: "Ngày" };
const money = (n: number) => formatMoney(Math.floor(n));
const presetLabel = (n: number) => (n === 0 ? "Không" : formatMillions(n));

/** Đọc trạng thái từ link chia sẻ: ?p=&c=&y=&r=&f=&t=&inf= */
function fromParams(sp: URLSearchParams): Partial<CompoundInput> {
  const out: Partial<CompoundInput> = {};
  const num = (k: string) => {
    const v = sp.get(k);
    if (v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };
  const p = num("p");
  if (p !== null) out.principal = Math.min(p, 1e13);
  const c = num("c");
  if (c !== null) out.monthly = Math.min(c, 1e11);
  const y = num("y");
  if (y !== null && y >= 1) out.years = Math.min(Math.round(y), MAX_YEARS);
  const r = num("r");
  if (r !== null) out.ratePct = Math.min(r, 50);
  const inf = num("inf");
  if (inf !== null) out.inflationPct = Math.min(inf, 30);
  const f = sp.get("f");
  if (f && (FREQS as string[]).includes(f)) out.frequency = f as Frequency;
  if (sp.get("t") === "begin") out.timing = "begin";
  return out;
}

function toParams(s: CompoundInput) {
  const p = new URLSearchParams({
    p: String(s.principal),
    c: String(s.monthly),
    y: String(s.years),
    r: String(s.ratePct),
    f: s.frequency,
  });
  if (s.timing === "begin") p.set("t", "begin");
  if (s.inflationPct > 0) p.set("inf", String(s.inflationPct));
  return p.toString();
}

function summary(r: CompoundResult) {
  const s = r.input;
  return [
    "LIGHT HUMAN · Dự báo lãi kép",
    `Tiền gốc: ${money(s.principal)} đ · Góp thêm: ${money(s.monthly)} đ/tháng`,
    `Lãi suất ${s.ratePct}%/năm · Ghép lãi ${FREQUENCY_LABEL[s.frequency].toLowerCase()} · ${s.years} năm`,
    `Tổng vốn bỏ vào: ${money(r.contributed)} đ`,
    `Tiền lãi: ${money(r.interest)} đ`,
    `Giá trị sau ${s.years} năm: ${money(r.futureValue)} đ`,
    ...(s.inflationPct > 0 ? [`Sức mua hôm nay (lạm phát ${s.inflationPct}%): ${money(r.realValue)} đ`] : []),
  ].join("\n");
}

export function CompoundCalculatorWithQuery() {
  const sp = useSearchParams();
  return <CompoundCalculator initial={fromParams(new URLSearchParams(sp.toString()))} />;
}

export function CompoundCalculator({ initial }: { initial?: Partial<CompoundInput> }) {
  const [s, setS] = useState<CompoundInput>({ ...DEFAULTS, ...initial });
  const [showSimple, setShowSimple] = useState(true);
  const [flash, setFlash] = useState<"copy" | "link" | null>(null);
  const update = (patch: Partial<CompoundInput>) => setS((prev) => ({ ...prev, ...patch }));

  const ready = s.years >= 1 && (s.principal > 0 || s.monthly > 0);
  const r = ready ? compound(s) : null;
  const { presets } = compoundTool;

  const notify = (kind: "copy" | "link") => {
    setFlash(kind);
    window.setTimeout(() => setFlash(null), 1800);
  };
  const url = () => `${window.location.origin}${window.location.pathname}?${toParams(s)}`;
  const copyResult = async () => {
    if (!r) return;
    await navigator.clipboard?.writeText(`${summary(r)}\nXem chi tiết: ${url()}`);
    notify("copy");
  };
  const copyLink = async () => {
    window.history.replaceState(null, "", `?${toParams(s)}`);
    await navigator.clipboard?.writeText(url());
    notify("link");
  };

  const parts = r
    ? [
        { tone: "base", label: "Tiền gốc ban đầu", v: s.principal },
        { tone: "ins", label: "Tổng tiền góp thêm", v: r.totalDeposits },
        { tone: "net", label: "Tiền lãi", v: Math.max(0, r.interest) },
      ]
    : [];

  return (
    <section className="lh-section lht-calc" id="may-tinh" aria-label="Máy tính lãi kép">
      <div className="lh-container">
        <div className="lht-print-head" aria-hidden="true">
          <strong>LIGHT HUMAN</strong> · Dự báo lãi kép · lighthuman.vn/cong-cu/tinh-lai-kep
        </div>

        <div className="lht-calc__grid">
          <form className="lht-panel lht-noprint" onSubmit={(e) => e.preventDefault()} noValidate>
            <div className="lht-panel__head">
              <span className="lht-step">Thông tin của bạn</span>
              <button type="button" className="lht-link-btn" onClick={() => setS(DEFAULTS)}>
                <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
                Đặt lại
              </button>
            </div>

            <div className="lht-group">
              <span className="lht-group__n">1</span>
              <div className="lht-group__body">
                <MoneyField
                  label="Tiền gốc ban đầu"
                  hint="Số tiền bạn có sẵn để gửi hoặc đầu tư ngay."
                  value={s.principal}
                  onChange={(n) => update({ principal: n })}
                  presets={presets.principal}
                  presetLabel={presetLabel}
                />
              </div>
            </div>

            <div className="lht-group">
              <span className="lht-group__n">2</span>
              <div className="lht-group__body">
                <MoneyField
                  label="Góp thêm mỗi tháng"
                  hint="Khoản bạn đều đặn bỏ thêm vào mỗi tháng (có thể để 0)."
                  value={s.monthly}
                  onChange={(n) => update({ monthly: n })}
                  presets={presets.monthly}
                  presetLabel={presetLabel}
                  size="sm"
                />
              </div>
            </div>

            <div className="lht-group">
              <span className="lht-group__n">3</span>
              <div className="lht-group__body lht-group__body--split">
                <RangeField
                  label="Lãi suất"
                  hint="Theo năm"
                  value={s.ratePct}
                  onChange={(n) => update({ ratePct: n })}
                  min={0}
                  max={30}
                  step={0.1}
                  unit="%"
                  marks={presets.rateMarks}
                />
                <RangeField
                  label="Thời gian"
                  hint="Số năm gửi / đầu tư"
                  value={s.years}
                  onChange={(n) => update({ years: Math.max(1, Math.round(n)) })}
                  min={1}
                  max={MAX_YEARS}
                  step={1}
                  unit="năm"
                  marks={presets.yearMarks}
                />
              </div>
            </div>

            <div className="lht-group">
              <span className="lht-group__n">4</span>
              <div className="lht-group__body">
                <Segmented
                  label="Kỳ ghép lãi"
                  value={s.frequency}
                  onChange={(f) => update({ frequency: f })}
                  options={FREQS.map((f) => ({ value: f, label: SHORT_FREQ[f] }))}
                  wide
                />
              </div>
            </div>

            <details className="lht-advanced">
              <summary>
                <SlidersHorizontal size={16} strokeWidth={2} aria-hidden="true" />
                Tùy chọn nâng cao
                <span>Thời điểm góp · Lạm phát</span>
              </summary>
              <div className="lht-advanced__body">
                <Segmented
                  label="Góp tiền vào"
                  value={s.timing}
                  onChange={(t) => update({ timing: t })}
                  options={[
                    { value: "end", label: "Cuối mỗi kỳ" },
                    { value: "begin", label: "Đầu mỗi kỳ" },
                  ]}
                  wide
                />
                <RangeField
                  label="Lạm phát dự kiến"
                  hint="Để quy giá trị tương lai về sức mua hôm nay. Để 0 nếu không cần."
                  value={s.inflationPct}
                  onChange={(n) => update({ inflationPct: n })}
                  min={0}
                  max={15}
                  step={0.1}
                  unit="%"
                  marks={[0, 5, 10, 15]}
                />
              </div>
            </details>
          </form>

          <aside className="lht-result" aria-live="polite">
            <div className="lht-result__glow" aria-hidden="true" />
            {r ? (
              <>
                <span className="lht-result__eyebrow">Sau {s.years} năm bạn sẽ có</span>
                <div className="lht-result__big">
                  <AnimatedNumber value={Math.floor(r.futureValue)} />
                  <span className="lht-result__unit">đồng</span>
                </div>
                <p className="lht-result__sub">
                  Lợi nhuận <strong>+{formatRate(r.roi)}</strong> trên tổng vốn {money(r.contributed)} đ
                </p>

                <div className="lht-split" role="img" aria-label={parts.map((p) => `${p.label} ${money(p.v)} đồng`).join(", ")}>
                  {parts.map((p) => (
                    <span
                      key={p.tone}
                      className={`lht-split__seg lht-split__seg--${p.tone}`}
                      style={{ width: `${(p.v / Math.max(1, r.futureValue)) * 100}%` }}
                    />
                  ))}
                </div>
                <dl className="lht-legend">
                  {parts.map((p) => (
                    <div key={p.tone} className="lht-legend__row">
                      <dt>
                        <span className={`lht-dot lht-dot--${p.tone}`} aria-hidden="true" />
                        {p.label}
                      </dt>
                      <dd>{money(p.v)} đ</dd>
                    </div>
                  ))}
                </dl>

                <div className="lht-stats">
                  <div className="lht-stat">
                    <Hourglass size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>Tiền gốc gấp đôi sau</span>
                    <strong>{r.doublingYears ? `≈ ${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(r.doublingYears)} năm` : "—"}</strong>
                  </div>
                  <div className="lht-stat">
                    <TrendingUp size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>Lãi suất thực nhận / năm</span>
                    <strong>{formatRate(r.effectiveRate, 2)}</strong>
                  </div>
                  <div className="lht-stat">
                    <Wallet size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>Hơn lãi đơn</span>
                    <strong>+{formatCompact(Math.max(0, r.futureValue - r.simpleValue))}</strong>
                  </div>
                </div>

                {s.inflationPct > 0 && (
                  <p className="lht-delta">
                    <span className="lht-delta__badge">{money(r.realValue)} đ</span>
                    là sức mua tương đương hôm nay với lạm phát {s.inflationPct}%/năm.
                  </p>
                )}

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
                <p>Nhập tiền gốc hoặc khoản góp hằng tháng để xem dự báo.</p>
              </div>
            )}
          </aside>
        </div>

        {r && (
          <>
            <article className="lht-card lht-chart-card">
              <header className="lht-chart-card__head">
                <div>
                  <span className="lht-step">Tăng trưởng</span>
                  <h3>Tài sản của bạn qua từng năm</h3>
                </div>
                <label className="lht-switch lht-noprint">
                  <input type="checkbox" checked={showSimple} onChange={(e) => setShowSimple(e.target.checked)} />
                  <span aria-hidden="true" />
                  So sánh lãi đơn
                </label>
              </header>
              <GrowthChart rows={r.rows} showSimple={showSimple} />
            </article>

            <div className="lht-duo">
              <FormulaCard result={r} />
              <article className="lht-card">
                <header className="lht-card__head">
                  <span className="lht-step">Chi tiết</span>
                  <h3>Bảng tích lũy theo năm</h3>
                </header>
                <div className="lht-yeartable">
                  <table className="lht-table">
                    <thead>
                      <tr>
                        <th scope="col">Năm</th>
                        <th scope="col">Vốn đã bỏ vào</th>
                        <th scope="col">Lãi trong năm</th>
                        <th scope="col">Số dư cuối năm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.rows.map((row) => (
                        <tr key={row.year}>
                          <th scope="row">{row.year}</th>
                          <td>{money(row.contributed)}</td>
                          <td className="is-gain">+{money(row.interestYear)}</td>
                          <td>
                            <strong>{money(row.balance)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
