import Image from "next/image";
import Link from "next/link";
import { caseStudies, type CaseStudy } from "@/content/case-studies";
import { Reveal } from "@/components/ui/Reveal";
import { GhostLink } from "./GhostLink";

export function CaseCard({ c }: { c: CaseStudy }) {
  return (
    <Link href="/case-studies" className="lh-case-card">
      <div className="lh-case-card__photo">
        <Image src={c.image} alt={c.brand} fill sizes="(min-width: 1024px) 33vw, 100vw" />
      </div>
      <div className="lh-case-card__body">
        <div className="lh-case-card__brand">{c.brand}</div>
        <div className="lh-case-card__industry">{c.industry}</div>
        <p className="lh-case-card__headline">{c.headline}</p>
        <div className="lh-case-card__tags">
          {c.tags.map((t) => (
            <span key={t} className="lh-chip">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

/** Lưới "Câu chuyện thành công" (trang chủ). */
export function CaseStudiesGrid() {
  return (
    <section className="lh-section lh-section--surface">
      <div className="lh-container">
        <div className="lh-case-studies-grid">
          <div className="lh-case-studies-grid__head">
            <div>
              <span className="lh-eyebrow">Khách hàng</span>
              <h2 className="lh-h2 lh-mt-md">
                Câu chuyện <em>thành công</em>
              </h2>
              <p className="lh-lede lh-mt-md">
                Light Human đồng hành cùng các doanh nghiệp Việt và quốc tế trong hành trình tối ưu đội ngũ.
              </p>
            </div>
            <GhostLink href="/case-studies">Xem tất cả</GhostLink>
          </div>
          <div className="lh-case-studies-grid__items">
            {caseStudies.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 3) * 80}>
                <CaseCard c={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
