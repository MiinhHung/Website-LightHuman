"use client";

import { useSyncExternalStore } from "react";

export function useMedia(query: string, defaultValue: boolean = false): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => {
      if (typeof window === "undefined") return defaultValue;
      return window.matchMedia(query).matches;
    },
    () => defaultValue,
  );
}
