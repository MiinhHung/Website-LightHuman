import { vi } from "@/content/quote/labels.vi";
import { QuoteBuilder } from "@/components/quote/QuoteBuilder";

/**
 * /lien-he above the FAQ: page title and the full-width quote builder. The
 * `#bao-gia` anchor is where every "Báo giá" link on the site lands; direct
 * contact details live in the footer.
 */
export function ContactQuote() {
  return (
    <section className="lh-section lh-contact-page">
      <div className="lh-container">
        <header className="lh-contact-page__head">
          <h1 className="lh-contact-page__title">{vi.pageTitle}</h1>
          <p className="lh-contact-page__lede">{vi.pageSubtitle}</p>
        </header>
        <div id="bao-gia" className="lh-contact-page__form">
          <QuoteBuilder />
        </div>
      </div>
    </section>
  );
}
