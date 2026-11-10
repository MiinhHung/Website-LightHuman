import { describe, expect, it } from "vitest";
import { normalizeLine, type RawLine } from "../normalize";

const base: RawLine = {
  industries: ["SAN_XUAT"],
  experience: "NONE",
  region: "DOMESTIC",
  education: "NONE",
  quantity: 5,
};

describe("normalizeLine", () => {
  it("dedupes industries and preserves first-occurrence order", () => {
    const out = normalizeLine({
      ...base,
      industries: ["SAN_XUAT", "CNTT", "SAN_XUAT"],
    });
    expect(out.industries).toEqual(["SAN_XUAT", "CNTT"]);
  });

  it("dedupes languages and preserves first-occurrence order", () => {
    const out = normalizeLine({
      ...base,
      languages: ["TRUNG", "HAN", "TRUNG"],
    });
    expect(out.languages).toEqual(["TRUNG", "HAN"]);
  });

  it("multiLanguage=false when no language is selected", () => {
    expect(normalizeLine(base).multiLanguage).toBe(false);
  });

  it("multiLanguage=false for exactly one language", () => {
    expect(normalizeLine({ ...base, languages: ["TRUNG"] }).multiLanguage).toBe(false);
  });

  it("multiLanguage=true for two languages", () => {
    expect(normalizeLine({ ...base, languages: ["TRUNG", "HAN"] }).multiLanguage).toBe(true);
  });

  it("multiLanguage=true for three languages", () => {
    expect(
      normalizeLine({ ...base, languages: ["TRUNG", "HAN", "NHAT"] }).multiLanguage,
    ).toBe(true);
  });

  it("treats missing languages as empty", () => {
    const out = normalizeLine(base);
    expect(out.languages).toEqual([]);
    expect(out.multiLanguage).toBe(false);
  });

  it("passes through scalars unchanged", () => {
    const out = normalizeLine({
      ...base,
      experience: "ONE_TO_THREE",
      region: "OVERSEAS",
      education: "DAI_HOC",
      quantity: 42,
    });
    expect(out.experience).toBe("ONE_TO_THREE");
    expect(out.region).toBe("OVERSEAS");
    expect(out.education).toBe("DAI_HOC");
    expect(out.quantity).toBe(42);
  });
});
