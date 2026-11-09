"use client";

import Image from "next/image";
import { useState } from "react";
import { caseCategories, caseStudies, type CaseCategoryId, type CaseStudy } from "@/content/case-studies";
import { Reveal } from "@/components/ui/Reveal";
import { FilterBar } from "./FilterBar";

type FilterId = "all" | CaseCategoryId;

/** Thẻ câu chuyện trên trang /case-studies (site gốc: thẻ tĩnh, không phải liên kết). */
function CaseListingCard({ c }: { c: CaseStudy }) {
  const { brand, industry, headline, tags } = c.listing;
  return (
    <div className="lh-case-card">
      <div className="lh-case-card__photo">
        <Image src={c.image} alt={brand} fill sizes="(min-width: 1024px) 33vw, 100vw" />
      </div>
      <div className="lh-case-card__body">
        <div className="lh-case-card__brand">{brand}</div>
        <div className="lh-case-card__industry">{industry}</div>
        <p className="lh-case-card__headline">{headline}</p>
        <div className="lh-case-card__tags">
          {tags.map((t) => (
            <span key={t} className="lh-chip">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
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
          <div className="lh-case-studies-grid">
            <div className="lh-case-studies-grid__head">
              <div />
            </div>
            <div className="lh-case-studies-grid__items">
              {items.map((c, i) => (
                <Reveal key={c.slug} delay={i * 80}>
                  <CaseListingCard c={c} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
