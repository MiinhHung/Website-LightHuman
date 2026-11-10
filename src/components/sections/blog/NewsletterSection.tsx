"use client";

import { insightsPage } from "@/content/posts";
import { useNewsletter } from "./useNewsletter";

/** Khối "Đăng ký nhận tin" (lh-news) cuối trang Insights. */
export function NewsletterSection() {
  const n = insightsPage.newsletter;
  const { email, status, onSubmit, onEmailChange } = useNewsletter();
  const note = status === "success" ? n.success : status === "invalid" ? n.invalid : n.fine;

  return (
    <section className="lh-section lh-news">
      <div className="lh-container">
        <div className="lh-news__inner">
          <div>
            <h2 className="lh-h2 lh-mt-md">{n.title}</h2>
            <p>{n.desc}</p>
          </div>
          <div>
            <form className="lh-news__form" noValidate onSubmit={onSubmit}>
              <input
                placeholder={n.placeholder}
                aria-label={n.placeholder}
                aria-invalid={status === "invalid"}
                required
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
              />
              <button type="submit">{n.button}</button>
            </form>
            <p className="lh-news__small" role="status" aria-live="polite">
              {note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
