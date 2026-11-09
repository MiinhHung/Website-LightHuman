import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { IconItem, Service } from "@/content/services";
import { Reveal } from "@/components/ui/Reveal";
import { GhostLink } from "@/components/sections/GhostLink";
import { ServiceIcon } from "./icons";
import { rich } from "./rich";

type Head = { eyebrow: string; title: string; lede?: string; link?: { label: string; href: string } };

function GridShell({ head, children }: { head: Head; children: ReactNode }) {
  return (
    <section className="lh-section lh-section--surface lh-services-grid--detail">
      <div className="lh-container">
        <div className="lh-services-grid">
          <div className="lh-services-grid__head">
            <div>
              <span className="lh-eyebrow lh-eyebrow--with-spark">
                <span className="lh-spark" aria-hidden="true" />
                {head.eyebrow}
              </span>
              <h2 className="lh-h2 lh-mt-md">{rich(head.title)}</h2>
              {head.lede && <p className="lh-lede lh-mt-md">{head.lede}</p>}
            </div>
            {head.link && <GhostLink href={head.link.href}>{head.link.label}</GhostLink>}
          </div>
          <div className="lh-services-grid__items">{children}</div>
        </div>
      </div>
    </section>
  );
}

/** Danh mục dịch vụ (trang /dich-vu): thẻ có icon, mô tả, ảnh và "Tìm hiểu thêm". */
export function ServiceCatalog({ head, items }: { head: Head; items: Service[] }) {
  return (
    <GridShell head={head}>
      {items.map((s, i) => (
        <Reveal key={s.slug} delay={i * 60}>
          <Link href={`/dich-vu/${s.slug}`} className="lh-service-card">
            <div className="lh-service-card__head">
              <span className="lh-service-card__icon" aria-hidden="true">
                <ServiceIcon name={s.icon} size={20} />
              </span>
              <h3 className="lh-service-card__title">{s.name}</h3>
            </div>
            <p className="lh-service-card__desc">{s.summary}</p>
            <div className="lh-service-card__media">
              <Image src={s.image} alt={s.name} fill sizes="(min-width: 1024px) 33vw, 100vw" className="lh-service-card__photo" />
            </div>
            <span className="lh-service-card__more">
              Tìm hiểu thêm
              <span className="lh-service-card__arrow" aria-hidden="true">
                →
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
    </GridShell>
  );
}

/** Phạm vi / gói dịch vụ ở trang chi tiết: thẻ "plain" (icon + tiêu đề + mô tả). */
export function ServiceScope({ head, items }: { head: Head; items: IconItem[] }) {
  return (
    <GridShell head={head}>
      {items.map((it, i) => (
        <Reveal key={it.title} delay={i * 60}>
          <div className="lh-service-card lh-service-card--plain">
            <div className="lh-service-card__head">
              <span className="lh-service-card__icon" aria-hidden="true">
                <ServiceIcon name={it.icon} size={20} />
              </span>
              <h3 className="lh-service-card__title">{it.title}</h3>
            </div>
            <p className="lh-service-card__desc">{it.desc}</p>
          </div>
        </Reveal>
      ))}
    </GridShell>
  );
}
