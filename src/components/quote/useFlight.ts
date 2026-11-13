"use client";

import { useCallback, useLayoutEffect, useRef } from "react";

type Rect = { left: number; top: number; width: number; height: number };
type Flight = { target: string; from: Rect };

/**
 * FLIP card flight from the mock's quote.js: remember where a card was, let
 * React re-render it elsewhere, then animate the new node from the old rect.
 * Web Animations API only, so the board needs no animation dependency.
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

  const get = useCallback((key: string) => nodes.current.get(key) ?? null, []);

  /** Animate after the next commit (the target node may not exist yet). */
  const launch = useCallback((target: string, from: Rect | null | undefined) => {
    if (from) queue.current.push({ target, from });
  }, []);

  /** Animate now: the node is already where it rests (e.g. a missed drop). */
  const flyNow = useCallback((target: string, from: Rect | null | undefined) => {
    const el = nodes.current.get(target);
    if (el && from) fly(el, from);
  }, []);

  const pulse = useCallback((key: string) => {
    const el = nodes.current.get(key);
    if (!el || reducedMotion()) return;
    el.animate(
      [{ boxShadow: "0 0 0 0 rgba(242, 207, 99, 0.7)" }, { boxShadow: "0 0 0 14px rgba(242, 207, 99, 0)" }],
      { duration: 650, easing: "ease-out" },
    );
  }, []);

  const shake = useCallback((key: string) => {
    const el = nodes.current.get(key);
    if (!el || reducedMotion()) return;
    el.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 300 },
    );
  }, []);

  useLayoutEffect(() => {
    const flights = queue.current;
    queue.current = [];
    for (const { target, from } of flights) {
      const el = nodes.current.get(target);
      if (el) fly(el, from);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { register, get, launch, flyNow, pulse, shake };
}

function fly(el: HTMLElement, from: Rect) {
  if (reducedMotion()) return;
  const to = el.getBoundingClientRect();
  if (!to.width) return;
  el.animate(
    [
      {
        transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${Math.min(1.4, from.width / to.width)})`,
        opacity: 0.7,
      },
      { transform: "none", opacity: 1 },
    ],
    { duration: 460, easing: "cubic-bezier(.32,.72,0,1)" },
  );
}

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
