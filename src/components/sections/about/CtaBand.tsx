import Link from "next/link";

const RINGS = [50, 72, 94, 116, 138, 160, 182, 204];

/** Vòng tròn chấm vàng trang trí bên phải dải CTA (giữ nguyên SVG site gốc). */
function CtaSwirl() {
  return (
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
  );
}

/** Dải CTA tối (lh-cta--dark) — dùng ở cuối trang Giới thiệu, Case Studies. */
export function CtaBand({
  heading,
  desc,
  action,
}: {
  heading: string;
  desc: string;
  action: { label: string; href: string };
}) {
  return (
    <section className="lh-section lh-cta lh-cta--dark">
      <div className="lh-container">
        <div className="lh-cta">
          <div className="lh-cta__band">
            <CtaSwirl />
            <div className="lh-cta__copy">
              <h2 className="lh-cta__heading">{heading}</h2>
              <div className="lh-cta__desc">
                <p className="mb-4 leading-relaxed">
                  <span>{desc}</span>
                </p>
              </div>
            </div>
            <div className="lh-cta__action">
              <Link href={action.href} className="lh-hero__cta-primary">
                {action.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
