import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Award, Briefcase, Building2, Play, Users } from "lucide-react";
import { hero, homeStats, type TrustIcon } from "@/content/home";
import { site } from "@/content/site";
import { CountUp } from "@/components/ui/CountUp";
import { homeEn } from "@/content/en/home";
import type { Locale } from "@/i18n/config";

const statIcons: Record<TrustIcon, ReactNode> = {
  award: <Award size={26} strokeWidth={1.75} />,
  building: <Building2 size={26} strokeWidth={1.75} />,
  briefcase: <Briefcase size={26} strokeWidth={1.75} />,
  users: <Users size={26} strokeWidth={1.75} />,
};

/** Hero điện ảnh của trang chủ (ảnh nền toàn khung, quỹ đạo trang trí). */
export function HomeHero({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en" ? homeEn.hero : null;
  const stats = locale === "en" ? homeEn.stats : homeStats;
  return (
    <section className="lh-hero lh-hero--dark lh-hero--cinematic">
      <div className="lh-hero__bg">
        <Image
          src={hero.image}
          alt={en?.imageAlt ?? "Con người xuất sắc kiến tạo doanh nghiệp phi thường."}
          fill
          preload
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
            {en ? (
              <>
                {en.title.before}
                <em>{en.title.em1}</em>
                {en.title.middle}
                <em>{en.title.em2}</em>
                {en.title.after}
              </>
            ) : (
              <>
                Con người <em>xuất sắc</em> kiến tạo doanh nghiệp <em>phi thường.</em>
              </>
            )}
          </h1>
          <p className="lh-hero__lede">{en?.lede ?? hero.lede}</p>
          <div className="lh-hero__ctas">
            <Link href={en?.primary.href ?? "/dich-vu"} className="lh-hero__cta-primary">
              {en?.primary.label ?? "Khám phá dịch vụ"}
              <ArrowRight size={17} strokeWidth={2} />
            </Link>
            <a href={`${site.jobsUrl}/`} target="_blank" rel="noopener noreferrer" className="lh-hero__cta-ghost">
              <span className="lh-hero__cta-play" aria-hidden="true">
                <Play size={15} fill="currentColor" strokeWidth={0} />
              </span>
              {en?.jobs ?? "Tin tuyển dụng"}
            </a>
          </div>
        </div>
      </div>
      {/* Desktop only; below 1100px the standalone <TrustStats /> row shows the same numbers. */}
      <dl className="lh-hero__stats">
        {stats.map((s, i) => (
          <div key={s.num} className="lh-hero__stat" style={{ "--i": i } as CSSProperties}>
            <span className="lh-hero__stat-icon" aria-hidden="true">
              {statIcons[s.icon]}
            </span>
            <dt className="lh-hero__stat-label">{s.label}</dt>
            <dd className="lh-hero__stat-num">
              <CountUp value={s.num} delay={650 + i * 110} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
