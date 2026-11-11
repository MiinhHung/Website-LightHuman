"use client";

import { useEffect, useRef } from "react";
import { formatMoney } from "@/lib/salary/format";

/**
 * Số tiền "chạy" tới giá trị mới (ease-out 520ms). Ghi thẳng vào DOM qua ref nên không
 * gây re-render; tôn trọng prefers-reduced-motion. Nội dung SSR = giá trị cuối.
 */
export function AnimatedNumber({
  value,
  className,
  format = formatMoney,
}: {
  value: number;
  className?: string;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = shown.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || from === value) {
      shown.current = value;
      el.textContent = format(value);
      return;
    }
    const start = performance.now();
    const dur = 520;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (value - from) * eased;
      shown.current = v;
      el.textContent = format(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, format]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
