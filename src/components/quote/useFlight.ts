"use client";

import { useCallback, useLayoutEffect, useRef } from "react";

type Rect = { left: number; top: number; width: number; height: number };
type Flight = { target: string; from: Rect };

/**
 * FLIP "card flight": remember where a card was (pointer overlay, deck card or
 * sheet chip), let React re-render it somewhere else, then animate the new
 * node from the old rect to its resting place. Pure Web Animations API so the
 * quote board needs no animation dependency.
 */
export function useFlight(deps: readonly unknown[]) {
  const nodes = useRef(new Map<string, HTMLElement>());
  const queue = useRef<Flight[]>([]);

  const register = useCallback(
    (key: string) => (el: HTMLElement | null) => {
      if (el) nodes.current.set(key, el);
      else nodes.current.delete(key);
    },
    [],
  );

  const launch = useCallback((target: string, from: Rect | null | undefined) => {
    if (from) queue.current.push({ target, from });
  }, []);

  const rectOf = useCallback((key: string): Rect | null => {
    const el = nodes.current.get(key);
    return el ? el.getBoundingClientRect() : null;
  }, []);

  const pulse = useCallback((key: string) => {
    const el = nodes.current.get(key);
    if (!el || reducedMotion()) return;
    el.animate(
      [
        { boxShadow: "0 0 0 0 rgba(242, 207, 99, 0.75)" },
        { boxShadow: "0 0 0 10px rgba(242, 207, 99, 0)" },
      ],
      { duration: 650, easing: "ease-out" },
    );
  }, []);

  useLayoutEffect(() => {
    const flights = queue.current;
    queue.current = [];
    if (flights.length === 0 || reducedMotion()) return;
    for (const { target, from } of flights) {
      const el = nodes.current.get(target);
      if (!el) continue;
      const to = el.getBoundingClientRect();
      if (!to.width || !to.height) continue;
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      const sx = from.width / to.width;
      const sy = from.height / to.height;
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy}) rotate(-6deg)`, opacity: 0.85, zIndex: 50 },
          { transform: "translate(0, 0) scale(1.08) rotate(1.5deg)", opacity: 1, offset: 0.78, zIndex: 50 },
          { transform: "none", opacity: 1, zIndex: 50 },
        ],
        { duration: 560, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { register, launch, rectOf, pulse };
}

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
