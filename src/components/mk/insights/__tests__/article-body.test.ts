import { describe, expect, it } from "vitest";
import { posts } from "@/content/posts";
import { cleanArticleBody } from "../article-body";

const slug = posts[0].slug;

describe("cleanArticleBody internal links", () => {
  it("moves old root-level post links under /blog", () => {
    expect(cleanArticleBody(`<p><a href="/${slug}">x</a></p>`).html).toContain(`href="/blog/${slug}"`);
  });

  it("keeps the hash on rewritten post links", () => {
    expect(cleanArticleBody(`<a href="/${slug}#muc-2">x</a>`).html).toContain(`href="/blog/${slug}#muc-2"`);
  });

  it("sends old category and tag archives to the insights list", () => {
    const { html } = cleanArticleBody(`<a href="/category/blog-nhan-su">a</a><a href="/tag/ky-nang-mem">b</a>`);
    expect(html).not.toMatch(/\/category\/|\/tag\//);
    expect(html.match(/href="\/tin-tuc"/g)).toHaveLength(2);
  });

  it("leaves real routes and external links alone", () => {
    const { html } = cleanArticleBody(`<a href="/lien-he#bao-gia">q</a><a href="https://example.com">e</a>`);
    expect(html).toContain(`href="/lien-he#bao-gia"`);
    expect(html).toContain(`href="https://example.com" target="_blank" rel="noopener"`);
  });
});
