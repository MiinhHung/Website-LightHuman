"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { site } from "@/content/site";
import { FacebookSolidIcon, LinkedinSolidIcon, MailIcon, PhoneIcon, ZaloIcon } from "@/components/icons/BrandIcons";

type Channel = { label: string; href: string; color: string; icon: ReactNode; external?: boolean };

const channels: Channel[] = [
  { label: "Gọi hotline", href: site.contact.phoneHref, color: "#2F7D5B", icon: <PhoneIcon /> },
  { label: "Chat Zalo", href: site.contact.zalo, color: "#0068FF", icon: <ZaloIcon />, external: true },
  { label: "Facebook", href: site.chat.facebook, color: "#1877F2", icon: <FacebookSolidIcon />, external: true },
  { label: "LinkedIn", href: site.chat.linkedin, color: "#0A66C2", icon: <LinkedinSolidIcon />, external: true },
  { label: "Gửi email", href: `mailto:${site.contact.email}`, color: "#b88436", icon: <MailIcon /> },
];

function ChannelLink({ c, delay, collapsed }: { c: Channel; delay: number; collapsed?: boolean }) {
  return (
    <a
      href={c.href}
      aria-label={c.label}
      title={c.label}
      className="lh-livechat__btn"
      style={{ "--ch-color": c.color, "--ch-delay": `${delay}ms` } as CSSProperties}
      data-collapsed={collapsed === undefined ? undefined : String(collapsed)}
      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {c.icon}
      <span className="sr-only">{c.label}</span>
    </a>
  );
}

/** Cụm nút liên hệ nhanh: desktop hiện cả 5; mobile thu gọn sau nút gọi (bấm để mở 4 kênh còn lại). */
export function LiveChat() {
  const [open, setOpen] = useState(false);
  const rest = channels.slice(1);

  return (
    <div className="above-footer-slot">
      <aside
        className="lh-livechat"
        data-position="bottom-right"
        data-mobile-collapse="true"
        data-open={String(open)}
        aria-label="Liên hệ nhanh"
      >
        <div className="lh-livechat__stack lh-livechat__stack--desktop">
          {channels.map((c, i) => (
            <ChannelLink key={c.label} c={c} delay={i * 40} />
          ))}
        </div>
        <div className="lh-livechat__stack lh-livechat__stack--mobile" id="lh-livechat-stack">
          {rest.map((c, i) => (
            <ChannelLink key={c.label} c={c} delay={i * 40} collapsed={!open} />
          ))}
          <div className="lh-livechat__primary">
            <button
              type="button"
              className="lh-livechat__toggle"
              aria-expanded={open}
              aria-controls="lh-livechat-stack"
              aria-label={open ? "Đóng menu liên hệ" : `Mở menu liên hệ — ${rest.length} kênh khác`}
              onClick={() => setOpen((v) => !v)}
            >
              <PhoneIcon />
              <span className="lh-livechat__badge" aria-hidden="true">
                {rest.length}+
              </span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
