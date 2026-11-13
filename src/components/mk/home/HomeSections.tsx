import type { CSSProperties } from "react";
import { caseStudies } from "@/content/case-studies";
import { partners, clientWall } from "@/content/partners";
import { posts, type Post } from "@/content/posts";
import { services } from "@/content/services";
import { quoteHref } from "@/content/site";
import {
  edHero,
  hero,
  homeStats,
  homeToolkit,
  homeVideo,
  homeChapters,
  layerItems,
  layersHead,
  manifesto,
  mkHome,
  processSteps,
  whyHead,
  whyPicks,
} from "@/content/home";
import {
  edHeroEn,
  homeChaptersEn,
  homeEn,
  homeToolkitEn,
  homeVideoEn,
  layerItemsEn,
  layersHeadEn,
  manifestoEn,
  mkHomeEn,
  whyHeadEn,
  whyItemsEn,
} from "@/content/en/home";
import type { Locale } from "@/i18n/config";
import { fixCopy, imgSrc, pad } from "@/lib/mk";
import { Btn, BtnIco, CtaBand, Ico, LinkLine, MkImg, MkLink, Rich, SecHead } from "../ui";
import { MiniSalary } from "./MiniSalary";

const css = (vars: Record<string, string | number>) => vars as CSSProperties;

/* ------------------------------------------------------------------ hero */
export function HomeHero({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en";
  const h = en ? edHeroEn : edHero;
  const stats = en ? homeEn.stats : homeStats;
  const play = en ? homeVideoEn.play : homeVideo.play;
  const label = en ? mkHomeEn.statsLabel : mkHome.statsLabel;
  const line = (text: string) => <Rich text={text} split fix={!en} />;

  return (
    <section className="hero hero-home" data-hero="">
      <div className="hero-media" data-hero-media="">
        <MkImg url={hero.image} alt={h.imageAlt} eager className="hero-img" />
      </div>
      <div className="hero-light" aria-hidden="true" />
      <div className="wrap hero-inner">
        <p className="kicker">{h.kicker}</p>
        <h1 className="h1 h1-home" data-lines="">
          <span className="line">
            {line(h.title.before.trim())} <em>{line(h.title.em1)}</em>
          </span>
          <span className="line">{line(h.title.middle.trim())}</span>
          <span className="line">
            <em>{line(h.title.em2)}</em>
          </span>
        </h1>
        <div className="hero-foot">
          <p className="hero-lede">{h.lede}</p>
          <div className="hero-actions">
            <Btn label={h.primary.label} href={h.primary.href} kind="gold" />
            <button className="btn btn-ghost" type="button" data-video-open="">
              <span>{play}</span>
              <BtnIco name="play" />
            </button>
          </div>
        </div>
        <div className="orbit" data-orbit="">
          <dl className="orbit-list" aria-label={label}>
            {stats.map((s, i) => {
              const n = parseInt(s.num.replace(/[.,]/g, ""), 10);
              return (
                <div key={s.label} className="orbit-card" style={css({ "--n": i })}>
                  <dt>{s.label}</dt>
                  <dd>
                    <span className="num" data-count={n} data-suffix={s.num.replace(/[\d.,]/g, "")}>
                      {s.num}
                    </span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ client logos */
export function PartnersBand({ locale = "vi", single }: { locale?: Locale; single?: boolean }) {
  const list = partners.filter((p) => !p.placeholder);
  const w = clientWall[locale];
  const rows = single ? [list] : [list.filter((_, i) => i % 2 === 0), list.filter((_, i) => i % 2 === 1)];
  return (
    <section className="band-logos tone-deep" aria-labelledby="khach-hang">
      <div className="wrap logos-head">
        <p className="logos-count">
          <span className="num" data-count={parseInt(w.count, 10)} data-suffix="+">
            {w.count}
          </span>
        </p>
        <div>
          <h2 className="h3" id="khach-hang">
            {w.heading}
          </h2>
          <p className="muted-dark">{w.lede}</p>
        </div>
        <LinkLine label={w.link.label} href={w.link.href} />
      </div>
      {rows.map((r, i) => (
        <div key={i} className={`marquee${i % 2 ? " marquee-rev" : ""}`} data-marquee="">
          <ul className="marquee-track">
            {r.map((p) => (
              <li key={p.name} className="logo-tile">
                <MkImg url={p.logo} alt={p.name} sizes="160px" />
              </li>
            ))}
            {r.map((p) => (
              <li key={`${p.name}-dup`} className="logo-tile" aria-hidden="true">
                <MkImg url={p.logo} alt="" sizes="160px" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ manifesto */
export function Manifesto({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en";
  const m = en ? manifestoEn : manifesto;
  const belief = en ? homeChaptersEn.belief : homeChapters.belief;
  return (
    <section className="manifesto tone-navy" aria-labelledby="niem-tin">
      <div className="wrap">
        <h2 className="sr-only" id="niem-tin">
          {belief}
        </h2>
        <p className="manifesto-text" data-scrub-words="">
          {m.segments.map((s, si) => (
            <span key={si}>
              {si > 0 && " "}
              {s.text
                .split(/\s+/)
                .filter(Boolean)
                .map((w, wi, arr) => (
                  <span key={wi}>
                    <span className={`w${s.em ? " em" : ""}`}>{w}</span>
                    {wi < arr.length - 1 && " "}
                  </span>
                ))}
            </span>
          ))}
        </p>
        <p className="manifesto-sign">{m.sign}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ services strips */
export function ServicesAcc({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en";
  const c = en ? mkHomeEn.services : mkHome.services;
  return (
    <section className="svc-acc tone-paper" aria-labelledby="dich-vu-home">
      <div className="wrap">
        <SecHead id="dich-vu-home" title={c.title} lede={c.lede} after={<LinkLine label={c.all} href="/dich-vu" />} />
        <div className="acc" data-acc="">
          {services.map((s, i) => {
            const name = en ? (homeEn.services.items[s.slug]?.name ?? s.name) : fixCopy(s.name);
            const summary = en ? (homeEn.services.items[s.slug]?.summary ?? s.summary) : fixCopy(s.summary);
            return (
              <article key={s.slug} className={`acc-item${i === 0 ? " is-active" : ""}`}>
                <MkLink className="acc-link" href={`/dich-vu/${s.slug}`}>
                  <div className="acc-media">
                    <MkImg url={s.image} alt="" sizes="(max-width: 760px) 90vw, 700px" />
                  </div>
                  <span className="acc-num">{pad(i + 1)}</span>
                  <span className="acc-rail" aria-hidden="true">
                    {name}
                  </span>
                  <div className="acc-body">
                    <h3 className="h3">{name}</h3>
                    <p>{summary}</p>
                    <span className="acc-more">
                      {c.more}
                      <Ico name="arrow-up-right" />
                    </span>
                  </div>
                </MkLink>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ process timeline */
export function ProcessTimeline({
  steps,
  title,
  lede,
  cta,
}: {
  steps: { icon: string; title: string; desc: string }[];
  title: string;
  lede: string;
  cta: string;
}) {
  return (
    <section className="process tone-navy" aria-labelledby="quy-trinh">
      <div className="wrap">
        <div className="process-head">
          <h2 className="h2" id="quy-trinh" data-split="" data-split-done="1">
            <Rich text={title} split />
          </h2>
          <p className="lede">
            <Rich text={lede} />
          </p>
          <Btn label={cta} href={quoteHref} kind="gold" />
        </div>
        <ol className="tl" data-tl="">
          {steps.map((s, i) => (
            <li key={s.title} className="tl-row" style={css({ "--i": i })}>
              <div className="tl-text">
                <span className="tl-ico">
                  <Ico name={s.icon} />
                </span>
                <h3 className="h3">{fixCopy(s.title)}</h3>
                <p>{fixCopy(s.desc)}</p>
              </div>
              <span className="tl-node" aria-hidden="true" />
              <span className="tl-num" aria-hidden="true">
                {pad(i + 1)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function HomeProcess({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en";
  const c = en ? mkHomeEn.process : mkHome.process;
  return <ProcessTimeline steps={en ? homeEn.process.steps : processSteps} title={c.title} lede={c.lede} cta={c.cta} />;
}

/* ------------------------------------------------------------------ client stage */
export function CasesStage({ locale = "vi", title }: { locale?: Locale; title?: string }) {
  const en = locale === "en";
  const c = en ? mkHomeEn.cases : mkHome.cases;
  return (
    <section className="cases tone-paper" aria-labelledby="ket-qua">
      <div className="wrap">
        <SecHead id="ket-qua" title={title ?? c.title} after={<LinkLine label={c.all} href="/case-studies" />} />
        <div className="cstage" data-tabs="">
          <div className="cs-list" role="tablist" aria-label={c.tablist} aria-orientation="vertical">
            {caseStudies.map((cs, i) => {
              const tr = en ? homeEn.stories.items[cs.slug] : undefined;
              return (
                <button
                  key={cs.slug}
                  className="cs-tab"
                  role="tab"
                  id={`cs-t${i}`}
                  aria-controls={`cs-p${i}`}
                  aria-selected={i === 0}
                  tabIndex={i === 0 ? 0 : -1}
                  type="button"
                >
                  <span className="cs-n">{pad(i + 1)}</span>
                  <span className="cs-b">
                    <strong>{tr?.brand ?? cs.brand}</strong>
                    <small>{tr?.industry ?? fixCopy(cs.industry)}</small>
                  </span>
                  <Ico name="arrow-up-right" />
                </button>
              );
            })}
          </div>
          <div className="cs-panels">
            {caseStudies.map((cs, i) => {
              const tr = en ? homeEn.stories.items[cs.slug] : undefined;
              const tag = [tr?.industry ?? cs.industry, ...(tr?.tags ?? cs.tags)].map(fixCopy).join(" / ");
              const headline = tr?.headline ?? fixCopy(cs.headline);
              return (
                <article key={cs.slug} className="cs-panel" role="tabpanel" id={`cs-p${i}`} aria-labelledby={`cs-t${i}`} hidden={i > 0}>
                  <div className="cs-media">
                    <MkImg url={cs.image} alt={headline} sizes="(max-width: 760px) 90vw, 520px" />
                  </div>
                  <div className="cs-card">
                    <p className="cs-tag">{tag}</p>
                    <h3 className="h3">{headline}</h3>
                    <blockquote className="cs-quote">
                      <p>{tr?.quote ?? cs.quote.text}</p>
                      <footer>
                        <b>{cs.quote.name}</b>, {tr?.role ?? cs.quote.role}
                      </footer>
                    </blockquote>
                    <LinkLine label={c.more} href={`/case-studies#${cs.slug}`} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ layers (sx-parallax) */
export function SxParallax({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en";
  const h = en ? layersHeadEn : layersHead;
  const items = en ? layerItemsEn : layerItems;
  return (
    <section className="sx-parallax" aria-labelledby="sx-parallax-title">
      <div className="wrap sx-layers-wrap">
        <div className="sx-layers-head sx-reveal">
          <span className="sx-badge">{h.kicker}</span>
          <h2 className="h2 sx-title" id="sx-parallax-title">
            {h.title.before}
            <em>{h.title.em}</em>
          </h2>
          <p className="sx-lede">{h.lede}</p>
        </div>
        <div className="sx-layers-grid">
          {items.map((l, i) => (
            <article
              key={l.title}
              className={`sx-layer-card sx-reveal ${i % 2 === 0 ? "is-alt-cool" : "is-alt-warm"}`}
              style={css({ "--sx-delay": `${i * 90}ms` })}
            >
              <div className="sx-layer-head">
                <span className="sx-layer-badge">
                  {h.layer} {pad(i + 1)}
                </span>
                <span className="sx-layer-ico">
                  <Ico name={l.icon} />
                </span>
              </div>
              <h3 className="sx-layer-title">{l.title}</h3>
              <p className="sx-layer-desc">{l.desc}</p>
              <div className="sx-layer-foot">
                <span className="sx-layer-tag">{l.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ why us (sx-features) */
export function SxFeatures({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en";
  const h = en ? whyHeadEn : whyHead;
  const cells = en
    ? whyItemsEn.map((w) => ({ icon: w.icon, title: w.title, desc: w.desc, service: w.service, href: w.href }))
    : whyPicks.map(([slug, idx, icon]) => {
        const svc = services.find((s) => s.slug === slug)!;
        const f = svc.features.items[idx];
        return { icon, title: fixCopy(f.title), desc: fixCopy(f.desc), service: fixCopy(svc.name), href: `/dich-vu/${svc.slug}` };
      });

  const layer1 = cells.slice(0, 3);
  const layer2 = cells.slice(3, 6);

  return (
    <section className="sx-features" aria-labelledby="sx-features-title">
      <div className="sx-head">
        <div className="sx-head-in sx-reveal">
          <span className="sx-badge">{h.kicker}</span>
          <h2 className="h2 sx-title" id="sx-features-title">
            {h.title.before}
            <em>{h.title.em}</em>
          </h2>
          <p className="sx-lede">{h.lede}</p>
        </div>
      </div>
      <div className="sx-stack-wrap">
        <div className="sx-stack-layer sx-layer-1" style={css({ "--layer-index": 1 })}>
          <div className="sx-grid">
            {layer1.map((f, i) => (
              <div key={f.title} className="sx-cell" style={css({ "--card-index": i })}>
                <article className="sx-card sx-reveal" style={css({ "--sx-delay": `${i * 80}ms` })}>
                  <div className="sx-card-head">
                    <div className="sx-icon">
                      <Ico name={f.icon} />
                    </div>
                    <span className="sx-num" aria-hidden="true">
                      {pad(i + 1)}
                    </span>
                  </div>
                  <div className="sx-card-body">
                    <h3 className="sx-card-title">{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                  <MkLink className="sx-more" href={f.href} aria-label={`${f.title}: ${f.service}`}>
                    <span>{f.service}</span>
                    <Ico name="arrow-up-right" />
                  </MkLink>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="sx-stack-layer sx-layer-2" style={css({ "--layer-index": 2 })}>
          <div className="sx-grid">
            {layer2.map((f, i) => (
              <div key={f.title} className="sx-cell" style={css({ "--card-index": i + 3 })}>
                <article className="sx-card sx-reveal" style={css({ "--sx-delay": `${(i + 1) * 80}ms` })}>
                  <div className="sx-card-head">
                    <div className="sx-icon">
                      <Ico name={f.icon} />
                    </div>
                    <span className="sx-num" aria-hidden="true">
                      {pad(i + 4)}
                    </span>
                  </div>
                  <div className="sx-card-body">
                    <h3 className="sx-card-title">{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                  <MkLink className="sx-more" href={f.href} aria-label={`${f.title}: ${f.service}`}>
                    <span>{f.service}</span>
                    <Ico name="arrow-up-right" />
                  </MkLink>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ testimonials marquee */
export function SxTestimonials({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en";
  const c = en ? mkHomeEn.testimonials : mkHome.testimonials;
  const initial = (name: string) => (name.replace(/^(Mr|Ms|Mrs)\.?\s+/i, "").trim().charAt(0) || "L").toUpperCase();
  const items = caseStudies.filter((cs) => cs.quote);
  // Two identical tracks, each with the list twice (even count keeps the up/down rhythm across the seam).
  const loop = [...items, ...items];
  const card = (cs: (typeof items)[number], key: string, decorative: boolean) => {
    const tr = en ? homeEn.stories.items[cs.slug] : undefined;
    return (
      <div key={key} className="sx-item" aria-hidden={decorative || undefined} inert={decorative || undefined}>
        <figure className="sx-t-card">
          <div className="sx-t-top">
            <span className="sx-avatar" aria-hidden="true">
              {initial(cs.quote.name)}
            </span>
            <figcaption className="sx-who">
              <strong>{cs.quote.name}</strong>
              <span>{tr?.role ?? cs.quote.role}</span>
            </figcaption>
            <MkLink className="sx-t-link" href={`/case-studies#${cs.slug}`} aria-label={`${c.more} ${cs.brand}`}>
              <Ico name="arrow-up-right" />
            </MkLink>
          </div>
          <blockquote>
            <p>{tr?.quote ?? cs.quote.text}</p>
          </blockquote>
        </figure>
        <div className="sx-logo" aria-hidden="true">
          <span className="sx-logo-bg" />
          <span className="sx-brand">{tr?.brand ?? cs.brand}</span>
        </div>
      </div>
    );
  };
  return (
    <section className="sx-testimonials" aria-labelledby="sx-testi-title">
      <h2 className="h2 sx-title sx-center sx-reveal" id="sx-testi-title">
        {c.title}
      </h2>
      <p className="sx-sub sx-reveal" style={css({ "--sx-delay": "80ms" })}>
        {c.sub}
      </p>
      <div className="sx-marquee sx-reveal is-running" style={css({ "--sx-delay": "160ms" })} data-sx-marquee="">
        <div className="sx-track" data-sx-source="">
          {loop.map((cs, i) => card(cs, `a${i}`, i >= items.length))}
        </div>
        <div className="sx-track" aria-hidden="true" inert>
          {loop.map((cs, i) => card(cs, `b${i}`, true))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ toolkit bento */
// Illustrative compound curve (shape only, no figures): 1/month at 6%/year over 10 years.
const SPARK = (() => {
  const pts: number[] = [];
  let fv = 0;
  const r = 0.06 / 12;
  for (let m = 0; m <= 120; m++) {
    fv = fv * (1 + r) + 1;
    if (m % 6 === 0) pts.push(fv);
  }
  const max = pts[pts.length - 1];
  return pts.map((v, i) => `${i ? "L" : "M"}${((i / (pts.length - 1)) * 300).toFixed(1)} ${(88 - (v / max) * 80).toFixed(1)}`).join(" ");
})();

export function Toolkit({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en";
  const t = en ? homeToolkitEn : homeToolkit;
  const c = en ? mkHomeEn.toolkit : mkHome.toolkit;
  return (
    <section className="toolkit tone-mist" aria-labelledby="cong-cu-home">
      <div className="wrap">
        <SecHead id="cong-cu-home" title={t.title} kicker={c.kicker} lede={t.lede} />
        <div className="bento">
          <MiniSalary t={t.salary} locale={locale} />
          <MkLink className="bento-cell bento-quote shell" href={quoteHref}>
            <div className="core">
              <p className="cell-tag">
                <Ico name="clipboard" />
                {t.quote.tag}
              </p>
              <h3 className="h3">{t.quote.title}</h3>
              <p>{t.quote.body}</p>
              <div className="q-demo" aria-hidden="true">
                {t.quote.cards.map((card, i) => (
                  <span key={card} className="q-chip" style={css({ "--i": i })}>
                    {card}
                  </span>
                ))}
                <span className="q-sheet">{t.quote.sheet}</span>
              </div>
              <span className="link-line">
                {t.quote.cta}
                <Ico name="arrow-right" />
              </span>
            </div>
          </MkLink>
          <MkLink className="bento-cell bento-compound shell" href="/cong-cu/tinh-lai-kep">
            <div className="core">
              <p className="cell-tag">
                <Ico name="compound" />
                {t.compound.tag}
              </p>
              <h3 className="h3">{t.compound.title}</h3>
              <svg className="spark" viewBox="0 0 300 90" preserveAspectRatio="none" aria-hidden="true">
                <path className="area" d={`${SPARK} L300 90 L0 90 Z`} />
                <path d={SPARK} />
              </svg>
              <span className="link-line">
                {t.compound.cta}
                <Ico name="arrow-right" />
              </span>
            </div>
          </MkLink>
          <MkLink className="bento-cell bento-tax shell" href="/cong-cu/tinh-thue-thu-nhap-ca-nhan">
            <div className="core">
              <p className="cell-tag">
                <Ico name="tax" />
                {c.taxTag}
              </p>
              <h3 className="h3">{c.taxTitle}</h3>
              <p>{c.taxBody}</p>
              <span className="link-line">
                {c.taxCta}
                <Ico name="arrow-right" />
              </span>
            </div>
          </MkLink>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ insights index */
/** Same pick as the mock: every non-blog post first, then blog posts, in source order. */
export function pickPosts(): Post[] {
  const sel = posts.filter((p) => p.categorySlug !== "blog-nhan-su");
  return sel
    .concat(posts.filter((p) => p.categorySlug === "blog-nhan-su").slice(0, Math.max(0, 24 - sel.length)))
    .sort((a, b) => posts.indexOf(a) - posts.indexOf(b));
}

export function PostsIndex({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en";
  const c = en ? mkHomeEn.posts : mkHome.posts;
  const list = pickPosts().slice(0, 4);
  return (
    <section className="index tone-paper" aria-labelledby="goc-nhin" data-cursor-reveal="">
      <div className="wrap">
        <SecHead id="goc-nhin" title={c.title} after={<LinkLine label={c.all} href="/tin-tuc" />} />
        <ol className="index-list">
          {list.map((p, i) => (
            <li key={p.slug} data-reveal-img={imgSrc(p.image)}>
              <MkLink href={`/blog/${p.slug}`} hrefLang={en ? "vi" : undefined}>
                <span className="ix-num">{pad(i + 1)}</span>
                <span className="ix-cat">{p.category}</span>
                <span className="ix-title">{p.title}</span>
                <span className="ix-meta">
                  {p.publishedLabel}
                  <br />
                  {p.readMinutes} {c.minutes}
                </span>
              </MkLink>
            </li>
          ))}
        </ol>
      </div>
      <div className="cursor-img" aria-hidden="true">
        {/* Plain <img>: the runtime swaps its src as the pointer moves between rows. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={imgSrc(list[0]?.image)} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ closing */
export function QuoteCta({ locale = "vi", title, desc }: { locale?: Locale; title?: string; desc?: string }) {
  const c = locale === "en" ? mkHomeEn.cta : mkHome.cta;
  return <CtaBand title={title ?? c.title} desc={desc ?? c.desc} action={c.action} secondary={c.secondary} />;
}
