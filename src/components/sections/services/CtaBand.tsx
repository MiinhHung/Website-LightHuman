import Link from "next/link";
import type { CtaBandData } from "@/content/services";
import { rich } from "./rich";

const RINGS = [50, 72, 94, 116, 138, 160, 182, 204];

/** Dải CTA nền tối có vòng tròn nét đứt (lh-cta--dark). */
export function CtaBand({ cta }: { cta: CtaBandData }) {
  return (
    <section className="lh-section lh-cta lh-cta--dark">
      <div className="lh-container">
        <div className="lh-cta">
          <div className="lh-cta__band">
            <svg className="lh-cta__swirl" width="380" height="380" viewBox="0 0 380 380" aria-hidden="true">
              {RINGS.map((r) => (
                <circle
                  key={r}
                  cx="190"
                  cy="190"
                  r={r}
                  fill="none"
                  stroke="rgba(234,184,128,0.5)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />
              ))}
            </svg>
            <div className="lh-cta__copy">
              <h2 className="lh-cta__heading">{rich(cta.title)}</h2>
              <div className="lh-cta__desc">
                <p className="mb-4 leading-relaxed">
                  <span>{cta.desc}</span>
                </p>
              </div>
            </div>
            <div className="lh-cta__action">
              <Link href="/lien-he" className="lh-hero__cta-primary">
                {cta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
