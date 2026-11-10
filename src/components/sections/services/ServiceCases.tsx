import Image from "next/image";
import type { CaseItem } from "@/content/services";
import { Reveal } from "@/components/ui/Reveal";
import { GhostLink } from "@/components/sections/GhostLink";
import { rich } from "./rich";

/** "Case Studies" ở trang chi tiết dịch vụ — thẻ không có liên kết, không có tag (khác trang chủ). */
export function ServiceCases({
  title,
  linkLabel,
  items,
}: {
  eyebrow?: string;
  title: string;
  linkLabel: string;
  items: CaseItem[];
}) {
  return (
    <section className="lh-section lh-section--surface">
      <div className="lh-container">
        <div className="lh-case-studies-grid">
          <div className="lh-case-studies-grid__head">
            <div>
              <h2 className="lh-h2 lh-mt-md">{rich(title)}</h2>
            </div>
            <GhostLink href="/case-studies">{linkLabel}</GhostLink>
          </div>
          <div className="lh-case-studies-grid__items">
            {items.map((c, i) => (
              <Reveal key={c.brand} delay={i * 80}>
                <div className="lh-case-card">
                  <div className="lh-case-card__photo">
                    <Image src={c.image} alt={c.brand} fill sizes="(min-width: 1024px) 33vw, 100vw" />
                  </div>
                  <div className="lh-case-card__body">
                    <div className="lh-case-card__brand">{c.brand}</div>
                    <div className="lh-case-card__industry">{c.industry}</div>
                    <p className="lh-case-card__headline">{c.headline}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
