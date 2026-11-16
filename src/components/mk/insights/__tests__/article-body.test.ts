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

  it("strips legacy CTA sections and swirl circle SVGs", () => {
    const raw = `
      <p>Nội dung bài viết.</p>
      <section class="lh-section lh-cta lh-cta--dark">
        <div class="lh-container">
          <div class="lh-cta">
            <svg class="lh-cta__swirl"><circle cx="190" cy="190" r="50"></circle></svg>
            <h2>Đăng ký nhận bài viết</h2>
            <a href="https://lighthuman.vn/">Khám phá</a>
          </div>
        </div>
      </section>
    `;
    const { html, toc } = cleanArticleBody(raw);
    expect(html).toContain("Nội dung bài viết.");
    expect(html).not.toContain("lh-cta");
    expect(html).not.toContain("<svg");
    expect(html).not.toContain("<circle");
    expect(html).not.toContain("Đăng ký nhận bài viết");
    expect(toc).toHaveLength(0);
  });
});
