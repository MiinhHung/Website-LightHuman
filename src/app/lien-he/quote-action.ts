"use server";

/**
 * Server Action for the drag-and-drop quote builder embedded in /lien-he.
 *
 * Contract:
 *   - Parses FormData → zod schema (NEVER trusts a client-computed type).
 *   - Honeypot field `website` must be empty.
 *   - On success: returns a typed state with either a priced quote or a
 *     `manual_required` fallback (no price match → BD takes over).
 *   - On failure: returns field-keyed errors and the user's own values so the
 *     client re-renders without losing input.
 *
 * Phase 3 minimal: no PDF route, no webhook notification. Those plug in at
 * phase 5–6 without changing this file's contract.
 */

import type { QuoteType } from "@/lib/quote/classify";
import { createQuote } from "@/lib/quote/create-quote";
import { quoteInputSchema } from "@/lib/quote/schema";

export type QuoteFormErrors = Record<string, string>;

export type QuoteFormValues = {
  "contact.name"?: string;
  "contact.company"?: string;
  "contact.email"?: string;
  "contact.phone"?: string;
  "line.position"?: string;
  "line.quantity"?: string;
};

export type QuoteFormState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      errors: QuoteFormErrors;
      values: QuoteFormValues;
    }
  | {
      status: "priced";
      code: string;
      type: QuoteType;
      currency: "VND";
      unitPrice: number;
      subtotal: number;
      quantity: number;
      pricingVersion: string;
    }
  | {
      status: "manual_required";
      code: string;
      type: QuoteType;
      reason: string;
    };

export const initialQuoteState: QuoteFormState = { status: "idle" };

function str(v: FormDataEntryValue | null | undefined): string {
  return typeof v === "string" ? v : "";
}

export async function createQuoteAction(
  _prev: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  // Honeypot — bots happily fill invisible fields. Treat as idle (no feedback)
  // so bots can't learn when the trap tripped.
  if (str(formData.get("website")).length > 0) {
    return { status: "idle" };
  }

  const input = {
    contact: {
      name: str(formData.get("contact.name")),
      company: str(formData.get("contact.company")),
      email: str(formData.get("contact.email")),
      phone: str(formData.get("contact.phone")),
    },
    lines: [
      {
        position: str(formData.get("line.position")),
        industries: formData
          .getAll("line.industries")
          .filter((v): v is string => typeof v === "string"),
        languages: formData
          .getAll("line.languages")
          .filter((v): v is string => typeof v === "string"),
        experience: str(formData.get("line.experience")),
        region: str(formData.get("line.region")),
        education: str(formData.get("line.education")),
        quantity: str(formData.get("line.quantity")),
      },
    ],
    website: "",
  };

  const values: QuoteFormValues = {
    "contact.name": input.contact.name,
    "contact.company": input.contact.company,
    "contact.email": input.contact.email,
    "contact.phone": input.contact.phone,
    "line.position": input.lines[0].position,
    "line.quantity": input.lines[0].quantity,
  };

  const parsed = quoteInputSchema.safeParse(input);
  if (!parsed.success) {
    const errors: QuoteFormErrors = {};
    for (const iss of parsed.error.issues) {
      const key = iss.path.join(".");
      // Keep the first error per field so the UI isn't noisy.
      if (!(key in errors)) errors[key] = iss.message;
    }
    return {
      status: "error",
      message: "Vui lòng kiểm tra lại các trường được đánh dấu.",
      errors,
      values,
    };
  }

  const result = createQuote(parsed.data);
  const line0 = result.lines[0];

  if (result.status === "priced" && line0.matched) {
    return {
      status: "priced",
      code: result.code,
      type: result.type,
      currency: line0.currency ?? "VND",
      unitPrice: line0.unitPrice ?? 0,
      subtotal: line0.subtotal ?? 0,
      quantity: line0.quantity,
      pricingVersion: line0.pricingVersion,
    };
  }

  return {
    status: "manual_required",
    code: result.code,
    type: result.type,
    reason: line0.reason ?? "Chưa có giá cho tổ hợp này.",
  };
}
