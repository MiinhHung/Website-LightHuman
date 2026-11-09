import Image from "next/image";
import Link from "next/link";
import { getOtherPosts, postCategories, postPageCopy, type Post } from "@/content/posts";
import { ArrowIcon } from "./ArticleIcons";
import { AsideSearch } from "./AsideSearch";
import { AsideNewsletter } from "./AsideNewsletter";
import { AsideShare } from "./AsideShare";

/** Sidebar bài viết: tìm kiếm, chuyên mục, bài mới nhất, đăng ký nhận tin, chia sẻ. */
export function ArticleAside({ post }: { post: Post }) {
  const a = postPageCopy.aside;
  const latest = getOtherPosts(post.slug, 4);
  return (
    <aside className="lh-article-aside">
      <AsideSearch />
      <div className="lh-article-aside__card">
        <h3 className="lh-article-aside__title">{a.categoriesTitle}</h3>
        <ul className="lh-article-aside__cats">
          {postCategories.map((c) => (
            <li key={c.slug}>
              <a href={`/category/${c.slug}`} className="lh-article-aside__cat-link">
                <span className="lh-article-aside__cat-label">{c.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="lh-article-aside__card">
        <h3 className="lh-article-aside__title">{a.latestTitle}</h3>
        <ul className="lh-article-aside__latest">
          {latest.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="lh-article-aside__latest-link">
                <span className="lh-article-aside__latest-thumb">
                  <Image src={p.image} alt={p.imageAlt ?? p.title} fill sizes="96px" />
                </span>
                <span className="lh-article-aside__latest-meta">
                  <span className="lh-article-aside__latest-title">{p.title}</span>
                  <span className="lh-article-aside__latest-date">{p.publishedLabel}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/blog" className="lh-article-aside__all">
          {a.allLabel}
          <ArrowIcon />
        </Link>
      </div>
      <AsideNewsletter />
      <AsideShare title={post.title} />
    </aside>
  );
}
