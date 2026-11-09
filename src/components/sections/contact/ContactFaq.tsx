import { contactFaqHead } from "@/content/contact";
import { faqs } from "@/content/faq";
import { site } from "@/content/site";

/**
 * FAQ dạng <details>/<summary> như trang gốc: CSS xoay dấu "+" theo `.lh-faq__item[open]`,
 * mục đầu tiên mở sẵn; bàn phím (Enter/Space) do trình duyệt xử lý.
 */
export function ContactFaq() {
  return (
    <section id="faq" className="lh-section">
      <div className="lh-container">
        <div className="lh-faq">
          <div className="lh-faq__layout">
            <div className="lh-faq__head">
              <span className="lh-eyebrow lh-faq__eyebrow">{contactFaqHead.eyebrow}</span>
              <h2 className="lh-h2 lh-mt-md">
                Câu hỏi <em>thường gặp</em>
              </h2>
              <p className="lh-faq__helper">
                {contactFaqHead.helper}{" "}
                <a className="lh-faq__helper-link" href={`mailto:${site.contact.email}`}>
                  {contactFaqHead.helperLink}
                </a>
              </p>
            </div>
            <div className="lh-faq__list">
              {faqs.map((item, i) => (
                <details key={item.q} className="lh-faq__item" open={i === 0}>
                  <summary className="lh-faq__q">
                    <span>{item.q}</span>
                    <span className="lh-faq__plus" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="lh-faq__a">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
