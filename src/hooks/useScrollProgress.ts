"use client";

import { useEffect, useState } from "react";

/**
 * Đo % tiến độ cuộn trang (từ 0 đến 100).
 * Thường dùng cho thanh tiến trình đọc bài viết (reading indicator).
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) {
        setProgress(0);
      } else {
        const pct = Math.min(100, Math.max(0, Math.round((scrollY / docHeight) * 100)));
        setProgress(pct);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}
