import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clientWall, partners } from "@/content/partners";
import type { Locale } from "@/i18n/config";

/**
 * Client logo wall: "800+" headline, then two rows of uniform white tiles
 * drifting in opposite directions. CMS logos come in mixed formats (JPEG with
 * backgrounds, padded PNGs), so each one sits in a fixed tile to keep the rhythm.
 */
export function Partners({ locale = "vi", showLink = true }: { locale?: Locale; showLink?: boolean }) {
  const copy = clientWall[locale];
  const logos = partners.filter((p) => !p.placeholder);
  const half = Math.ceil(logos.length / 2);
  const rows = [logos.slice(0, half), logos.slice(half)];

  return (
    <section className="lh-partners" aria-labelledby="lh-partners-title">
      <div className="lh-container lh-partners__head">
        <h2 id="lh-partners-title" className="lh-partners__heading">
          <span className="lh-partners__count">{copy.count}</span>
          <span className="lh-partners__title">{copy.heading}</span>
        </h2>
        <div className="lh-partners__aside">
          <p className="lh-partners__lede">{copy.lede}</p>
          {showLink && (
            <Link href={copy.link.href} className="lh-partners__link">
              {copy.link.label}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      <div className="lh-partners__rows">
        {rows.map((row, r) => (
          <div key={r} className="lh-partners__marquee">
            <div
              className={r === 1 ? "lh-partners__track lh-partners__track--reverse" : "lh-partners__track"}
              style={{ "--lh-marquee-duration": `${row.length * 3.4}s` } as CSSProperties}
            >
              {[0, 1].map((dup) =>
                row.map((p) => (
                  <span
                    key={`${dup}-${p.logo}`}
                    className="lh-partner-tile"
                    aria-hidden={dup === 1 || undefined}
                    title={dup === 0 ? p.name : undefined}
                  >
                    <Image src={p.logo} alt={dup === 1 ? "" : p.name} width={200} height={80} sizes="200px" />
                  </span>
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
