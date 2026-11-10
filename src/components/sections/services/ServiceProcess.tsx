import type { CSSProperties } from "react";
import type { ProcessData } from "@/content/services";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceIcon } from "./icons";
import { rich } from "./rich";

/** Các bước quy trình (số bước, icon, nền sáng/tối tuỳ trang). */
export function ServiceProcess({ process }: { process: ProcessData }) {
  const { steps } = process;
  return (
    <section className={process.dark ? "lh-section lh-process-steps lh-process-steps--dark" : "lh-section lh-process-steps"}>
      <div className="lh-container">
        <div className="lh-process-steps">
          <div className="lh-process-steps__head">
            <h2 className="lh-h2">{process.title ? rich(process.title) : "Quy trình làm việc"}</h2>
            {process.lede && <p className="lh-lede lh-mt-md">{process.lede}</p>}
          </div>
          <ol className="lh-process-steps__list" style={{ "--lh-step-count": steps.length } as CSSProperties}>
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} className="lh-process-steps__item" delay={i * 80}>
                {i < steps.length - 1 && <span className="lh-process-steps__connector" aria-hidden="true" />}
                <div className="lh-process-steps__circle">
                  <ServiceIcon name={s.icon} size={22} />
                </div>
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
