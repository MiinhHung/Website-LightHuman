"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { BtnIco } from "./ui";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * "Nhận bài Góc nhìn qua email". Not wired to a mail service yet (the mock
 * only acknowledges), so it says so instead of pretending to subscribe.
 */
export function NotifyForm({
  inline,
  label = "Nhận bài Góc nhìn mới qua email",
  consentText = "Tôi đồng ý nhận email từ Light Human theo",
  autoFocusRef,
}: {
  inline?: boolean;
  label?: string;
  consentText?: string;
  autoFocusRef?: (el: HTMLInputElement | null) => void;
}) {
  const id = useId();
  const [status, setStatus] = useState<{ text: string; err: boolean } | null>(null);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const consent = form.elements.namedItem("consent") as HTMLInputElement;
    const value = email.value.trim();
    if (!EMAIL.test(value)) {
      setStatus({ text: "Email chưa đúng định dạng, ví dụ ban@congty.vn.", err: true });
      email.focus();
      return;
    }
    if (!consent.checked) {
      setStatus({ text: "Vui lòng tick đồng ý nhận email.", err: true });
      consent.focus();
      return;
    }
    // TODO(BA): no newsletter endpoint yet; nothing is stored.
    setStatus({ text: `Đã ghi nhận ${value} (chưa nối máy chủ gửi thư).`, err: false });
    form.reset();
  }

  const statusEl = (
    <p className={`nl-status${status?.err ? " is-err" : ""}`} role="status" aria-live="polite">
      {status?.text}
    </p>
  );
  const consentEl = (
    <label className="check">
      <input type="checkbox" name="consent" />{" "}
      <span>
        {consentText} <Link href="/chinh-sach-bao-mat">chính sách bảo mật</Link>.
      </span>
    </label>
  );

  if (inline) {
    return (
      <form className="notify-inline" noValidate onSubmit={submit}>
        <label htmlFor={id} className="nl-label">
          {label}
        </label>
        <div className="nl-row">
          <input id={id} type="email" name="email" placeholder="ban@congty.vn" autoComplete="email" required />
          <button className="btn btn-gold" type="submit">
            <span>Đăng ký</span>
            <BtnIco />
          </button>
        </div>
        {consentEl}
        {statusEl}
      </form>
    );
  }
  return (
    <form noValidate onSubmit={submit}>
      <label className="sr-only" htmlFor={id}>
        Email của bạn
      </label>
      <input id={id} ref={autoFocusRef} type="email" name="email" placeholder="ban@congty.vn" autoComplete="email" required />
      {consentEl}
      <button className="btn btn-gold" type="submit">
        <span>Đăng ký</span>
        <BtnIco />
      </button>
      {statusEl}
    </form>
  );
}
