import type { CSSProperties, ReactNode } from "react";
import { Briefcase, Building2, HeartHandshake, UsersRound } from "lucide-react";
import { aboutStats, type AboutStatIcon } from "@/content/about";
import { Reveal } from "@/components/ui/Reveal";

const icons: Record<AboutStatIcon, ReactNode> = {
  briefcase: <Briefcase size={20} strokeWidth={1.75} />,
  "users-round": <UsersRound size={20} strokeWidth={1.75} />,
  "building-2": <Building2 size={20} strokeWidth={1.75} />,
  "heart-handshake": <HeartHandshake size={20} strokeWidth={1.75} />,
};

/** "Light Human qua những con số" (lh-metrics-row / lh-trust) của trang Giới thiệu. */
export function AboutStats() {
  const { eyebrow, title, items } = aboutStats;
  return (
    <section className="lh-section lh-section--compact lh-metrics-row">
      <div className="lh-container">
        <div className="lh-mb-lg">
          <span className="lh-eyebrow">{eyebrow}</span>
          <h2 className="lh-h2 lh-mt-md">{title}</h2>
        </div>
        <div className="lh-trust" style={{ "--lh-trust-cols": items.length } as CSSProperties}>
          {items.map((s, i) => (
            <Reveal key={s.label} className="lh-trust__stat" delay={i * 80}>
              <span className="lh-trust__icon" aria-hidden="true">
                {icons[s.icon]}
              </span>
              <div className="num">{s.num}</div>
              <div className="lab">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
