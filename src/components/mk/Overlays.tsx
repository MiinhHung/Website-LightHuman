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

/** Floating contact rail + the email panel it opens (auto-opens once per session at mid-page). */
function RailAndNotify() {
  const c = site.contact;
  const [open, setOpen] = useState(false);
  const bell = useRef<HTMLButtonElement>(null);
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
        <a className="rail-btn" data-contact="phone" href={c.phoneHref} aria-label={`Gọi ${c.phone}`}>
          <Ico name="phone" />
          <span className="rail-tip">Gọi {c.phone}</span>
        </a>
        <a className="rail-btn" data-contact="zalo" href={c.zalo} target="_blank" rel="noopener" aria-label="Nhắn Zalo Light Human">
          <Ico name="chat" />
          <span className="rail-tip">Zalo</span>
        </a>
        <a className="rail-btn" data-contact="facebook" href={site.socials.facebook} target="_blank" rel="noopener" aria-label="Facebook Light Human">
          <Ico name="facebook" />
          <span className="rail-tip">Facebook</span>
        </a>
        <a className="rail-btn" data-contact="email" href={`mailto:${c.email}`} aria-label={`Gửi email ${c.email}`}>
          <Ico name="envelope" />
          <span className="rail-tip">{c.email}</span>
        </a>
        <button
          ref={bell}
          className="rail-btn rail-bell"
          type="button"
          aria-expanded={open}
          aria-controls="notify-panel"
          aria-label="Nhận bài Góc nhìn qua email"
          onClick={() => set(!open)}
        >
          <Ico name="bell" />
          <span className="rail-tip">Nhận bài qua email</span>
        </button>
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
            bell.current?.focus();
          }
        }}
      >
        <button
          className="notify-x"
          type="button"
          aria-label="Đóng"
          onClick={() => {
            set(false);
            bell.current?.focus();
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
