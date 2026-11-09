import Link from "next/link";
import type { ReactNode } from "react";

/** Nút chữ có mũi tên "→" (lh-btn-ghost) ở đầu các section. */
export function GhostLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="lh-btn-ghost">
      {children}
      <span className="lh-btn-ghost__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
