import type { CSSProperties, ReactNode } from "react";
import { ClipboardCheck, Handshake, Search, Sprout, Target, Users } from "lucide-react";
import { processSteps, type StepIcon } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";

const icons: Record<StepIcon, ReactNode> = {
  users: <Users size={22} strokeWidth={1.75} />,
  search: <Search size={22} strokeWidth={1.75} />,
  target: <Target size={22} strokeWidth={1.75} />,
  handshake: <Handshake size={22} strokeWidth={1.75} />,
  clipboard: <ClipboardCheck size={22} strokeWidth={1.75} />,
  sprout: <Sprout size={22} strokeWidth={1.75} />,
};

/** 6 bước quy trình (nền navy). Dùng ở trang chủ, Dịch vụ, chi tiết dịch vụ. */
export function ProcessSteps({
  title = (
    <>
      6 bước Light Human <em>đồng hành</em> cùng bạn
    </>
  ),
  lede = "Từ thấu hiểu nhu cầu đến tối ưu liên tục - quy trình được thiết kế để mang lại kết quả bền vững.",
  steps = processSteps,
}: {
  title?: ReactNode;
  lede?: ReactNode;
  steps?: { icon: StepIcon; title: string; desc: string }[];
}) {
  return (
    <section className="lh-section lh-process-steps lh-process-steps--dark">
      <div className="lh-container">
        <div className="lh-process-steps">
          <div className="lh-process-steps__head">
            <span className="lh-eyebrow">Quy trình</span>
            <h2 className="lh-h2 lh-mt-md">{title}</h2>
            {lede && <p className="lh-lede lh-mt-md">{lede}</p>}
          </div>
          <ol className="lh-process-steps__list" style={{ "--lh-step-count": steps.length } as CSSProperties}>
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} className="lh-process-steps__item" delay={i * 80}>
                {i < steps.length - 1 && <span className="lh-process-steps__connector" aria-hidden="true" />}
                <div className="lh-process-steps__circle">{icons[s.icon]}</div>
                <div className="lh-process-steps__num lh-mono">{String(i + 1).padStart(2, "0")}</div>
                <div className="lh-process-steps__title">{s.title}</div>
                <p className="lh-process-steps__desc">{s.desc}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
