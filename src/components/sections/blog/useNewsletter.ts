"use client";

import { useState, type FormEvent } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type NewsletterStatus = "idle" | "invalid" | "success";

/** Trạng thái form đăng ký nhận tin (chưa có backend — chỉ kiểm tra email và báo thành công). */
export function useNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("invalid");
      return;
    }
    setStatus("success");
    setEmail("");
  }

  function onEmailChange(value: string) {
    setEmail(value);
    if (status !== "idle") setStatus("idle");
  }

  return { email, status, onSubmit, onEmailChange };
}
