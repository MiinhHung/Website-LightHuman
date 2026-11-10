const vnd = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 });

/** 60000000 → "60.000.000" */
export function formatMoney(n: number) {
  return vnd.format(Math.round(n));
}

/** Chuỗi người dùng gõ ("60.000.000", "60tr", "60,5 triệu") → số đồng. */
export function parseMoney(raw: string): number {
  const s = raw.trim().toLowerCase().replace(/\s+/g, "");
  const short = s.match(/^(\d+(?:[.,]\d+)?)(tr|triệu|trieu|m)$/);
  if (short) return Math.round(parseFloat(short[1].replace(",", ".")) * 1_000_000);
  const digits = s.replace(/\D/g, "");
  return digits ? Math.min(Number(digits), 99_999_999_999) : 0;
}

/** Hiển thị gọn: 51.514.400 → "51,5 triệu". */
export function formatMillions(n: number) {
  const m = n / 1_000_000;
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: m >= 100 ? 0 : 1 }).format(m)} triệu`;
}

export function formatRate(rate: number, digits = 1) {
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: digits }).format(rate * 100)}%`;
}

const ROMAN = ["", "I", "II", "III", "IV"] as const;
export const regionLabel = (r: 1 | 2 | 3 | 4) => `Vùng ${ROMAN[r]}`;
