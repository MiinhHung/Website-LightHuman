import type { CSSProperties } from "react";
import { caseStudies } from "@/content/case-studies";
import { services } from "@/content/services";
import { storyAhead, storyMilestones, storyOrigin, storyRecord, storyTimeline, type StoryProof } from "@/content/story";
import { fixCopy } from "@/lib/mk";
import { LinkLine, MkImg, MkLink, Rich } from "../ui";

const css = (vars: Record<string, string | number>) => vars as CSSProperties;

export function StoryOrigin() {
  const o = storyOrigin;
  return (
    <section className="origin tone-paper" aria-labelledby="khoi-dau">
      <div className="wrap">
        <h2 className="h2 origin-title" id="khoi-dau" data-split="" data-split-done="1">
          <Rich text={o.title} split />
        </h2>
        <div className="origin-cols">
          {o.paragraphs.map((p) => (
            <p key={p}>
              <Rich text={p} />
            </p>
          ))}
        </div>
        <figure className="origin-motto">
          <blockquote>
            <p>{o.motto}</p>
          </blockquote>
          <figcaption>{fixCopy(o.mottoNote)}</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Proof({ proof }: { proof: StoryProof }) {
  switch (proof.kind) {
    case "roots":
      return (
        <div className="chron-proof">
          <p className="chron-proof-k">{proof.label}</p>
          <ul className="chron-tags">
            {proof.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      );
    case "services":
      return (
        <div className="chron-proof">
          <p className="chron-proof-k">{proof.label}</p>
          <ul className="chron-tags">
            {services.map((s) => (
              <li key={s.slug}>
                <MkLink href={`/dich-vu/${s.slug}`}>{fixCopy(s.name)}</MkLink>
              </li>
            ))}
          </ul>
        </div>
      );
    case "case": {
      const cs = caseStudies.find((c) => c.slug === proof.slug);
      if (!cs?.quote) return null;
      return (
        <figure className="chron-quote">
          <blockquote>
            <p>{cs.quote.text}</p>
          </blockquote>
          <figcaption>
            <strong>{cs.quote.name}</strong>, {cs.quote.role}
          </figcaption>
          <LinkLine label={proof.linkLabel} href={`/case-studies#${cs.slug}`} />
        </figure>
      );
    }
    case "link":
      return (
        <div className="chron-proof">
          <LinkLine label={proof.label} href={proof.href} />
        </div>
      );
  }
}

/** Vertical chronicle; runtime `data-vtimeline` grows `.vt-fill` and lights each `li` as it is reached. */
export function StoryTimeline() {
  const t = storyTimeline;
  return (
    <section className="chronicle tone-navy" aria-labelledby="hanh-trinh">
      <div className="wrap">
        <div className="chron-head">
          <h2 className="h2" id="hanh-trinh" data-split="" data-split-done="1">
            <Rich text={t.title} split />
          </h2>
          <p className="lede">{t.lede}</p>
        </div>
        <div className="chron" data-vtimeline="">
          <span className="chron-rail" aria-hidden="true">
            <span className="vt-fill" />
          </span>
          <ol className="chron-list">
          {storyMilestones.map((m, i) => (
            <li key={m.title} className="chron-item" style={css({ "--i": i })}>
              <p className="chron-when">{m.when}</p>
              <span className="chron-dot" aria-hidden="true" />
              <div className="chron-body">
                <h3 className="h3">{fixCopy(m.title)}</h3>
                <p className="chron-text">{fixCopy(m.text)}</p>
                {m.stats && (
                  <dl className="chron-stats">
                    {m.stats.map((s) => (
                      <div key={s.label}>
                        <dt>{s.label}</dt>
                        <dd>{s.num}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {m.proof && <Proof proof={m.proof} />}
              </div>
            </li>
          ))}
          <li className="chron-item is-ahead">
            <p className="chron-when">{t.aheadWhen}</p>
            <span className="chron-dot" aria-hidden="true" />
            <div className="chron-body">
              <h3 className="h3">{storyAhead.title}</h3>
              <p className="chron-text">{fixCopy(storyAhead.text)}</p>
            </div>
          </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export function StoryRecord() {
  const r = storyRecord;
  return (
    <section className="record tone-paper" id="kiem-chung" aria-labelledby="kiem-chung-h">
      <div className="wrap record-grid">
        <figure className="record-photo" data-clip-reveal="">
          <MkImg url={r.photo.url} alt={r.photo.alt} sizes="(max-width: 900px) 100vw, 600px" />
          <figcaption>
            {r.photo.caption} <LinkLine label={r.photo.linkLabel} href={r.photo.href} />
          </figcaption>
        </figure>
        <div className="record-body">
          <h2 className="h2" id="kiem-chung-h" data-split="" data-split-done="1">
            <Rich text={r.title} split />
          </h2>
          <p className="lede">{r.lede}</p>
          <dl className="record-facts">
            {r.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd className={f.mono ? "is-mono" : undefined}>{fixCopy(f.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
