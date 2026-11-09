"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

const EASE = "var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1))";

/**
 * Hiệu ứng xuất hiện khi cuộn — giống hệt site gốc:
 * opacity 0 → 1, translateY(16px) → 0, 420ms, trễ theo `delay` (site gốc so le 80ms).
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  style,
  children,
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0px)" : "translateY(16px)",
        transition: `opacity 420ms ${EASE} ${delay}ms, transform 420ms ${EASE} ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
