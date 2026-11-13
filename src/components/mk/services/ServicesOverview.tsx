import type { CSSProperties } from "react";
import { caseStudies } from "@/content/case-studies";
import { mkHome } from "@/content/home";
import { services, servicesMk, servicesPage, type ProcessData } from "@/content/services";
import { quoteHref } from "@/content/site";
import { fixCopy, imgSrc, pad } from "@/lib/mk";
import { Btn, Ico, LinkLine, MkImg, MkLink, SecHead } from "../ui";
import { HeroPhoto } from "./parts";

const css = (vars: Record<string, string | number>) => vars as CSSProperties;

export function ServicesHero() {
  const h = servicesPage.hero;
  return (
    <HeroPhoto
      image={h.image}
      alt={servicesMk.heroAlt}
      kicker={h.eyebrow}
      title={h.title}
      lede={h.lede}
      crumbs={[{ label: servicesMk.crumbs.home, href: "/" }, { label: servicesMk.crumbs.services }]}
      actions={<Btn label={servicesMk.quoteLabel} href={quoteHref} kind="gold" />}
    />
  );
}

/** Mock `servicesIndex()`: numbered list, the cursor-follow image swaps per row. */
export function ServicesIndex() {
  const g = servicesPage.grid;
  return (
    <section className="index tone-paper" aria-labelledby="ds-dich-vu" data-cursor-reveal="">
      <div className="wrap">
        <SecHead id="ds-dich-vu" title={g.title} lede={g.lede} />
        <ol className="index-list index-svc">
          {services.map((s, i) => (
            <li key={s.slug} data-reveal-img={imgSrc(s.image)}>
              <MkLink href={`/dich-vu/${s.slug}`}>
                <span className="ix-num">{pad(i + 1)}</span>
                <span className="ix-ico">
                  <Ico name={s.icon} />
                </span>
                <span className="ix-title">{fixCopy(s.name)}</span>
                <span className="ix-sum">{fixCopy(s.summary)}</span>
                <span className="ix-go">
                  <Ico name="arrow-up-right" />
                </span>
              </MkLink>
            </li>
          ))}
        </ol>
      </div>
      <div className="cursor-img" aria-hidden="true">
        {/* Plain <img>: the runtime swaps its src as the pointer moves between rows. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={imgSrc(services[0].image)} />
      </div>
    </section>
  );
}

/** Mock `stepsH()`: horizontal step row. */
export function StepsRow({ process, tone = "tone-navy" }: { process: ProcessData; tone?: string }) {
  return (
    <section className={`steps-h ${tone}`} aria-labelledby="buoc">
      <div className="wrap">
        <SecHead
          id="buoc"
          title={process.title || process.eyebrow}
          kicker={process.title ? process.eyebrow : undefined}
          lede={process.lede}
        />
        <ol className="steps-row" data-steps="">
          {process.steps.map((s, i) => (
            <li key={s.title} style={css({ "--i": i })}>
              <span className="st-num">{pad(i + 1)}</span>
              <span className="st-ico">
                <Ico name={s.icon} />
              </span>
              <h3 className="h4">{fixCopy(s.title)}</h3>
              <p>{fixCopy(s.desc)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Mock `casesStage(caseStudies.slice(0, 3), …)`; the home `CasesStage` always lists every case. */
export function ServicesCasesStage() {
  const c = mkHome.cases;
  const list = caseStudies.slice(0, 3);
  return (
    <section className="cases tone-paper" aria-labelledby="ket-qua">
      <div className="wrap">
        <SecHead id="ket-qua" title={servicesMk.casesTitle} after={<LinkLine label={c.all} href="/case-studies" />} />
        <div className="cstage" data-tabs="">
          <div className="cs-list" role="tablist" aria-label={c.tablist} aria-orientation="vertical">
            {list.map((cs, i) => (
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
                  <strong>{cs.brand}</strong>
                  <small>{fixCopy(cs.industry)}</small>
                </span>
                <Ico name="arrow-up-right" />
              </button>
            ))}
          </div>
          <div className="cs-panels">
            {list.map((cs, i) => {
              const headline = fixCopy(cs.headline);
              return (
                <article key={cs.slug} className="cs-panel" role="tabpanel" id={`cs-p${i}`} aria-labelledby={`cs-t${i}`} hidden={i > 0}>
                  <div className="cs-media">
                    <MkImg url={cs.image} alt={headline} sizes="(max-width: 760px) 90vw, 520px" />
                  </div>
                  <div className="cs-card">
                    <p className="cs-tag">{[cs.industry, ...cs.tags].map(fixCopy).join(" / ")}</p>
                    <h3 className="h3">{headline}</h3>
                    {cs.quote && (
                      <blockquote className="cs-quote">
                        <p>{cs.quote.text}</p>
                        <footer>
                          <b>{cs.quote.name}</b>, {cs.quote.role}
                        </footer>
                      </blockquote>
                    )}
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
