import type { ReactNode } from "react";
import type { IconItem } from "@/content/services";
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
