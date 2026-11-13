import { site } from "./site";

/** Nội dung trang Liên hệ (bản mẫu lien-he.html). */

export const contactMeta = {
  title: "Liên hệ và nhận báo giá tuyển dụng | Light Human",
  description:
    "Tạo báo giá tuyển dụng trong vài phút: chọn chuyên ngành, kinh nghiệm, khu vực, nhận mã báo giá ngay. Văn phòng Light Human tại 213 Chu Văn An, Bình Thạnh, TP.HCM.",
} as const;

export const contactHero = {
  crumbHome: "Trang chủ",
  crumbLabel: "Đường dẫn",
  crumb: "Liên hệ",
  kicker: "Liên hệ",
  title: "Bắt đầu với *một bản báo giá*",
  lede: "Chọn vị trí và yêu cầu ứng viên, nhận mã báo giá ngay. Đội BD liên hệ lại trong 24 giờ làm việc.",
} as const;

/** Unused by the page; kept for ContactForm (contact Server Action pattern). */
export const contactFormCopy = {
  heading: "Gửi yêu cầu cho chúng tôi",
  lede: "Vui lòng điền thông tin, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.",
  privacy: "Chúng tôi cam kết bảo mật tuyệt đối mọi thông tin của bạn.",
  submit: "Gửi yêu cầu",
} as const;

/** Film block between the map and the FAQ. */
export const contactVideo = {
  eyebrow: "Chưa sẵn sàng báo giá?",
  title: "Xem Light Human làm việc thế nào",
  lede: "Bốn phút về đội ngũ, quy trình và khách hàng của chúng tôi. Khi cần, bộ báo giá phía trên luôn ở đây.",
  play: "Xem phim",
  close: "Đóng video",
};

export const contactFaqHead = {
  title: "Câu hỏi *thường gặp*",
  helper: "Không tìm thấy câu trả lời?",
  helperLink: "Gửi email cho chúng tôi.",
} as const;

/** Full-width office map under the quote board. */
export const contactMap = {
  title: "Bản đồ văn phòng Light Human",
  embed: `https://www.google.com/maps?q=${encodeURIComponent(site.contact.address)}&output=embed`,
};
