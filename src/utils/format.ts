/**
 * Định dạng số thành chuỗi tiền tệ (mặc định VND)
 * Dùng được ở cả Server Components và Client Components.
 *
 * @param value Số tiền cần định dạng
 * @param currency Mã tiền tệ (mặc định 'VND')
 * @param locale Ngôn ngữ hiển thị (mặc định 'vi-VN')
 *
 * @example
 * formatCurrency(5000000) // "5.000.000 ₫"
 */
export function formatCurrency(
  value: number | string | null | undefined,
  currency: string = "VND",
  locale: string = "vi-VN",
): string {
  const numericValue = typeof value === "string" ? Number(value) : value;

  if (numericValue === null || numericValue === undefined || isNaN(numericValue)) {
    return "0 ₫";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  }).format(numericValue);
}

/**
 * Định dạng số thông thường có phân cách hàng nghìn
 * @example formatNumber(1250000) // "1.250.000"
 */
export function formatNumber(
  value: number | string | null | undefined,
  locale: string = "vi-VN",
): string {
  const numericValue = typeof value === "string" ? Number(value) : value;

  if (numericValue === null || numericValue === undefined || isNaN(numericValue)) {
    return "0";
  }

  return new Intl.NumberFormat(locale).format(numericValue);
}

/**
 * Delay execution tiện ích
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
