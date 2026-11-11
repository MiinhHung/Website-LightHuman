import type { CSSProperties } from "react";
import { manifesto } from "@/content/home";
import { manifestoEn } from "@/content/en/home";
import type { Locale } from "@/i18n/config";

/**
 * Tall section with a sticky statement whose words light up one by one as the
 * page scrolls (CSS scroll-driven animation, see home.css). Without support or
 * under reduced motion it is a normal-height section with the text fully lit.
 */
export function Manifesto({ locale = "vi" }: { locale?: Locale }) {
  const t = locale === "en" ? manifestoEn : manifesto;
  const words = t.segments.flatMap((s) => s.text.split(" ").map((w) => ({ w, em: !!s.em })));
  const n = words.length;

  return (
    <section className="lh-manifesto" aria-labelledby="lh-manifesto-text">
      <div className="lh-manifesto__stick">
        <div className="lh-container">
          <p className="lh-manifesto__eyebrow">{t.eyebrow}</p>
          <p id="lh-manifesto-text" className="lh-manifesto__text">
            {words.map(({ w, em }, i) => (
              <span
                key={i}
                className={em ? "lh-manifesto__w lh-manifesto__w--em" : "lh-manifesto__w"}
                // Each word gets its own slice of the section's scroll range.
                style={{ "--p": ((i / n) * 72).toFixed(2) } as CSSProperties}
              >
                {w}{" "}
              </span>
            ))}
          </p>
          <p className="lh-manifesto__sign">{t.sign}</p>
        </div>
      </div>
    </section>
  );
}
