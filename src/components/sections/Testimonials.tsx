import { testimonials } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";

/** "Khách hàng nói gì về Light Human?" — dùng ở trang chủ và Dịch vụ. */
export function Testimonials() {
  return (
    <section className="lh-section lh-testimonials">
      <div className="lh-container">
        <div className="lh-testimonials__head">
          <span className="lh-eyebrow lh-eyebrow--gold">Testimonials</span>
          <h2 className="lh-h2 lh-mt-md">
            Khách hàng nói gì về <em>Light Human</em>?
          </h2>
        </div>
        <div className="lh-testimonials__grid">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 80}>
              <figure className="lh-testimonial-card">
                <span className="lh-testimonial-card__mark" aria-hidden="true">
                  “
                </span>
                <blockquote className="lh-testimonial-card__quote">{t.quote}</blockquote>
                <figcaption className="lh-testimonial-card__author">
                  <span className="lh-testimonial-card__avatar" aria-hidden="true">
                    {t.avatar}
                  </span>
                  <span className="lh-testimonial-card__id">
                    <span className="lh-testimonial-card__name">{t.name}</span>
                    <span className="lh-testimonial-card__meta">{t.meta}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
