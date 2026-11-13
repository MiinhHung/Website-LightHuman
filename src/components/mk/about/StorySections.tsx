import { storyAhead, storyMilestones, storyOrigin, storyTimeline } from "@/content/story";
import { fixCopy } from "@/lib/mk";
import { Rich } from "../ui";

export function StoryOrigin() {
  const o = storyOrigin;
  return (
    <section className="origin tone-paper" aria-labelledby="khoi-dau">
      <div className="wrap origin-grid">
        <div>
          <h2 className="h2" id="khoi-dau" data-split="" data-split-done="1">
            <Rich text={o.title} split />
          </h2>
          {o.paragraphs.map((p) => (
            <p key={p} className="lede">
              <Rich text={p} />
            </p>
          ))}
        </div>
        <aside className="origin-motto">
          <blockquote>
            <p>{o.motto}</p>
          </blockquote>
          <p className="fine">{fixCopy(o.mottoNote)}</p>
        </aside>
      </div>
    </section>
  );
}

/** Horizontal pinned track on desktop (runtime `data-hscroll`); stacks on mobile. */
export function StoryTimeline() {
  const t = storyTimeline;
  return (
    <section className="timeline tone-navy" aria-labelledby="hanh-trinh" data-hscroll="">
      <div className="hscroll-pin">
        <div className="hscroll-track" data-hscroll-track="">
          <div className="hscroll-intro">
            <h2 className="h2" id="hanh-trinh" data-split="" data-split-done="1">
              <Rich text={t.title} split />
            </h2>
            <p className="lede muted-dark">{t.lede}</p>
          </div>
          {storyMilestones.map((m) => (
            <article key={m.title} className="tl-item">
              <p className="tl-when">{m.when}</p>
              <span className="tl-dot" aria-hidden="true" />
              <h3 className="h3">{fixCopy(m.title)}</h3>
              <p>{fixCopy(m.text)}</p>
            </article>
          ))}
          <article className="tl-item tl-ahead">
            <p className="tl-when">{t.aheadWhen}</p>
            <span className="tl-dot" aria-hidden="true" />
            <h3 className="h3">{storyAhead.title}</h3>
            <p>{fixCopy(storyAhead.text)}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
