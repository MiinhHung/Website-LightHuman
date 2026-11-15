"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { Ico } from "./ui";

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

function ContactFabIcon({ className }: { className?: string }) {
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
      <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1.12zM21 4H11c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zm-.5 2l-4.5 2.81L11.5 6V5.25l4.5 2.81 4.5-2.81V6z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1c0 9.39 7.61 17 17 17c.55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1.12" />
    </svg>
  );
}

/** 1 nút duy nhất nổi bật (Navy & Gold) liên hệ qua form email hoặc SĐT hotline. */
function RailAndNotify() {
  const c = site.contact;
  const [open, setOpen] = useState(false);
  const emailInput = useRef<HTMLInputElement | null>(null);
  const [emailStatus, setEmailStatus] = useState<{ text: string; err: boolean } | null>(null);
  const auto = useRef(false);

  const set = (v: boolean, isAuto = false) => {
    auto.current = isAuto;
    setOpen(v);
    if (!v) store.set("contact-panel-dismissed", "1");
  };

  useEffect(() => {
    if (open && !auto.current) {
      emailInput.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (store.get("contact-panel-dismissed") || !("IntersectionObserver" in window)) return;
    const mark = document.createElement("div");
    mark.setAttribute("aria-hidden", "true");
    mark.style.cssText = `position:absolute;left:0;width:1px;height:1px;pointer-events:none;top:${Math.round(document.documentElement.scrollHeight * 0.55)}px`;
    document.body.appendChild(mark);
    const ob = new IntersectionObserver((l) => {
      if (l[0].isIntersecting && !store.get("contact-panel-dismissed")) {
        set(true, true);
        store.set("contact-panel-dismissed", "1");
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

  function handleEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const emailEl = form.elements.namedItem("email") as HTMLInputElement;
    const consentEl = form.elements.namedItem("consent") as HTMLInputElement;
    const value = emailEl.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setEmailStatus({ text: "Email chưa đúng định dạng (ví dụ: hr@congty.vn).", err: true });
      emailEl.focus();
      return;
    }
    if (!consentEl.checked) {
      setEmailStatus({ text: "Vui lòng chọn đồng ý để nhận phản hồi.", err: true });
      consentEl.focus();
      return;
    }

    setEmailStatus({
      text: `Đã ghi nhận ${value}! Đội ngũ tư vấn sẽ liên hệ lại trong 24h.`,
      err: false,
    });
    form.reset();
  }

  return (
    <>
      {/* 1 nút nổi duy nhất mang màu chủ đạo Navy - Gold hoàng kim nổi bật */}
      <div className="rail" data-contact-rail="">
        <button
          className={`contact-fab${open ? " is-active" : ""}`}
          type="button"
          aria-expanded={open}
          aria-controls="contact-panel"
          aria-label={open ? "Đóng bảng liên hệ" : "Mở liên hệ qua email hoặc số điện thoại"}
          onClick={() => set(!open)}
        >
          {open ? <Ico name="x" className="contact-fab-ico" /> : <ContactFabIcon className="contact-fab-ico" />}
          <span className="rail-tip">{open ? "Đóng" : "Liên hệ tư vấn"}</span>
        </button>
      </div>

      {/* Hộp thoại liên hệ nhanh qua Hotline hoặc Form Email */}
      <div
        className="contact-panel"
        id="contact-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="contact-panel-h"
        hidden={!open}
        onKeyDown={(e) => {
          if (e.key === "Escape") set(false);
        }}
      >
        <button
          className="contact-panel-close"
          type="button"
          aria-label="Đóng"
          onClick={() => set(false)}
        >
          <Ico name="x" />
        </button>

        <div className="contact-panel-head">
          <span className="contact-panel-badge">Liên hệ tư vấn</span>
          <h3 className="contact-panel-title" id="contact-panel-h">
            Light Human sẵn sàng hỗ trợ
          </h3>
          <p className="contact-panel-sub">
            Gọi hotline trực tiếp hoặc để lại email để nhận tư vấn nhanh nhất.
          </p>
        </div>

        {/* Kênh 1: Hotline điện thoại */}
        <div className="contact-phone-card">
          <div className="contact-phone-info">
            <span className="contact-phone-label">Hotline tư vấn</span>
            <strong className="contact-phone-number">{c.phone}</strong>
          </div>
          <a
            className="contact-call-btn"
            href={c.phoneHref}
            aria-label={`Gọi ngay số hotline ${c.phone}`}
          >
            <PhoneIcon />
            <span>Gọi ngay</span>
          </a>
        </div>

        <div className="contact-divider">
          <span>hoặc liên hệ qua email</span>
        </div>

        {/* Kênh 2: Form gửi email */}
        <form onSubmit={handleEmailSubmit} className="contact-email-form">
          <div className="contact-input-wrap">
            <input
              ref={emailInput}
              type="email"
              name="email"
              placeholder="Nhập email của bạn..."
              required
              className="contact-email-input"
            />
            <button type="submit" className="contact-submit-btn">
              <span>Gửi</span>
              <Ico name="arrow-right" />
            </button>
          </div>
          {emailStatus && (
            <p className={`contact-status${emailStatus.err ? " is-err" : ""}`}>
              {emailStatus.text}
            </p>
          )}
          <label className="contact-consent">
            <input type="checkbox" name="consent" defaultChecked />
            <span>
              Đồng ý nhận email theo{" "}
              <Link href="/chinh-sach-bao-mat">chính sách bảo mật</Link>.
            </span>
          </label>
        </form>

        <div className="contact-panel-foot">
          <Link href="/lien-he" onClick={() => set(false)} className="contact-foot-link">
            <span>Đến trang Liên hệ & Báo giá chi tiết</span>
            <Ico name="arrow-up-right" />
          </Link>
        </div>
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
