"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { Ico } from "./ui";
import { NotifyForm } from "./NotifyForm";

const store = {
  get: (k: string) => {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      sessionStorage.setItem(k, v);
    } catch {
      /* storage blocked */
    }
  },
};

function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      width="28"
      height="28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 5C11.163 5 4 11.5 4 19.5c0 4.143 1.91 7.893 5.013 10.597L7.6 34.5a.8.8 0 001.07.98l5.88-2.35C16.32 33.71 18.11 34 20 34c8.837 0 16-6.5 16-14.5S28.837 5 20 5z"
        fill="#ffffff"
      />
      <g transform="translate(8, 8)">
        <path
          fill="#0084ff"
          d="M12.49 10.272v-.45h1.347v6.322h-.77a.576.576 0 01-.577-.573v.001a3.27 3.27 0 01-1.938.632a3.284 3.284 0 01-3.284-3.282a3.284 3.284 0 013.284-3.282 3.27 3.27 0 011.937.632zM6.919 7.79v.205c0 .382-.051.694-.3 1.06l-.03.034a8 8 0 00-.242.285L2.024 14.8h4.895v.768a.576.576 0 01-.577.576H0v-.362c0-.443.11-.641.25-.847L4.858 9.23H.192V7.79zm8.551 8.354a.48.48 0 01-.48-.48V7.79h1.441v8.354zM20.693 9.6a3.306 3.306 0 11.002 6.612a3.306 3.306 0 01-.002-6.612m-10.14 5.253a1.932 1.932 0 100-3.863 1.932 1.932 0 000 3.863m10.14-.003a1.945 1.945 0 100-3.89 1.945 1.945 0 000 3.89"
        />
      </g>
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1c0 9.39 7.61 17 17 17c.55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1.12" />
    </svg>
  );
}

/** Floating contact rail + the email panel it opens (auto-opens once per session at mid-page). */
function RailAndNotify() {
  const c = site.contact;
  const [open, setOpen] = useState(false);
  const email = useRef<HTMLInputElement | null>(null);
  const auto = useRef(false);

  const set = (v: boolean, isAuto = false) => {
    auto.current = isAuto;
    setOpen(v);
    if (!v) store.set("notify-dismissed", "1");
  };

  useEffect(() => {
    if (open && !auto.current) email.current?.focus();
  }, [open]);

  useEffect(() => {
    if (store.get("notify-dismissed") || !("IntersectionObserver" in window)) return;
    const mark = document.createElement("div");
    mark.setAttribute("aria-hidden", "true");
    mark.style.cssText = `position:absolute;left:0;width:1px;height:1px;pointer-events:none;top:${Math.round(document.documentElement.scrollHeight * 0.5)}px`;
    document.body.appendChild(mark);
    const ob = new IntersectionObserver((l) => {
      if (l[0].isIntersecting && !store.get("notify-dismissed")) {
        set(true, true);
        store.set("notify-dismissed", "1");
        ob.disconnect();
      }
    });
    const t = window.setTimeout(() => ob.observe(mark), 1500);
    return () => {
      window.clearTimeout(t);
      ob.disconnect();
      mark.remove();
    };
  }, []);

  return (
    <>
      <div className="rail" data-contact-rail="">
        <a
          className="contact-pulse-btn contact-btn-zalo"
          data-contact="zalo"
          href={c.zalo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn Zalo Light Human"
        >
          <ZaloIcon />
          <span className="rail-tip">Chat Zalo</span>
        </a>
        <a
          className="contact-pulse-btn contact-btn-phone"
          data-contact="phone"
          href={c.phoneHref}
          aria-label={`Gọi ${c.phone}`}
        >
          <span className="contact-phone-shake">
            <PhoneIcon />
          </span>
          <span className="rail-tip">Gọi {c.phone}</span>
        </a>
      </div>
      <div
        className="notify"
        id="notify-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="notify-h"
        hidden={!open}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            set(false);
          }
        }}
      >
        <button
          className="notify-x"
          type="button"
          aria-label="Đóng"
          onClick={() => {
            set(false);
          }}
        >
          <Ico name="x" />
        </button>
        <p className="notify-h" id="notify-h">
          Một bài Góc nhìn mới mỗi tuần
        </p>
        <p className="notify-p">Tuyển dụng, lương thưởng, xu hướng nhân sự. Không gửi quảng cáo.</p>
        <NotifyForm consentText="Tôi đồng ý nhận email theo" autoFocusRef={(el) => (email.current = el)} />
      </div>
    </>
  );
}

/** Company film: any `[data-video-open]` button on the page opens it (YouTube no-cookie). */
function VideoDialog() {
  const [open, setOpen] = useState(false);
  const last = useRef<HTMLElement | null>(null);
  const close = useRef<HTMLButtonElement>(null);
  const v = site.introVideo;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const b = (e.target as Element).closest<HTMLElement>("[data-video-open]");
      if (!b) return;
      last.current = b;
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) close.current?.focus();
    else last.current?.focus();
  }, [open]);

  return (
    <div
      className="video-dialog"
      role="dialog"
      aria-modal="true"
      aria-label={v.title}
      hidden={!open}
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
        if (e.key === "Tab") {
          e.preventDefault();
          close.current?.focus();
        }
      }}
    >
      <button ref={close} className="video-x" type="button" aria-label="Đóng video" onClick={() => setOpen(false)}>
        <Ico name="x" />
      </button>
      <div className="video-box">
        {open && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
            title={v.title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}

export function Overlays() {
  return (
    <>
      <RailAndNotify />
      <VideoDialog />
      <div className="cursor-light" aria-hidden="true" />
      <div className="page-wipe" aria-hidden="true" />
    </>
  );
}
