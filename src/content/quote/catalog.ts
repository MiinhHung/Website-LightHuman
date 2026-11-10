/**
 * Quote catalogue — SINGLE SOURCE OF TRUTH for UI and server.
 *
 * Values are stable, screaming-snake codes (persisted inside the signed snapshot
 * and inside the pricing matrix). Labels are the Vietnamese strings shown to the
 * customer. UI components MUST read from here instead of re-declaring the lists.
 *
 * Source (BA): recruitment catalogue for Light Human's quote builder.
 */

// -----------------------------------------------------------------------------
// Industry
// -----------------------------------------------------------------------------

export const INDUSTRY_VALUES = [
  "SAN_XUAT",
  "GIAO_DUC",
  "NHA_HANG_KHACH_SAN",
  "VAN_TAI",
  "TMDT",
  "FMCG_BAN_LE",
  "DICH_VU_CONG",
  "BPO",
  "BAT_DONG_SAN",
  "CNTT",
  "TAI_CHINH",
  "KY_THUAT",
  "Y_TE",
  "XAY_DUNG",
  "POD",
  "ATTT",
] as const;
export type IndustryValue = (typeof INDUSTRY_VALUES)[number];

export const INDUSTRY_LABELS: Record<IndustryValue, string> = {
  SAN_XUAT: "Sản xuất",
  GIAO_DUC: "Giáo dục",
  NHA_HANG_KHACH_SAN: "Nhà hàng - Khách sạn",
  VAN_TAI: "Vận tải",
  TMDT: "TMĐT",
  FMCG_BAN_LE: "FMCG / Bán lẻ",
  DICH_VU_CONG: "Dịch vụ công",
  BPO: "BPO",
  BAT_DONG_SAN: "Bất động sản",
  CNTT: "CNTT",
  TAI_CHINH: "Tài chính",
  KY_THUAT: "Kỹ thuật",
  Y_TE: "Y tế",
  XAY_DUNG: "Xây dựng",
  POD: "POD",
  ATTT: "ATTT",
};

// -----------------------------------------------------------------------------
// Language
// -----------------------------------------------------------------------------

export const LANGUAGE_VALUES = ["TRUNG", "HAN", "NHAT"] as const;
export type LanguageValue = (typeof LANGUAGE_VALUES)[number];

export const LANGUAGE_LABELS: Record<LanguageValue, string> = {
  TRUNG: "Trung",
  HAN: "Hàn",
  NHAT: "Nhật",
};

// -----------------------------------------------------------------------------
// Experience
// -----------------------------------------------------------------------------

export const EXPERIENCE_VALUES = ["NONE", "UNDER_1", "ONE_TO_THREE", "OVER_3"] as const;
export type ExperienceValue = (typeof EXPERIENCE_VALUES)[number];

export const EXPERIENCE_LABELS: Record<ExperienceValue, string> = {
  NONE: "Không yêu cầu",
  UNDER_1: "Dưới 1 năm",
  ONE_TO_THREE: "1–3 năm",
  OVER_3: "Trên 3 năm",
};

// -----------------------------------------------------------------------------
// Region
// -----------------------------------------------------------------------------

export const REGION_VALUES = ["DOMESTIC", "OVERSEAS"] as const;
export type RegionValue = (typeof REGION_VALUES)[number];

export const REGION_LABELS: Record<RegionValue, string> = {
  DOMESTIC: "Trong nước",
  OVERSEAS: "Nước ngoài",
};

// -----------------------------------------------------------------------------
// Education
// -----------------------------------------------------------------------------

export const EDUCATION_VALUES = ["NONE", "THPT", "CAO_DANG", "DAI_HOC", "SAU_DAI_HOC"] as const;
export type EducationValue = (typeof EDUCATION_VALUES)[number];

export const EDUCATION_LABELS: Record<EducationValue, string> = {
  NONE: "Không yêu cầu",
  THPT: "THPT",
  CAO_DANG: "Cao đẳng",
  DAI_HOC: "Đại học",
  SAU_DAI_HOC: "Sau đại học",
};

// -----------------------------------------------------------------------------
// Group catalogue (drives the drag-and-drop columns)
// -----------------------------------------------------------------------------

export const GROUP_KEYS = ["industries", "languages", "experience", "region", "education"] as const;
export type GroupKey = (typeof GROUP_KEYS)[number];

export type Option = { readonly value: string; readonly label: string };

export type Group = {
  readonly key: GroupKey;
  readonly label: string;
  readonly selectType: "multi" | "single";
  readonly required: boolean;
  readonly options: readonly Option[];
};

function toOptions<V extends string>(values: readonly V[], labels: Record<V, string>): readonly Option[] {
  return values.map((v) => ({ value: v, label: labels[v] }));
}

export const CATALOG: readonly Group[] = [
  { key: "industries", label: "Chuyên ngành", selectType: "multi", required: true, options: toOptions(INDUSTRY_VALUES, INDUSTRY_LABELS) },
  { key: "languages", label: "Ngôn ngữ", selectType: "multi", required: false, options: toOptions(LANGUAGE_VALUES, LANGUAGE_LABELS) },
  { key: "experience", label: "Kinh nghiệm", selectType: "single", required: true, options: toOptions(EXPERIENCE_VALUES, EXPERIENCE_LABELS) },
  { key: "region", label: "Khu vực", selectType: "single", required: true, options: toOptions(REGION_VALUES, REGION_LABELS) },
  { key: "education", label: "Bằng cấp", selectType: "single", required: true, options: toOptions(EDUCATION_VALUES, EDUCATION_LABELS) },
];

/** Resolve a human-readable label for an option value inside a group (for PDF/email). */
export function labelFor(groupKey: GroupKey, value: string): string {
  switch (groupKey) {
    case "industries":
      return INDUSTRY_LABELS[value as IndustryValue] ?? value;
    case "languages":
      return LANGUAGE_LABELS[value as LanguageValue] ?? value;
    case "experience":
      return EXPERIENCE_LABELS[value as ExperienceValue] ?? value;
    case "region":
      return REGION_LABELS[value as RegionValue] ?? value;
    case "education":
      return EDUCATION_LABELS[value as EducationValue] ?? value;
  }
}
