import type { ReactNode } from "react";
import { crumbsCopy } from "@/content/about";
import { MkImg, MkLink, Rich } from "../ui";

/** Mock `crumbs()`: home link, then the current page. */
export function Crumbs({ current }: { current: string }) {
  return (
    <nav className="crumbs" aria-label={crumbsCopy.label}>
      <ol>
        <li>
          <MkLink href="/">{crumbsCopy.home}</MkLink>
        </li>
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}

function HeroBody({
  crumb,
  kicker,
  title,
  lede,
  actions,
}: {
  crumb?: string;
  kicker?: string;
  title: string;
  lede?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="wrap hero-inner">
      {crumb && <Crumbs current={crumb} />}
      {kicker && <p className="kicker">{kicker}</p>}
      <h1 className="h1" data-lines="" data-split-done="1">
        <Rich text={title} split />
      </h1>
      {lede && (
        <p className="hero-lede">
          <Rich text={lede} />
        </p>
      )}
      {actions && <div className="hero-actions">{actions}</div>}
    </div>
  );
}

type HeroProps = { crumb?: string; kicker?: string; title: string; lede?: string; actions?: ReactNode };

/** Mock `heroPhoto()`: `.hero-page` also switches the header to its transparent mode. */
export function HeroPhoto({ image, alt, ...body }: HeroProps & { image: string; alt: string }) {
  return (
    <section className="hero hero-page" data-hero="">
      <div className="hero-media" data-hero-media="">
        <MkImg url={image} alt={alt} eager className="hero-img" />
      </div>
      <div className="hero-light" aria-hidden="true" />
      <HeroBody {...body} />
    </section>
  );
}

/** Mock `heroText()`. */
export function HeroText(props: HeroProps) {
  return (
    <section className="hero hero-text tone-navy" data-hero="">
      <div className="hero-light" aria-hidden="true" />
      <HeroBody {...props} />
    </section>
  );
}
