import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { teamSection } from "@/content/about";
import { quoteHref, site } from "@/content/site";
import { storyAhead, storyCta, storyMilestones, storyOrigin, storyPage } from "@/content/story";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: storyPage.title,
  description: storyPage.lede,
};

const founders = teamSection.members.filter((m) => m.role.toLowerCase().includes("sáng lập"));

export default function StoryPage() {
  return (
    <>
      <section className="lh-section lh-story-hero">
        <div className="lh-container lh-story-hero__grid">
          <div className="lh-story-hero__copy">
            <h1 className="lh-story-hero__title">{storyPage.title}</h1>
            <p className="lh-story-hero__lede">{storyPage.lede}</p>
          </div>
          <div className="lh-story-hero__photo">
            <Image
              src={storyPage.image}
              alt={storyPage.imageAlt}
              fill
              preload
              sizes="(min-width: 1024px) 560px, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="lh-section lh-story-origin">
        <div className="lh-container lh-story-origin__grid">
          <div className="lh-story-origin__text">
            <h2 className="lh-h2">{storyOrigin.title}</h2>
            {storyOrigin.paragraphs.map((p) => (
              <p key={p} className="lh-story-origin__p">
                {p}
              </p>
            ))}
            <Link href="/dich-vu/gioi-thieu#doi-ngu" className="lh-story-origin__link">
              Gặp đội ngũ Light Human
            </Link>
          </div>
          <ul className="lh-story-founders">
            {founders.map((f) => (
              <li key={f.name} className="lh-story-founder">
                <div className="lh-story-founder__photo">
                  <Image src={f.photo} alt={f.name} fill sizes="(min-width: 1024px) 220px, 45vw" />
                </div>
                <p className="lh-story-founder__name">{f.name}</p>
                <p className="lh-story-founder__role">{f.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="lh-story-motto">
        <span className="lh-story-motto__rays" aria-hidden="true" />
        <div className="lh-container">
          <figure className="lh-story-motto__figure">
            <blockquote>
              <p className="lh-story-motto__quote">“{storyOrigin.motto}”</p>
            </blockquote>
            <figcaption className="lh-story-motto__note">{storyOrigin.mottoNote}</figcaption>
          </figure>
        </div>
      </section>

      <section className="lh-section lh-story-timeline">
        <div className="lh-container">
          <h2 className="lh-h2">Những dấu mốc</h2>
          <ol className="lh-timeline">
            {storyMilestones.map((m) => (
              <Reveal as="li" key={m.title} className="lh-timeline__item">
                <p className="lh-timeline__when">{m.when}</p>
                <div className="lh-timeline__body">
                  <h3 className="lh-timeline__title">{m.title}</h3>
                  <p className="lh-timeline__text">{m.text}</p>
                  {m.stats && (
                    <dl className="lh-timeline__stats">
                      {m.stats.map((s) => (
                        <div key={s.label}>
                          <dt>{s.label}</dt>
                          <dd>{s.num}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </Reveal>
            ))}
            <Reveal as="li" className="lh-timeline__item lh-timeline__item--ahead">
              <p className="lh-timeline__when">Phía trước</p>
              <div className="lh-timeline__body">
                <h3 className="lh-timeline__title">{storyAhead.title}</h3>
                <p className="lh-timeline__text">{storyAhead.text}</p>
              </div>
            </Reveal>
          </ol>
        </div>
      </section>

      <ClosingCta
        heading={storyCta.heading}
        desc={storyCta.desc}
        action={{ label: "Nhận báo giá", href: quoteHref }}
        secondary={{ label: "Xem việc làm", href: site.jobsUrl }}
      />
    </>
  );
}
