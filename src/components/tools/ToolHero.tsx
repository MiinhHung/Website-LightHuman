import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Hero nền navy cho các trang công cụ: breadcrumb, tiêu đề, lede, dải số liệu
 * và (tuỳ chọn) ảnh bên phải kèm một thẻ nổi (`badge`) đè lên ảnh.
 */
export function ToolHero({
  eyebrow,
  title,
  lede,
  facts,
  crumbs,
  image,
  media,
  badge,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  facts?: { value: string; label: string }[];
  crumbs?: { label: string; href?: string }[];
  image?: { src: string; alt: string };
  /** Hình minh họa tự vẽ thay cho ảnh chụp. */
  media?: ReactNode;
  badge?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className={image || media ? "lht-hero lht-hero--media" : "lht-hero"}>
      <div className="lht-hero__pattern" aria-hidden="true" />
      <div className="lh-container lht-hero__inner">
        <div className="lht-hero__copy">
          {crumbs && (
            <nav aria-label="Breadcrumb" className="lht-crumbs">
              <ol>
                {crumbs.map((c, i) => (
                  <li key={c.label}>
                    {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                    {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <span className="lht-hero__eyebrow">
            <span className="lh-spark" aria-hidden="true" />
            {eyebrow}
          </span>
          <h1 className="lht-hero__title">{title}</h1>
          <p className="lht-hero__lede">{lede}</p>
          {children}
        </div>

        {image && (
          <div className="lht-hero__media">
            <div className="lht-hero__photo">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                preload
                sizes="(min-width: 980px) 42vw, 100vw"
                className="lht-hero__img"
              />
            </div>
            {badge && <div className="lht-hero__badge">{badge}</div>}
          </div>
        )}
        {!image && media && <div className="lht-hero__media lht-hero__media--art">{media}</div>}

        {facts && (
          <dl className="lht-hero__facts">
            {facts.map((f) => (
              <div key={f.label} className="lht-hero__fact">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
