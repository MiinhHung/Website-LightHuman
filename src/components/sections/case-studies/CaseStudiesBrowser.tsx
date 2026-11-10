"use client";

import Image from "next/image";
import { useState } from "react";
import { caseCategories, caseStudies, type CaseCategoryId, type CaseStudy } from "@/content/case-studies";
import { Reveal } from "@/components/ui/Reveal";
import { FilterBar } from "./FilterBar";

type FilterId = "all" | CaseCategoryId;

/** Thẻ câu chuyện trên trang /case-studies (site gốc: thẻ tĩnh, không phải liên kết). */
function CaseListingCard({ c, featured = false }: { c: CaseStudy; featured?: boolean }) {
  const { brand, industry, headline, tags } = c.listing;
  return (
    <article className={featured ? "lh-case-card lh-case-card--featured" : "lh-case-card"}>
      <div className="lh-case-card__photo">
        <Image
          src={c.image}
          alt={brand}
          fill
          sizes={featured ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
        />
      </div>
      <div className="lh-case-card__body">
        <div className="lh-case-card__industry">{industry}</div>
        <h2 className="lh-case-card__brand">{brand}</h2>
        <p className="lh-case-card__headline">{headline}</p>
        {featured && (
          <figure className="lh-case-card__quote">
            <blockquote>
              <p>“{c.quote.text}”</p>
            </blockquote>
            <figcaption>
              <strong>{c.quote.name}</strong>, {c.quote.role}
            </figcaption>
          </figure>
        )}
        <div className="lh-case-card__tags">
          {tags.map((t) => (
            <span key={t} className="lh-chip">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/** Bộ lọc ngành + lưới câu chuyện thành công. */
export function CaseStudiesBrowser({ allLabel }: { allLabel: string }) {
  const [active, setActive] = useState<FilterId>("all");
  const options = [{ id: "all" as const, label: allLabel }, ...caseCategories];
  const items = active === "all" ? caseStudies : caseStudies.filter((c) => c.category === active);

  return (
    <>
      <FilterBar<FilterId> options={options} active={active} onChange={setActive} />
      <section className="lh-section lh-section--surface">
        <div className="lh-container">
          {items.length > 0 && (
            <div key={active} className="lh-case-list">
              <Reveal>
                <CaseListingCard c={items[0]} featured />
              </Reveal>
              {items.length > 1 && (
                <div className="lh-case-list__rest">
                  {items.slice(1).map((c, i) => (
                    <Reveal key={c.slug} delay={(i % 2) * 80}>
                      <CaseListingCard c={c} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
