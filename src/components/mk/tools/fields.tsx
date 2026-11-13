"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { fixCopy } from "@/lib/mk";
import { formatMillions, formatMoney, formatRate, parseMoney, regionLabel } from "@/lib/salary/format";
import { regionHelp, salaryRules, type Region, type SalaryRuleSet } from "@/lib/salary/rules";
import type { BracketRow } from "@/lib/salary/calc";
import { Ico } from "../ui";

/* Form fields and result pieces shared by the three calculators (mock tools/calc-section.js + assets/js/tools.js). */

export type RuleId = SalaryRuleSet["id"];
export type Read = { value: number; error: string };

/** Mock `readMoney`: the value is 0 while the field shows an error. */
export function readMoney(raw: string, required: boolean, requiredMsg = "Nhập số tiền lớn hơn 0."): Read {
  const t = raw.trim();
  let error = "";
  if (/^-/.test(t)) error = "Số tiền không được âm.";
  else if (required && parseMoney(t) <= 0) error = requiredMsg;
  return { value: error ? 0 : parseMoney(t), error };
}

export const moneyText = (n: number) => (n ? formatMoney(n) : "");

/** Money in results tweens from the value it showed before (mock `tweenHtml`, 700 ms ease-out). */
export function Tn({ v }: { v: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(v);
  useLayoutEffect(() => {
    // Write into React's own text node so later renders keep updating the visible text.
    const node = ref.current?.firstChild;
    const from = shown.current;
    if (!node || from === v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown.current = v;
      return;
    }
    node.nodeValue = formatMoney(from);
    let raf = 0;
    let t0: number | null = null;
    const frame = (t: number) => {
      if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / 700);
      const cur = Math.round(from + (v - from) * (1 - Math.pow(1 - p, 3)));
      shown.current = cur;
      node.nodeValue = formatMoney(cur);
      if (p < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [v]);
  return (
    <span className="tn" ref={ref}>
      {formatMoney(v)}
    </span>
  );
}

/** Mock `sign()`: "- 1.234" for deductions, plain for totals. */
export const Signed = ({ n, s }: { n: number; s?: string }) => (
  <>
    {n > 0 && s ? `${s} ` : ""}
    <Tn v={n} />
  </>
);

/* ------------------------------------------------------------------ form */
function Label({ id, text, tag = "label" }: { id: string; text: string; tag?: "label" | "p" }) {
  return tag === "label" ? (
    <label className="calc-label" htmlFor={id} id={`${id}-label`}>
      {text}
    </label>
  ) : (
    <p className="calc-label" id={`${id}-label`}>
      {text}
    </p>
  );
}

const ErrBox = ({ id, error }: { id: string; error: string }) => (
  <p className="calc-err field-err" id={`${id}-err`} hidden={!error}>
    {error}
  </p>
);

export function FormHead({ step, onReset }: { step: string; onReset: () => void }) {
  return (
    <div className="calc-form-head">
      <p className="calc-step">{step}</p>
      <button type="button" className="calc-reset" data-reset="" onClick={onReset}>
        Đặt lại
      </button>
    </div>
  );
}

export function MoneyField({
  id,
  label,
  hint,
  text,
  setText,
  error,
  placeholder,
  presets,
  presetLabel = formatMillions,
  presetsLabel = "Mức gợi ý",
  className,
  hidden,
  dataAttr,
}: {
  id: string;
  label: string;
  hint?: string;
  text: string;
  setText: (t: string) => void;
  error: string;
  placeholder?: string;
  presets?: number[];
  presetLabel?: (n: number) => string;
  presetsLabel?: string;
  className?: string;
  hidden?: boolean;
  dataAttr?: string;
}) {
  const desc = [hint ? `${id}-hint` : "", `${id}-err`].filter(Boolean).join(" ");
  const current = parseMoney(text);
  return (
    <div className={className ? `calc-field ${className}` : "calc-field"} hidden={hidden} {...(dataAttr ? { [dataAttr]: "" } : {})}>
      <Label id={id} text={label} />
      {hint && (
        <p className="calc-hint" id={`${id}-hint`}>
          {fixCopy(hint)}
        </p>
      )}
      <div className="input-wrap calc-money">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          data-money=""
          aria-describedby={desc}
          aria-invalid={error ? true : undefined}
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            const raw = text.trim();
            if (raw && !/^-/.test(raw)) setText(moneyText(parseMoney(raw)));
          }}
        />
        <em>VNĐ</em>
      </div>
      <ErrBox id={id} error={error} />
      {presets && (
        <div className="calc-presets" role="group" aria-label={presetsLabel} data-presets={id}>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              className="chip chip-sm"
              data-preset={p}
              aria-pressed={p === current}
              onClick={() => setText(p ? formatMoney(p) : "0")}
            >
              {presetLabel(p)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type Opt<T extends string> = { value: T; label: string; ariaLabel?: string };

/** Single-choice chip group (aria-pressed). */
export function Choice<T extends string>({
  id,
  label,
  attr,
  options,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  attr: string;
  options: Opt<T>[];
  value: T;
  onChange: (v: T) => void;
  children?: ReactNode;
}) {
  return (
    <div className="calc-field">
      <Label id={id} text={label} tag="p" />
      <div className="calc-chips" role="group" aria-labelledby={`${id}-label`} data-choice={attr}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className="chip"
            {...{ [attr]: o.value }}
            aria-pressed={o.value === value}
            aria-label={o.ariaLabel}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}

export const MAX_DEPENDENTS = 15;

export function Stepper({ id, value, onChange }: { id: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="calc-field">
      <Label id={id} text="Người phụ thuộc" tag="p" />
      <div className="stepper" role="group" aria-labelledby={`${id}-label`} data-stepper="" data-min="0" data-max={MAX_DEPENDENTS}>
        <button type="button" data-step="-1" aria-label="Giảm người phụ thuộc" disabled={value <= 0} onClick={() => onChange(Math.max(0, value - 1))}>
          <Ico name="minus" />
        </button>
        <output id={id} aria-live="polite" aria-labelledby={`${id}-label`}>
          {value}
        </output>
        <button
          type="button"
          data-step="1"
          aria-label="Tăng người phụ thuộc"
          disabled={value >= MAX_DEPENDENTS}
          onClick={() => onChange(Math.min(MAX_DEPENDENTS, value + 1))}
        >
          <Ico name="plus" />
        </button>
      </div>
    </div>
  );
}

const REGIONS = ([1, 2, 3, 4] as Region[]).map((r) => ({
  value: String(r),
  label: regionLabel(r).replace("Vùng ", ""),
  ariaLabel: regionLabel(r),
}));

export const RegionChoice = ({ p, value, onChange }: { p: string; value: Region; onChange: (r: Region) => void }) => (
  <Choice id={`${p}-region`} label="Vùng" attr="data-region" options={REGIONS} value={String(value)} onChange={(v) => onChange(Number(v) as Region)} />
);

export const RegionHelp = ({ p }: { p: string }) => (
  <p className="calc-hint calc-hint-ico" id={`${p}-region-help`}>
    <Ico name="info" />
    <span>{fixCopy(regionHelp)}</span>
  </p>
);

export function Insurance({
  p,
  fullTitle,
  fullSub,
  customSub,
  custom,
  setCustom,
  text,
  setText,
  error,
  ruleId,
  region,
}: {
  p: string;
  fullTitle: string;
  fullSub: string;
  customSub: string;
  custom: boolean;
  setCustom: (c: boolean) => void;
  text: string;
  setText: (t: string) => void;
  error: string;
  ruleId: RuleId;
  region: Region;
}) {
  return (
    <fieldset className="calc-field calc-fieldset">
      <legend className="calc-label">Lương đóng bảo hiểm</legend>
      <div className="calc-radios">
        <label className="calc-radio">
          <input type="radio" name={`${p}-ins`} value="full" checked={!custom} onChange={() => setCustom(false)} />
          <span>
            <strong>{fullTitle}</strong>
            <small>{fullSub}</small>
          </span>
        </label>
        <label className="calc-radio">
          <input type="radio" name={`${p}-ins`} value="custom" checked={custom} onChange={() => setCustom(true)} />
          <span>
            <strong>Mức khác</strong>
            <small>{customSub}</small>
          </span>
        </label>
      </div>
      <MoneyField
        id={`${p}-ins-amount`}
        label="Mức lương đóng bảo hiểm"
        text={text}
        setText={setText}
        error={custom ? error : ""}
        placeholder={`Tối thiểu ${formatMoney(salaryRules[ruleId].regionalMinimum[region])}`}
        className="calc-sub"
        dataAttr="data-ins-custom"
        hidden={!custom}
      />
    </fieldset>
  );
}

export const RuleChoice = ({ p, value, onChange }: { p: string; value: RuleId; onChange: (r: RuleId) => void }) => (
  <Choice
    id={`${p}-rule`}
    label="Áp dụng quy định"
    attr="data-rule"
    options={(["2026", "2025"] as RuleId[]).map((r) => ({ value: r, label: fixCopy(salaryRules[r].label) }))}
    value={value}
    onChange={onChange}
  />
);

export function Legal({ list, disclaimer }: { list: string[] | null; disclaimer: string }) {
  return (
    <div className="calc-legal">
      {list && (
        <details>
          <summary>
            Căn cứ pháp lý
            <span className="calc-legal-ico">
              <Ico name="caret-down" />
            </span>
          </summary>
          <ul>
            {list.map((l) => (
              <li key={l}>{fixCopy(l)}</li>
            ))}
          </ul>
        </details>
      )}
      <p className="fine">
        <Ico name="info" />
        <span>{fixCopy(disclaimer)}</span>
      </p>
    </div>
  );
}

/** Two-column calculator shell: form left, sticky result right, details below. */
export function CalcShell({
  p,
  kind,
  title,
  form,
  result,
  resultRef,
  children,
}: {
  p: string;
  kind: string;
  title: string;
  form: ReactNode;
  result: ReactNode;
  resultRef: string;
  children: ReactNode;
}) {
  return (
    <section className="calc-sec tone-paper" id="may-tinh" aria-labelledby={`${p}-calc-h`}>
      <div className="wrap">
        <h2 className="sr-only" id={`${p}-calc-h`}>
          {title}
        </h2>
        <div className="calc" data-calc={kind}>
          <div className="calc-grid">
            <form className="calc-form shell" noValidate aria-labelledby={`${p}-calc-h`} onSubmit={(e) => e.preventDefault()}>
              <div className="core">{form}</div>
            </form>
            <aside className="calc-result" aria-label="Kết quả">
              <div className="calc-result-body" data-result="" aria-live="polite">
                {result}
              </div>
              <p className="calc-ref">
                <Ico name="info" />
                <span>{resultRef}</span>
              </p>
            </aside>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ result pieces */
export type Part = { tone: string; label: string; v: number };

export function SplitBar({ parts, total, label }: { parts: Part[]; total: number; label: string }) {
  return (
    <div className="calc-split" role="img" aria-label={label}>
      {parts.map((p) => (
        <span key={p.tone} className={`seg seg-${p.tone}`} style={{ width: `${((Math.max(0, p.v) / Math.max(1, total)) * 100).toFixed(2)}%` }} />
      ))}
    </div>
  );
}

export function Legend({ parts }: { parts: Part[] }) {
  return (
    <dl className="calc-legend">
      {parts.map((p) => (
        <div key={p.tone}>
          <dt>
            <i className={`sw sw-${p.tone}`} aria-hidden="true" />
            {p.label}
          </dt>
          <dd>
            <Tn v={Math.floor(p.v)} /> đ
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function BigNum({ eyebrow, value, unit }: { eyebrow: string; value: number; unit: string }) {
  return (
    <>
      <p className="calc-r-eyebrow">{eyebrow}</p>
      <p className="calc-r-big">
        <span>
          <Tn v={Math.floor(value)} />
        </span>
        <small>{unit}</small>
      </p>
    </>
  );
}

export const RRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="calc-r-row">
    <span>{label}</span>
    <strong>{children}</strong>
  </div>
);

export const Row = ({ label, cls, children }: { label: string; cls?: string; children: ReactNode }) => (
  <tr className={cls}>
    <th scope="row">{label}</th>
    <td>{children}</td>
  </tr>
);

export function Card({ step, title, cls, children }: { step: string; title: string; cls?: string; children: ReactNode }) {
  return (
    <article className={cls ? `calc-card ${cls}` : "calc-card"}>
      <header>
        <p className="calc-step">{step}</p>
        <h3 className="h4">{title}</h3>
      </header>
      {children}
    </article>
  );
}

function bracketLabel(from: number, to: number) {
  if (from === 0) return `Đến ${formatMillions(to)}`;
  if (to === Infinity) return `Trên ${formatMillions(from)}`;
  return `${formatMillions(from).replace(" triệu", "")} - ${formatMillions(to)}`;
}

export function BracketLadder({ brackets, amtLabel, total }: { brackets: BracketRow[]; amtLabel: string; total: number }) {
  const maxTax = Math.max(1, ...brackets.map((b) => b.tax));
  return (
    <>
      <ol className="calc-brackets">
        {brackets.map((b) => {
          const active = b.amount > 0;
          return (
            <li key={b.from} className={active ? "is-active" : ""}>
              <div className="br-top">
                <span className="br-rate">{formatRate(b.rate)}</span>
                <span className="br-range">{bracketLabel(b.from, b.to)}</span>
                <span className="br-tax">
                  <Tn v={b.tax} />
                </span>
              </div>
              <div className="br-bar" aria-hidden="true">
                <span style={{ width: `${((b.tax / maxTax) * 100).toFixed(2)}%` }} />
              </div>
              {active && (
                <p className="br-amt">
                  {amtLabel} <Tn v={b.amount} /> đ
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <p className="calc-card-foot">
        <span>Tổng thuế</span>
        <strong>
          <Tn v={total} /> đ
        </strong>
      </p>
    </>
  );
}

export const EmptyState = ({ msg }: { msg: string }) => (
  <div className="calc-empty">
    <p className="calc-r-eyebrow">Kết quả</p>
    <p>{msg}</p>
  </div>
);

export const Delta = ({ badge, children }: { badge: ReactNode; children: ReactNode }) => (
  <p className="calc-delta">
    <span className="calc-delta-badge">{badge}</span>
    {children}
  </p>
);

/**
 * Mirrors the calculator state into the query string so the address bar is always a
 * shareable link. Untouched pages keep their URL as loaded.
 */
export function useQuerySync(qs: string) {
  const initial = useRef(qs);
  const touched = useRef(false);
  useEffect(() => {
    if (!touched.current && qs === initial.current) return;
    touched.current = true;
    const t = window.setTimeout(() => {
      const { pathname, hash } = window.location;
      window.history.replaceState(null, "", `${pathname}?${qs}${hash}`);
    }, 300);
    return () => window.clearTimeout(t);
  }, [qs]);
}

/** Width of an element, re-measured on resize (mock: chart redrawn when width changes by 8px+). */
export function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = -1;
    let t = 0;
    const measure = () => {
      const cw = el.clientWidth;
      if (!cw || Math.abs(cw - last) < 8) return;
      const delay = last < 0 ? 0 : 120;
      last = cw;
      window.clearTimeout(t);
      t = window.setTimeout(() => setW(cw), delay);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);
  return [ref, w] as const;
}

export const css = (vars: Record<string, string | number>) => vars as CSSProperties;
