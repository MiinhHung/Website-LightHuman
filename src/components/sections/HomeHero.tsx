import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Award, Briefcase, Building2, Play, Users } from "lucide-react";
import { hero, homeStats, type TrustIcon } from "@/content/home";
import { site } from "@/content/site";

const statIcons: Record<TrustIcon, ReactNode> = {
  award: <Award size={26} strokeWidth={1.75} />,
  building: <Building2 size={26} strokeWidth={1.75} />,
  briefcase: <Briefcase size={26} strokeWidth={1.75} />,
  users: <Users size={26} strokeWidth={1.75} />,
};

/** Hero điện ảnh của trang chủ (ảnh nền toàn khung, quỹ đạo trang trí). */
export function HomeHero() {
  return (
    <section className="lh-hero lh-hero--dark lh-hero--cinematic">
      <div className="lh-hero__bg">
        <Image
          src={hero.image}
          alt="Con người xuất sắc kiến tạo doanh nghiệp phi thường."
          fill
          priority
          sizes="100vw"
          className="lh-hero__bg-img"
        />
        <div className="lh-hero__bg-tint" aria-hidden="true" />
        <div className="lh-hero__bg-fade" aria-hidden="true" />
      </div>
      <div className="lh-hero__decor" aria-hidden="true">
        <span className="lh-hero__orbit lh-hero__orbit--gold" />
        <span className="lh-hero__orbit lh-hero__orbit--blue" />
        <span className="lh-hero__data-dots" />
      </div>
      <div className="lh-container lh-hero__stage">
        <div className="lh-hero__copy">
          <span className="lh-hero__eyebrow">
            <span className="lh-hero__spark" aria-hidden="true">
              ✦
            </span>
            {site.name}
          </span>
          <h1 className="lh-hero__title">
            Con người <em>xuất sắc</em> kiến tạo doanh nghiệp <em>phi thường.</em>
          </h1>
          <p className="lh-hero__lede">{hero.lede}</p>
          <div className="lh-hero__ctas">
            <Link href="/dich-vu" className="lh-hero__cta-primary">
              Khám phá dịch vụ
              <ArrowRight size={17} strokeWidth={2} />
            </Link>
            <a href={`${site.jobsUrl}/`} target="_blank" rel="noopener noreferrer" className="lh-hero__cta-ghost">
              <span className="lh-hero__cta-play" aria-hidden="true">
                <Play size={15} fill="currentColor" strokeWidth={0} />
              </span>
              Tin tuyển dụng
            </a>
          </div>
        </div>
      </div>
      {/* Desktop only; below 1100px the standalone <TrustStats /> row shows the same numbers. */}
      <dl className="lh-hero__stats">
        {homeStats.map((s) => (
          <div key={s.num} className="lh-hero__stat">
            <span className="lh-hero__stat-icon" aria-hidden="true">
              {statIcons[s.icon]}
            </span>
            <dt className="lh-hero__stat-label">{s.label}</dt>
            <dd className="lh-hero__stat-num">{s.num}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
