import { contactInfo } from "@/content/contact";
import { vi } from "@/content/quote/labels.vi";
import { QuoteBuilder } from "@/components/quote/QuoteBuilder";
import { ContactIcon } from "./ContactIcon";

/**
 * /lien-he above the FAQ: page title, direct contact details on the left
 * (sticky on desktop) and the quote builder on the right. The `#bao-gia`
 * anchor is where every "Báo giá" link on the site lands.
 */
export function ContactQuote() {
  return (
    <section className="lh-section lh-contact-page">
      <div className="lh-container">
        <header className="lh-contact-page__head">
          <h1 className="lh-contact-page__title">{vi.pageTitle}</h1>
          <p className="lh-contact-page__lede">{vi.pageSubtitle}</p>
        </header>

        <div className="lh-contact-page__grid">
          <aside className="lh-contact-page__aside" aria-labelledby="contact-direct">
            <h2 id="contact-direct" className="lh-contact-page__aside-title">
              {contactInfo.heading}
            </h2>
            <ul className="lh-contact-page__rows">
              {contactInfo.rows.map((row) => (
                <li key={row.title} className="lh-contact-page__row">
                  <span className="lh-contact-page__icon" aria-hidden="true">
                    <ContactIcon name={row.icon} size={18} />
                  </span>
                  <div>
                    <p className="lh-contact-page__row-title">{row.title}</p>
                    {"href" in row && !("linkLabel" in row) ? (
                      <a className="lh-contact-page__row-link" href={row.href}>
                        {row.lines.join(" ")}
                      </a>
                    ) : (
                      <p className="lh-contact-page__row-body">
                        {row.lines.map((line) => (
                          <span key={line}>{line} </span>
                        ))}
                      </p>
                    )}
                    {"linkLabel" in row && (
                      <a className="lh-contact-page__map" href={row.href} target="_blank" rel="noopener noreferrer">
                        {row.linkLabel}
                        <span className="sr-only"> (mở Google Maps trong tab mới)</span>
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <ul className="lh-contact-page__promises">
              {contactInfo.promises.map((p) => (
                <li key={p.text}>
                  <ContactIcon name={p.icon} size={16} />
                  <span>{p.text}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div id="bao-gia" className="lh-contact-page__form">
            <QuoteBuilder />
          </div>
        </div>
      </div>
    </section>
  );
}
