import { vi } from "@/content/quote/labels.vi";
import { QuoteBuilder } from "@/components/quote/QuoteBuilder";

/** Khối form tạo báo giá kéo thả. */
export function ContactSplit() {
  return (
    <section className="lh-section lh-contact-section--split">
      <div className="lh-container">
        <div className="lh-contact-form">
          <div className="lh-contact-form__card">
            <div className="lh-contact-form__card-head">
              <h3 className="lh-contact-form__card-heading">{vi.pageTitle}</h3>
              <p className="lh-contact-form__card-lede">{vi.pageSubtitle}</p>
            </div>
            <QuoteBuilder />
          </div>
        </div>
      </div>
    </section>
  );
}
