import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { edHero, hero, heroIntents, homeStats, homeVideo } from "@/content/home";
import { edHeroEn, heroIntentsEn, homeEn, homeVideoEn } from "@/content/en/home";
import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { CountUp } from "@/components/ui/CountUp";
import { VideoLightbox } from "@/components/sections/VideoLightbox";

/**
 * Editorial home hero on warm paper: headline and two actions on the left, a
 * photo with the company film card overlapping it on the right, then the four
 * numbers as a ruled row. Light, so the header stays solid navy above it.
 */
export function EdHero({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en";
  const t = en ? edHeroEn : edHero;
  const intents = en ? heroIntentsEn : heroIntents;
  const video = en ? homeVideoEn : homeVideo;
  const stats = en ? homeEn.stats : homeStats;
  const v = site.introVideo;
  const crossLang = en ? "vi" : undefined;

  return (
    <section className="lh-ed-hero">
      <div className="lh-container lh-ed-hero__grid">
        <div className="lh-ed-hero__copy">
          <p className="lh-ed-kicker">{t.kicker}</p>
          <h1 className="lh-ed-hero__title">
            {t.title.before}
            <em>{t.title.em1}</em>
            {t.title.middle}
            <em>{t.title.em2}</em>
          </h1>
          <p className="lh-ed-hero__lede">{t.lede}</p>
          <div className="lh-ed-hero__ctas">
            <Link href={t.primary.href} className="lh-ed-btn" hrefLang={crossLang}>
              {t.primary.label}
              <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link href={t.secondary.href} className="lh-ed-btn lh-ed-btn--ghost" hrefLang={crossLang}>
              {t.secondary.label}
            </Link>
          </div>
          <nav className="lh-ed-hero__intents" aria-labelledby="lh-ed-intents">
            <span id="lh-ed-intents" className="lh-ed-hero__intents-label">
              {intents.label}
            </span>
            <ul>
              {intents.items.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} hrefLang={crossLang}>
                    {it.label}
                    <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="lh-ed-hero__media">
          <div className="lh-ed-hero__photo">
            <Image src={hero.image} alt={t.imageAlt} fill preload sizes="(min-width: 1024px) 560px, 100vw" />
          </div>
          <span className="lh-ed-hero__arc" aria-hidden="true" />
          <div className="lh-ed-hero__film">
            <span className="lh-ed-hero__film-label">{t.film}</span>
            <VideoLightbox
              videoId={v.id}
              title={v.title}
              poster={v.poster}
              duration={v.duration}
              label={video.play}
              closeLabel={video.close}
              dialogLabel={video.dialog}
            />
          </div>
        </div>
      </div>

      <div className="lh-container">
        <dl className="lh-ed-stats">
          {stats.map((s, i) => (
            <div key={s.num} className="lh-ed-stats__item" style={{ "--i": i } as CSSProperties}>
              <dt className="lh-ed-stats__label">{s.label}</dt>
              <dd className="lh-ed-stats__num">
                <CountUp value={s.num} delay={400 + i * 110} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
