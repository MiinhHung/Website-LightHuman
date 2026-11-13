import type { Metadata } from "next";
import { notFoundCopy } from "@/content/not-found";
import { LinkLine, Rich } from "@/components/mk/ui";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
};

// Mock 404 has no `data-hero`, so the title is static (no reveal) and the header stays solid.
export default function NotFound() {
  const c = notFoundCopy;
  return (
    <section className="hero hero-text tone-navy nf">
      <div className="hero-light" aria-hidden="true" />
      <div className="wrap hero-inner">
        <p className="kicker">{c.kicker}</p>
        <h1 className="h1">
          <Rich text={c.title} />
        </h1>
        <p className="hero-lede">{c.lede}</p>
        <ul className="nf-links">
          {c.links.map((l) => (
            <li key={l.href}>
              <LinkLine label={l.label} href={l.href} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
