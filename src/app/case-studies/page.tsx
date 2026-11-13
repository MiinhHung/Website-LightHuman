import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { caseCategories, caseStudies, caseStudiesPage } from "@/content/case-studies";
import { fixCopy } from "@/lib/mk";
import { MkImg } from "@/components/mk/ui";
import { PartnersBand, QuoteCta } from "@/components/mk/home/HomeSections";
import { PageHero } from "@/components/mk/insights/parts";

const page = caseStudiesPage;

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        image={page.hero.image}
        alt={page.heroAlt}
        kicker={page.hero.eyebrow}
        title={page.hero.title}
        lede={page.hero.lede}
        crumbs={[{ label: page.crumbs.home, href: "/" }, { label: page.crumbs.current }]}
      />
      <section className="cases-browse tone-paper" aria-labelledby="ds-du-an">
        <div className="wrap">
          <h2 className="sr-only" id="ds-du-an">
            {page.browse.heading}
          </h2>
          <div className="chips" role="group" aria-label={page.browse.filterLabel} data-filter-group="case">
            <button type="button" className="chip" aria-pressed="true" data-filter="all">
              {page.allLabel}
            </button>
            {caseCategories.map((c) => (
              <button key={c.id} type="button" className="chip" aria-pressed="false" data-filter={c.id}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="case-grid" data-filter-list="case">
            {caseStudies.map((c, i) => {
              const headline = fixCopy(c.headline);
              return (
                <article key={c.slug} className="case-card" id={c.slug} data-cat={c.category} style={{ "--i": i } as CSSProperties}>
                  <div className="case-media" data-clip-reveal="">
                    <MkImg url={c.image} alt={headline} sizes="(max-width: 760px) 90vw, 560px" />
                  </div>
                  <div className="case-body">
                    <p className="case-meta">
                      <strong>{fixCopy(c.brand)}</strong>
                      <span>{fixCopy(c.industry)}</span>
                    </p>
                    <h3 className="h3">{headline}</h3>
                    <ul className="tags">
                      {c.tags.map((t) => (
                        <li key={t}>{fixCopy(t)}</li>
                      ))}
                    </ul>
                    {/* Client quotes are shown verbatim (the mock's copy fixes skip them). */}
                    <blockquote className="case-quote">
                      <p>{c.quote.text}</p>
                      <footer>
                        <b>{c.quote.name}</b>, {c.quote.role}
                      </footer>
                    </blockquote>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="empty" data-filter-empty="case" hidden>
            {page.browse.empty}
          </p>
        </div>
      </section>
      <PartnersBand />
      <QuoteCta title={page.cta.heading} desc={page.cta.desc} />
    </>
  );
}
