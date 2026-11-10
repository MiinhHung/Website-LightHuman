import Image from "next/image";
import Link from "next/link";
import { posts, type Post } from "@/content/posts";
import { GhostLink } from "./GhostLink";

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
export function FeaturedPosts() {
  const [lead, ...rest] = posts.slice(0, 3);
  return (
    <section className="lh-section lh-insights">
      <div className="lh-container">
        <div className="lh-insights__head">
          <h2 className="lh-h2">Góc nhìn nhân sự từ Light Human</h2>
          <GhostLink href="/tin-tuc">Xem tất cả bài viết</GhostLink>
        </div>
        <div className="lh-insights__grid">
          <Link href={`/blog/${lead.slug}`} className="lh-insights__lead">
            <div className="lh-insights__lead-media">
              <Image src={lead.image} alt={lead.title} fill sizes="(min-width: 1024px) 640px, 100vw" />
            </div>
            <p className="lh-insights__meta">
              {lead.category}, {lead.readMinutes} phút đọc
            </p>
            <h3 className="lh-insights__lead-title">{lead.title}</h3>
            <p className="lh-insights__excerpt">{lead.excerpt}</p>
          </Link>
          <ul className="lh-insights__list">
            {rest.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="lh-insights__row">
                  <div className="lh-insights__thumb">
                    <Image src={p.image} alt="" fill sizes="160px" />
                  </div>
                  <div>
                    <p className="lh-insights__meta">
                      {p.category}, {p.readMinutes} phút đọc
                    </p>
                    <h3 className="lh-insights__row-title">{p.title}</h3>
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
