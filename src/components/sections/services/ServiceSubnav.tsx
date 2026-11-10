"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { quoteHref } from "@/content/site";

export type SubnavItem = { id: string; label: string };

/**
 * Sticky in-page navigation for long service pages, with the quote action
 * always in reach. The current section is tracked with an IntersectionObserver.
 */
export function ServiceSubnav({ items }: { items: SubnavItem[] }) {
  const [current, setCurrent] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="lh-subnav" aria-label="Mục lục trang">
      <div className="lh-container lh-subnav__inner">
        <ul className="lh-subnav__list">
          {items.map((i) => (
            <li key={i.id}>
              <a href={`#${i.id}`} className="lh-subnav__link" aria-current={current === i.id ? "location" : undefined}>
                {i.label}
              </a>
            </li>
          ))}
        </ul>
        <Link href={quoteHref} className="lh-subnav__cta">
          Nhận báo giá
        </Link>
      </div>
    </nav>
  );
}
