import { Fragment } from "react";
import { aboutIntro } from "@/content/about";

/** Khối văn bản Sứ mệnh / Tầm nhìn (lh-prose căn giữa, giống nội dung rich-text CMS). */
export function AboutIntro() {
  const { mission, vision, quote, closing } = aboutIntro;
  return (
    <section className="lh-section">
      <div className="lh-container">
        <div className="lh-prose lh-prose--centered">
          {[mission, vision].map((block) => (
            <Fragment key={block.id}>
              <h2 id={block.id} className="text-3xl font-bold mt-8 mb-4">
                <span>{block.title}</span>
              </h2>
              <p className="mb-4 leading-relaxed">
                <span>{block.text}</span>
              </p>
            </Fragment>
          ))}
          <blockquote className="border-l-4 border-border pl-4 italic my-4 text-text-secondary">
            <span>
              <strong>{quote}</strong>
            </span>
          </blockquote>
          <p className="mb-4 leading-relaxed">
            <span>{closing}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
