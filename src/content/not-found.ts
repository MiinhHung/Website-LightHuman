import { quoteHref } from "./site";

/** Global 404 (src/app/not-found.tsx). */
export const notFoundCopy = {
  kicker: "Lỗi 404",
  title: "Trang này *chưa được chiếu sáng.*",
  lede: "Đường dẫn không còn hoặc đã đổi. Thử một trong các trang dưới đây.",
  links: [
    { label: "Trang chủ", href: "/" },
    { label: "Dịch vụ", href: "/dich-vu" },
    { label: "Dự án", href: "/case-studies" },
    { label: "Nhận báo giá", href: quoteHref },
  ],
};
