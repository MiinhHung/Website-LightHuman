import type { Metadata } from "next";
import { insightsPage, postCategories, posts } from "@/content/posts";
import { Ico, Rich } from "@/components/mk/ui";
import { NotifyForm } from "@/components/mk/NotifyForm";
import { PageHero, PostCard } from "@/components/mk/insights/parts";

const ip = insightsPage;
const b = ip.browse;

export const metadata: Metadata = {
  title: ip.meta.title,
  description: ip.meta.description,
};

// The mock showed 24 picked posts; every post has a page here, so the grid lists all of them.
export default function InsightsPage() {
  const [first, ...rest] = posts;
  const cats = postCategories.filter((c) => posts.some((p) => p.categorySlug === c.slug));
  return (
    <>
      <PageHero
        image={ip.hero.image}
        alt={ip.heroAlt}
        kicker={ip.hero.eyebrow}
        title={ip.hero.title}
        lede={ip.hero.lede}
        crumbs={[{ label: ip.crumbs.home, href: "/" }, { label: ip.crumbs.current }]}
      />
      <section className="posts tone-paper" aria-labelledby="bai-moi">
        <div className="wrap">
          <h2 className="sr-only" id="bai-moi">
            {ip.featured.title}
          </h2>
          <PostCard post={first} featured />
          <div className="posts-tools">
            <div className="chips" role="group" aria-label={ip.categoriesLabel} data-filter-group="post">
              <button type="button" className="chip" aria-pressed="true" data-filter="all">
                {ip.allLabel}
              </button>
              {cats.map((c) => (
                <button key={c.slug} type="button" className="chip" aria-pressed="false" data-filter={c.slug}>
                  {c.label}
                </button>
              ))}
            </div>
            <label className="search">
              <span className="sr-only">{b.searchLabel}</span>
              <Ico name="search" />
              <input type="search" placeholder={b.searchPlaceholder} data-post-search="" />
            </label>
          </div>
          <p className="results" data-results="" aria-live="polite">
            {rest.length} {b.resultsAll}
          </p>
          <div className="post-grid" data-filter-list="post">
            {rest.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
          <div className="empty" data-filter-empty="post" hidden>
            <p className="h4">{b.emptyTitle}</p>
            <p>{b.emptyBody}</p>
          </div>
        </div>
      </section>
      <section className="newsletter tone-navy" aria-label={ip.weekly.label}>
        <div className="wrap nl-wrap">
          <h2 className="h2" data-split="" data-split-done="1">
            <Rich text={ip.weekly.title} split />
          </h2>
          <NotifyForm inline />
        </div>
      </section>
    </>
  );
}
