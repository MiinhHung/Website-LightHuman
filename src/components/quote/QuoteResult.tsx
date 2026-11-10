"use client";

import { vi } from "@/content/quote/labels.vi";
import type { QuoteFormState } from "@/app/lien-he/quote-state";

const vnd = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

/** Renders the Server Action result as a labelled card with PDF download links. */
export function QuoteResult({
  state,
  onReset,
}: {
  state: QuoteFormState;
  onReset: () => void;
}) {
  if (state.status === "priced") {
    return (
      <div className="lh-quote-result lh-quote-result--priced" role="status">
        <h4>{state.pricingComplete ? vi.result.pricedTitle : vi.result.draftTitle}</h4>
        <p>{state.pricingComplete ? vi.result.pricedBody : vi.result.draftBody}</p>
        {/* The seed price is a placeholder; showing it next to an empty PDF would contradict it. */}
        {state.pricingComplete && (
          <div className="lh-quote-result__amount">
            {vnd.format(state.subtotal)}
            <span className="lh-quote-result__amount-breakdown">
              {" "}
              ({vnd.format(state.unitPrice)} × {state.quantity})
            </span>
          </div>
        )}
        {state.downloads.length > 0 ? (
          <div className="lh-quote-result__actions">
            {state.downloads.map((d) => (
              <a key={d.type} href={d.href} className="lh-btn" rel="nofollow noreferrer">
                {d.type === "mass" ? vi.result.downloadMass : vi.result.downloadHunt}
              </a>
            ))}
          </div>
        ) : (
          <p className="lh-quote-note">{vi.result.downloadUnavailable}</p>
        )}
        <div className="lh-quote-result__code">
          Mã báo giá: {state.code} · Loại: {state.type === "mass" ? vi.types.mass : vi.types.hunt} ·
          Bảng giá {state.pricingVersion}
        </div>
        <div className="lh-quote-result__actions">
          <button type="button" className="lh-btn--link" onClick={onReset}>
            Gửi yêu cầu khác →
          </button>
        </div>
      </div>
    );
  }
  if (state.status === "manual_required") {
    return (
      <div className="lh-quote-result lh-quote-result--manual" role="status">
        <h4>{vi.result.manualTitle}</h4>
        <p>{vi.result.manualBody}</p>
        <div className="lh-quote-result__code">
          Mã yêu cầu: {state.code} · Loại: {state.type === "mass" ? vi.types.mass : vi.types.hunt}
        </div>
        <div className="lh-quote-result__actions">
          <button type="button" className="lh-btn--link" onClick={onReset}>
            Gửi yêu cầu khác →
          </button>
        </div>
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className="lh-quote-result lh-quote-result--error" role="alert">
        <h4>{vi.result.errorTitle}</h4>
        <p>{state.message}</p>
      </div>
    );
  }
  return null;
}
