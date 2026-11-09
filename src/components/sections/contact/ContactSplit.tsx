import { contactFormCopy, contactInfo } from "@/content/contact";
import { ContactForm } from "./ContactForm";
import { ContactIcon } from "./ContactIcon";

/** Khối "Thông tin liên hệ" + thẻ form gửi yêu cầu. */
export function ContactSplit() {
  const { urgent } = contactInfo;
  return (
    <section className="lh-section lh-contact-section--split">
      <div className="lh-container">
        <div className="lh-contact-form">
          <div className="lh-contact-form__split">
            <aside className="lh-contact-info">
              <h3 className="lh-contact-info__heading">{contactInfo.heading}</h3>
              <div className="lh-contact-info__rows">
                {contactInfo.rows.map((row) => (
                  <div key={row.title} className="lh-contact-info__row">
                    <span className="lh-contact-info__icon" aria-hidden="true">
                      <ContactIcon name={row.icon} />
                    </span>
                    <div>
                      <div className="lh-contact-info__title">{row.title}</div>
                      <div className="lh-contact-info__body">
                        {row.lines.map((line) => (
                          <span key={line} className="lh-contact-info__body-line">
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lh-contact-urgent">
                <div className="lh-contact-urgent__head">
                  {/* Trang gốc để trống icon này. */}
                  <span className="lh-contact-urgent__icon" aria-hidden="true" />
                  <span className="lh-contact-urgent__heading">{urgent.heading}</span>
                </div>
                <p className="lh-contact-urgent__body">{urgent.body}</p>
                <a className="lh-contact-urgent__cta" href={urgent.href}>
                  {urgent.cta}
                  <span className="lh-contact-urgent__cta-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </aside>
            <div className="lh-contact-form__main">
              <div className="lh-contact-form__card">
                <div className="lh-contact-form__card-head">
                  <h3 className="lh-contact-form__card-heading">{contactFormCopy.heading}</h3>
                  <p className="lh-contact-form__card-lede">{contactFormCopy.lede}</p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
