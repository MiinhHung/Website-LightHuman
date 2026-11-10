import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServiceHeroData } from "@/content/services";
import { rich } from "./rich";

/** Hero điện ảnh của trang Dịch vụ và các trang chi tiết dịch vụ. */
export function ServiceHero({ hero }: { hero: ServiceHeroData }) {
  return (
    <section className={hero.split ? "lh-hero lh-hero--dark lh-hero--cinematic lh-hero--split" : "lh-hero lh-hero--dark lh-hero--cinematic"}>
      <div className="lh-hero__bg">
        {/* Site gốc dùng nguyên chuỗi tiêu đề (kể cả dấu *) làm alt. */}
        <Image src={hero.image} alt={hero.title} fill preload sizes="100vw" className="lh-hero__bg-img" />
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
            {hero.eyebrow}
          </span>
          <h1 className="lh-hero__title">{rich(hero.title)}</h1>
          <p className="lh-hero__lede">{hero.lede}</p>
          {hero.cta && (
            <div className="lh-hero__ctas">
              <Link href="/lien-he" className="lh-hero__cta-primary">
                {hero.cta}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
