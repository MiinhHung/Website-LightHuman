"use client";

import { useActionState, type ReactNode } from "react";
import { submitContact } from "@/app/lien-he/actions";
import { contactFormCopy } from "@/content/contact";
import { serviceOptions, type ContactField, type ContactState } from "@/lib/contact-schema";
import { Button } from "@/components/ui/button";
import { ContactIcon } from "./ContactIcon";

const initialState: ContactState = { status: "idle" };

/** Form "Gửi yêu cầu cho chúng tôi" — markup/class như trang gốc, gửi qua Server Action. */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div className="contact-form__success" role="status">
        <h4 className="contact-form__success-heading">Cảm ơn bạn!</h4>
        <p className="contact-form__success-body">{state.message}</p>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const values = state.values ?? {};

  const field = (name: ContactField, label: string, control: (a11y: A11y) => ReactNode) => {
    const error = errors[name];
    const errorId = `contact-${name}-error`;
    return (
      <label className="block">
        <span className="block text-xs font-medium text-[var(--ink-700)] mb-1.5">{label}</span>
        {control({
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? errorId : undefined,
        })}
        {error && (
          <span id={errorId} className="contact-form__helper block text-xs text-rose-500 mt-1">
            {error}
          </span>
        )}
      </label>
    );
  };

  const inputClass =
    "w-full rounded-[10px] border border-[var(--border-1,#d9dfeb)] bg-[var(--bg-page,#fff)] px-3.5 py-3 text-[15px] text-[var(--ink-800)] outline-none transition-colors duration-150 focus:border-[var(--brand-gold,#f2cf63)]";

  const input = (name: ContactField, label: string, type: string, required: boolean) =>
    field(name, label, (a11y) => (
      <input
        type={type}
        required={required}
        className={inputClass}
        name={name}
        defaultValue={values[name]}
        {...a11y}
      />
    ));

  return (
    <form className="flex flex-col gap-4" action={formAction} aria-busy={pending || undefined}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {input("name", "Họ và tên *", "text", true)}
        {input("email", "Email công ty *", "email", true)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {input("phone", "Số điện thoại *", "tel", true)}
        {input("role", "Chức vụ", "text", false)}
      </div>
      {input("company", "Tên công ty *", "text", true)}
      {field("service", "Dịch vụ bạn quan tâm *", (a11y) => (
        <select
          name="service"
          required
          className={`${inputClass} appearance-none cursor-pointer pr-9 bg-[right_12px_center] bg-no-repeat`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235D6477' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          }}
          defaultValue={values.service ?? ""}
          {...a11y}
        >
          <option value="" disabled>
            Chọn dịch vụ
          </option>
          {serviceOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ))}
      {field("message", "Nội dung chi tiết về nhu cầu của bạn *", (a11y) => (
        <textarea
          name="message"
          rows={4}
          required
          className={`${inputClass} resize-y min-h-[96px]`}
          defaultValue={values.message}
          {...a11y}
        />
      ))}

      {/* Bẫy bot (honeypot) — vị trí tuyệt đối nên không chiếm ô lưới. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />

      {state.status === "error" && state.message && (
        <p className="contact-form__helper col-span-full text-sm text-rose-500" role="alert">
          {state.message}
        </p>
      )}

      <p className="inline-flex items-center gap-2 text-[12.5px] text-[var(--ink-500)] m-0">
        <span aria-hidden="true">
          <ContactIcon name="shield-check" size={13} />
        </span>
        {contactFormCopy.privacy}
      </p>
      <Button type="submit" variant="brand" size="brand-lg" disabled={pending}>
        {pending ? "Đang gửi…" : contactFormCopy.submit}
        <span aria-hidden="true">→</span>
      </Button>
    </form>
  );
}

type A11y = { "aria-invalid"?: boolean; "aria-describedby"?: string };
