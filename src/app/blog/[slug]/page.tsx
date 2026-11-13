import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, postPageCopy, posts } from "@/content/posts";
import { getPostBody } from "@/content/post-bodies";
import { site } from "@/content/site";
import { fixCopy } from "@/lib/mk";
import { Ico, MkImg } from "@/components/mk/ui";
import { Crumbs, PostCard } from "@/components/mk/insights/parts";
import { cleanArticleBody } from "@/components/mk/insights/article-body";

// Every slug is prebuilt via generateStaticParams, but the page body depends on
// `params`, so a navigation can't show a shared shell first; allow it to block.
export const instant = false;

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, images: [post.image] },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const c = postPageCopy.article;
  const title = fixCopy(post.title);
  const { html, toc } = cleanArticleBody(getPostBody(slug));
  const tagsHtml = post.tags.length
    ? `<ul class="tags article-tags">${post.tags.map((t) => `<li>${escapeHtml(fixCopy(t.label))}</li>`).join("")}</ul>`
    : "";
  const url = `${site.url}/blog/${post.slug}`;
  const related = posts.filter((x) => x.slug !== post.slug && x.categorySlug === post.categorySlug).slice(0, 3);
  const more = posts.filter((x) => x.slug !== post.slug && !related.includes(x)).slice(0, 3 - related.length);

  return (
    <>
      <article className="article" aria-labelledby="bai-h1">
        <header className="article-head tone-navy">
          <div className="wrap-narrow">
            <Crumbs items={[{ label: c.crumbs.home, href: "/" }, { label: c.crumbs.insights, href: "/tin-tuc" }, { label: title }]} />
            <p className="kicker">{fixCopy(post.category)}</p>
            {/* Not split: the runtime only animates titles inside [data-hero], same as the mock. */}
            <h1 className="h1 h1-article" id="bai-h1" data-lines="">
              {title}
            </h1>
            <p className="article-meta">
              {c.author} · {post.publishedLabel} · {post.readMinutes} {c.minutes}
            </p>
          </div>
        </header>
        <div className="article-cover wrap" data-clip-reveal="">
          <MkImg url={post.image} alt={post.imageAlt ? fixCopy(post.imageAlt) : title} eager sizes="(max-width: 1280px) 100vw, 1280px" />
        </div>
        <div className="wrap article-grid">
          {/* Trusted rich text from Light Human's own CMS (synced at build time), not user input.
              Tags go into the same HTML so `.mk-prose > *` spacing rules still see them as children. */}
          <div className="mk-prose" dangerouslySetInnerHTML={{ __html: html + tagsHtml }} />
          <aside className="article-aside">
            {toc.length > 1 && (
              <nav className="toc" aria-label={c.tocLabel}>
                <p className="aside-h">{c.tocTitle}</p>
                <ol>
                  {toc.map(([id, text]) => (
                    <li key={id}>
                      <a href={`#${id}`}>{text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <div className="share">
              <p className="aside-h">{c.shareTitle}</p>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener"
                aria-label={c.shareFacebook}
              >
                <Ico name="facebook" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener"
                aria-label={c.shareLinkedin}
              >
                <Ico name="linkedin" />
              </a>
              <button type="button" data-copy={url} aria-label={c.copyLink}>
                <Ico name="copy" />
              </button>
            </div>
          </aside>
        </div>
      </article>
      <section className="related-posts tone-mist" aria-labelledby="bai-lien-quan">
        <div className="wrap">
          <h2 className="h2" id="bai-lien-quan">
            {c.readNext}
          </h2>
          <div className="post-grid">
            {related.concat(more).map((x) => (
              <PostCard key={x.slug} post={x} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
