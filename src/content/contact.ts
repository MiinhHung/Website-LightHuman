/** Nội dung trang Liên hệ — nguyên văn lighthuman.vn/lien-he. */
import { CMS } from "./site";

export const contactHero = {
  eyebrow: "LIÊN HỆ LIGHT HUMAN",
  lede: "Light Human sẵn sàng lắng nghe nhu cầu và mang đến giải pháp nhân sự tối ưu, phù hợp với mục tiêu phát triển của doanh nghiệp bạn.",
  image: `${CMS}/download_3e99dabfe5.jpeg`,
  chips: [
    { icon: "users-round", title: "Phản hồi nhanh", desc: "trong 24h" },
    { icon: "sparkles", title: "Giải pháp phù hợp", desc: "với nhu cầu" },
    { icon: "shield-check", title: "Bảo mật thông tin", desc: "tuyệt đối" },
  ],
  overlay: {
    title: "Sứ mệnh của chúng tôi",
    body: "Kết nối doanh nghiệp với những nhân tài phù hợp nhất, kiến tạo giá trị dài hạn.",
  },
} as const;

export const contactInfo = {
  heading: "Thông tin liên hệ",
  rows: [
    { icon: "map-pin", title: "Trụ sở chính", lines: ["213 Chu Văn An, phường 26,", "quận Bình Thạnh, TP. Hồ Chí Minh"] },
    { icon: "phone", title: "Điện thoại", lines: ["028 3842 5188"] },
    { icon: "mail", title: "Email", lines: ["info@lighthuman.vn"] },
    { icon: "clock", title: "Giờ làm việc", lines: ["Thứ 2 - tới thứ 6 (08h00 - 18h00)"] },
  ],
  urgent: {
    heading: "Bạn cần tư vấn gấp?",
    body: "Liên hệ ngay với chuyên gia của chúng tôi để được hỗ trợ nhanh chóng.",
    cta: "Gọi ngay 028 3842 5188",
    href: "tel:+842838425188",
  },
} as const;

export const contactFormCopy = {
  heading: "Gửi yêu cầu cho chúng tôi",
  lede: "Vui lòng điền thông tin, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.",
  privacy: "Chúng tôi cam kết bảo mật tuyệt đối mọi thông tin của bạn.",
  submit: "Gửi yêu cầu",
} as const;

export const contactMap = {
  title: "Light Human",
  lines: ["Tầng 4, 213 Chu Văn An, Phường Bình Thạnh, Tp Hồ Chí Minh"],
} as const;

export const contactWhyUs = {
  heading: "Vì sao chọn Light Human?",
  rows: [
    {
      icon: "award",
      title: "Chuyên môn sâu rộng",
      desc: "Đội ngũ chuyên gia giàu kinh nghiệm và am hiểu từng ngành nghề.",
    },
    {
      icon: "gem",
      title: "Giải pháp tùy chỉnh",
      desc: "Mỗi doanh nghiệp là duy nhất. Chúng tôi thiết kế giải pháp phù hợp với bạn.",
    },
    {
      icon: "users",
      title: "Kết nối nhân tài chất lượng",
      desc: "Mạng lưới ứng viên cao cấp, được tuyển chọn kỹ lưỡng.",
    },
    {
      icon: "handshake",
      title: "Đồng hành dài hạn",
      desc: "Không chỉ tuyển dụng, chúng tôi đồng hành cùng doanh nghiệp trên hành trình phát triển.",
    },
  ],
} as const;

export const contactFaqHead = {
  eyebrow: "FAQ",
  helper: "Không tìm thấy câu trả lời?",
  helperLink: "Gửi email cho chúng tôi.",
} as const;
