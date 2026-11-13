"use client";

import { useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import {
  compound,
  FREQUENCY_LABEL,
  MAX_YEARS,
  PERIODS_PER_YEAR,
  type CompoundInput,
  type CompoundResult,
  type Frequency,
} from "@/lib/finance/compound";
import { formatMillions, formatMoney, formatRate } from "@/lib/salary/format";
import { fixCopy } from "@/lib/mk";
import { compoundTool } from "@/content/tools";
import { Ico } from "../ui";
import {
  BigNum,
  CalcShell,
  Choice,
  css,
  Delta,
  EmptyState,
  FormHead,
  Legal,
  Legend,
  MoneyField,
  moneyText,
  readMoney,
  RRow,
  SplitBar,
  Tn,
  useQuerySync,
  useWidth,
  type Part,
} from "./fields";

const DEFAULTS: CompoundInput = {
  principal: 100_000_000,
  monthly: 3_000_000,
  years: 10,
  ratePct: 7,
  frequency: "month",
  timing: "end",
  inflationPct: 0,
};

const RATE_MAX = 30;
const INF_MAX = 15;
const FREQS: Frequency[] = ["year", "quarter", "month", "day"];
const FREQ_SHORT: Record<Frequency, string> = { year: "Năm", quarter: "Quý", month: "Tháng", day: "Ngày" };

/** Share link: ?p=&c=&y=&r=&f=&t=&inf= */
function fromParams(sp: URLSearchParams): Partial<CompoundInput> {
  const out: Partial<CompoundInput> = {};
  const num = (k: string) => {
    const v = sp.get(k);
    if (v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };
  const p = num("p");
  if (p !== null) out.principal = Math.min(p, 99_999_999_999);
  const c = num("c");
  if (c !== null) out.monthly = Math.min(c, 99_999_999_999);
  const y = num("y");
  if (y !== null && y >= 1) out.years = Math.min(Math.round(y), MAX_YEARS);
  const r = num("r");
  if (r !== null) out.ratePct = Math.min(r, RATE_MAX);
  const inf = num("inf");
  if (inf !== null) out.inflationPct = Math.min(inf, INF_MAX);
  const f = sp.get("f");
  if (f && (FREQS as string[]).includes(f)) out.frequency = f as Frequency;
  if (sp.get("t") === "begin") out.timing = "begin";
  return out;
}

function toParams(s: CompoundInput) {
  const p = new URLSearchParams({ p: String(s.principal), c: String(s.monthly), y: String(s.years), r: String(s.ratePct), f: s.frequency });
  if (s.timing === "begin") p.set("t", "begin");
  if (s.inflationPct > 0) p.set("inf", String(s.inflationPct));
  return p.toString();
}

const nf = (d: number) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: d });
const money = (n: number) => formatMoney(Math.floor(n));

/** 1.234.000.000 → "1,23 tỷ"; 45.600.000 → "45,6 tr". */
function formatCompact(n: number) {
  if (Math.abs(n) >= 1e9) return `${nf(2).format(n / 1e9)} tỷ`;
  if (Math.abs(n) >= 1e6) return `${nf(n >= 1e8 ? 0 : 1).format(n / 1e6)} tr`;
  return nf(0).format(n);
}

const parseNum = (t: string) => parseFloat(String(t).replace(",", "."));
const clampNum = (t: string, min: number, max: number) => {
  const v = parseNum(t);
  return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : 0;
};

/** Range slider paired with a number box (mock `rangeField`). */
type RangeState = { text: string; range: number };

function RangeField({
  id,
  label,
  unit,
  min,
  max,
  step,
  value,
  setValue,
  marks,
  hint,
}: {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: RangeState;
  setValue: (v: RangeState) => void;
  marks?: number[];
  hint?: string;
}) {
  const v = parseNum(value.text);
  const error = !Number.isFinite(v)
    ? `Nhập một số từ ${min} đến ${max}.`
    : v < min || v > max
      ? `Giá trị nằm trong khoảng ${min} đến ${max}.`
      : "";
  const desc = [hint ? `${id}-hint` : "", `${id}-err`].filter(Boolean).join(" ");
  const at = (n: number) => `${((n - min) / (max - min)) * 100}%`;
  return (
    <div className="calc-field calc-range" data-range="" style={css({ "--p": at(value.range) })}>
      <div className="calc-range-head">
        <label className="calc-label" htmlFor={id} id={`${id}-label`}>
          {label}
        </label>
        <span className="calc-num">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value.text}
            aria-describedby={desc}
            aria-invalid={error ? true : undefined}
            onChange={(e) => {
              const n = parseNum(e.target.value);
              setValue({ text: e.target.value, range: Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : value.range });
            }}
          />
          <em>{unit}</em>
        </span>
      </div>
      {hint && (
        <p className="calc-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      <input
        id={`${id}-range`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value.range}
        aria-labelledby={`${id}-label`}
        onChange={(e) => setValue({ text: e.target.value, range: Number(e.target.value) })}
      />
      {marks && (
        <div className="calc-marks" aria-hidden="true">
          {marks.map((m) => (
            <span key={m} style={css({ "--at": at(m) })}>
              {m}
            </span>
          ))}
        </div>
      )}
      <p className="calc-err field-err" id={`${id}-err`} hidden={!error}>
        {error}
      </p>
    </div>
  );
}

const Group = ({ n, children }: { n: number; children: ReactNode }) => (
  <div className="calc-group">
    <span className="calc-group-n" aria-hidden="true">
      {n}
    </span>
    <div className="calc-group-body">{children}</div>
  </div>
);

const P = "lk";
const rs = (n: number): RangeState => ({ text: String(n), range: n });

export function CompoundCalcWithQuery() {
  const sp = useSearchParams();
  return <CompoundCalc initial={fromParams(new URLSearchParams(sp.toString()))} />;
}

export function CompoundCalc({ initial }: { initial?: Partial<CompoundInput> }) {
  const start = { ...DEFAULTS, ...initial };
  const [principalText, setPrincipalText] = useState(moneyText(start.principal));
  const [monthlyText, setMonthlyText] = useState(moneyText(start.monthly));
  const [rate, setRate] = useState(rs(start.ratePct));
  const [years, setYears] = useState(rs(start.years));
  const [frequency, setFrequency] = useState<Frequency>(start.frequency);
  const [timing, setTiming] = useState<CompoundInput["timing"]>(start.timing);
  const [inflation, setInflation] = useState(rs(start.inflationPct));
  const [showSimple, setShowSimple] = useState(true);
  const [chartRef, chartW] = useWidth<HTMLDivElement>(720);

  const principal = readMoney(principalText, false);
  const monthly = readMoney(monthlyText, false);
  const s: CompoundInput = {
    principal: principal.value,
    monthly: monthly.value,
    ratePct: clampNum(rate.text, 0, RATE_MAX),
    years: Math.max(1, Math.round(clampNum(years.text, 1, MAX_YEARS))),
    frequency,
    timing,
    inflationPct: clampNum(inflation.text, 0, INF_MAX),
  };
  useQuerySync(toParams(s));
  const principalError =
    principal.error || (s.principal <= 0 && s.monthly <= 0 ? "Nhập tiền gốc hoặc khoản góp hằng tháng lớn hơn 0." : "");

  const reset = () => {
    setPrincipalText(moneyText(DEFAULTS.principal));
    setMonthlyText(moneyText(DEFAULTS.monthly));
    setRate(rs(DEFAULTS.ratePct));
    setYears(rs(DEFAULTS.years));
    setFrequency(DEFAULTS.frequency);
    setTiming(DEFAULTS.timing);
    setInflation(rs(DEFAULTS.inflationPct));
    setShowSimple(true);
  };

  const t = compoundTool;
  const pr = t.presets;
  const plabel = (n: number) => (n === 0 ? "Không" : formatMillions(n));
  const ready = s.years >= 1 && (s.principal > 0 || s.monthly > 0);
  const r = ready ? compound(s) : null;

  const form = (
    <>
      <FormHead step="Thông tin của bạn" onReset={reset} />
      <Group n={1}>
        <MoneyField
          id={`${P}-principal`}
          label="Tiền gốc ban đầu"
          hint="Số tiền bạn có sẵn để gửi hoặc đầu tư ngay."
          text={principalText}
          setText={setPrincipalText}
          error={principalError}
          presets={pr.principal}
          presetLabel={plabel}
          presetsLabel="Tiền gốc gợi ý"
        />
      </Group>
      <Group n={2}>
        <MoneyField
          id={`${P}-monthly`}
          label="Góp thêm mỗi tháng"
          hint="Khoản bạn đều đặn bỏ thêm vào mỗi tháng (có thể để 0)."
          text={monthlyText}
          setText={setMonthlyText}
          error={monthly.error}
          presets={pr.monthly}
          presetLabel={plabel}
          presetsLabel="Khoản góp gợi ý"
        />
      </Group>
      <Group n={3}>
        <div className="calc-row">
          <RangeField id={`${P}-rate`} label="Lãi suất" unit="%/năm" min={0} max={RATE_MAX} step={0.1} value={rate} setValue={setRate} marks={pr.rateMarks} />
          <RangeField id={`${P}-years`} label="Thời gian" unit="năm" min={1} max={MAX_YEARS} step={1} value={years} setValue={setYears} marks={pr.yearMarks} />
        </div>
      </Group>
      <Group n={4}>
        <Choice
          id={`${P}-freq`}
          label="Kỳ ghép lãi"
          attr="data-freq"
          options={FREQS.map((f) => ({ value: f, label: FREQ_SHORT[f] }))}
          value={frequency}
          onChange={setFrequency}
        />
      </Group>
      <details className="calc-adv">
        <summary>
          <span>Tùy chọn nâng cao</span>
          <small>Thời điểm góp · Lạm phát</small>
          <span className="calc-legal-ico">
            <Ico name="caret-down" />
          </span>
        </summary>
        <div className="calc-adv-body">
          <Choice
            id={`${P}-timing`}
            label="Góp tiền vào"
            attr="data-timing"
            options={[
              { value: "end", label: "Cuối mỗi kỳ" },
              { value: "begin", label: "Đầu mỗi kỳ" },
            ]}
            value={timing}
            onChange={setTiming}
          />
          <RangeField
            id={`${P}-inf`}
            label="Lạm phát dự kiến"
            unit="%/năm"
            min={0}
            max={INF_MAX}
            step={0.1}
            value={inflation}
            setValue={setInflation}
            marks={[0, 5, 10, 15]}
            hint="Để quy giá trị tương lai về sức mua hôm nay. Để 0 nếu không cần."
          />
        </div>
      </details>
    </>
  );

  return (
    <CalcShell
      p={P}
      kind="compound"
      title={t.calcTitle}
      form={form}
      resultRef={t.resultRef}
      result={r ? <Result r={r} /> : <EmptyState msg="Nhập tiền gốc hoặc khoản góp hằng tháng để xem dự báo." />}
    >
      <div className="calc-detail" data-compound-detail="" hidden={!r}>
        <article className="calc-card calc-chart-card">
          <header className="calc-chart-head">
            <div>
              <p className="calc-step">Tăng trưởng</p>
              <h3 className="h4">Tài sản của bạn qua từng năm</h3>
            </div>
            <label className="check">
              <input type="checkbox" id={`${P}-simple`} checked={showSimple} onChange={(e) => setShowSimple(e.target.checked)} />
              <span>So sánh lãi đơn</span>
            </label>
          </header>
          <ul className="calc-chart-legend" aria-hidden="true">
            <li>
              <i className="ln ln-bal" />
              Số dư (lãi kép)
            </li>
            <li>
              <i className="ln ln-base" />
              Vốn đã bỏ vào
            </li>
            <li>
              <i className="ln ln-simple" />
              Nếu chỉ tính lãi đơn
            </li>
          </ul>
          <div className="calc-chart" data-chart="" ref={chartRef}>
            {r && <Chart r={r} showSimple={showSimple} width={chartW} />}
          </div>
        </article>
        <div className="calc-duo">
          <article className="calc-card calc-formula">
            <header>
              <p className="calc-step">Công thức</p>
              <h3 className="h4">Cách tính, từng bước</h3>
            </header>
            <p
              className="calc-formula-main"
              role="img"
              aria-label="FV bằng P nhân (1 cộng i chia m) mũ n nhân m, cộng D nhân [(1 cộng i chia m) mũ n nhân m trừ 1] chia (i chia m)"
            >
              FV = P × (1 + i/m)<sup>n×m</sup> + D × [(1 + i/m)<sup>n×m</sup> − 1] ÷ (i/m)
            </p>
            <dl className="calc-vars">
              {t.variables.map((v) => (
                <div key={v.sym}>
                  <dt>{v.sym}</dt>
                  <dd>
                    <strong>{v.name}</strong>
                    <span>{fixCopy(v.desc)}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <h4 className="calc-sub-h">Áp dụng với số của bạn</h4>
            <div data-formula="">{r && <Formula r={r} />}</div>
          </article>
          <article className="calc-card">
            <header>
              <p className="calc-step">Chi tiết</p>
              <h3 className="h4">Bảng tích lũy theo năm</h3>
            </header>
            <div className="calc-years-wrap" data-years="" tabIndex={0} role="region" aria-label="Bảng tích lũy theo năm, cuộn để xem thêm">
              {r && <YearsTable r={r} />}
            </div>
          </article>
        </div>
      </div>
      <Legal list={null} disclaimer={t.disclaimer} />
    </CalcShell>
  );
}

function Result({ r }: { r: CompoundResult }) {
  const s = r.input;
  const parts: Part[] = [
    { tone: "base", label: "Tiền gốc ban đầu", v: s.principal },
    { tone: "ins", label: "Tổng tiền góp thêm", v: r.totalDeposits },
    { tone: "net", label: "Tiền lãi", v: Math.max(0, r.interest) },
  ];
  return (
    <>
      <BigNum eyebrow={`Sau ${s.years} năm bạn sẽ có`} value={r.futureValue} unit="đồng" />
      <p className="calc-r-sub">
        Lợi nhuận <strong>+{formatRate(r.roi)}</strong> trên tổng vốn <Tn v={Math.floor(r.contributed)} /> đ
      </p>
      <SplitBar parts={parts} total={r.futureValue} label={parts.map((p) => `${p.label} ${money(p.v)} đồng`).join(", ")} />
      <Legend parts={parts} />
      <RRow label="Tiền gốc gấp đôi sau">{r.doublingYears ? `khoảng ${nf(1).format(r.doublingYears)} năm` : "-"}</RRow>
      <RRow label="Lãi suất thực nhận / năm">{formatRate(r.effectiveRate, 2)}</RRow>
      <RRow label="Hơn lãi đơn">+{formatCompact(Math.max(0, r.futureValue - r.simpleValue))}</RRow>
      {s.inflationPct > 0 && (
        <Delta
          badge={
            <>
              <Tn v={Math.floor(r.realValue)} /> đ
            </>
          }
        >
          là sức mua tương đương hôm nay với lạm phát {nf(1).format(s.inflationPct)}%/năm.
        </Delta>
      )}
    </>
  );
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * exp;
}

type Pt = { balance: number; contributed: number; simpleBalance: number };

function Chart({ r, showSimple, width }: { r: CompoundResult; showSimple: boolean; width: number }) {
  const W = Math.max(280, Math.round(width || 720));
  const narrow = W < 560;
  const H = narrow ? 240 : 300;
  const pad = { l: narrow ? 48 : 64, r: 16, t: 16, b: 30 };
  const principal = r.input.principal;
  const pts: Pt[] = [{ balance: principal, contributed: principal, simpleBalance: principal }, ...r.rows];
  const n = pts.length - 1;
  const max = niceMax(Math.max(...pts.map((p) => Math.max(p.balance, showSimple ? p.simpleBalance : 0))));
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const x = (i: number) => pad.l + (n ? (iw * i) / n : 0);
  const y = (v: number) => pad.t + ih - (Math.max(0, v) / max) * ih;
  const line = (key: keyof Pt) => pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(" ");
  const every = Math.max(1, Math.ceil(n / (narrow ? 5 : 10)));
  const ticks: number[] = [];
  for (let i = 0; i <= n; i++) {
    if (i % every === 0 || i === n) {
      if (i !== n && n - i < every * 0.6) continue;
      ticks.push(i);
    }
  }
  const label = `Biểu đồ tăng trưởng ${n} năm: số dư cuối kỳ ${money(r.futureValue)} đồng, vốn đã bỏ vào ${money(r.contributed)} đồng${
    showSimple ? `, nếu chỉ tính lãi đơn ${money(r.simpleValue)} đồng` : ""
  }.`;
  return (
    <svg className="calc-chart-svg" viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={label}>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const yy = y(t * max).toFixed(1);
        return (
          <g key={t}>
            <line className="ch-grid" x1={pad.l} x2={W - pad.r} y1={yy} y2={yy} />
            <text className="ch-tick" x={pad.l - 8} y={yy} dy="4" textAnchor="end">
              {formatCompact(t * max)}
            </text>
          </g>
        );
      })}
      {ticks.map((i) => (
        <text key={i} className="ch-tick" x={x(i).toFixed(1)} y={H - 8} textAnchor="middle">
          {i === 0 ? "Nay" : `Năm ${i}`}
        </text>
      ))}
      <path className="ch-area" d={`${line("balance")} L${x(n).toFixed(1)} ${y(0).toFixed(1)} L${x(0).toFixed(1)} ${y(0).toFixed(1)} Z`} />
      <path className="ch-base" d={line("contributed")} />
      {showSimple && <path className="ch-simple" d={line("simpleBalance")} />}
      <path className="ch-bal" d={line("balance")} />
      <circle className="ch-dot" cx={x(n).toFixed(1)} cy={y(pts[n].balance).toFixed(1)} r="5" />
    </svg>
  );
}

function Formula({ r }: { r: CompoundResult }) {
  const inp = r.input;
  const m = PERIODS_PER_YEAR[inp.frequency];
  const num = (v: number, d = 6) => nf(d).format(v);
  const growth = Math.pow(1 + r.periodRate, r.periods);
  const principalPart = inp.principal * growth;
  const annuityPart = r.futureValue - principalPart;
  const begin = inp.timing === "begin";
  const li = (label: string, code: ReactNode, cls?: string) => (
    <li className={cls}>
      <span>{label}</span>
      <code>{code}</code>
    </li>
  );
  return (
    <ol className="calc-steps">
      {li("Lãi suất mỗi kỳ", `i/m = ${num(inp.ratePct)}% ÷ ${m} = ${num(r.periodRate * 100, 4)}%`)}
      {li(`Số kỳ ghép lãi (${FREQUENCY_LABEL[inp.frequency].toLowerCase()})`, `n×m = ${inp.years} × ${m} = ${num(r.periods, 0)} kỳ`)}
      {li(
        "Hệ số tăng trưởng",
        <>
          (1 + {num(r.periodRate, 6)})<sup>{num(r.periods, 0)}</sup> = {num(growth, 4)}
        </>,
      )}
      {li("Phần tiền gốc", `${money(inp.principal)} × ${num(growth, 4)} = ${money(principalPart)}`)}
      {li("Tiền góp mỗi kỳ", `D = ${money(inp.monthly)} × 12 ÷ ${m} = ${money(r.perPeriodDeposit)}`)}
      {li(
        "Phần tiền góp",
        r.periodRate > 0
          ? `${money(r.perPeriodDeposit)} × (${num(growth, 4)} − 1) ÷ ${num(r.periodRate, 6)}${begin ? ` × ${num(1 + r.periodRate, 6)}` : ""} = ${money(annuityPart)}`
          : `${money(r.perPeriodDeposit)} × ${num(r.periods, 0)} kỳ = ${money(annuityPart)}`,
      )}
      {li("Tổng giá trị FV", `${money(principalPart)} + ${money(annuityPart)} = ${money(r.futureValue)} đ`, "is-total")}
    </ol>
  );
}

function YearsTable({ r }: { r: CompoundResult }) {
  return (
    <table className="calc-table calc-years">
      <caption className="sr-only">Bảng tích lũy theo năm (VNĐ)</caption>
      <thead>
        <tr>
          <th scope="col">Năm</th>
          <th scope="col">Vốn đã bỏ vào</th>
          <th scope="col">Lãi trong năm</th>
          <th scope="col">Lãi đơn</th>
          <th scope="col">Số dư cuối năm</th>
        </tr>
      </thead>
      <tbody>
        {r.rows.map((y) => (
          <tr key={y.year}>
            <th scope="row">{y.year}</th>
            <td>
              <Tn v={Math.floor(y.contributed)} />
            </td>
            <td className="is-gain">
              +<Tn v={Math.floor(y.interestYear)} />
            </td>
            <td>
              <Tn v={Math.floor(y.simpleBalance)} />
            </td>
            <td>
              <strong>
                <Tn v={Math.floor(y.balance)} />
              </strong>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
