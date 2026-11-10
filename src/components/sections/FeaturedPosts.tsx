import Image from "next/image";
import Link from "next/link";
import { posts, type Post } from "@/content/posts";
import { Reveal } from "@/components/ui/Reveal";
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
          {post.category} · {post.readMinutes}-min read
        </span>
        <h3 className="lh-review-tile__title">{post.title}</h3>
        <p className={lead ? "lh-review-tile__excerpt" : "lh-review-tile__excerpt lh-review-tile__excerpt--sm"}>
          {post.excerpt}
        </p>
        <div className="lh-review-tile__meta">
          <span>By Light Human</span>
          <span style={{ marginLeft: "auto" }}>{post.dateLabel}</span>
        </div>
      </div>
    </Link>
  );
}

/** "Bản tin nổi bật" — 1 bài lớn + 2 bài nhỏ. */
export function FeaturedPosts() {
  return (
    <section className="lh-section lh-featured">
      <div className="lh-container">
        <div className="lh-featured__head">
          <div>
            <span className="lh-eyebrow">Insights</span>
            <h2 className="lh-h2 lh-mt-md">
              Bản tin nổi bật - <em>Chiến lược &amp; câu chuyện</em> nhân sự
            </h2>
          </div>
          <GhostLink href="/tin-tuc">Xem tất cả bài viết</GhostLink>
        </div>
        <div className="lh-featured__grid">
          {posts.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <ReviewTile post={p} lead={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
