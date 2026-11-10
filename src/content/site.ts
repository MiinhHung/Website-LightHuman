import logoOnDark from "@/assets/brand/logo-on-dark.png";

/**
 * Thông tin chung toàn site (lấy theo lighthuman.vn). Mọi component đọc từ đây.
 */

export const CMS = "https://blog.lighthuman.vn/uploads";

export const site = {
  name: "Light Human",
  tagline: "Đối tác nhân sự chiến lược cho doanh nghiệp Việt",
  description:
    "Light Human - đơn vị tư vấn nhân sự và headhunting hàng đầu Việt Nam. Executive Search, Mass Hiring, Employer Branding, đào tạo & tư vấn.",
  url: "https://lighthuman.vn",
  jobsUrl: "https://job.lighthuman.vn",
  // Local copy of the CMS logo (Logo_Light_Human_01) with its transparent padding trimmed.
  logo: logoOnDark,
  legal:
    "© 2026 Light Human. © Light Human Co., Ltd. MST: 0316300874. GPHĐ Dịch Vụ Việc làm: 33093/2024/67/SLĐTBXH-VLATLĐ. Tất cả quyền được bảo lưu.",
  contact: {
    phone: "028 3842 5188",
    phoneHref: "tel:02838425188",
    email: "info@lighthuman.vn",
    address: "213 Chu Văn An, Phường Bình Thạnh, Tp Hồ Chí Minh",
    zalo: "https://zalo.me/1918819694290024083",
  },
  /** Kênh trong cụm liên hệ nhanh (livechat) — trang gốc dùng trang tuyển dụng. */
  chat: {
    facebook: "https://www.facebook.com/Tuyendunglighthuman",
    linkedin: "https://www.linkedin.com/company/gi-i-ph-p-nh-n-s-nh-s-ng-light-human/?viewAsMember=true",
  },
  /** Mạng xã hội ở footer. */
  socials: {
    youtube: "https://www.youtube.com/@lighthuman",
    facebook: "https://www.facebook.com/lighthuman.vn",
    linkedin: "https://www.linkedin.com/company/lighthuman",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  /** Opens off-site (job board) in a new tab. */
  external?: boolean;
  children?: { label: string; href: string }[];
};

/** Single destination for every "get a quote" action: the quote builder on /lien-he. */
export const quoteHref = "/lien-he#bao-gia";

export const serviceNav = [
  { label: "Headhunting & Executive Search", href: "/dich-vu/tuyen-dung-nhan-su-cao-cap" },
  { label: "Tuyển dụng số lượng lớn", href: "/dich-vu/tuyen-dung-nhan-su-so-luong-lon" },
  { label: "Employer Branding", href: "/dich-vu/xay-dung-thuong-hieu-tuyen-dung" },
  { label: "Đào tạo & Tư vấn nhân sự", href: "/dich-vu/dao-tao-tuyen-dung" },
];

export const mainNav: NavItem[] = [
  {
    label: "Giới thiệu",
    href: "/dich-vu/gioi-thieu",
    children: [
      { label: "Về Light Human", href: "/dich-vu/gioi-thieu" },
      { label: "Câu chuyện Light Human", href: "/cau-chuyen" },
    ],
  },
  { label: "Dịch vụ", href: "/dich-vu", children: serviceNav },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Insights", href: "/tin-tuc" },
  { label: "Tuyển dụng", href: site.jobsUrl, external: true },
];

export const footerNav = [
  {
    title: "Công ty",
    links: [
      { label: "Giới thiệu", href: "/dich-vu/gioi-thieu" },
      { label: "Câu chuyện Light Human", href: "/cau-chuyen" },
      { label: "Đội ngũ", href: "/dich-vu/gioi-thieu" },
      { label: "Tin tức", href: "/tin-tuc" },
    ],
  },
  { title: "Dịch vụ", links: serviceNav },
  {
    title: "Tài nguyên",
    links: [
      { label: "Case Studies", href: "/case-studies" },
      { label: "Insights", href: "/tin-tuc" },
      { label: "Liên hệ", href: "/lien-he" },
      { label: "FAQ", href: "/lien-he#faq" },
    ],
  },
];
