// Kept out of quote-action.ts: a "use server" module may only export async functions.

import type { QuoteType } from "@/lib/quote/classify";

export type QuoteFormErrors = Record<string, string>;

export type QuoteFormValues = {
  "contact.name"?: string;
  "contact.company"?: string;
  "contact.email"?: string;
  "contact.phone"?: string;
  "line.position"?: string;
  "line.quantity"?: string;
};

export type QuoteDownload = { readonly type: QuoteType; readonly href: string };

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
      /** False while any price printed in the PDF is still empty. */
      pricingComplete: boolean;
      /** Empty when no token secret is configured (production without QUOTE_TOKEN_SECRET). */
      downloads: readonly QuoteDownload[];
    }
  | {
      status: "manual_required";
      code: string;
      type: QuoteType;
      reason: string;
    };

export const initialQuoteState: QuoteFormState = { status: "idle" };
