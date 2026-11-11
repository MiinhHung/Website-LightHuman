import { processHead, processSteps } from "@/content/home";
import { homeEn, processHeadEn } from "@/content/en/home";
import type { Locale } from "@/i18n/config";

/** The six working steps as a ruled 3 × 2 grid with large serif numerals. */
export function EdProcess({ locale = "vi" }: { locale?: Locale }) {
  const en = locale === "en";
  const head = en ? processHeadEn : processHead;
  const steps = en ? homeEn.process.steps : processSteps;

  return (
    <section className="lh-ed-section lh-ed-process">
      <div className="lh-container">
        <header className="lh-ed-head">
          <h2 className="lh-h2">{head.title}</h2>
          <p className="lh-lede">{head.lede}</p>
        </header>
        <ol className="lh-ed-process__grid">
          {steps.map((s, i) => (
            <li key={s.title} className="lh-ed-step">
              <span className="lh-ed-step__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="lh-ed-step__title">{s.title}</h3>
              <p className="lh-ed-step__desc">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
