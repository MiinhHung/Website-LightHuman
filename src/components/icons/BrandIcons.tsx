/** Icon SVG riêng của site gốc (không có trong lucide). Giữ nguyên path từ lighthuman.vn. */

type P = { size?: number };

export function PhoneIcon({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function ZaloIcon({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <text x="12" y="16" textAnchor="middle" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight="700" fontSize="10" fill="currentColor">
        Zalo
      </text>
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function FacebookSolidIcon({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

export function LinkedinSolidIcon({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43A2.06 2.06 0 1 1 5.34 3.3a2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.99 0 1.78-.77 1.78-1.72V1.72C24 .77 23.21 0 22.22 0z" />
    </svg>
  );
}

export function MailIcon({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

const outline = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function YoutubeOutlineIcon({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...outline} aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

export function FacebookOutlineIcon({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...outline} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function LinkedinOutlineIcon({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...outline} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function ArrowLineIcon({ size = 14 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/** Hình trang trí ở thẻ CTA (tia sáng + hai bong bóng chat). */
export function CtaDecor({ tone }: { tone: "light" | "dark" }) {
  const ray = tone === "light" ? "rgba(20,40,90,0.18)" : "rgba(242,207,99,0.3)";
  const bubble = tone === "light" ? "var(--brand-blue)" : "var(--brand-yellow)";
  return (
    <svg className="lh-cta__grid-decor" width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect key={deg} x="46" y="6" width="4" height="12" rx="2" fill={ray} transform={`rotate(${deg} 48 48)`} />
      ))}
      <rect x="20" y="32" width="42" height="28" rx="10" fill={bubble} />
      <rect x="36" y="46" width="40" height="26" rx="10" fill={bubble} opacity="0.85" />
    </svg>
  );
}
