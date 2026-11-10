import { describe, expect, it } from "vitest";
import {
  POSITION_MAX,
  QUANTITY_MAX,
  QUOTE_LINES_MAX,
  contactSchema,
  quoteInputSchema,
  quoteLineSchema,
} from "../schema";

const validContact = {
  name: "Nguyễn Văn A",
  company: "Công ty TNHH ABC",
  email: "a@example.com",
  phone: "0901234567",
};

const validLine = {
  position: "Công nhân lắp ráp",
  industries: ["SAN_XUAT"],
  languages: [],
  experience: "NONE",
  region: "DOMESTIC",
  education: "NONE",
  quantity: 10,
};

// ---- contactSchema ---------------------------------------------------------

describe("contactSchema", () => {
  it("accepts a valid contact with both email and phone", () => {
    expect(contactSchema.safeParse(validContact).success).toBe(true);
  });

  it("accepts email only (phone blank)", () => {
    expect(contactSchema.safeParse({ ...validContact, phone: "" }).success).toBe(true);
  });

  it("accepts phone only (email blank)", () => {
    expect(contactSchema.safeParse({ ...validContact, email: "" }).success).toBe(true);
  });

  it("rejects when both email and phone are blank", () => {
    const r = contactSchema.safeParse({ ...validContact, email: "", phone: "" });
    expect(r.success).toBe(false);
  });

  it("rejects a bad email format", () => {
    const r = contactSchema.safeParse({ ...validContact, email: "not-an-email", phone: "" });
    expect(r.success).toBe(false);
  });

  it("rejects a bad phone format", () => {
    const r = contactSchema.safeParse({ ...validContact, email: "", phone: "abc" });
    expect(r.success).toBe(false);
  });

  it("rejects missing name", () => {
    const r = contactSchema.safeParse({ ...validContact, name: "" });
    expect(r.success).toBe(false);
  });

  it("rejects missing company", () => {
    const r = contactSchema.safeParse({ ...validContact, company: "" });
    expect(r.success).toBe(false);
  });

  it("accepts a phone with spaces/dashes (matching VN regex)", () => {
    expect(
      contactSchema.safeParse({ ...validContact, phone: "0901 234 567", email: "" }).success,
    ).toBe(true);
  });

  it("accepts a +84-prefixed phone", () => {
    expect(
      contactSchema.safeParse({ ...validContact, phone: "+84901234567", email: "" }).success,
    ).toBe(true);
  });
});

// ---- quoteLineSchema -------------------------------------------------------

describe("quoteLineSchema", () => {
  it("accepts a valid line", () => {
    expect(quoteLineSchema.safeParse(validLine).success).toBe(true);
  });

  it("coerces quantity from a numeric string (FormData friendly)", () => {
    const r = quoteLineSchema.safeParse({ ...validLine, quantity: "12" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.quantity).toBe(12);
  });

  it("rejects quantity 0", () => {
    expect(quoteLineSchema.safeParse({ ...validLine, quantity: 0 }).success).toBe(false);
  });

  it("rejects negative quantity", () => {
    expect(quoteLineSchema.safeParse({ ...validLine, quantity: -1 }).success).toBe(false);
  });

  it("rejects fractional quantity", () => {
    expect(quoteLineSchema.safeParse({ ...validLine, quantity: 1.5 }).success).toBe(false);
  });

  it("rejects quantity above the cap", () => {
    expect(
      quoteLineSchema.safeParse({ ...validLine, quantity: QUANTITY_MAX + 1 }).success,
    ).toBe(false);
  });

  it("rejects an empty industries array", () => {
    expect(quoteLineSchema.safeParse({ ...validLine, industries: [] }).success).toBe(false);
  });

  it("rejects an unknown industry value", () => {
    expect(
      quoteLineSchema.safeParse({ ...validLine, industries: ["UNKNOWN_SECTOR"] }).success,
    ).toBe(false);
  });

  it("rejects an unknown language value", () => {
    expect(
      quoteLineSchema.safeParse({ ...validLine, languages: ["ESP"] }).success,
    ).toBe(false);
  });

  it("rejects a missing enum (experience)", () => {
    const withoutExp = {
      position: validLine.position,
      industries: validLine.industries,
      languages: validLine.languages,
      region: validLine.region,
      education: validLine.education,
      quantity: validLine.quantity,
    };
    expect(quoteLineSchema.safeParse(withoutExp).success).toBe(false);
  });

  it("defaults languages to [] when omitted", () => {
    const withoutLangs = {
      position: validLine.position,
      industries: validLine.industries,
      experience: validLine.experience,
      region: validLine.region,
      education: validLine.education,
      quantity: validLine.quantity,
    };
    const r = quoteLineSchema.safeParse(withoutLangs);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.languages).toEqual([]);
  });

  it("requires a position", () => {
    expect(quoteLineSchema.safeParse({ ...validLine, position: undefined }).success).toBe(false);
    expect(quoteLineSchema.safeParse({ ...validLine, position: "   " }).success).toBe(false);
  });

  it("rejects a position shorter than 2 or longer than 100 characters (after trim)", () => {
    expect(quoteLineSchema.safeParse({ ...validLine, position: " A " }).success).toBe(false);
    expect(quoteLineSchema.safeParse({ ...validLine, position: "x".repeat(POSITION_MAX + 1) }).success).toBe(false);
    expect(quoteLineSchema.safeParse({ ...validLine, position: "x".repeat(POSITION_MAX) }).success).toBe(true);
  });

  it("trims the position", () => {
    const r = quoteLineSchema.safeParse({ ...validLine, position: "  Kế toán  " });
    expect(r.success && r.data.position).toBe("Kế toán");
  });
});

// ---- quoteInputSchema ------------------------------------------------------

describe("quoteInputSchema", () => {
  it("accepts a quote with one valid line", () => {
    expect(
      quoteInputSchema.safeParse({ contact: validContact, lines: [validLine] }).success,
    ).toBe(true);
  });

  it("rejects a quote with no lines", () => {
    expect(quoteInputSchema.safeParse({ contact: validContact, lines: [] }).success).toBe(false);
  });

  it(`caps the number of lines at ${QUOTE_LINES_MAX} (token size)`, () => {
    const lines = (n: number) => Array.from({ length: n }, () => validLine);
    expect(quoteInputSchema.safeParse({ contact: validContact, lines: lines(QUOTE_LINES_MAX) }).success).toBe(true);
    expect(quoteInputSchema.safeParse({ contact: validContact, lines: lines(QUOTE_LINES_MAX + 1) }).success).toBe(false);
  });

  it("rejects a quote whose contact is invalid", () => {
    expect(
      quoteInputSchema.safeParse({
        contact: { ...validContact, email: "", phone: "" },
        lines: [validLine],
      }).success,
    ).toBe(false);
  });

  it("rejects a non-empty honeypot", () => {
    expect(
      quoteInputSchema.safeParse({
        contact: validContact,
        lines: [validLine],
        website: "https://spam.example.com",
      }).success,
    ).toBe(false);
  });

  it("accepts an empty honeypot string", () => {
    expect(
      quoteInputSchema.safeParse({
        contact: validContact,
        lines: [validLine],
        website: "",
      }).success,
    ).toBe(true);
  });
});
