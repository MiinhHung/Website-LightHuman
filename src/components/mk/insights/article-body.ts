import { posts } from "@/content/posts";

const POST_SLUGS = new Set(posts.map((p) => p.slug));

/**
 * The CMS bodies still link with the old WordPress permalinks: posts at "/<slug>",
 * archives at "/category/…" and "/tag/…". Posts live at /blog/<slug> here, and there
 * are no archive pages, so those go to the insights list.
 */
function fixInternalHref(href: string): string {
  const [path, hash = ""] = href.split("#");
  const seg = path.replace(/^\/|\/$/g, "");
  if (/^(category|tag)\//.test(seg)) return "/tin-tuc";
  if (POST_SLUGS.has(seg)) return `/blog/${seg}${hash ? `#${hash}` : ""}`;
  return href;
}

/**
 * CMS article HTML → the mock's prose markup (src/templates/post.js): drop the old
 * site's wrappers and Tailwind classes, keep content tags, and collect h2s for the TOC.
 */
export function cleanArticleBody(raw: string | undefined): { html: string; toc: [string, string][] } {
  let body = String(raw ?? "")
    .replace(/<\/?(section|div|span)[^>]*>/g, "")
    .replace(/\sclass="[^"]*"/g, "")
    .replace(/\sstyle="[^"]*"/g, "")
    .replace(/<img(?![^>]*\balt=)/g, '<img alt=""')
    .replace(/<img /g, '<img loading="lazy" decoding="async" ')
    .replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"')
    .replace(/<a href="(\/[^"]*)"/g, (_m, href: string) => `<a href="${fixInternalHref(href)}"`)
    .replace(/<h1(\s|>)/g, "<h2$1")
    .replace(/<\/h1>/g, "</h2>");
  const toc: [string, string][] = [];
  body = body.replace(/<h2( id="([^"]+)")?>([\s\S]*?)<\/h2>/g, (_m, _a, id: string | undefined, text: string) => {
    // TOC renders as React text, so entities from the CMS must be decoded here.
    const clean = text
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .trim();
    const slug = id || `muc-${toc.length + 1}`;
    toc.push([slug, clean]);
    return `<h2 id="${slug}">${text}</h2>`;
  });
  return { html: body, toc };
}
