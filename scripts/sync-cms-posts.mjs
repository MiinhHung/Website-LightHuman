/**
 * Pull every published post from the Light Human CMS (Strapi, blog.lighthuman.vn)
 * and write two generated files:
 *   src/content/generated/cms-posts.json   — summaries (safe to ship to the client)
 *   src/content/generated/cms-bodies.json  — { slug: bodyHtml } (server only)
 *
 * Body HTML mirrors how lighthuman.vn renders the same blocks (lh-section / lh-prose,
 * lh-faq, lh-cta), so the existing article CSS applies unchanged.
 *
 * Usage: npm run sync:posts
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://blog.lighthuman.vn";
const OUT_DIR = path.join(process.cwd(), "src", "content", "generated");

const BLOCKS = [
  "blocks-content.rich-text",
  "blocks-content.image",
  "blocks-form.faq",
  "blocks-marketing.cta",
  "blocks-product.pros-cons",
  "blocks-hero.hero",
];

function query(page) {
  const p = new URLSearchParams();
  p.set("pagination[pageSize]", "100");
  p.set("pagination[page]", String(page));
  p.set("sort", "publishedAt:desc");
  for (const b of BLOCKS) p.set(`populate[content][on][${b}][populate]`, "*");
  p.set("populate[coverImage]", "true");
  p.set("populate[categories]", "true");
  p.set("populate[tags]", "true");
  return `${ORIGIN}/api/posts?${p}`;
}

async function fetchAll() {
  const all = [];
  for (let page = 1; ; page++) {
    const res = await fetch(query(page));
    if (!res.ok) throw new Error(`CMS ${res.status} on page ${page}`);
    const json = await res.json();
    all.push(...json.data);
    if (page >= json.meta.pagination.pageCount) break;
  }
  return all;
}

// ---------------------------------------------------------------- helpers ---
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const abs = (url) => (!url ? "" : url.startsWith("http") ? url : `${ORIGIN}${url}`);

function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function plain(nodes = []) {
  return nodes.map((n) => (n.text ?? "") + plain(n.children)).join("");
}

const SAFE_HREF = /^(https?:|mailto:|tel:|\/|#)/i;

function inline(nodes = []) {
  return nodes
    .map((n) => {
      if (n.type === "link") {
        const href = SAFE_HREF.test(n.url ?? "") ? n.url : "#";
        const ext = /^https?:/i.test(href) && !href.includes("lighthuman.vn");
        return `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>${inline(n.children)}</a>`;
      }
      if (n.type !== "text" && n.children) return inline(n.children);
      let t = esc(n.text ?? "");
      if (!t) return "";
      if (n.code) t = `<code>${t}</code>`;
      if (n.bold) t = `<strong>${t}</strong>`;
      if (n.italic) t = `<em>${t}</em>`;
      if (n.underline) t = `<u>${t}</u>`;
      if (n.strikethrough) t = `<s>${t}</s>`;
      return `<span>${t}</span>`;
    })
    .join("");
}

function richBlock(node) {
  switch (node.type) {
    case "paragraph": {
      const html = inline(node.children);
      return html.trim() ? `<p class="mb-4 leading-relaxed">${html}</p>` : "";
    }
    case "heading": {
      const level = Math.min(Math.max(node.level ?? 2, 2), 4);
      const size = level === 2 ? "text-3xl" : level === 3 ? "text-2xl" : "text-xl";
      return `<h${level} id="${slugify(plain(node.children))}" class="${size} font-bold mt-8 mb-4">${inline(node.children)}</h${level}>`;
    }
    case "list": {
      const ordered = node.format === "ordered";
      const tag = ordered ? "ol" : "ul";
      const cls = ordered ? "list-decimal pl-6 mb-4 space-y-1" : "list-disc pl-6 mb-4 space-y-1";
      const items = (node.children ?? [])
        .map((li) => (li.type === "list" ? richBlock(li) : `<li>${inline(li.children)}</li>`))
        .join("");
      return `<${tag} class="${cls}">${items}</${tag}>`;
    }
    case "quote":
      return `<blockquote><p>${inline(node.children)}</p></blockquote>`;
    case "code":
      return `<pre><code>${esc(plain(node.children))}</code></pre>`;
    case "image": {
      const img = node.image ?? {};
      return figure(abs(img.url), img.alternativeText ?? "", img.caption ?? "", img.width, img.height);
    }
    default:
      return node.children ? `<p class="mb-4 leading-relaxed">${inline(node.children)}</p>` : "";
  }
}

const section = (inner, extra = "") => `<section class="lh-section${extra}"><div class="lh-container">${inner}</div></section>`;

function figure(src, alt, caption, width, height) {
  if (!src) return "";
  const size = width && height ? ` width="${width}" height="${height}"` : "";
  const cap = caption ? `<figcaption>${esc(caption)}</figcaption>` : "";
  return `<figure class="lh-article-figure"><img src="${esc(src)}" alt="${esc(alt)}"${size} loading="lazy" decoding="async">${cap}</figure>`;
}

const SWIRL = `<svg class="lh-cta__swirl" width="380" height="380" viewBox="0 0 380 380" aria-hidden="true">${[50, 72, 94, 116, 138, 160]
  .map((r) => `<circle cx="190" cy="190" r="${r}" fill="none" stroke="rgba(234,184,128,0.5)" stroke-width="1" stroke-dasharray="3 6"></circle>`)
  .join("")}</svg>`;

function block(b) {
  switch (b.__component) {
    case "blocks-content.rich-text": {
      const html = (b.content ?? []).map(richBlock).join("");
      return html ? section(`<div class="lh-prose lh-prose--centered">${html}</div>`) : "";
    }
    case "blocks-content.image": {
      const img = b.image ?? {};
      const src = abs(img.formats?.large?.url ?? img.url);
      return section(figure(src, b.alt || img.alternativeText || "", b.caption, img.formats?.large?.width ?? img.width, img.formats?.large?.height ?? img.height));
    }
    case "blocks-form.faq": {
      const items = (b.items ?? [])
        .map(
          (it) =>
            `<details class="lh-faq__item"><summary class="lh-faq__q"><span>${esc(it.question)}</span><span class="lh-faq__plus" aria-hidden="true">+</span></summary><p class="lh-faq__a">${esc(typeof it.answer === "string" ? it.answer : plain(it.answer))}</p></details>`,
        )
        .join("");
      if (!items) return "";
      return section(
        `<div class="lh-faq"><div class="lh-faq__layout lh-faq__layout--stacked"><div class="lh-faq__head"><h2 class="lh-h2">${esc(b.heading || "Câu hỏi thường gặp")}</h2></div><div class="lh-faq__list">${items}</div></div></div>`,
      );
    }
    case "blocks-marketing.cta": {
      const desc = Array.isArray(b.description) ? plain(b.description) : (b.description ?? "");
      const href = SAFE_HREF.test(b.buttonUrl ?? "") ? b.buttonUrl : "/lien-he";
      return section(
        `<div class="lh-cta"><div class="lh-cta__band">${SWIRL}<div class="lh-cta__copy"><h2 class="lh-cta__heading">${esc(b.heading)}</h2>${desc ? `<p class="lh-cta__desc">${esc(desc)}</p>` : ""}</div><div class="lh-cta__action"><a href="${esc(href)}" class="lh-hero__cta-primary">${esc(b.buttonText || "Liên hệ Light Human")}</a></div></div></div>`,
        " lh-cta lh-cta--dark",
      );
    }
    case "blocks-product.pros-cons": {
      const col = (title, list, tone) =>
        `<div class="lh-proscons__col lh-proscons__col--${tone}"><h3>${esc(title)}</h3><ul>${(list ?? []).map((i) => `<li>${esc(i.text)}</li>`).join("")}</ul></div>`;
      return section(
        `<div class="lh-proscons">${b.heading ? `<h2 class="lh-h2">${esc(b.heading)}</h2>` : ""}<div class="lh-proscons__grid">${col(b.prosTitle || "Ưu điểm", b.pros, "pro")}${col(b.consTitle || "Hạn chế", b.cons, "con")}</div></div>`,
      );
    }
    default:
      // blocks-hero.hero: the article page already renders its own head.
      return "";
  }
}

// ------------------------------------------------------------------ dates ---
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function dateLabels(iso) {
  // Vietnam time, so a post published late UTC shows the local day.
  const d = new Date(new Date(iso).getTime() + 7 * 3600 * 1000);
  const day = d.getUTCDate();
  const m = d.getUTCMonth();
  const y = d.getUTCFullYear();
  return { publishedLabel: `${day} thg ${m + 1}, ${y}`, dateLabel: `${MONTHS_EN[m]} ${y}` };
}

// ------------------------------------------------------------------- main ---
const raw = await fetchAll();
const summaries = [];
const bodies = {};

for (const p of raw) {
  if (!p.slug || !p.title) continue;
  const cover = p.coverImage;
  const image = abs(cover?.formats?.large?.url ?? cover?.url);
  if (!image) continue; // the listing and article head both need a cover
  const cat = p.categories?.[0];
  const iso = p.datePublishedOverride ?? p.publishedAt;
  summaries.push({
    slug: p.slug,
    title: p.title.trim(),
    excerpt: (p.excerpt ?? "").trim(),
    category: cat?.name ?? "Blog Nhân Sự",
    categorySlug: cat?.slug ?? "blog-nhan-su",
    tags: (p.tags ?? []).map((t) => ({ label: t.name, slug: t.slug })),
    readMinutes: Math.max(1, p.readingTime ?? 1),
    publishedAt: iso,
    ...dateLabels(iso),
    image,
    imageAlt: cover?.alternativeText || p.title.trim(),
  });
  bodies[p.slug] = (p.content ?? []).map(block).join("");
}

summaries.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

await mkdir(OUT_DIR, { recursive: true });
await writeFile(path.join(OUT_DIR, "cms-posts.json"), JSON.stringify(summaries, null, 1) + "\n");
await writeFile(path.join(OUT_DIR, "cms-bodies.json"), JSON.stringify(bodies) + "\n");
console.log(`Synced ${summaries.length} posts (${raw.length - summaries.length} skipped without cover).`);
