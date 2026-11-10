"use client";

import { useEffect, useRef } from "react";

const fmt = new Intl.NumberFormat("vi-VN");

/**
 * Counts a stat like "36.000+" up from zero once on mount. The server renders
 * the final value (crawlers, no-JS); the count writes textContent from a
 * rAF loop, never React state. Skipped under reduced motion.
 */
export function CountUp({ value, delay = 0, duration = 1400 }: { value: string; delay?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^([\d.]+)(.*)$/);
    if (!el || !match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = Number(match[1].replace(/\./g, ""));
    const suffix = match[2];
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, Math.max(0, (t - start - delay) / duration));
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(Math.round(target * eased)) + suffix;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    el.textContent = `0${suffix}`;
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value, delay, duration]);

  return (
    <span ref={ref} aria-label={value}>
      {value}
    </span>
  );
}
