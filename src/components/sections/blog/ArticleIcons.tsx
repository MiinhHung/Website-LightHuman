/** Icon SVG của trang bài viết — giữ nguyên path từ lighthuman.vn (không hoàn toàn trùng lucide). */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function CrumbSepIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" strokeWidth="2" className="lh-article-crumbs__sep" {...stroke}>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" {...stroke}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" {...stroke}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.8" {...stroke}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth="1.8" {...stroke}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.8" {...stroke}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.8" {...stroke}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.8" {...stroke}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}
