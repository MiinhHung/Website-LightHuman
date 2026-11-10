"use client";

import { vi } from "@/content/quote/labels.vi";
import type { QuoteFormErrors, QuoteFormValues } from "@/app/lien-he/quote-state";

/** Contact fieldset wired to the Server Action's error/values shape. */
export function ContactFields({
  errors,
  values,
}: {
  errors: QuoteFormErrors;
  values: QuoteFormValues;
}) {
  const shared = { errors, values };
  return (
    <fieldset className="lh-quote-contact">
      <legend className="sr-only">{vi.contact.legend}</legend>
      <Field name="contact.name" label={vi.contact.name} type="text" autoComplete="name" required {...shared} />
      <Field
        name="contact.company"
        label={vi.contact.company}
        type="text"
        autoComplete="organization"
        required
        {...shared}
      />
      <Field
        name="contact.email"
        label={vi.contact.email}
        type="email"
        autoComplete="email"
        hintId="quote-contact-hint"
        {...shared}
      />
      <Field
        name="contact.phone"
        label={vi.contact.phone}
        type="tel"
        autoComplete="tel"
        hintId="quote-contact-hint"
        {...shared}
      />
      <p id="quote-contact-hint" className="lh-quote-note lh-quote-contact__hint">
        {vi.contact.needEmailOrPhone}
      </p>
    </fieldset>
  );
}

function Field({
  name,
  label,
  type,
  autoComplete,
  required = false,
  hintId,
  errors,
  values,
}: {
  name: keyof QuoteFormValues;
  label: string;
  type: string;
  autoComplete: string;
  required?: boolean;
  hintId?: string;
  errors: QuoteFormErrors;
  values: QuoteFormValues;
}) {
  const error = errors[name];
  const errorId = `${name.replace(/\./g, "-")}-error`;
  const describedBy = [error ? errorId : null, hintId].filter(Boolean).join(" ") || undefined;
  return (
    <label className="lh-field">
      <span className="lh-field__label">
        {label}
        {required && (
          <span className="lh-quote-req" aria-hidden="true">
            *
          </span>
        )}
      </span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        defaultValue={values[name] ?? ""}
        required={required}
        className="lh-field__input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      {error && (
        <span id={errorId} className="lh-quote-error-text">
          {error}
        </span>
      )}
    </label>
  );
}
