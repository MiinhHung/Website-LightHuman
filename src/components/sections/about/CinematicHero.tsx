import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Hero điện ảnh của các trang con (Giới thiệu, Case Studies, Insights) —
 * cùng markup với site gốc: ảnh nền toàn khung, quỹ đạo trang trí, eyebrow ✦.
 */
export function CinematicHero({
  eyebrow,
  title,
  lede,
  image,
  imageAlt = title,
  cta,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  image: string;
  imageAlt?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="lh-hero lh-hero--dark lh-hero--cinematic">
      <div className="lh-hero__bg">
        <Image src={image} alt={imageAlt} fill preload sizes="100vw" className="lh-hero__bg-img" />
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
            {eyebrow}
          </span>
          <h1 className="lh-hero__title">{title}</h1>
          <p className="lh-hero__lede">{lede}</p>
          {cta && (
            <div className="lh-hero__ctas">
              <Link href={cta.href} className="lh-hero__cta-primary">
                {cta.label}
                <ArrowRight size={17} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
