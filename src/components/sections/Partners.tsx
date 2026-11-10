import type { CSSProperties } from "react";
import Image from "next/image";
import { partners } from "@/content/partners";

/**
 * Client logo wall: two rows of uniform tiles drifting in opposite directions.
 * CMS logos come in mixed formats (JPEG with backgrounds, padded PNGs), so each
 * one sits in a fixed white tile to keep the rhythm even.
 */
export function Partners({ eyebrow = "Được tin tưởng bởi" }: { eyebrow?: string }) {
  const logos = partners.filter((p) => !p.placeholder);
  const half = Math.ceil(logos.length / 2);
  const rows = [logos.slice(0, half), logos.slice(half)];

  return (
    <section className="lh-section lh-section--compact lh-partners">
      <div className="lh-container">
        <div className="lh-partners__head">
          <span className="lh-eyebrow">{eyebrow}</span>
          <h2 className="lh-h2 lh-partners__heading">
            Khách hàng <em>tiêu biểu</em>
          </h2>
          <p className="lh-partners__lede">
            Hơn 800 doanh nghiệp trong nước và quốc tế đã chọn Light Human làm đối tác tuyển dụng.
          </p>
        </div>
      </div>

      <div className="lh-partners__rows">
        {rows.map((row, r) => (
          <div key={r} className="lh-partners__marquee">
            <div
              className={r === 1 ? "lh-partners__track lh-partners__track--reverse" : "lh-partners__track"}
              style={{ "--lh-marquee-duration": `${row.length * 3.2}s` } as CSSProperties}
            >
              {[0, 1].map((copy) =>
                row.map((p) => (
                  <span
                    key={`${copy}-${p.logo}`}
                    className="lh-partner-tile"
                    aria-hidden={copy === 1 || undefined}
                    title={copy === 0 ? p.name : undefined}
                  >
                    <Image src={p.logo} alt={copy === 1 ? "" : p.name} width={160} height={64} sizes="160px" />
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
