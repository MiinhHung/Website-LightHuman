import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import icons from "@/content/mk/icons.json";
import { fixCopy, imgSize, imgSrc, richParts } from "@/lib/mk";

const ICONS = icons as Record<string, string>;
export type IcoName = keyof typeof icons;

/** Phosphor Light icon from the mock's icon set (paths are static, trusted data). */
export function Ico({ name, className }: { name: string; className?: string }) {
  const path = ICONS[name];
  if (!path) throw new Error(`Missing icon: ${name}`);
  return (
    <svg
      className={className ? `ico ${className}` : "ico"}
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: path }}
    />
  );
}

export const BtnIco = ({ name = "arrow-right" }: { name?: string }) => (
  <span className="btn-ico">
    <Ico name={name} />
  </span>
);

/** CMS or local image; local copies get their intrinsic size so layout does not jump. */
export function MkImg({
  url,
  alt,
  className,
  eager,
  sizes,
}: {
  url: string;
  alt: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const src = imgSrc(url);
  const dim = imgSize(src);
  if (!dim) {
    // Remote image without a local copy (article bodies); keep the CMS URL.
    return (
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        className={className}
        sizes={sizes ?? "100vw"}
        preload={eager}
        loading={eager ? undefined : "lazy"}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={dim[0]}
      height={dim[1]}
      className={className}
      sizes={sizes ?? "100vw"}
      preload={eager}
      loading={eager ? undefined : "lazy"}
    />
  );
}

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

export function MkLink({
  href,
  className,
  children,
  ...rest
}: { href: string; className?: string; children: ReactNode } & Record<string, unknown>) {
  if (isExternal(href)) {
    const blank = href.startsWith("http");
    return (
      <a href={href} className={className} {...(blank ? { target: "_blank", rel: "noopener" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}

export function Btn({
  label,
  href,
  kind = "gold",
  icon = "arrow-right",
  className,
  magnetic,
}: {
  label: string;
  href: string;
  kind?: "gold" | "navy" | "ghost" | "line";
  icon?: string;
  className?: string;
  magnetic?: boolean;
}) {
  return (
    <MkLink href={href} className={`btn btn-${kind}${className ? ` ${className}` : ""}`} data-magnetic={magnetic ? "" : undefined}>
      <span>{label}</span>
      <BtnIco name={icon} />
    </MkLink>
  );
}

export function LinkLine({ label, href, icon = "arrow-right" }: { label: string; href: string; icon?: string }) {
  return (
    <MkLink href={href} className="link-line">
      {label}
      <Ico name={icon} />
    </MkLink>
  );
}

/** Words pre-wrapped as `.wd > .wi` so the runtime's GSAP reveal never rewrites React-owned text. */
function SplitWords({ text }: { text: string }) {
  const parts = text.split(/(\s+)/);
  return (
    <>
      {parts.map((p, i) =>
        !p ? null : /^\s+$/.test(p) ? (
          <Fragment key={i}>{p}</Fragment>
        ) : (
          <span key={i} className="wd">
            <span className="wi">{p}</span>
          </span>
        ),
      )}
    </>
  );
}

/** `*nghiêng*` → <em>; `split` pre-splits words for the reveal animation. */
export function Rich({ text, split, fix = true }: { text: string; split?: boolean; fix?: boolean }) {
  const parts = richParts(fix ? fixCopy(text) : text);
  return (
    <>
      {parts.map((p, i) => {
        const inner = split ? <SplitWords text={p.text} /> : p.text;
        return p.em ? <em key={i}>{inner}</em> : <Fragment key={i}>{inner}</Fragment>;
      })}
    </>
  );
}

export function SecHead({
  id,
  title,
  kicker,
  lede,
  center,
  className,
  after,
}: {
  id?: string;
  title: string;
  kicker?: string;
  lede?: string;
  center?: boolean;
  className?: string;
  after?: ReactNode;
}) {
  return (
    <div className={`sec-head${center ? " sec-center" : ""}${className ? ` ${className}` : ""}`}>
      {kicker && <p className="eyebrow">{fixCopy(kicker)}</p>}
      <h2 className="h2" id={id} data-split="" data-split-done="1">
        <Rich text={title} split />
      </h2>
      {lede && (
        <p className="lede">
          <Rich text={lede} />
        </p>
      )}
      {after}
    </div>
  );
}

/** Gold closing band at the end of every page. */
export function CtaBand({
  title,
  desc,
  action,
  secondary,
}: {
  title: string;
  desc?: string;
  action: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="cta-band tone-gold" aria-labelledby="cta-cuoi">
      <div className="wrap cta-inner">
        <h2 className="display" id="cta-cuoi" data-split="" data-split-done="1">
          <Rich text={title} split />
        </h2>
        <div className="cta-side">
          {desc && (
            <p>
              <Rich text={desc} />
            </p>
          )}
          <Btn label={action.label} href={action.href} kind="navy" className="btn-lg" magnetic />
          {secondary && <LinkLine label={secondary.label} href={secondary.href} icon="arrow-up-right" />}
        </div>
      </div>
    </section>
  );
}
