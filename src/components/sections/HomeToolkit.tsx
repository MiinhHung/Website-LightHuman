"use client";

import Link from "next/link";
import { useId, useMemo, useState, type CSSProperties } from "react";
import { ArrowRight, Calculator, LayoutGrid, TrendingUp } from "lucide-react";
import { homeToolkit } from "@/content/home";
import { homeToolkitEn } from "@/content/en/home";
import { quoteHref } from "@/content/site";
import { grossToNet } from "@/lib/salary/calc";
import { CURRENT_RULE } from "@/lib/salary/rules";
import { AnimatedNumber } from "@/components/tools/AnimatedNumber";
import { Reveal } from "@/components/ui/Reveal";
import type { Locale } from "@/i18n/config";

const MIN = 5_000_000;
const MAX = 150_000_000;
const STEP = 500_000;
const DEPENDENTS = [0, 1, 2, 3] as const;

// Module-level so AnimatedNumber gets a stable function and only animates on value changes.
const viMoney = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });
const enMoney = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const fmtVi = (n: number) => viMoney.format(Math.round(n));
const fmtEn = (n: number) => enMoney.format(Math.round(n));

/**
 * "Try it now" band on the home page: a live Gross → Net preview (same engine as
 * /cong-cu/tinh-luong-gross-net) beside teasers for the quote board and the
 * compound-interest tool. The point is a first interaction, not the full tool.
 */
export function HomeToolkit({ locale = "vi" }: { locale?: Locale }) {
  const t = locale === "en" ? homeToolkitEn : homeToolkit;
  const fmt = locale === "en" ? fmtEn : fmtVi;
  const [gross, setGross] = useState(30_000_000);
  const [dependents, setDependents] = useState(0);
  const sliderId = useId();
  const depsId = useId();
  const crossLang = locale === "en" ? "vi" : undefined;

  const r = useMemo(
    () => grossToNet(gross, { dependents, region: 1, insuranceBase: null, ruleId: CURRENT_RULE }),
    [gross, dependents],
  );
  const share = (n: number) => `${((n / r.gross) * 100).toFixed(2)}%`;
  const fill = `${((gross - MIN) / (MAX - MIN)) * 100}%`;
  const detailHref = `/cong-cu/tinh-luong-gross-net?m=gn&v=${gross}&d=${dependents}&r=1`;

  return (
    <section className="lh-section lh-kit" aria-labelledby="lh-kit-title">
      <div className="lh-container">
        <div className="lh-kit__head">
          <p className="lh-kit__eyebrow">{t.eyebrow}</p>
          <h2 id="lh-kit-title" className="lh-h2">
            {t.title}
          </h2>
          <p className="lh-lede">{t.lede}</p>
        </div>

        <div className="lh-kit__grid">
          <Reveal className="lh-kit__salary">
            <span className="lh-kit__tag">
              <Calculator size={15} strokeWidth={2} aria-hidden="true" />
              {t.salary.tag}
            </span>
            <h3 className="lh-kit__title">{t.salary.title}</h3>

            <div className="lh-kit__field">
              <label htmlFor={sliderId} className="lh-kit__label">
                {t.salary.gross}
              </label>
              <output htmlFor={sliderId} className="lh-kit__gross">
                {fmt(gross)} <span>{t.salary.unit}</span>
              </output>
              <input
                id={sliderId}
                type="range"
                min={MIN}
                max={MAX}
                step={STEP}
                value={gross}
                onChange={(e) => setGross(Number(e.target.value))}
                className="lh-kit__range"
                style={{ "--fill": fill } as CSSProperties}
                aria-valuetext={`${fmt(gross)} ${t.salary.unit}`}
              />
            </div>

            <div className="lh-kit__field lh-kit__field--row">
              <span id={depsId} className="lh-kit__label">
                {t.salary.dependents}
              </span>
              <div className="lh-kit__deps" role="radiogroup" aria-labelledby={depsId}>
                {DEPENDENTS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    role="radio"
                    aria-checked={dependents === d}
                    className="lh-kit__dep"
                    onClick={() => setDependents(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="lh-kit__result" aria-live="polite">
              <span className="lh-kit__label">{t.salary.net}</span>
              <p className="lh-kit__net">
                <AnimatedNumber value={r.net} format={fmt} /> <span>{t.salary.unit}</span>
              </p>
              <div className="lh-kit__bar" aria-hidden="true">
                <span className="lh-kit__bar-net" style={{ width: share(r.net) }} />
                <span className="lh-kit__bar-ins" style={{ width: share(r.employee.total) }} />
                <span className="lh-kit__bar-tax" style={{ width: share(r.tax) }} />
              </div>
              <dl className="lh-kit__legend">
                <div>
                  <dt>
                    <i className="lh-kit__dot lh-kit__dot--ins" aria-hidden="true" />
                    {t.salary.insurance}
                  </dt>
                  <dd>
                    {fmt(r.employee.total)} {t.salary.unit}
                  </dd>
                </div>
                <div>
                  <dt>
                    <i className="lh-kit__dot lh-kit__dot--tax" aria-hidden="true" />
                    {t.salary.tax}
                  </dt>
                  <dd>
                    {fmt(r.tax)} {t.salary.unit}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lh-kit__foot">
              <p className="lh-kit__note">{t.salary.note}</p>
              <Link href={detailHref} className="lh-kit__link" hrefLang={crossLang}>
                {t.salary.cta}
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          <div className="lh-kit__side">
            <Reveal delay={90}>
              <Link href={quoteHref} className="lh-kit__quote" hrefLang={crossLang}>
                <span className="lh-kit__tag lh-kit__tag--dark">
                  <LayoutGrid size={15} strokeWidth={2} aria-hidden="true" />
                  {t.quote.tag}
                </span>
                <span className="lh-kit__deal" aria-hidden="true">
                  <span className="lh-kit__sheet">
                    <span className="lh-kit__sheet-title">{t.quote.sheet}</span>
                    <span className="lh-kit__sheet-line" />
                    <span className="lh-kit__sheet-line lh-kit__sheet-line--short" />
                  </span>
                  {t.quote.cards.map((c, i) => (
                    <span key={c} className="lh-kit__card" style={{ "--i": i } as CSSProperties}>
                      {c}
                    </span>
                  ))}
                </span>
                <span className="lh-kit__title lh-kit__title--light">{t.quote.title}</span>
                <span className="lh-kit__body">{t.quote.body}</span>
                <span className="lh-kit__cta">
                  {t.quote.cta}
                  <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
            <Reveal delay={160}>
              <Link href="/cong-cu/tinh-lai-kep" className="lh-kit__mini" hrefLang={crossLang}>
                <span className="lh-kit__mini-icon" aria-hidden="true">
                  <TrendingUp size={20} strokeWidth={1.75} />
                </span>
                <span>
                  <span className="lh-kit__mini-tag">{t.compound.tag}</span>
                  <span className="lh-kit__mini-title">{t.compound.title}</span>
                </span>
                <span className="lh-kit__mini-go">
                  {t.compound.cta}
                  <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
