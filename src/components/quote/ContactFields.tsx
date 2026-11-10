"use client";

import { vi } from "@/content/quote/labels.vi";
import type { QuoteFormErrors, QuoteFormValues } from "@/app/lien-he/quote-action";

/** Contact fieldset wired to the Server Action's error/values shape. */
export function ContactFields({
  errors,
  values,
}: {
  errors: QuoteFormErrors;
  values: QuoteFormValues;
}) {
  return (
    <fieldset className="lh-quote-contact" aria-describedby="quote-contact-hint">
      <legend className="sr-only">{vi.contact.legend}</legend>
      <Field
        name="contact.name"
        label={`${vi.contact.name} *`}
        type="text"
        required
        errors={errors}
        values={values}
      />
      <Field
        name="contact.company"
        label={`${vi.contact.company} *`}
        type="text"
        required
        errors={errors}
        values={values}
      />
      <Field
        name="contact.email"
        label={vi.contact.email}
        type="email"
        required={false}
        errors={errors}
        values={values}
      />
      <Field
        name="contact.phone"
        label={vi.contact.phone}
        type="tel"
        required={false}
        errors={errors}
        values={values}
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
  required,
  errors,
  values,
}: {
  name: keyof QuoteFormValues;
  label: string;
  type: string;
  required: boolean;
  errors: QuoteFormErrors;
  values: QuoteFormValues;
}) {
  const error = errors[name];
  const errorId = `${name.replace(/\./g, "-")}-error`;
  return (
    <label className="lh-field">
      <span className="lh-field__label">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={values[name] ?? ""}
        required={required}
        className="lh-field__input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <span id={errorId} className="lh-quote-error-text">
          {error}
        </span>
      )}
    </label>
  );
}
