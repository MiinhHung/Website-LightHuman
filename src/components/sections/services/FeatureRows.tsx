import type { IconItem } from "@/content/services";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceIcon } from "./icons";
import { rich } from "./rich";

/** "Vì sao chọn Light Human?" — các hàng tính năng xen kẽ (lh-feature-rows). */
export function FeatureRows({
  title,
  lede,
  items,
}: {
  eyebrow?: string;
  title: string;
  lede: string;
  items: IconItem[];
}) {
  return (
    <section className="lh-section">
      <div className="lh-container">
        <div className="lh-feature-rows">
          <div className="lh-feature-rows__head">
            <h2 className="lh-h2 lh-mt-md">{rich(title)}</h2>
            <p className="lh-lede lh-mt-md">{lede}</p>
          </div>
          <div className="lh-feature-rows__list">
            {items.map((it, i) => (
              <Reveal
                as="article"
                key={it.title}
                delay={i * 80}
                className={i % 2 === 1 ? "lh-feature-row lh-feature-row--flip" : "lh-feature-row"}
              >
                <div className="lh-feature-row__body">
                  <div className="lh-feature-row__head">
                    <div className="lh-feature-row__icon" aria-hidden="true">
                      <ServiceIcon name={it.icon} size={22} />
                    </div>
                  </div>
                  <h3 className="lh-feature-row__title">{it.title}</h3>
                  <p className="lh-feature-row__desc">{it.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
