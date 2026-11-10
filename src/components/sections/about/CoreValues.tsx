import type { ReactNode } from "react";
import { HeartHandshake, ShieldCheck, Sparkles, Sprout } from "lucide-react";
import { coreValuesSection, type ValueIcon } from "@/content/about";
import { Reveal } from "@/components/ui/Reveal";

const icons: Record<ValueIcon, ReactNode> = {
  "heart-handshake": <HeartHandshake size={20} strokeWidth={1.75} />,
  "shield-check": <ShieldCheck size={20} strokeWidth={1.75} />,
  sparkles: <Sparkles size={20} strokeWidth={1.75} />,
  sprout: <Sprout size={20} strokeWidth={1.75} />,
};

/** "Giá trị cốt lõi" — lưới thẻ dịch vụ dạng plain (không ảnh). */
export function CoreValues() {
  const { title, lede, items } = coreValuesSection;
  return (
    <section className="lh-section lh-section--surface lh-services-grid--null">
      <div className="lh-container">
        <div className="lh-services-grid">
          <div className="lh-services-grid__head">
            <div>
              <h2 className="lh-h2 lh-mt-md">{title}</h2>
              <p className="lh-lede lh-mt-md">{lede}</p>
            </div>
          </div>
          <div className="lh-services-grid__items lh-values-grid">
            {items.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="lh-service-card lh-service-card--plain">
                  <div className="lh-service-card__head">
                    <span className="lh-service-card__icon" aria-hidden="true">
                      {icons[v.icon]}
                    </span>
                    <h3 className="lh-service-card__title">{v.title}</h3>
                  </div>
                  <p className="lh-service-card__desc">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
