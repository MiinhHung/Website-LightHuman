"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { caseStudies } from "@/content/case-studies";
import { GhostLink } from "./GhostLink";
import { homeEn } from "@/content/en/home";
import type { Locale } from "@/i18n/config";

/**
 * Success stories with the client's own words: one featured story at a time,
 * switched through an ARIA tablist. Replaces the separate case-study grid and
 * testimonial wall, which repeated the same five stories twice.
 */
export function SuccessStories({
  title = (
    <>
      Câu chuyện <em>thành công</em>
    </>
  ),
  lede = "Light Human đồng hành cùng các doanh nghiệp Việt và quốc tế trong hành trình tối ưu đội ngũ.",
  showAllLink = true,
  locale = "vi",
}: {
  locale?: Locale;
  title?: ReactNode;
  lede?: string;
  showAllLink?: boolean;
}) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const en = locale === "en" ? homeEn.stories : null;
  const stories = caseStudies.map((c) => {
    const t = en?.items[c.slug];
    if (!t) return c;
    return {
      ...c,
      brand: t.brand ?? c.brand,
      industry: t.industry,
      headline: t.headline,
      tags: t.tags,
      quote: { ...c.quote, text: t.quote, role: t.role },
    };
  });
  const story = stories[active];

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const last = stories.length - 1;
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? active === last ? 0 : active + 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? active === 0 ? last : active - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className="lh-section lh-section--surface lh-stories">
      <div className="lh-container">
        <div className="lh-stories__head">
          <div>
            <h2 className="lh-h2">{title}</h2>
            <p className="lh-lede lh-mt-md">{lede}</p>
          </div>
          {showAllLink && <GhostLink href="/case-studies">{en?.viewAll ?? "Xem tất cả câu chuyện"}</GhostLink>}
        </div>

        <div className="lh-stories__tabs" role="tablist" aria-label={en?.tabsLabel ?? "Chọn câu chuyện"}>
          {stories.map((c, i) => (
            <button
              key={c.slug}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${baseId}-panel`}
              tabIndex={i === active ? 0 : -1}
              className="lh-stories__tab"
              onClick={() => setActive(i)}
              onKeyDown={onTabKeyDown}
            >
              <span className="lh-stories__tab-brand">{c.brand}</span>
              <span className="lh-stories__tab-industry">{c.industry}</span>
            </button>
          ))}
        </div>

        <article
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          className="lh-stories__panel"
        >
          {/* All photos stay mounted so switching stories crossfades instead of flashing while loading. */}
          <div className="lh-stories__photo">
            {stories.map((c, i) => (
              <Image
                key={c.slug}
                src={c.image}
                alt={i === active ? `${c.brand}: ${c.headline}` : ""}
                aria-hidden={i === active ? undefined : true}
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className={i === active ? "is-active" : undefined}
              />
            ))}
          </div>
          <div key={story.slug} className="lh-stories__body">
            <p className="lh-stories__industry">{story.industry}</p>
            <h3 className="lh-stories__brand">{story.brand}</h3>
            <p className="lh-stories__headline">{story.headline}</p>
            <figure className="lh-stories__quote">
              <blockquote>
                <p>“{story.quote.text}”</p>
              </blockquote>
              <figcaption>
                <span className="lh-stories__quote-name">{story.quote.name}</span>
                <span className="lh-stories__quote-role">{story.quote.role}</span>
                {en && <span className="lh-stories__quote-note">{en.translated}</span>}
              </figcaption>
            </figure>
            <ul className="lh-stories__tags" aria-label={en?.usedLabel ?? "Dịch vụ đã dùng"}>
              {story.tags.map((t) => (
                <li key={t} className="lh-chip">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
}
