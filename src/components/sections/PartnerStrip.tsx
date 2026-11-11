import type { CSSProperties } from "react";
import Image from "next/image";
import { partners } from "@/content/partners";

/**
 * Slim client strip right under the home hero: one label and one drifting row
 * of logos. The full two-row wall (<Partners />) stays on service pages.
 */
export function PartnerStrip({ label }: { label: string }) {
  const logos = partners.filter((p) => !p.placeholder);
  return (
    <section className="lh-strip" aria-label={label}>
      <div className="lh-container lh-strip__inner">
        <p className="lh-strip__label">{label}</p>
        <div className="lh-partners__marquee lh-strip__marquee">
          <div
            className="lh-partners__track"
            style={{ "--lh-marquee-duration": `${logos.length * 2.6}s` } as CSSProperties}
          >
            {[0, 1].map((copy) =>
              logos.map((p) => (
                <span
                  key={`${copy}-${p.logo}`}
                  className="lh-strip__logo"
                  aria-hidden={copy === 1 || undefined}
                  title={copy === 0 ? p.name : undefined}
                >
                  <Image src={p.logo} alt={copy === 1 ? "" : p.name} width={120} height={48} sizes="120px" />
                </span>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
