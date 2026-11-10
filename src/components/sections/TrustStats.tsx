import type { CSSProperties, ReactNode } from "react";
import { Award, Briefcase, Building2, Users } from "lucide-react";
import type { TrustIcon } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";

const icons: Record<TrustIcon, ReactNode> = {
  award: <Award size={20} strokeWidth={1.75} />,
  building: <Building2 size={20} strokeWidth={1.75} />,
  briefcase: <Briefcase size={20} strokeWidth={1.75} />,
  users: <Users size={20} strokeWidth={1.75} />,
};

/** Hàng số liệu (lh-trust) — dùng ở trang chủ và trang Giới thiệu. */
export function TrustStats({
  title,
  stats,
}: {
  eyebrow?: string;
  title: ReactNode;
  stats: { icon?: TrustIcon; num: string; label: string }[];
}) {
  return (
    <section className="lh-section lh-section--compact lh-metrics-row">
      <div className="lh-container">
        <div className="lh-mb-lg">
          <h2 className="lh-h2 lh-mt-md">{title}</h2>
        </div>
        <div className="lh-trust" style={{ "--lh-trust-cols": stats.length } as CSSProperties}>
          {stats.map((s, i) => (
            <Reveal key={s.num + s.label} className="lh-trust__stat" delay={i * 80}>
              {s.icon && (
                <span className="lh-trust__icon" aria-hidden="true">
                  {icons[s.icon]}
                </span>
              )}
              <div className="num">{s.num}</div>
              <div className="lab">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
