import type { ReactNode } from "react";

/**
 * Magazine-style chapter mark ("02 — Dịch vụ") laid over the top of the section
 * it wraps. The rule draws itself in as the section scrolls into view (home.css).
 */
export function Chapter({
  n,
  label,
  tone = "light",
  children,
}: {
  n: number;
  label: string;
  tone?: "light" | "dark";
  children: ReactNode;
}) {
  return (
    <div className="lh-chapter" data-tone={tone}>
      <div className="lh-chapter__mark lh-container" aria-hidden="true">
        <span className="lh-chapter__n">{String(n).padStart(2, "0")}</span>
        <span className="lh-chapter__rule" />
        <span className="lh-chapter__label">{label}</span>
      </div>
      {children}
    </div>
  );
}
