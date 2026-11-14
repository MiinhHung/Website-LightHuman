"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { grossToNet } from "@/lib/salary/calc";
import { CURRENT_RULE } from "@/lib/salary/rules";
import type { homeToolkit } from "@/content/home";
import type { Locale } from "@/i18n/config";
import { Ico } from "../ui";
import { Tn } from "../tools/fields";

const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** Home bento: live Gross → Net preview, same engine as /cong-cu/tinh-luong-gross-net. */
export function MiniSalary({ t, locale }: { t: (typeof homeToolkit)["salary"]; locale: Locale }) {
  const [raw, setRaw] = useState("30.000.000");
  const [dep, setDep] = useState(0);
  const depId = useId();
  const noteId = useId();
  const amount = parseInt(raw.replace(/\D/g, ""), 10) || 0;

  const r = useMemo(
    () => (amount ? grossToNet(amount, { dependents: dep, region: 1, insuranceBase: null, ruleId: CURRENT_RULE }) : null),
    [amount, dep],
  );
  // Tn tweens from the previous value, so typing makes the figures roll like the tool pages.
  const money = (n: number) => (
    <>
      <Tn v={n} /> {t.unit}
    </>
  );
  const change = (d: number) => setDep((v) => Math.max(0, Math.min(9, v + d)));

  return (
    <article className="bento-cell bento-salary shell">
      <div className="core">
        <p className="cell-tag">
          <Ico name="salary" />
          {t.tag}
        </p>
        <h3 className="h3">{t.title}</h3>
        <div className="mini-form">
          <label className="field">
            <span>{t.gross}</span>
            <span className="input-wrap">
              <input
                type="text"
                inputMode="numeric"
                value={raw}
                aria-describedby={noteId}
                onChange={(e) => {
                  const n = parseInt(e.target.value.replace(/\D/g, ""), 10) || 0;
                  setRaw(n ? fmt(n) : "");
                }}
              />
              <em>{t.unit}</em>
            </span>
          </label>
          <div className="field">
            <span id={depId}>{t.dependents}</span>
            <div className="stepper" role="group" aria-labelledby={depId}>
              <button type="button" aria-label={locale === "en" ? "One fewer" : "Bớt một người"} onClick={() => change(-1)}>
                <Ico name="minus" />
              </button>
              <output>{dep}</output>
              <button type="button" aria-label={locale === "en" ? "One more" : "Thêm một người"} onClick={() => change(1)}>
                <Ico name="plus" />
              </button>
            </div>
          </div>
        </div>
        <dl className="mini-out" aria-live="polite">
          <div className="mini-net">
            <dt>{t.net}</dt>
            <dd>{r ? money(r.net) : "-"}</dd>
          </div>
          <div>
            <dt>{t.insurance}</dt>
            <dd>{r ? money(r.employee.total) : "-"}</dd>
          </div>
          <div>
            <dt>{t.tax}</dt>
            <dd>{r ? money(r.tax) : "-"}</dd>
          </div>
        </dl>
        <p className="fine" id={noteId}>
          {t.note}
        </p>
        <Link className="link-line" href={`/cong-cu/tinh-luong-gross-net?m=gn&v=${amount}&d=${dep}&r=1`} hrefLang={locale === "en" ? "vi" : undefined}>
          {t.cta}
          <Ico name="arrow-right" />
        </Link>
      </div>
    </article>
  );
}
