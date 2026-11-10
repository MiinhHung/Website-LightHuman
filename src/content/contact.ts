/** Nội dung trang Liên hệ — nguyên văn lighthuman.vn/lien-he. */

export const contactInfo = {
  heading: "Liên hệ trực tiếp",
  rows: [
    {
      icon: "map-pin",
      title: "Văn phòng",
      lines: ["Tầng 4, 213 Chu Văn An,", "phường Bình Thạnh, TP. Hồ Chí Minh"],
      href: "https://www.google.com/maps/search/?api=1&query=213+Chu+V%C4%83n+An%2C+B%C3%ACnh+Th%E1%BA%A1nh%2C+H%E1%BB%93+Ch%C3%AD+Minh",
      linkLabel: "Xem bản đồ",
    },
    { icon: "phone", title: "Điện thoại", lines: ["028 3842 5188"], href: "tel:+842838425188" },
    { icon: "mail", title: "Email", lines: ["info@lighthuman.vn"], href: "mailto:info@lighthuman.vn" },
    { icon: "clock", title: "Giờ làm việc", lines: ["Thứ 2 đến thứ 6, 08:00-18:00"] },
  ],
  promises: [
    { icon: "clock", text: "Đội BD phản hồi trong 24 giờ làm việc." },
    { icon: "sparkles", text: "Nhận mã báo giá ngay sau khi gửi yêu cầu." },
    { icon: "shield-check", text: "Thông tin của bạn được bảo mật." },
  ],
} as const;

export const contactFormCopy = {
  heading: "Gửi yêu cầu cho chúng tôi",
  lede: "Vui lòng điền thông tin, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.",
  privacy: "Chúng tôi cam kết bảo mật tuyệt đối mọi thông tin của bạn.",
  submit: "Gửi yêu cầu",
} as const;

export const contactFaqHead = {
  eyebrow: "FAQ",
  helper: "Không tìm thấy câu trả lời?",
  helperLink: "Gửi email cho chúng tôi.",
} as const;
