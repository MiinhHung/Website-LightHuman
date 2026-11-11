import Image from "next/image";
import Link from "next/link";
import { posts, type Post } from "@/content/posts";
import { GhostLink } from "./GhostLink";
import { homeEn } from "@/content/en/home";
import type { Locale } from "@/i18n/config";

export function ReviewTile({ post, lead = false }: { post: Post; lead?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className={lead ? "lh-review-tile lh-review-tile--lead" : "lh-review-tile"}>
      <div className="lh-review-tile__media">
        <Image src={post.image} alt={post.title} fill sizes={lead ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"} />
        <span className="lh-tag">{post.category}</span>
      </div>
      <div className="lh-review-tile__body">
        <span className="lh-review-tile__cat">
          {post.category}, {post.readMinutes} phút đọc
        </span>
        <h3 className="lh-review-tile__title">{post.title}</h3>
        <p className={lead ? "lh-review-tile__excerpt" : "lh-review-tile__excerpt lh-review-tile__excerpt--sm"}>
          {post.excerpt}
        </p>
        <div className="lh-review-tile__meta">
          <span>Light Human</span>
          <span style={{ marginLeft: "auto" }}>{post.dateLabel}</span>
        </div>
      </div>
    </Link>
  );
}

/** Home insights: one lead story with its cover, two more as compact rows. */
export function FeaturedPosts({ locale = "vi" }: { locale?: Locale }) {
  const [lead, ...rest] = posts.slice(0, 3);
  const en = locale === "en" ? homeEn.insights : null;
  const readTime = (min: number) => (en ? en.readTime(min) : `${min} phút đọc`);
  // English page, Vietnamese articles: mark the article text so screen readers switch voice.
  const lang = en ? "vi" : undefined;
  return (
    <section className="lh-section lh-insights">
      <div className="lh-container">
        <div className="lh-insights__head">
          <div>
            <h2 className="lh-h2">{en?.heading ?? "Góc nhìn nhân sự từ Light Human"}</h2>
            {en && <p className="lh-insights__note">{en.note}</p>}
          </div>
          <GhostLink href="/tin-tuc">{en?.viewAll ?? "Xem tất cả bài viết"}</GhostLink>
        </div>
        <div className="lh-insights__grid">
          <Link href={`/blog/${lead.slug}`} className="lh-insights__lead" hrefLang={lang}>
            <div className="lh-insights__lead-media">
              <Image src={lead.image} alt={lead.title} fill sizes="(min-width: 1024px) 640px, 100vw" />
            </div>
            <p className="lh-insights__meta">
              <span lang={lang}>{lead.category}</span>, {readTime(lead.readMinutes)}
            </p>
            <h3 className="lh-insights__lead-title" lang={lang}>
              {lead.title}
            </h3>
            <p className="lh-insights__excerpt" lang={lang}>
              {lead.excerpt}
            </p>
          </Link>
          <ul className="lh-insights__list">
            {rest.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="lh-insights__row" hrefLang={lang}>
                  <div className="lh-insights__thumb">
                    <Image src={p.image} alt="" fill sizes="160px" />
                  </div>
                  <div>
                    <p className="lh-insights__meta">
                      <span lang={lang}>{p.category}</span>, {readTime(p.readMinutes)}
                    </p>
                    <h3 className="lh-insights__row-title" lang={lang}>
                      {p.title}
                    </h3>
                    <p className="lh-insights__date">{p.dateLabel}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
