import Image from "next/image";
import { postPageCopy, type Post } from "@/content/posts";
import { CalendarIcon, ClockIcon } from "./ArticleIcons";

/** Đầu bài: chuyên mục, tiêu đề, sapo, tác giả, ngày đăng, thời gian đọc, ảnh bìa. */
export function ArticleHead({ post }: { post: Post }) {
  const { author } = postPageCopy;
  return (
    <header className="lh-article-head">
      <a href={`/category/${post.categorySlug}`} className="lh-article-head__eyebrow">
        {post.category}
      </a>
      <h1 className="lh-article-head__title">{post.title}</h1>
      <p className="lh-article-head__lead">{post.excerpt}</p>
      <div className="lh-article-head__byline">
        <div className="lh-article-head__author">
          <span className="lh-article-head__avatar" aria-hidden="true">
            <span>{author.initials}</span>
          </span>
          <span className="lh-article-head__author-text">
            <span className="lh-article-head__author-name">{author.name}</span>
            <span className="lh-article-head__author-role">{author.role}</span>
          </span>
        </div>
        <span className="lh-article-head__divider" aria-hidden="true" />
        <span className="lh-article-head__meta">
          <CalendarIcon />
          {post.publishedLabel}
        </span>
        <span className="lh-article-head__dot" aria-hidden="true" />
        <span className="lh-article-head__meta">
          <ClockIcon />
          {post.readMinutes} phút đọc
        </span>
      </div>
      <div className="lh-article-head__cover">
        <Image
          src={post.image}
          alt={post.imageAlt ?? post.title}
          fill
          preload
          sizes="(min-width: 1024px) 860px, 100vw"
        />
      </div>
    </header>
  );
}
