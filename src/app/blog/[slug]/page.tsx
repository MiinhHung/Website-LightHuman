import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/content/posts";
import { ArticleCrumbs } from "@/components/sections/blog/ArticleCrumbs";
import { ArticleHead } from "@/components/sections/blog/ArticleHead";
import { ArticleAside } from "@/components/sections/blog/ArticleAside";
import { RelatedPosts } from "@/components/sections/blog/RelatedPosts";

// Every slug is prebuilt via generateStaticParams, but the page body depends on
// `params`, so a navigation can't show a shared shell first; allow it to block.
export const instant = false;

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

  return (
    <article className="lh-article lh-article--editorial">
      <ArticleCrumbs post={post} />
      <div className="lh-article-shell">
        {/* Site gốc dùng <main> lồng trong <main>; ở đây dùng <div> cho HTML hợp lệ — CSS chỉ bám class. */}
        <div className="lh-article-main">
          <ArticleHead post={post} />
          {post.bodyHtml && (
            // Rich-text của chính site (src/content/posts.ts), không phải dữ liệu người dùng nhập.
            <div className="lh-article-prose" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
          )}
          <div className="lh-article-tags">
            {post.tags.map((t) => (
              <a key={t.slug} href={`/tag/${t.slug}`} className="lh-chip">
                #{t.label}
              </a>
            ))}
          </div>
        </div>
        <ArticleAside post={post} />
      </div>
      <RelatedPosts slug={post.slug} />
    </article>
  );
}
