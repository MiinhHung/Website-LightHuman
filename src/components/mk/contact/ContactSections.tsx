import { QuoteBuilder } from "@/components/quote/QuoteBuilder";
import { contactFaqHead, contactHero, contactMap, contactVideo } from "@/content/contact";
import { faqs } from "@/content/faq";
import { vi } from "@/content/quote/labels.vi";
import { site } from "@/content/site";
import { fixCopy } from "@/lib/mk";
import { Ico, MkImg, MkLink, Rich, SecHead } from "../ui";

/** Mock `{{hero-text}}`: `.hero-text` keeps the header solid. */
export function ContactHero() {
  const h = contactHero;
  return (
    <section className="hero hero-text tone-navy" data-hero="">
      <div className="hero-light" aria-hidden="true" />
      <div className="wrap hero-inner">
        <nav className="crumbs" aria-label={h.crumbLabel}>
          <ol>
            <li>
              <MkLink href="/">{h.crumbHome}</MkLink>
            </li>
            <li aria-current="page">{h.crumb}</li>
          </ol>
        </nav>
        <p className="kicker">{h.kicker}</p>
        <h1 className="h1" data-lines="" data-split-done="1">
          <Rich text={h.title} split />
        </h1>
        <p className="hero-lede">{h.lede}</p>
      </div>
    </section>
  );
}

/** Mock `{{quote-builder}}`; `#bao-gia` is where every "Báo giá" link lands. */
export function QuoteSection() {
  return (
    <section className="qd tone-light" id="bao-gia" aria-labelledby="bg-title">
      <div className="wrap">
        <div className="qd-head">
          <p className="eyebrow">{vi.sheet.eyebrow}</p>
          <h2 className="h2" id="bg-title">
            <Rich text={vi.sheet.title} />
          </h2>
          <p className="lede">{vi.sheet.lede}</p>
        </div>
        <QuoteBuilder />
      </div>
    </section>
  );
}

/** Mock `{{contact-info}}`: full-width office map. */
export function ContactMap() {
  return (
    <section className="map-contact tone-paper" aria-labelledby="van-phong-map">
      <div className="wrap">
        <h2 className="sr-only" id="van-phong-map">
          {contactMap.title}
        </h2>
        <div className="mc-map mc-map-full" data-clip-reveal="">
          <iframe title={contactMap.title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={contactMap.embed} />
        </div>
      </div>
    </section>
  );
}

/** Mock `videoFeature()`; the button opens the shared video dialog (Overlays). */
export function ContactVideo() {
  const c = contactVideo;
  const v = site.introVideo;
  return (
    <section className="video-feature tone-deep" aria-labelledby="phim">
      <div className="wrap">
        <SecHead id="phim" title={c.title} kicker={c.eyebrow} lede={c.lede} center />
        <button className="video-frame" type="button" data-video-open="" data-clip-reveal="" aria-label={`${c.play}: ${v.title}`}>
          <MkImg url={v.poster} alt="" sizes="(max-width: 1024px) 100vw, 1100px" />
          <span className="video-play">
            <span className="video-play-ring">
              <Ico name="play" />
            </span>
            <span>
              {c.play} · {v.duration}
            </span>
          </span>
        </button>
      </div>
    </section>
  );
}

/** Mock `{{contact-faq}}`: `details.faq-item` is wired by the runtime. */
export function ContactFaq() {
  return (
    <section className="faq-sec tone-paper" id="faq" aria-labelledby="hoi-dap">
      <div className="wrap faq-grid">
        <div className="faq-head">
          <h2 className="h2" id="hoi-dap" data-split="" data-split-done="1">
            <Rich text={contactFaqHead.title} split />
          </h2>
          <p className="lede">
            {contactFaqHead.helper} <a href={`mailto:${site.contact.email}`}>{contactFaqHead.helperLink}</a>
          </p>
        </div>
        <div className="faq" data-faq="">
          {faqs.map((f, i) => (
            <details key={f.q} className="faq-item" open={i === 0}>
              <summary>
                <span>{fixCopy(f.q)}</span>
                <span className="faq-ico">
                  <Ico name="plus" />
                </span>
              </summary>
              <div className="faq-a">
                <p>
                  <Rich text={f.a} />
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
