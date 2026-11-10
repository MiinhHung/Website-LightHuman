/**
 * Per-position surcharges, from BA's surcharge table. CẦN BA XÁC NHẬN mọi mức %.
 *
 * Only surcharges that the current form can trigger are listed. Gender, age gap,
 * night shift, process duration and employer brand have no form field yet.
 * TODO(BA): whether multiple surcharges add up or the highest wins is undecided —
 * the PDF only lists them, it never combines them.
 */

import type { IndustryValue } from "./catalog";

export type QuantityBand = {
  /** Inclusive lower bound. */
  readonly min: number;
  /** Exclusive upper bound; null = no upper bound. */
  readonly max: number | null;
  readonly pct: number;
  readonly label: string;
};

// Mass only. TODO(BA): ≥ 50 has no surcharge — a "large volume" package is pending.
export const QUANTITY_SURCHARGE_BANDS: readonly QuantityBand[] = [
  { min: 1, max: 10, pct: 8, label: "Số lượng dưới 10 nhân sự" },
  { min: 10, max: 50, pct: 5, label: "Số lượng từ 10 đến dưới 50 nhân sự" },
];

export type IndustryGroup = {
  readonly id: string;
  readonly pct: number;
  readonly industries: readonly IndustryValue[];
};

export const INDUSTRY_SURCHARGE_GROUPS: readonly IndustryGroup[] = [
  {
    id: "industry-10",
    pct: 10,
    industries: [
      "FMCG_BAN_LE",
      "SAN_XUAT",
      "GIAO_DUC",
      "NHA_HANG_KHACH_SAN",
      "VAN_TAI",
      "TMDT",
      "DICH_VU_CONG",
      "BPO",
    ],
  },
  {
    id: "industry-15",
    pct: 15,
    industries: ["BAT_DONG_SAN", "CNTT", "TAI_CHINH", "KY_THUAT", "Y_TE", "XAY_DUNG", "POD", "ATTT"],
  },
];

// Chinese, Korean, Japanese, or more than one language. The catalog only offers
// those three, so any selected language triggers it.
export const LANGUAGE_SURCHARGE_PCT = 15;

export const SURCHARGE_LABELS = {
  industry: "Chuyên ngành",
  language: "Ngôn ngữ",
} as const;
