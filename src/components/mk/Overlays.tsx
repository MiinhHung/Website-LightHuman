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

function ChatBubbleIcon({ className }: { className?: string }) {
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
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
      <circle cx="8" cy="10" r="1.3" />
      <circle cx="12" cy="10" r="1.3" />
      <circle cx="16" cy="10" r="1.3" />
    </svg>
  );
}

function MailEnvelopeIcon({ className }: { className?: string }) {
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
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
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

function SendIcon({ className }: { className?: string }) {
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
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Xin chào! 👋 Tôi là tư vấn viên trực tuyến của Light Human. Doanh nghiệp bạn đang cần tư vấn tuyển dụng hay dịch vụ nhân sự nào?",
    time: "Vừa xong",
  },
];

const QUICK_SUGGESTIONS = [
  "Báo giá tuyển dụng nhân sự",
  "Tuyển nhân sự cấp cao (Headhunt)",
  "Tuyển dụng số lượng lớn cho nhà máy / bán lẻ",
  "Cần tư vấn trực tiếp qua điện thoại",
];

/** 2 nút nổi riêng biệt: 1 nút nhắn tin trực tiếp trên web, 1 nút gửi email thông báo */
function RailAndNotify() {
  const c = site.contact;
  const [activePanel, setActivePanel] = useState<"chat" | "email" | null>(null);
  const emailInput = useRef<HTMLInputElement | null>(null);
  const chatInput = useRef<HTMLInputElement | null>(null);
  const chatStreamRef = useRef<HTMLDivElement | null>(null);
  const [emailStatus, setEmailStatus] = useState<{ text: string; err: boolean } | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [chatDraft, setChatDraft] = useState("");
  const auto = useRef(false);

  const togglePanel = (panel: "chat" | "email") => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const closePanel = () => {
    setActivePanel(null);
    store.set("contact-panel-dismissed", "1");
  };

  useEffect(() => {
    if (activePanel === "email") {
      emailInput.current?.focus();
    } else if (activePanel === "chat") {
      chatInput.current?.focus();
    }
  }, [activePanel]);

  useEffect(() => {
    if (activePanel === "chat" && chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  }, [chatMessages, activePanel]);

  useEffect(() => {
    if (store.get("contact-panel-dismissed") || !("IntersectionObserver" in window)) return;
    const mark = document.createElement("div");
    mark.setAttribute("aria-hidden", "true");
    mark.style.cssText = `position:absolute;left:0;width:1px;height:1px;pointer-events:none;top:${Math.round(document.documentElement.scrollHeight * 0.55)}px`;
    document.body.appendChild(mark);
    const ob = new IntersectionObserver((l) => {
      if (l[0].isIntersecting && !store.get("contact-panel-dismissed")) {
        auto.current = true;
        setActivePanel("email");
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
      text: `Đã ghi nhận ${value}! Đội ngũ tư vấn sẽ gửi thông báo và liên hệ lại trong 24h.`,
      err: false,
    });
    form.reset();
  }

  function sendChatMessage(text: string) {
    const cleanText = text.trim();
    if (!cleanText) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: cleanText,
      time: "Vừa xong",
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatDraft("");

    // Phản hồi tự động từ tư vấn viên
    window.setTimeout(() => {
      const botReply: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: `Cảm ơn bạn! Light Human đã nhận được yêu cầu: "${cleanText}". Bạn vui lòng để lại Số điện thoại hoặc Email để chuyên viên phụ trách hỗ trợ bạn ngay nhé!`,
        time: "Vừa xong",
      };
      setChatMessages((prev) => [...prev, botReply]);
    }, 600);
  }

  function handleChatSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendChatMessage(chatDraft);
  }

  return (
    <>
      {/* 2 nút nổi riêng biệt: 1 nút nhắn tin trực tiếp trên web, 1 nút gửi email thông báo */}
      <div className="rail" data-contact-rail="">
        {/* Nút 1: Nhắn tin trực tiếp trên web */}
        <button
          className={`contact-fab contact-fab-chat${activePanel === "chat" ? " is-active" : ""}`}
          type="button"
          aria-expanded={activePanel === "chat"}
          aria-controls="chat-panel"
          aria-label={activePanel === "chat" ? "Đóng khung chat" : "Nhắn tin trực tiếp trên web"}
          onClick={() => togglePanel("chat")}
        >
          {activePanel === "chat" ? (
            <Ico name="x" className="contact-fab-ico" />
          ) : (
            <>
              <ChatBubbleIcon className="contact-fab-ico" />
              <span className="contact-fab-pulse-dot" aria-hidden="true" />
            </>
          )}
          <span className="rail-tip">
            {activePanel === "chat" ? "Đóng chat" : "Nhắn tin trực tiếp trên web"}
          </span>
        </button>

        {/* Nút 2: Gửi email thông báo */}
        <button
          className={`contact-fab contact-fab-email${activePanel === "email" ? " is-active" : ""}`}
          type="button"
          aria-expanded={activePanel === "email"}
          aria-controls="email-panel"
          aria-label={activePanel === "email" ? "Đóng form email" : "Gửi email thông báo"}
          onClick={() => togglePanel("email")}
        >
          {activePanel === "email" ? (
            <Ico name="x" className="contact-fab-ico" />
          ) : (
            <MailEnvelopeIcon className="contact-fab-ico" />
          )}
          <span className="rail-tip">
            {activePanel === "email" ? "Đóng thông báo" : "Gửi email thông báo"}
          </span>
        </button>
      </div>

      {/* POPUP 1: Khung Nhắn tin trực tiếp trên web */}
      <div
        className="contact-panel is-chat-mode"
        id="chat-panel"
        role="dialog"
        aria-modal="false"
        aria-label="Khung nhắn tin trực tiếp trên web"
        hidden={activePanel !== "chat"}
        onKeyDown={(e) => {
          if (e.key === "Escape") closePanel();
        }}
      >
        <div className="contact-chat-view">
          <div className="contact-chat-head">
            <div className="contact-chat-user">
              <div className="contact-chat-avatar-mini">
                <ChatBubbleIcon />
                <span className="contact-pulse-dot" aria-hidden="true" />
              </div>
              <div>
                <h4 className="contact-chat-name">Tư vấn viên Light Human</h4>
                <span className="contact-chat-online">Trực tuyến trên web • Sẵn sàng hỗ trợ</span>
              </div>
            </div>

            <button
              className="contact-panel-close-inline"
              type="button"
              aria-label="Đóng chat"
              onClick={closePanel}
            >
              <Ico name="x" />
            </button>
          </div>

          {/* Dòng hội thoại */}
          <div className="contact-chat-stream" ref={chatStreamRef}>
            <div className="contact-chat-date-divider">
              <span>Hôm nay</span>
            </div>

            {chatMessages.map((m) => (
              <div
                key={m.id}
                className={`contact-chat-bubble ${m.sender === "user" ? "is-user" : "is-bot"}`}
              >
                <div className="contact-chat-bubble-content">{m.text}</div>
                <span className="contact-chat-bubble-time">{m.time}</span>
              </div>
            ))}

            {/* Gợi ý câu hỏi nhanh */}
            {chatMessages.length <= 3 && (
              <div className="contact-chat-chips">
                <span className="contact-chips-title">Gợi ý câu hỏi nhanh:</span>
                <div className="contact-chips-list">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="contact-chip"
                      onClick={() => sendChatMessage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ô nhập tin nhắn trực tiếp */}
          <form onSubmit={handleChatSubmit} className="contact-chat-inputbar">
            <input
              ref={chatInput}
              type="text"
              placeholder="Nhập tin nhắn của bạn..."
              value={chatDraft}
              onChange={(e) => setChatDraft(e.target.value)}
              className="contact-chat-input"
              required
            />
            <button
              type="submit"
              className="contact-chat-send"
              disabled={!chatDraft.trim()}
              aria-label="Gửi tin nhắn"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>

      {/* POPUP 2: Khung Gửi email thông báo */}
      <div
        className="contact-panel"
        id="email-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="email-panel-h"
        hidden={activePanel !== "email"}
        onKeyDown={(e) => {
          if (e.key === "Escape") closePanel();
        }}
      >
        <button
          className="contact-panel-close"
          type="button"
          aria-label="Đóng"
          onClick={closePanel}
        >
          <Ico name="x" />
        </button>

        <div className="contact-panel-head">
          <span className="contact-panel-badge">Gửi email thông báo</span>
          <h3 className="contact-panel-title" id="email-panel-h">
            Nhận thông báo & Tư vấn
          </h3>
          <p className="contact-panel-sub">
            Để lại email để nhận thông báo phân tích thị trường nhân sự hoặc yêu cầu tư vấn.
          </p>
        </div>

        {/* Kênh Hotline */}
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
          <span>hoặc nhận thông báo qua email</span>
        </div>

        {/* Form gửi email thông báo */}
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
          <Link href="/lien-he" onClick={closePanel} className="contact-foot-link">
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
