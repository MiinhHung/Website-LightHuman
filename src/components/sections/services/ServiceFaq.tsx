import Link from "next/link";
import type { FaqItem } from "@/content/services";

/** FAQ dạng <details> gốc (câu đầu mở sẵn, mỗi câu đóng/mở độc lập như site gốc). */
export function ServiceFaq({ helper, items }: { helper?: { text: string; linkLabel: string }; items: FaqItem[] }) {
  return (
    <section className="lh-section">
      <div className="lh-container">
        <div className="lh-faq">
          <div className="lh-faq__layout">
            <div className="lh-faq__head">
              <span className="lh-eyebrow lh-faq__eyebrow">FAQ</span>
              <h2 className="lh-h2 lh-mt-md">Câu hỏi thường gặp</h2>
              {helper && (
                <p className="lh-faq__helper">
                  {helper.text}{" "}
                  <Link className="lh-faq__helper-link" href="/lien-he">
                    {helper.linkLabel}
                  </Link>
                </p>
              )}
            </div>
            <div className="lh-faq__list">
              {items.map((f, i) => (
                <details key={f.q} className="lh-faq__item" open={i === 0}>
                  <summary className="lh-faq__q">
                    <span>{f.q}</span>
                    <span className="lh-faq__plus" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="lh-faq__a">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
