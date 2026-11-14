"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export interface UseInViewOptions extends IntersectionObserverInit {
  readonly triggerOnce?: boolean;
}

/**
 * Hook kiểm tra một phần tử DOM có đang xuất hiện trong viewport hay không.
 * Phù hợp để tải lười dữ liệu (lazy loading) hoặc kích hoạt render biểu đồ.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, root = null, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            observer.unobserve(node);
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold, root, rootMargin },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  return [ref, inView];
}
