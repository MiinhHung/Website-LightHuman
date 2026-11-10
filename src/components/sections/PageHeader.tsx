import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

/**
 * Compact light header for inner pages: breadcrumb, title, one-line lede,
 * optional action and photo. Only the home page keeps the full-screen
 * cinematic hero, so inner pages get to their content in the first screen.
 */
export function PageHeader({
  crumbs,
  title,
  lede,
  image,
  imageAlt = "",
  action,
}: {
  crumbs: Crumb[];
  title: ReactNode;
  lede: string;
  image?: string;
  imageAlt?: string;
  action?: { label: string; href: string };
}) {
  return (
    <section className={image ? "lh-page-head lh-page-head--media" : "lh-page-head"}>
      <div className="lh-container lh-page-head__grid">
        <div className="lh-page-head__copy">
          <nav aria-label="Breadcrumb">
            <ol className="lh-page-head__crumbs">
              {[{ label: "Trang chủ", href: "/" }, ...crumbs].map((c, i, all) => (
                <li key={`${c.label}-${i}`}>
                  {c.href && i < all.length - 1 ? (
                    <Link href={c.href}>{c.label}</Link>
                  ) : (
                    <span aria-current="page">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="lh-page-head__title">{title}</h1>
          <p className="lh-page-head__lede">{lede}</p>
          {action && (
            <Link href={action.href} className="lh-page-head__action">
              {action.label}
              <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
            </Link>
          )}
        </div>
        {image && (
          <div className="lh-page-head__media">
            <Image src={image} alt={imageAlt} fill preload sizes="(min-width: 1024px) 560px, 100vw" />
          </div>
        )}
      </div>
    </section>
  );
}
