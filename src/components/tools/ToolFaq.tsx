import Link from "next/link";

/** FAQ dùng đúng markup lh-faq của site (details/summary, mục đầu mở sẵn). */
export function ToolFaq({
  eyebrow,
  helper,
  helperLink,
  items,
}: {
  eyebrow: string;
  helper: string;
  helperLink: string;
  items: { q: string; a: string }[];
}) {
  return (
    <section id="faq" className="lh-section lht-noprint">
      <div className="lh-container">
        <div className="lh-faq">
          <div className="lh-faq__layout">
            <div className="lh-faq__head">
              <span className="lh-eyebrow lh-faq__eyebrow">{eyebrow}</span>
              <h2 className="lh-h2 lh-mt-md">
                Câu hỏi <em>thường gặp</em>
              </h2>
              <p className="lh-faq__helper">
                {helper}{" "}
                <Link className="lh-faq__helper-link" href="/lien-he">
                  {helperLink}
                </Link>
              </p>
            </div>
            <div className="lh-faq__list">
              {items.map((item, i) => (
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
