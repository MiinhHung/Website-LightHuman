"use client";

import { vi } from "@/content/quote/labels.vi";
import type { QuoteFormErrors, QuoteFormValues } from "@/app/lien-he/quote-state";
import { Req } from "./Deck";

type Shared = { errors: QuoteFormErrors; values: QuoteFormValues; locked: boolean };

/** Mock `.qd-contact`: "Người nhận báo giá" on the paper, keyed by the Server Action's field names. */
export function ContactFields(shared: Shared) {
  return (
    <fieldset className="qd-contact">
      <legend>{vi.board.recipient}</legend>
      <div className="qd-contact-grid">
        <Field id="bg-name" name="contact.name" label={vi.contact.name} type="text" auto="name" required {...shared} />
        <Field id="bg-company" name="contact.company" label={vi.contact.company} type="text" auto="organization" required {...shared} />
        <Field
          id="bg-email"
          name="contact.email"
          label={vi.contact.email}
          type="email"
          auto="email"
          inputMode="email"
          placeholder="ban@congty.vn"
          hint
          {...shared}
        />
        <Field
          id="bg-phone"
          name="contact.phone"
          label={vi.contact.phone}
          type="tel"
          auto="tel"
          inputMode="tel"
          placeholder="0901 234 567"
          hint
          {...shared}
        />
      </div>
      <p className="qd-fine" id="bg-contact-hint">
        {vi.contact.needEmailOrPhone}
      </p>
    </fieldset>
  );
}

function Field({
  id,
  name,
  label,
  type,
  auto,
  required = false,
  hint = false,
  inputMode,
  placeholder,
  errors,
  values,
  locked,
}: Shared & {
  id: string;
  name: keyof QuoteFormValues;
  label: string;
  type: string;
  auto: string;
  required?: boolean;
  hint?: boolean;
  inputMode?: "email" | "tel";
  placeholder?: string;
}) {
  const error = errors[name];
  return (
    <label className="qd-field" htmlFor={id}>
      <span>
        {label}
        {required && <Req />}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={auto}
        inputMode={inputMode}
        placeholder={placeholder}
        defaultValue={values[name] ?? ""}
        readOnly={locked}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-err${hint ? " bg-contact-hint" : ""}`}
      />
      <span className="qd-err" id={`${id}-err`}>
        {error}
      </span>
    </label>
  );
}
