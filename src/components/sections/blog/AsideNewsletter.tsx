"use client";

import { postPageCopy } from "@/content/posts";
import { useNewsletter } from "./useNewsletter";

/** Thẻ đăng ký nhận tin ở sidebar bài viết. */
export function AsideNewsletter() {
  const a = postPageCopy.aside;
  const { email, status, onSubmit, onEmailChange } = useNewsletter();
  const note =
    status === "success" ? a.newsletterSuccess : status === "invalid" ? a.newsletterInvalid : a.newsletterFine;

  return (
    <div className="lh-article-aside__newsletter">
      <div className="lh-article-aside__newsletter-dots" aria-hidden="true" />
      <div className="lh-article-aside__newsletter-inner">
        <h3 className="lh-article-aside__newsletter-title">{a.newsletterTitle}</h3>
        <p className="lh-article-aside__newsletter-desc">{a.newsletterDesc}</p>
        <form className="lh-article-aside__newsletter-form" noValidate onSubmit={onSubmit}>
          <input
            type="email"
            placeholder={a.newsletterPlaceholder}
            className="lh-article-aside__newsletter-input"
            aria-label="Email"
            aria-invalid={status === "invalid"}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <button type="submit" className="lh-article-aside__newsletter-btn">
            {a.newsletterButton}
          </button>
        </form>
        <p className="lh-article-aside__newsletter-fine" role="status" aria-live="polite">
          {note}
        </p>
      </div>
    </div>
  );
}
