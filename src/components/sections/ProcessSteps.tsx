import type { ReactNode } from "react";
import { ClipboardCheck, Handshake, Search, Sprout, Target, Users } from "lucide-react";
import { processSteps, type StepIcon } from "@/content/home";

const icons: Record<StepIcon, ReactNode> = {
  users: <Users size={22} strokeWidth={1.75} />,
  search: <Search size={22} strokeWidth={1.75} />,
  target: <Target size={22} strokeWidth={1.75} />,
  handshake: <Handshake size={22} strokeWidth={1.75} />,
  clipboard: <ClipboardCheck size={22} strokeWidth={1.75} />,
  sprout: <Sprout size={22} strokeWidth={1.75} />,
};

/**
 * The site's signature moment: a sticky heading beside the six steps, with a
 * gold beam that fills and lights each step as it scrolls through the
 * viewport (CSS scroll-driven animation; static and fully lit where
 * unsupported or under reduced motion).
 */
export function ProcessSteps({
  title = "Sáu bước Light Human đồng hành cùng bạn",
  lede = "Từ thấu hiểu nhu cầu đến tối ưu liên tục, mỗi bước đều có người chịu trách nhiệm và kết quả đo được.",
  steps = processSteps,
  stepLabel = "Bước",
}: {
  stepLabel?: string;
  title?: ReactNode;
  lede?: ReactNode;
  steps?: { icon: StepIcon; title: string; desc: string }[];
}) {
  return (
    <section className="lh-light">
      <div className="lh-container lh-light__grid">
        <div className="lh-light__intro">
          <h2 className="lh-light__title">{title}</h2>
          <p className="lh-light__lede">{lede}</p>
        </div>
        <ol className="lh-light__steps">
          <span className="lh-light__beam" aria-hidden="true">
            <span className="lh-light__beam-fill" />
          </span>
          {steps.map((s, i) => (
            <li key={s.title} className="lh-light__step">
              <span className="lh-light__marker" aria-hidden="true">
                {icons[s.icon]}
              </span>
              <div>
                <p className="lh-light__num">{stepLabel} {i + 1}</p>
                <h3 className="lh-light__step-title">{s.title}</h3>
                <p className="lh-light__desc">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
