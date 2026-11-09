import Image from "next/image";
import Link from "next/link";
import { getOtherPosts, postPageCopy } from "@/content/posts";

/** "Bài viết liên quan" — 3 thẻ bài (lh-post-card) cuối trang. */
export function RelatedPosts({ slug }: { slug: string }) {
  const related = getOtherPosts(slug, 3);
  return (
    <section className="lh-article-related">
      <div className="lh-article-related__inner">
        <h2 className="lh-article-related__heading">{postPageCopy.relatedTitle}</h2>
        <div className="lh-article-related__grid">
          {related.map((p) => (
            <article key={p.slug} className="lh-post-card-wrap">
              <Link href={`/blog/${p.slug}`} className="lh-post-card">
                <div className="lh-post-card__media">
                  <Image src={p.image} alt={p.imageAlt ?? p.title} fill sizes="(min-width: 1024px) 33vw, 100vw" />
                  <span className="lh-post-card__chip">{p.category}</span>
                </div>
                <div className="lh-post-card__body">
                  <h3 className="lh-post-card__title">{p.title}</h3>
                  <div className="lh-post-card__meta">
                    <span>{p.publishedLabel}</span>
                    <span className="lh-post-card__dot" aria-hidden="true" />
                    <span>{p.readMinutes} phút đọc</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
