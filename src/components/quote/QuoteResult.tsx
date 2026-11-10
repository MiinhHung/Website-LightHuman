"use client";

import type { Ref } from "react";
import { Download } from "lucide-react";
import { vi } from "@/content/quote/labels.vi";
import type { QuoteFormState } from "@/app/lien-he/quote-state";

const vnd = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

type ResultState = Extract<QuoteFormState, { status: "priced" | "manual_required" }>;

/** Outcome card under the form; focusable so the builder can move focus to it after submit. */
export function QuoteResult({
  state,
  onReset,
  ref,
}: {
  state: ResultState;
  onReset: () => void;
  ref?: Ref<HTMLDivElement>;
}) {
  const priced = state.status === "priced";
  const title = priced
    ? state.pricingComplete
      ? vi.result.pricedTitle
      : vi.result.draftTitle
    : vi.result.manualTitle;
  const body = priced
    ? state.pricingComplete
      ? vi.result.pricedBody
      : vi.result.draftBody
    : vi.result.manualBody;

  return (
    <div ref={ref} tabIndex={-1} className="lh-quote-result" role="status">
      <h4>{title}</h4>
      <p>{body}</p>

      {/* The seed price is a placeholder; showing it next to an empty PDF would contradict it. */}
      {priced && state.pricingComplete && (
        <div className="lh-quote-result__amount">
          {vnd.format(state.subtotal)}
          <span className="lh-quote-result__amount-breakdown">
            {" "}
            ({vnd.format(state.unitPrice)} × {state.quantity})
          </span>
        </div>
      )}

      <dl className="lh-quote-result__meta">
        <div>
          <dt>{priced ? vi.result.code : vi.result.requestCode}:</dt>
          <dd>{state.code}</dd>
        </div>
        <div>
          <dt>{vi.result.type}:</dt>
          <dd>{vi.types[state.type]}</dd>
        </div>
      </dl>

      <div className="lh-quote-result__actions">
        {priced &&
          (state.downloads.length > 0 ? (
            state.downloads.map((d) => (
              <a key={d.type} href={d.href} className="lh-btn" rel="nofollow noreferrer">
                <Download size={16} strokeWidth={2} aria-hidden="true" />
                {d.type === "mass" ? vi.result.downloadMass : vi.result.downloadHunt}
              </a>
            ))
          ) : (
            <p className="lh-quote-note">{vi.result.downloadUnavailable}</p>
          ))}
        <button type="button" className="lh-btn--link" onClick={onReset}>
          {vi.result.reset}
        </button>
      </div>
    </div>
  );
}
