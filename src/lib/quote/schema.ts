/**
 * Zod schema shared between the client preview and the Server Action.
 *
 * The server re-parses whatever the form sends, so any client-side state is
 * untrusted here. The schema also covers the honeypot field and the multi-line
 * shape (Phase 1 UI uses a single line, the data model is already plural).
 *
 * Localization: field-level error messages are in Vietnamese so they can be
 * shown directly next to inputs. Code values (SCREAMING_SNAKE) live in catalog.
 */

import { z } from "zod";
import {
  EDUCATION_VALUES,
  EXPERIENCE_VALUES,
  INDUSTRY_VALUES,
  LANGUAGE_VALUES,
  REGION_VALUES,
} from "@/content/quote/catalog";

// Same regex as the /lien-he form — the site already treats these as canonical.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_VN = /^(\+?84|0)[\d\s.-]{8,12}$/;

export const QUANTITY_MAX = 10_000;

// ---- Contact ---------------------------------------------------------------

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "Vui lòng nhập họ và tên.").max(120, "Họ tên quá dài."),
    company: z
      .string()
      .trim()
      .min(2, "Vui lòng nhập tên công ty.")
      .max(200, "Tên công ty quá dài."),
    // `optional()` keeps empty strings as "" so we can reason about "one of
    // email/phone" below with simple truthiness.
    email: z.string().trim().max(200, "Email quá dài.").optional(),
    phone: z.string().trim().max(32, "Số điện thoại quá dài.").optional(),
  })
  .refine((c) => !c.email || EMAIL.test(c.email), {
    message: "Email chưa đúng định dạng.",
    path: ["email"],
  })
  .refine((c) => !c.phone || PHONE_VN.test(c.phone), {
    message: "Số điện thoại chưa hợp lệ (ví dụ 0901 234 567).",
    path: ["phone"],
  })
  .refine(
    (c) =>
      (!!c.email && EMAIL.test(c.email)) || (!!c.phone && PHONE_VN.test(c.phone)),
    {
      message: "Cần ít nhất một email hoặc số điện thoại hợp lệ.",
      // Point the error at email so the UI can anchor it there; the message
      // itself refers to both fields.
      path: ["email"],
    },
  );

export type ContactInput = z.infer<typeof contactSchema>;

// ---- Quote line ------------------------------------------------------------

export const quoteLineSchema = z.object({
  industries: z.array(z.enum(INDUSTRY_VALUES)).min(1, "Chọn ít nhất 1 chuyên ngành."),
  languages: z.array(z.enum(LANGUAGE_VALUES)).default([]),
  experience: z.enum(EXPERIENCE_VALUES),
  region: z.enum(REGION_VALUES),
  education: z.enum(EDUCATION_VALUES),
  // Coerce is friendly to <input type="number"> which yields a string in FormData.
  quantity: z
    .coerce.number()
    .int("Số lượng phải là số nguyên.")
    .min(1, "Số lượng tối thiểu là 1.")
    .max(QUANTITY_MAX, `Số lượng tối đa là ${QUANTITY_MAX}.`),
});

export type QuoteLineInput = z.infer<typeof quoteLineSchema>;

// ---- Quote request (top-level) --------------------------------------------

export const quoteInputSchema = z.object({
  contact: contactSchema,
  lines: z.array(quoteLineSchema).min(1, "Cần ít nhất một dòng yêu cầu."),
  // Honeypot — bots happily fill fields they can't see. Humans must leave it empty.
  website: z.string().max(0).optional(),
});

export type QuoteInput = z.infer<typeof quoteInputSchema>;
