import { Fragment, type ReactNode } from "react";
import { servicesMk } from "@/content/services";
import { fixCopy } from "@/lib/mk";
import { BtnIco, Ico, MkImg, MkLink, Rich } from "../ui";

/** Rich text that keeps the content's "\n" line breaks (mock `rich()` turns them into <br>). */
export function RichLines({ text, split }: { text: string; split?: boolean }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          <Rich text={line} split={split} />
        </Fragment>
      ))}
    </>
  );
}

export type Crumb = { label: string; href?: string };

export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label={servicesMk.crumbs.label}>
      <ol>
        {items.map((c, i) =>
          i === items.length - 1 || !c.href ? (
            <li key={c.label} aria-current="page">
              {fixCopy(c.label)}
            </li>
          ) : (
            <li key={c.label}>
              <MkLink href={c.href}>{fixCopy(c.label)}</MkLink>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

/** Mock `heroPhoto()`: full-bleed photo hero; `hero-page` makes the header transparent. */
export function HeroPhoto({
  image,
  alt,
  kicker,
  title,
  lede,
  crumbs,
  actions,
}: {
  image: string;
  alt: string;
  kicker?: string;
  title: string;
  lede?: string;
  crumbs?: Crumb[];
  actions?: ReactNode;
}) {
  return (
    <section className="hero hero-page" data-hero="">
      <div className="hero-media" data-hero-media="">
        <MkImg url={image} alt={fixCopy(alt)} eager className="hero-img" />
      </div>
      <div className="hero-light" aria-hidden="true" />
      <div className="wrap hero-inner">
        {crumbs && <Crumbs items={crumbs} />}
        {kicker && <p className="kicker">{fixCopy(kicker)}</p>}
        <h1 className="h1" data-lines="" data-split-done="1">
          <RichLines text={title} split />
        </h1>
        {lede && (
          <p className="hero-lede">
            <RichLines text={lede} />
          </p>
        )}
        {actions && <div className="hero-actions">{actions}</div>}
      </div>
    </section>
  );
}

/** `btn-gold-sm` is not one of the shared `Btn` kinds, so the subnav renders its own. */
export function BtnGoldSm({ label, href }: { label: string; href: string }) {
  return (
    <MkLink href={href} className="btn btn-gold-sm">
      <span>{label}</span>
      <BtnIco />
    </MkLink>
  );
}

/** Mock `faqList()`: native <details>, first item open. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq" data-faq="">
      {items.map((f, i) => (
        <details key={f.q} className="faq-item" open={i === 0 || undefined}>
          <summary>
            <span>{fixCopy(f.q)}</span>
            <span className="faq-ico">
              <Ico name="plus" />
            </span>
          </summary>
          <div className="faq-a">
            <p>
              <RichLines text={f.a} />
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
