import Link from "next/link";
import { aboutIntro } from "@/content/about";

/** Mission and vision side by side, then the company motto as a pull quote. */
export function AboutIntro() {
  const { mission, vision, quote, closing } = aboutIntro;
  return (
    <section className="lh-section lh-about-intro">
      <div className="lh-container">
        <div className="lh-about-intro__grid">
          {[mission, vision].map((block) => (
            <article key={block.id} id={block.id} className="lh-about-intro__block">
              <h2 className="lh-about-intro__title">{block.title}</h2>
              <p className="lh-about-intro__text">{block.text}</p>
            </article>
          ))}
        </div>
        <figure className="lh-about-intro__quote">
          <blockquote>
            <p>“{quote}”</p>
          </blockquote>
          <figcaption>
            {closing}{" "}
            <Link href="/cau-chuyen" className="lh-about-intro__link">
              Đọc câu chuyện Light Human
            </Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
