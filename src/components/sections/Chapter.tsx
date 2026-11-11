import type { ReactNode } from "react";
import { ArrowDown } from "lucide-react";

/**
 * One chapter of the home-page story: a mark ("02 — Chúng tôi làm gì") over the
 * top of the section it wraps, and an optional teaser for the next chapter at
 * the bottom so the reader keeps scrolling. Rules draw in on scroll (home.css).
 */
export function Chapter({
  n,
  label,
  tone = "light",
  next,
  children,
}: {
  n: number;
  label: string;
  tone?: "light" | "dark";
  /** Teaser for the following chapter; its anchor is `chuong-${n + 1}`. */
  next?: { prefix: string; label: string };
  children: ReactNode;
}) {
  const num = (k: number) => String(k).padStart(2, "0");
  return (
    <div id={`chuong-${n}`} className="lh-chapter" data-tone={tone} data-next={next ? "" : undefined}>
      <div className="lh-chapter__mark lh-container" aria-hidden="true">
        <span className="lh-chapter__n">{num(n)}</span>
        <span className="lh-chapter__rule" />
        <span className="lh-chapter__label">{label}</span>
      </div>
      {children}
      {next && (
        <div className="lh-chapter__next lh-container">
          <a href={`#chuong-${n + 1}`} className="lh-chapter__next-link">
            <span className="lh-chapter__next-prefix">{next.prefix}</span>
            <span className="lh-chapter__n">{num(n + 1)}</span>
            {next.label}
            <ArrowDown className="lh-chapter__next-arrow" size={15} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      )}
    </div>
  );
}
