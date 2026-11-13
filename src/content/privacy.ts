import { site } from "./site";

/**
 * /chinh-sach-bao-mat — draft copy from the approved mock.
 * TODO(BA): bản nháp để dựng giao diện; bộ phận pháp chế cần soạn và duyệt nội dung chính thức trước khi đăng.
 */

export const privacyMeta = {
  title: "Chính sách bảo mật",
  description:
    "Cách Light Human thu thập, sử dụng và bảo vệ thông tin bạn gửi qua form báo giá, form liên hệ và đăng ký nhận bài.",
};

export const privacyHero = {
  kicker: "Pháp lý",
  title: "Chính sách *bảo mật*",
  crumb: "Chính sách bảo mật",
};

/** A paragraph is plain text plus inline links. */
export type PrivacyPart = string | { label: string; href: string };

export const privacySections: { id: string; title: string; body: PrivacyPart[] }[] = [
  {
    id: "thu-thap",
    title: "Thông tin chúng tôi nhận",
    body: [
      "Họ tên, công ty, email, số điện thoại và yêu cầu tuyển dụng bạn nhập vào form báo giá hoặc form liên hệ; email khi bạn đăng ký nhận bài Góc nhìn.",
    ],
  },
  {
    id: "muc-dich",
    title: "Mục đích sử dụng",
    body: ["Liên hệ lại để tư vấn, gửi báo giá, gửi bài viết bạn đã đăng ký. Bạn có thể hủy nhận email bất cứ lúc nào."],
  },
  {
    id: "lien-he",
    title: "Liên hệ về dữ liệu cá nhân",
    body: [
      "Công ty Cổ phần Giải pháp Nhân sự Ánh Sáng (Light Human), MST 0316300874, 213 Chu Văn An, Phường Bình Thạnh, TP. Hồ Chí Minh. Email ",
      { label: site.contact.email, href: `mailto:${site.contact.email}` },
      ", điện thoại ",
      { label: site.contact.phone, href: site.contact.phoneHref },
      ".",
    ],
  },
];
