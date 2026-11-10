import { describe, expect, it } from "vitest";
import { createQuote } from "../create-quote";
import { isPricingComplete } from "../snapshot";
import type { QuoteInput } from "../schema";

const input: QuoteInput = {
  contact: { name: "Ms. May", company: "HD SAIGON", email: "may@example.com", phone: "" },
  lines: [
    {
      position: "Telesale tài chính",
      industries: ["TAI_CHINH", "TAI_CHINH"],
      languages: [],
      experience: "NONE",
      region: "DOMESTIC",
      education: "THPT",
      quantity: 3,
    },
  ],
};

describe("createQuote snapshot", () => {
  it("freezes contact, position, normalized criteria, surcharges and draft fees", () => {
    const now = new Date("2026-11-09T03:00:00.000Z");
    const result = createQuote(input, now);
    const s = result.snapshot;
    expect(s.code).toBe(result.code);
    expect(s.createdAt).toBe("2026-11-09T03:00:00.000Z");
    expect(s.contact).toEqual({ name: "Ms. May", company: "HD SAIGON", email: "may@example.com", phone: "" });
    expect(s.lines[0]).toMatchObject({
      type: "mass",
      position: "Telesale tài chính",
      quantity: 3,
      industries: ["TAI_CHINH"],
    });
    expect(s.lines[0].surcharges.map((x) => x.pct)).toEqual([8, 15]);
    expect(isPricingComplete(s)).toBe(false);
  });

  it("keeps the existing status rules (POD-only → manual_required)", () => {
    expect(createQuote(input).status).toBe("priced");
    const pod = { ...input, lines: [{ ...input.lines[0], industries: ["POD" as const] }] };
    expect(createQuote(pod).status).toBe("manual_required");
  });
});
