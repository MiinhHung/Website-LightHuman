import Link from "next/link";
import { postPageCopy, type Post } from "@/content/posts";
import { CrumbSepIcon } from "./ArticleIcons";

/** Breadcrumb: Trang chủ › Blog › Chuyên mục › Bài viết. */
export function ArticleCrumbs({ post }: { post: Post }) {
  const { home, blog } = postPageCopy.crumbs;
  return (
    <nav className="lh-article-crumbs" aria-label="Breadcrumb">
      <div className="lh-article-crumbs__inner">
        <span className="lh-article-crumbs__step">
          <Link href="/" className="lh-article-crumbs__link">
            {home}
          </Link>
        </span>
        <span className="lh-article-crumbs__step">
          <CrumbSepIcon />
          <Link href="/blog" className="lh-article-crumbs__link">
            {blog}
          </Link>
        </span>
        <span className="lh-article-crumbs__step">
          <CrumbSepIcon />
          <a href={`/category/${post.categorySlug}`} className="lh-article-crumbs__link">
            {post.category}
          </a>
        </span>
        <span className="lh-article-crumbs__step">
          <CrumbSepIcon />
          <span className="lh-article-crumbs__current" aria-current="page">
            {post.title}
          </span>
        </span>
      </div>
    </nav>
  );
}
