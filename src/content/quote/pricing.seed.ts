/**
 * Pricing seed — MẪU, CHƯA PHẢI GIÁ THẬT.
 *
 * Placeholder matrix so the end-to-end flow (classify → price → PDF → webhook)
 * can be demoed. BA will replace these numbers with the real price book later
 * and bump `version`. Rule for BA:
 *
 *   - Changing any number here is a `PATCH` bump: version `YYYY-MM-draft-N` →
 *     `YYYY-MM-draft-(N+1)`.
 *   - Changing the SHAPE (adding bands, removing enum keys) is a code change,
 *     not a data change.
 *
 * Shape semantics:
 *   unitPrice = baseByIndustry[industry max across selected]
 *             × experienceMultiplier[experience]
 *             × educationMultiplier[education]
 *             × regionMultiplier[region]
 *             × languageMultiplier (none | one | multi derived from languages.length)
 *             × quantityDiscount band (highest minQty ≤ quantity)
 *   unitPrice is rounded to the nearest 1 000 VND.
 *   subtotal  = unitPrice × quantity.
 *
 * Industries intentionally left OUT of baseByIndustry — POD — exercise the
 * no-match path in tests and the `manual_required` branch in production.
 * TODO(BA): confirm that POD really goes to manual review, or add real prices.
 */

import type { PricingSeed } from "@/lib/quote/pricing/types";

export const PRICING_SEED: PricingSeed = {
  version: "2026-11-draft-1",
  disclaimer:
    "BẢNG GIÁ MẪU — chưa phải giá chính thức. Dùng cho demo trong khi chờ BA cung cấp bảng giá thật.",
  currency: "VND",

  mass: {
    baseByIndustry: {
      SAN_XUAT: 2_500_000,
      GIAO_DUC: 2_200_000,
      NHA_HANG_KHACH_SAN: 2_300_000,
      VAN_TAI: 2_400_000,
      TMDT: 2_600_000,
      FMCG_BAN_LE: 2_400_000,
      DICH_VU_CONG: 2_200_000,
      BPO: 2_600_000,
      BAT_DONG_SAN: 2_500_000,
      CNTT: 3_200_000,
      TAI_CHINH: 3_000_000,
      KY_THUAT: 2_800_000,
      Y_TE: 2_700_000,
      XAY_DUNG: 2_500_000,
      // POD: intentionally missing → exercises no-match branch
      ATTT: 3_200_000,
    },
    experienceMultiplier: {
      NONE: 1.0,
      UNDER_1: 1.05,
      ONE_TO_THREE: 1.15,
      OVER_3: 1.25,
    },
    educationMultiplier: {
      NONE: 1.0,
      THPT: 1.0,
      CAO_DANG: 1.05,
      DAI_HOC: 1.1,
      SAU_DAI_HOC: 1.2,
    },
    regionMultiplier: {
      DOMESTIC: 1.0,
      OVERSEAS: 1.35,
    },
    languageMultiplier: {
      none: 1.0,
      one: 1.1,
      multi: 1.2,
    },
    quantityDiscount: [
      { minQty: 1, multiplier: 1.0 },
      { minQty: 10, multiplier: 0.95 },
      { minQty: 50, multiplier: 0.9 },
      { minQty: 100, multiplier: 0.85 },
    ],
  },

  hunt: {
    baseByIndustry: {
      SAN_XUAT: 18_000_000,
      GIAO_DUC: 15_000_000,
      NHA_HANG_KHACH_SAN: 16_000_000,
      VAN_TAI: 16_000_000,
      TMDT: 20_000_000,
      FMCG_BAN_LE: 18_000_000,
      DICH_VU_CONG: 15_000_000,
      BPO: 18_000_000,
      BAT_DONG_SAN: 20_000_000,
      CNTT: 28_000_000,
      TAI_CHINH: 26_000_000,
      KY_THUAT: 22_000_000,
      Y_TE: 24_000_000,
      XAY_DUNG: 20_000_000,
      // POD: intentionally missing → exercises no-match branch
      ATTT: 28_000_000,
    },
    experienceMultiplier: {
      NONE: 1.0,
      UNDER_1: 1.0,
      ONE_TO_THREE: 1.2,
      OVER_3: 1.5,
    },
    educationMultiplier: {
      NONE: 1.0,
      THPT: 1.0,
      CAO_DANG: 1.05,
      DAI_HOC: 1.15,
      SAU_DAI_HOC: 1.3,
    },
    regionMultiplier: {
      DOMESTIC: 1.0,
      OVERSEAS: 1.45,
    },
    languageMultiplier: {
      none: 1.0,
      one: 1.15,
      multi: 1.3,
    },
    quantityDiscount: [
      { minQty: 1, multiplier: 1.0 },
      { minQty: 3, multiplier: 0.97 },
      { minQty: 5, multiplier: 0.95 },
    ],
  },
};
