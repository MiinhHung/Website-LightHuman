import { describe, expect, it } from "vitest";
import { classify, type ClassifyInput } from "../classify";

const base: ClassifyInput = {
  education: "NONE",
  experience: "NONE",
  languages: [],
};

describe("classify", () => {
  it("returns mass for the baseline (no degree, no exp, no language)", () => {
    expect(classify(base)).toBe("mass");
  });

  it("stays mass for THPT with no experience and no language", () => {
    expect(classify({ ...base, education: "THPT" })).toBe("mass");
  });

  it('stays mass for experience "under 1 year" alone', () => {
    expect(classify({ ...base, experience: "UNDER_1" })).toBe("mass");
  });

  it.each(["CAO_DANG", "DAI_HOC", "SAU_DAI_HOC"] as const)(
    "returns hunt for degree %s (alone)",
    (education) => {
      expect(classify({ ...base, education })).toBe("hunt");
    },
  );

  it.each(["ONE_TO_THREE", "OVER_3"] as const)(
    "returns hunt for experience %s (alone)",
    (experience) => {
      expect(classify({ ...base, experience })).toBe("hunt");
    },
  );

  it("returns hunt when any single language is selected", () => {
    expect(classify({ ...base, languages: ["TRUNG"] })).toBe("hunt");
  });

  it("returns hunt when multiple languages are selected", () => {
    expect(classify({ ...base, languages: ["TRUNG", "HAN"] })).toBe("hunt");
    expect(classify({ ...base, languages: ["TRUNG", "HAN", "NHAT"] })).toBe("hunt");
  });

  it("stays hunt when several markers match at once", () => {
    expect(
      classify({
        education: "DAI_HOC",
        experience: "OVER_3",
        languages: ["TRUNG", "HAN"],
      }),
    ).toBe("hunt");
  });

  it("honours an overridden rules object (custom hunt degree set)", () => {
    const customRules = {
      huntEducation: ["SAU_DAI_HOC"] as const,
      huntExperience: [] as const,
      huntOnAnyLanguage: false,
    };
    expect(
      classify({ education: "DAI_HOC", experience: "OVER_3", languages: ["TRUNG"] }, customRules),
    ).toBe("mass");
    expect(
      classify({ education: "SAU_DAI_HOC", experience: "NONE", languages: [] }, customRules),
    ).toBe("hunt");
  });
});
