"use client";

import { useActionState, type ReactNode } from "react";
import { submitContact } from "@/app/lien-he/actions";
import { contactFormCopy } from "@/content/contact";
import { serviceOptions, type ContactField, type ContactState } from "@/lib/contact-schema";
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
      <label className="lh-field">
        <span className="lh-field__label">{label}</span>
        {control({
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? errorId : undefined,
        })}
        {error && (
          <span id={errorId} className="contact-form__helper block">
            {error}
          </span>
        )}
      </label>
    );
  };

  const input = (name: ContactField, label: string, type: string, required: boolean) =>
    field(name, label, (a11y) => (
      <input
        type={type}
        required={required}
        className="lh-field__input"
        name={name}
        defaultValue={values[name]}
        {...a11y}
      />
    ));

  return (
    <form className="lh-contact-form__form" action={formAction} aria-busy={pending || undefined}>
      <div className="lh-contact-form__row lh-contact-form__row--2">
        {input("name", "Họ và tên *", "text", true)}
        {input("email", "Email công ty *", "email", true)}
      </div>
      <div className="lh-contact-form__row lh-contact-form__row--2">
        {input("phone", "Số điện thoại *", "tel", true)}
        {input("role", "Chức vụ", "text", false)}
      </div>
      {input("company", "Tên công ty *", "text", true)}
      {field("service", "Dịch vụ bạn quan tâm *", (a11y) => (
        <select
          name="service"
          required
          className="lh-field__input lh-field__select"
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
          className="lh-field__input lh-field__textarea"
          defaultValue={values.message}
          {...a11y}
        />
      ))}

      {/* Bẫy bot (honeypot) — vị trí tuyệt đối nên không chiếm ô lưới. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />

      {state.status === "error" && state.message && (
        <p className="contact-form__helper col-span-full" role="alert">
          {state.message}
        </p>
      )}

      <p className="lh-contact-form__privacy">
        <span aria-hidden="true">
          <ContactIcon name="shield-check" size={13} />
        </span>
        {contactFormCopy.privacy}
      </p>
      <button type="submit" className="lh-btn lh-btn--lg" disabled={pending}>
        {pending ? "Đang gửi…" : contactFormCopy.submit}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}

type A11y = { "aria-invalid"?: boolean; "aria-describedby"?: string };
