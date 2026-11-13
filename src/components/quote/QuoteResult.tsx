"use client";

import type { Ref } from "react";
import { BtnIco } from "@/components/mk/ui";
import { site } from "@/content/site";
import { vi } from "@/content/quote/labels.vi";
import type { QuoteFormState } from "@/app/lien-he/quote-state";
import { fill } from "./text";

const vnd = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

export type ResultState = Extract<QuoteFormState, { status: "priced" | "manual_required" }>;

/**
 * Mock `.qd-result` under the stamped sheet. Only real exits are offered: the
 * server-signed PDF (when a token secret exists), the browser print dialog as
 * a fallback, and a prefilled email to BD (nothing is sent automatically yet).
 */
export function QuoteResult({
  state,
  summary,
  mailHref,
  onPrint,
  onReset,
  ref,
}: {
  state: ResultState;
  summary: string;
  mailHref: string;
  onPrint: () => void;
  onReset: () => void;
  ref?: Ref<HTMLDivElement>;
}) {
  const priced = state.status === "priced";
  const downloads = priced ? state.downloads : [];
  return (
    <div ref={ref} className="qd-result" tabIndex={-1} role="status">
      <p className="qd-result-title">{priced ? vi.sheetResult.title : vi.result.manualTitle}</p>
      <dl className="qd-result-meta">
        <div>
          <dt>{priced ? vi.result.code : vi.result.requestCode}</dt>
          <dd className="qd-code">{state.code}</dd>
        </div>
        <div>
          <dt>{vi.result.type}</dt>
          <dd data-type={state.type}>{vi.types[state.type]}</dd>
        </div>
        {/* Seed prices are placeholders; show a figure only once the price book is complete. */}
        {priced && state.pricingComplete && (
          <div>
            <dt>{vi.sheetResult.amount}</dt>
            <dd>
              {vnd.format(state.subtotal)} ({vnd.format(state.unitPrice)} × {state.quantity})
            </dd>
          </div>
        )}
      </dl>
      <p className="qd-result-sum">{summary}</p>
      <p className="qd-result-body">
        {!priced && <strong>{vi.sheetResult.manualNote} </strong>}
        <span>{fill(vi.sheetResult.note, { phone: site.contact.phone })}</span>
      </p>
      <div className="qd-export">
        {downloads.map((d) => (
          <a key={d.type} className="btn btn-gold" href={d.href} rel="nofollow noreferrer">
            <span>{d.type === "mass" ? vi.result.downloadMass : vi.result.downloadHunt}</span>
            <BtnIco name="download" />
          </a>
        ))}
        {downloads.length === 0 && (
          <button type="button" className="btn btn-gold" onClick={onPrint}>
            <span>{vi.sheetResult.print}</span>
            <BtnIco name="download" />
          </button>
        )}
        <a className="btn btn-ghost" href={mailHref}>
          <span>{vi.sheetResult.mail}</span>
          <BtnIco name="envelope" />
        </a>
      </div>
      {downloads.length === 0 && <p className="qd-fine">{vi.sheetResult.printNote}</p>}
      <button className="btn btn-ghost btn-sm" type="button" onClick={onReset}>
        <span>{vi.result.reset}</span>
        <BtnIco name="arrow-left" />
      </button>
    </div>
  );
}
