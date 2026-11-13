import type { CSSProperties } from "react";
import { aboutIntro, aboutStats, aboutVideo, coreValuesSection, teamSection } from "@/content/about";
import { site } from "@/content/site";
import { fixCopy, pad } from "@/lib/mk";
import { Ico, LinkLine, MkImg, Rich, SecHead } from "../ui";

const css = (vars: Record<string, string | number>) => vars as CSSProperties;

export function AboutIntro() {
  const a = aboutIntro;
  return (
    <section className="ab-intro tone-paper" aria-label={`${a.mission.title} và ${a.vision.title.toLowerCase()}`}>
      <div className="wrap ab-intro-grid">
        <article className="ab-card ab-mission" id={a.mission.id} data-rise="">
          <span className="ab-no" aria-hidden="true">
            01
          </span>
          <p className="ab-k">{a.mission.title}</p>
          <h2 className="ab-sentence">{fixCopy(a.mission.short)}</h2>
        </article>
        <article className="ab-card ab-vision" id={a.vision.id} data-rise="" style={css({ "--i": 1 })}>
          <span className="ab-no" aria-hidden="true">
            02
          </span>
          <p className="ab-k">{a.vision.title}</p>
          <h2 className="ab-sentence">{fixCopy(a.vision.short)}</h2>
        </article>
        <blockquote className="ab-quote" data-rise="">
          <p>{a.quote}</p>
        </blockquote>
      </div>
    </section>
  );
}

/** Mock `videoFeature()`; the button opens the global video lightbox. */
export function VideoFeature({ copy = aboutVideo }: { copy?: { eyebrow: string; title: string; lede: string; play: string } }) {
  const v = site.introVideo;
  return (
    <section className="video-feature tone-deep" aria-labelledby="phim">
      <div className="wrap">
        <SecHead id="phim" title={copy.title} kicker={copy.eyebrow} lede={copy.lede} center />
        <button className="video-frame" type="button" data-video-open="" data-clip-reveal="" aria-label={`${copy.play}: ${v.title}`}>
          <MkImg url={v.poster} alt="" sizes="(max-width: 1240px) 92vw, 1200px" />
          <span className="video-play">
            <span className="video-play-ring">
              <Ico name="play" />
            </span>
            <span>
              {copy.play} · {v.duration}
            </span>
          </span>
        </button>
      </div>
    </section>
  );
}

export function AboutStats() {
  const s = aboutStats;
  return (
    <section className="ab-stats tone-cream" aria-labelledby="con-so-gt">
      <div className="wrap">
        <h2 className="h2 ab-stats-title" id="con-so-gt" data-split="" data-split-done="1">
          <Rich text={s.title} split />
        </h2>
        <dl className="ab-frames">
          {s.items.map((x, i) => (
            <div key={x.label} className="ab-frame" data-rise="" style={css({ "--i": i })}>
              <span className="ab-frame-ico" aria-hidden="true">
                <Ico name={x.icon} />
              </span>
              <dd className="ab-frame-num">
                <span className="num" data-count={parseInt(x.num.replace(/\./g, ""), 10)} data-suffix={x.num.replace(/[\d.]/g, "")}>
                  {x.num}
                </span>
              </dd>
              <dt className="ab-frame-label">{x.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function CoreValues() {
  const v = coreValuesSection;
  return (
    <section className="val tone-navy" aria-labelledby="gia-tri">
      <div className="wrap">
        <SecHead id="gia-tri" title={v.title} lede={v.lede} className="val-head" />
        <div className="val-grid">
          {v.items.map((x, i) => (
            <article key={x.title} className={`val-card val-${i + 1}`} data-rise="" style={css({ "--i": i % 2 })}>
              <span className="val-n" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <span className="val-ico" aria-hidden="true">
                <Ico name={x.icon} />
              </span>
              <h3 className="val-title">{x.title}</h3>
              <p className="val-desc">{fixCopy(x.desc)}</p>
              <div className="val-proof">
                <p className="val-proof-k">{v.proofKicker}</p>
                <p>{x.proof.text}</p>
                <LinkLine label={x.proof.label} href={x.proof.href} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Team() {
  const t = teamSection;
  return (
    <section className="team tone-paper" id="doi-ngu" aria-labelledby="doi-ngu-h">
      <div className="wrap">
        <SecHead id="doi-ngu-h" title={t.title} kicker={t.eyebrow} lede={t.lede} />
        <ul className="team-list">
          {t.members.map((m, i) => (
            <li key={m.name} className="team-row" data-rise="" style={css({ "--i": i })}>
              <div className="team-photo">
                <MkImg url={m.photo} alt={m.name} sizes="160px" />
              </div>
              <div className="team-id">
                <h3 className="team-name">{m.name}</h3>
                <p className="team-role">{fixCopy(m.role)}</p>
              </div>
              <p className="team-bio">{m.bio}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
