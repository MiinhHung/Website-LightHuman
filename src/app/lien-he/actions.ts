"use server";

import { CONTACT_FIELDS, serviceOptions, validateContact, type ContactField, type ContactState } from "@/lib/contact-schema";

/**
 * Nhận yêu cầu tư vấn.
 * Nếu đặt biến môi trường CONTACT_WEBHOOK_URL (Google Apps Script, Zapier, Slack, CRM…),
 * dữ liệu sẽ được POST dạng JSON tới đó. Nếu chưa đặt, chỉ ghi log phía server.
 */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot chống bot: người dùng thật không thấy trường này.
  if (formData.get("website")) return { status: "success", message: "Cảm ơn bạn!" };

  const values = Object.fromEntries(
    CONTACT_FIELDS.map((f) => [f, String(formData.get(f) ?? "").slice(0, 3001)]),
  ) as Record<ContactField, string>;

  const errors = validateContact(values);
  if (Object.keys(errors).length) {
    return { status: "error", message: "Vui lòng kiểm tra lại các trường được đánh dấu.", errors, values };
  }

  try {
    const webhook = process.env.CONTACT_WEBHOOK_URL;
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          serviceLabel: serviceOptions.find((o) => o.value === values.service)?.label,
          submittedAt: new Date().toISOString(),
          source: "website",
        }),
      });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
    } else {
      console.info("[contact] Yêu cầu mới (chưa cấu hình CONTACT_WEBHOOK_URL):", values);
    }
  } catch (err) {
    console.error("[contact] Gửi thất bại:", err);
    return {
      status: "error",
      message: "Không gửi được yêu cầu. Vui lòng thử lại hoặc gọi hotline.",
      values,
    };
  }

  return {
    status: "success",
    message: "Đã nhận yêu cầu! Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ làm việc.",
  };
}
