import type { Post } from "@/content/posts";
import { postPageCopy } from "@/content/posts";
import { fixCopy } from "@/lib/mk";
import { MkImg, MkLink, Rich } from "../ui";

/** Mock `crumbs()`: the last item is the current page. */
export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Đường dẫn">
      <ol>
        {items.map((c, i) =>
          i === items.length - 1 || !c.href ? (
            <li key={i} aria-current="page">
              {c.label}
            </li>
          ) : (
            <li key={i}>
              <MkLink href={c.href}>{c.label}</MkLink>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

/** Mock `heroPhoto()` without actions (the pages here have none). */
export function PageHero({
  image,
  alt,
  kicker,
  title,
  lede,
  crumbs,
}: {
  image: string;
  alt: string;
  kicker?: string;
  title: string;
  lede?: string;
  crumbs: { label: string; href?: string }[];
}) {
  return (
    <section className="hero hero-page" data-hero="">
      <div className="hero-media" data-hero-media="">
        <MkImg url={image} alt={alt} eager className="hero-img" />
      </div>
      <div className="hero-light" aria-hidden="true" />
      <div className="wrap hero-inner">
        <Crumbs items={crumbs} />
        {kicker && <p className="kicker">{fixCopy(kicker)}</p>}
        <h1 className="h1" data-lines="" data-split-done="1">
          <Rich text={title} split />
        </h1>
        {lede && (
          <p className="hero-lede">
            <Rich text={lede} />
          </p>
        )}
      </div>
    </section>
  );
}

/** Mock `postCard()`; `data-cat` / `data-text` feed the runtime's filter and search. */
export function PostCard({ post, featured }: { post: Post; featured?: boolean }) {
  const title = fixCopy(post.title);
  const excerpt = post.excerpt ? fixCopy(post.excerpt) : "";
  const Heading = featured ? "h2" : "h4";
  return (
    <article
      className={`post-card${featured ? " post-featured" : ""}`}
      data-post=""
      data-cat={post.categorySlug}
      data-text={`${title} ${excerpt}`.toLowerCase()}
    >
      <MkLink href={`/blog/${post.slug}`}>
        <div className="post-media">
          <MkImg
            url={post.image}
            alt={post.imageAlt ? fixCopy(post.imageAlt) : title}
            sizes={featured ? "(max-width: 760px) 90vw, 60vw" : "(max-width: 760px) 90vw, 400px"}
          />
        </div>
        <div className="post-body">
          <p className="post-cat">{fixCopy(post.category)}</p>
          <h3 className={Heading}>{title}</h3>
          {excerpt && <p className="post-ex">{excerpt}</p>}
          <p className="post-meta">
            {post.publishedLabel} · {post.readMinutes} {postPageCopy.article.minutes}
          </p>
        </div>
      </MkLink>
    </article>
  );
}
