"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ArrowUpRight, Calculator, Clock, Search, TrendingUp, X } from "lucide-react";
import { insightsPage, posts, type Post } from "@/content/posts";
import { quoteHref } from "@/content/site";

const { hero, allLabel, filters, featured, browse } = insightsPage;

type Sort = "newest" | "quick";
type Filters = { q: string; cat: string; tag: string; sort: Sort };

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
}

/** Tags ranked by how many posts use them (ties keep first-seen order). */
const topTags = (() => {
  const count = new Map<string, { label: string; slug: string; n: number }>();
  for (const p of posts)
    for (const t of p.tags) {
      const cur = count.get(t.slug) ?? { ...t, n: 0 };
      cur.n += 1;
      count.set(t.slug, cur);
    }
  return [...count.values()].sort((a, b) => b.n - a.n);
})();

// Categories with no posts stay in content but are hidden from the filter until they have articles.
const categories = filters
  .map((label) => ({ label, n: posts.filter((p) => p.category === label).length }))
  .filter((c) => c.n > 0);

/** Last query string the hub wrote itself — lets the wrapper tell its own edits from real navigations. */
let lastWritten = "";

function syncUrl(f: Filters) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.cat !== "all") p.set("cat", f.cat);
  if (f.tag) p.set("tag", f.tag);
  if (f.sort !== "newest") p.set("sort", f.sort);
  const qs = p.toString();
  lastWritten = qs;
  window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
}

/**
 * /tin-tuc: compact cinematic masthead (search, topics, featured story) over a
 * feed with category tabs, sort and a sidebar. All filters live in one state and
 * mirror into the URL (`?q=&cat=&tag=&sort=`), so article-page searches land here.
 */
export function InsightsHub({ initial }: { initial?: Partial<Filters> }) {
  const [f, setF] = useState<Filters>({ q: "", cat: "all", tag: "", sort: "newest", ...initial });
  const update = (patch: Partial<Filters>) => {
    const next = { ...f, ...patch };
    setF(next);
    syncUrl(next);
  };

  const lead = posts[0];
  const filtering = Boolean(f.q.trim() || f.cat !== "all" || f.tag);
  const tagLabel = topTags.find((t) => t.slug === f.tag)?.label;

  const items = useMemo(() => {
    const q = normalize(f.q.trim());
    const list = posts.filter(
      (p) =>
        (f.cat === "all" || p.category === f.cat) &&
        (!f.tag || p.tags.some((t) => t.slug === f.tag)) &&
        (!q || normalize(`${p.title} ${p.excerpt} ${p.tags.map((t) => t.label).join(" ")}`).includes(q)),
    );
    // posts[] is newest-first; the lead story already sits in the masthead unless the reader is filtering.
    const feed = filtering ? list : list.filter((p) => p.slug !== lead.slug);
    return f.sort === "quick" ? [...feed].sort((a, b) => a.readMinutes - b.readMinutes) : feed;
  }, [f, filtering, lead.slug]);

  const total = filtering ? items.length : posts.length;

  return (
    <>
      <section className="lh-hero lh-hero--dark lh-hero--cinematic lh-ins-hero">
        <div className="lh-hero__bg" aria-hidden="true">
          <Image src={hero.image} alt="" fill preload sizes="100vw" className="lh-hero__bg-img" />
          <div className="lh-hero__bg-tint" />
          <div className="lh-hero__bg-fade" />
        </div>
        <div className="lh-container lh-ins-hero__grid">
          <div className="lh-ins-hero__copy">
            <span className="lh-hero__eyebrow">
              <span className="lh-hero__spark" aria-hidden="true">
                ✦
              </span>
              {hero.eyebrow}
            </span>
            <h1 className="lh-ins-hero__title">{hero.title}</h1>
            <p className="lh-ins-hero__lede">{hero.lede}</p>

            <form
              className="lh-ins-search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                document.getElementById("bai-viet")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <Search size={18} strokeWidth={2} aria-hidden="true" />
              <label htmlFor="ins-search" className="sr-only">
                {browse.searchLabel}
              </label>
              <input
                id="ins-search"
                type="search"
                value={f.q}
                placeholder={browse.searchPlaceholder}
                autoComplete="off"
                onChange={(e) => update({ q: e.target.value })}
              />
              {f.q && (
                <button type="button" className="lh-ins-search__clear" aria-label={browse.clear} onClick={() => update({ q: "" })}>
                  <X size={16} strokeWidth={2.25} aria-hidden="true" />
                </button>
              )}
            </form>

            <div className="lh-ins-topics" aria-label={browse.topicsLabel}>
              <span className="lh-ins-topics__label">{browse.topicsLabel}</span>
              {topTags.slice(0, 6).map((t) => (
                <button
                  key={t.slug}
                  type="button"
                  className="lh-ins-topic"
                  aria-pressed={f.tag === t.slug}
                  onClick={() => update({ tag: f.tag === t.slug ? "" : t.slug })}
                >
                  #{t.label}
                </button>
              ))}
            </div>
          </div>

          <Link href={`/blog/${lead.slug}`} className="lh-ins-lead">
            <span className="lh-ins-lead__media">
              <Image src={lead.image} alt={lead.imageAlt ?? lead.title} fill sizes="(min-width: 1024px) 44vw, 100vw" />
            </span>
            <span className="lh-ins-lead__body">
              <span className="lh-ins-meta">
                <span className="lh-ins-lead__badge">✦ {browse.featuredBadge}</span>
                {lead.category}
                <span aria-hidden="true">·</span>
                <Clock size={13} strokeWidth={2} aria-hidden="true" />
                {lead.readMinutes} {browse.minutes}
              </span>
              <span className="lh-ins-lead__title">{lead.title}</span>
              <span className="lh-ins-lead__excerpt">{lead.excerpt}</span>
              <span className="lh-ins-lead__cta">
                {browse.readMore} <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </span>
            </span>
          </Link>
        </div>
      </section>

      <section id="bai-viet" className="lh-section lh-ins-feed">
        <div className="lh-container lh-ins-feed__grid">
          <div className="lh-ins-feed__main">
            <div className="lh-ins-toolbar">
              <div className="lh-ins-tabs" role="group" aria-label="Chuyên mục">
                {[{ label: allLabel, value: "all", n: posts.length }, ...categories.map((c) => ({ ...c, value: c.label }))].map(
                  (c) => (
                    <button
                      key={c.value}
                      type="button"
                      aria-pressed={f.cat === c.value}
                      className="lh-ins-tab"
                      onClick={() => update({ cat: c.value })}
                    >
                      {c.label}
                      <span>{c.n}</span>
                    </button>
                  ),
                )}
              </div>
              <label className="lh-ins-sort">
                <span>{browse.sortLabel}</span>
                <select value={f.sort} onChange={(e) => update({ sort: e.target.value as Sort })}>
                  <option value="newest">{browse.sortNewest}</option>
                  <option value="quick">{browse.sortQuick}</option>
                </select>
              </label>
            </div>

            <div className="lh-ins-status" aria-live="polite">
              <h2 className="lh-ins-status__title">{filtering ? `${total} ${browse.resultsAll}` : featured.title}</h2>
              {filtering && (
                <div className="lh-ins-status__chips">
                  {f.q.trim() && (
                    <span className="lh-ins-chip">
                      {browse.resultsFor} “{f.q.trim()}”
                    </span>
                  )}
                  {tagLabel && <span className="lh-ins-chip">#{tagLabel}</span>}
                  {f.cat !== "all" && <span className="lh-ins-chip">{f.cat}</span>}
                  <button type="button" className="lh-ins-clear" onClick={() => update({ q: "", cat: "all", tag: "" })}>
                    <X size={14} strokeWidth={2.25} aria-hidden="true" />
                    {browse.clear}
                  </button>
                </div>
              )}
            </div>

            {items.length > 0 ? (
              <ul className="lh-ins-cards">
                {items.map((p, i) => (
                  <li key={p.slug} style={{ animationDelay: `${i * 70}ms` }}>
                    <PostCard post={p} activeTag={f.tag} onTag={(slug) => update({ tag: slug })} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="lh-ins-empty">
                <Search size={28} strokeWidth={1.5} aria-hidden="true" />
                <h3>{browse.emptyTitle}</h3>
                <p>{browse.emptyBody}</p>
                <button type="button" className="lh-ins-empty__cta" onClick={() => update({ q: "", cat: "all", tag: "" })}>
                  {browse.emptyCta}
                </button>
              </div>
            )}
          </div>

          <aside className="lh-ins-aside">
            <div className="lh-ins-box">
              <h3 className="lh-ins-box__title">{browse.asideTopics}</h3>
              <div className="lh-ins-cloud">
                {topTags.slice(0, 14).map((t) => (
                  <button
                    key={t.slug}
                    type="button"
                    className="lh-ins-tagbtn"
                    aria-pressed={f.tag === t.slug}
                    onClick={() => update({ tag: f.tag === t.slug ? "" : t.slug })}
                  >
                    #{t.label}
                    {t.n > 1 && <span>{t.n}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="lh-ins-box">
              <h3 className="lh-ins-box__title">{browse.asideTools}</h3>
              <ul className="lh-ins-tools">
                {browse.tools.map((t, i) => (
                  <li key={t.href}>
                    <Link href={t.href} className="lh-ins-tool">
                      <span className="lh-ins-tool__icon" aria-hidden="true">
                        {i === 0 ? <Calculator size={18} strokeWidth={1.75} /> : <TrendingUp size={18} strokeWidth={1.75} />}
                      </span>
                      <span>
                        <strong>{t.label}</strong>
                        <small>{t.desc}</small>
                      </span>
                      <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lh-ins-box lh-ins-box--navy">
              <h3 className="lh-ins-box__title">{browse.consult.title}</h3>
              <p>{browse.consult.body}</p>
              <Link href={quoteHref} className="lh-ins-consult">
                {browse.consult.cta} <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function PostCard({ post, activeTag, onTag }: { post: Post; activeTag: string; onTag: (slug: string) => void }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="lh-ins-card">
      <Link href={href} className="lh-ins-card__media" tabIndex={-1} aria-hidden="true">
        <Image src={post.image} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
      </Link>
      <div className="lh-ins-card__body">
        <span className="lh-ins-meta">
          {post.category}
          <span aria-hidden="true">·</span>
          <Clock size={13} strokeWidth={2} aria-hidden="true" />
          {post.readMinutes} {browse.minutes}
        </span>
        <h3 className="lh-ins-card__title">
          <Link href={href}>{post.title}</Link>
        </h3>
        <p className="lh-ins-card__excerpt">{post.excerpt}</p>
        <div className="lh-ins-card__tags">
          {post.tags.slice(0, 3).map((t) => (
            <button
              key={t.slug}
              type="button"
              className="lh-ins-tagbtn lh-ins-tagbtn--sm"
              aria-pressed={activeTag === t.slug}
              onClick={() => onTag(t.slug)}
            >
              #{t.label}
            </button>
          ))}
        </div>
        <div className="lh-ins-card__foot">
          <span>{post.publishedLabel}</span>
          <Link href={href} className="lh-ins-card__more" aria-label={`${browse.readMore}: ${post.title}`}>
            {browse.readMore} <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Reads `?q=&cat=&tag=&sort=` — render inside <Suspense> (fallback: InsightsHub without query). */
export function InsightsHubWithQuery() {
  const sp = useSearchParams();
  const sort = sp.get("sort");
  const cat = sp.get("cat");
  // Remount only for navigations from elsewhere (e.g. the article search box); the hub's own
  // replaceState while typing must not remount, or the search input would lose focus.
  const qs = sp.toString();
  const [seen, setSeen] = useState(qs);
  const [mountKey, setMountKey] = useState(qs);
  if (qs !== seen) {
    setSeen(qs);
    if (qs !== lastWritten) setMountKey(qs);
  }
  return (
    <InsightsHub
      key={mountKey}
      initial={{
        q: sp.get("q") ?? "",
        tag: sp.get("tag") ?? "",
        cat: cat && categories.some((c) => c.label === cat) ? cat : "all",
        sort: sort === "quick" ? "quick" : "newest",
      }}
    />
  );
}
