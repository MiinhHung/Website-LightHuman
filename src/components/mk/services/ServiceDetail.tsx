import type { CSSProperties } from "react";
import { services, servicesMk, type Service } from "@/content/services";
import { quoteHref } from "@/content/site";
import { fixCopy, pad } from "@/lib/mk";
import { Btn, Ico, LinkLine, MkImg, MkLink, Rich, SecHead } from "../ui";
import { BtnGoldSm, FaqList, HeroPhoto, RichLines } from "./parts";

const css = (vars: Record<string, string | number>) => vars as CSSProperties;
const ui = servicesMk;

export function ServiceHero({ s }: { s: Service }) {
  return (
    <HeroPhoto
      image={s.hero.image}
      alt={s.name}
      kicker={s.hero.eyebrow}
      title={s.hero.title}
      lede={s.hero.lede}
      crumbs={[
        { label: ui.crumbs.home, href: "/" },
        { label: ui.crumbs.services, href: "/dich-vu" },
        { label: s.name },
      ]}
      actions={<Btn label={fixCopy(s.hero.cta ?? ui.quoteLabel)} href={quoteHref} kind="gold" />}
    />
  );
}

export function ServiceSubnav({ s }: { s: Service }) {
  const items: [string, string][] = [
    ...(s.scope ? ([["pham-vi", ui.subnav.scope]] as [string, string][]) : []),
    ["khac-biet", ui.subnav.features],
    ["quy-trinh", ui.subnav.process],
    ["du-an", ui.subnav.cases],
    ["hoi-dap", ui.subnav.faq],
  ];
  return (
    <nav className="subnav" aria-label={ui.subnav.label} data-subnav="">
      <div className="wrap">
        <ul>
          {items.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ul>
        <BtnGoldSm label={ui.quoteLabel} href={quoteHref} />
      </div>
    </nav>
  );
}

export function ServiceScope({ scope }: { scope: NonNullable<Service["scope"]> }) {
  return (
    <section className="scope tone-paper" id="pham-vi" aria-labelledby="pham-vi-h">
      <div className="wrap">
        <SecHead id="pham-vi-h" title={scope.title} />
        <ul className="scope-bento">
          {scope.items.map((x, i) => (
            <li key={x.title} className="scope-cell shell" style={css({ "--i": i })}>
              <div className="core">
                <span className="scope-ico">
                  <Ico name={x.icon} />
                </span>
                <h3 className="h4">{fixCopy(x.title)}</h3>
                <p>{fixCopy(x.desc)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ServiceFeatures({ features }: { features: Service["features"] }) {
  return (
    <section className="features tone-cream" id="khac-biet" aria-labelledby="khac-biet-h">
      <div className="wrap feat-grid">
        <div className="feat-head">
          <h2 className="h2" id="khac-biet-h" data-split="" data-split-done="1">
            <RichLines text={features.title} split />
          </h2>
          {features.lede && (
            <p className="lede">
              <RichLines text={features.lede} />
            </p>
          )}
        </div>
        <ol className="feat-list">
          {features.items.map((x, i) => (
            <li key={x.title}>
              <span className="feat-num">{pad(i + 1)}</span>
              <span className="feat-ico">
                <Ico name={x.icon} />
              </span>
              <h3 className="h4">{fixCopy(x.title)}</h3>
              <p>{fixCopy(x.desc)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Mock vertical timeline; the runtime grows `.vt-fill` with scroll. */
export function ServiceTimeline({ process }: { process: Service["process"] }) {
  return (
    <section className="vtimeline tone-navy" id="quy-trinh" aria-labelledby="quy-trinh-h">
      <div className="wrap vt-grid">
        <div className="vt-head">
          <h2 className="h2" id="quy-trinh-h" data-split="" data-split-done="1">
            <RichLines text={process.title || process.eyebrow} split />
          </h2>
          {process.lede && (
            <p className="lede">
              <RichLines text={process.lede} />
            </p>
          )}
        </div>
        <ol className="vt-list" data-vtimeline="">
          {/* Rail sits inside the <ol> as in the mock: `.vt-list li` rules would break an <li> rail. */}
          <span className="vt-rail" aria-hidden="true">
            <span className="vt-fill" />
          </span>
          {process.steps.map((x, i) => (
            <li key={x.title}>
              <span className="vt-num">{pad(i + 1)}</span>
              <div>
                <h3 className="h4">{fixCopy(x.title)}</h3>
                <p>{fixCopy(x.desc)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ServiceCaseStrip({ cases }: { cases: Service["cases"] }) {
  return (
    <section className="case-strip tone-paper" id="du-an" aria-labelledby="du-an-h">
      <div className="wrap">
        <SecHead id="du-an-h" title={cases.title} after={<LinkLine label={fixCopy(cases.linkLabel)} href="/case-studies" />} />
      </div>
      <ul className="snap-row">
        {cases.items.map((c) => {
          const headline = fixCopy(c.headline);
          return (
            <li key={c.headline} className="snap-card">
              <div className="snap-media">
                <MkImg url={c.image} alt={headline} sizes="(max-width: 760px) 85vw, 480px" />
              </div>
              <p className="case-meta">
                <strong>{fixCopy(c.brand)}</strong>
                <span>{fixCopy(c.industry)}</span>
              </p>
              <h3 className="h4">{headline}</h3>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ServiceFaq({ faq }: { faq: Service["faq"] }) {
  return (
    <section className="faq-sec tone-mist" id="hoi-dap" aria-labelledby="hoi-dap-h">
      <div className="wrap faq-grid">
        <div className="faq-head">
          <h2 className="h2" id="hoi-dap-h" data-split="" data-split-done="1">
            <Rich text={ui.faqTitle} split />
          </h2>
          {faq.helper && (
            <p className="lede">
              {fixCopy(faq.helper.text)} <MkLink href="/lien-he">{fixCopy(faq.helper.linkLabel.replace(/\s*→$/, ""))}</MkLink>
            </p>
          )}
        </div>
        <FaqList items={faq.items} />
      </div>
    </section>
  );
}

export function RelatedServices({ current }: { current: string }) {
  return (
    <section className="related tone-paper" aria-labelledby="dv-khac">
      <div className="wrap">
        <h2 className="h3" id="dv-khac">
          {ui.related}
        </h2>
        <ul className="related-list">
          {services
            .filter((x) => x.slug !== current)
            .map((x) => (
              <li key={x.slug}>
                <MkLink href={`/dich-vu/${x.slug}`}>
                  <span className="r-ico">
                    <Ico name={x.icon} />
                  </span>
                  <span>{fixCopy(x.name)}</span>
                  <Ico name="arrow-up-right" />
                </MkLink>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
