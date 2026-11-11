import logoOnDark from "@/assets/brand/logo-on-dark.png";
import type { Locale } from "@/i18n/config";

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
  /** Company introduction film on the Light Human YouTube channel. */
  introVideo: { id: "w1UOWmfwSmk", title: "Giới thiệu Công ty Cổ phần Giải pháp Nhân sự Ánh Sáng - Light Human" },
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

/** Icon keys for menu entries; the header maps them to lucide icons. */
export type NavIcon =
  | "company"
  | "story"
  | "executive"
  | "mass"
  | "temporary"
  | "training"
  | "career"
  | "branding"
  | "salary"
  | "compound";

export type NavLink = { label: string; href: string; desc?: string; icon?: NavIcon };

export type NavItem = {
  label: string;
  href: string;
  /** Opens off-site (job board) in a new tab. */
  external?: boolean;
  children?: NavLink[];
  /** Label of the panel's footer link, which points at `href`. */
  overview?: string;
  /** Highlight card beside the links (services panel). */
  promo?: { title: string; body: string; cta: string; href: string };
};

/** Single destination for every "get a quote" action: the quote builder on /lien-he. */
export const quoteHref = "/lien-he#bao-gia";

const S = "/dich-vu";

export const serviceNav = [
  { label: "Tuyển dụng nhân sự cấp cao", href: `${S}/tuyen-dung-nhan-su-cao-cap` },
  { label: "Tuyển dụng số lượng lớn", href: `${S}/tuyen-dung-nhan-su-so-luong-lon` },
  { label: "Xây dựng thương hiệu tuyển dụng", href: `${S}/xay-dung-thuong-hieu-tuyen-dung` },
  { label: "Đào tạo tuyển dụng", href: `${S}/dao-tao-tuyen-dung` },
];

/** Light Human Toolkit — các công cụ tương tác (/cong-cu). */
export const toolNav = [
  { label: "Tính lương Gross ⇄ Net 2026", href: "/cong-cu/tinh-luong-gross-net" },
  { label: "Tính lãi kép & lợi nhuận đầu tư", href: "/cong-cu/tinh-lai-kep" },
];

// One language per menu: the old menu mixed "Case Studies" / "Insights" into Vietnamese.
export const mainNav: NavItem[] = [
  {
    label: "Giới thiệu",
    href: "/dich-vu/gioi-thieu",
    children: [
      { label: "Về Light Human", href: "/dich-vu/gioi-thieu", desc: "Sứ mệnh, giá trị cốt lõi và đội ngũ", icon: "company" },
      { label: "Câu chuyện Light Human", href: "/cau-chuyen", desc: "Hành trình hình thành và phát triển", icon: "story" },
    ],
  },
  {
    label: "Dịch vụ",
    href: S,
    overview: "Xem tổng quan dịch vụ",
    children: [
      { label: "Tuyển dụng nhân sự cấp cao", href: `${S}/tuyen-dung-nhan-su-cao-cap`, desc: "Headhunting vị trí quản lý, lãnh đạo", icon: "executive" },
      { label: "Tuyển dụng số lượng lớn", href: `${S}/tuyen-dung-nhan-su-so-luong-lon`, desc: "Hàng trăm vị trí cho nhà máy, chuỗi bán lẻ", icon: "mass" },
      { label: "Tuyển dụng nhân sự tạm thời", href: `${S}/tuyen-dung-nhan-su-tam-thoi`, desc: "Nhân sự thời vụ, theo dự án", icon: "temporary" },
      { label: "Xây dựng thương hiệu tuyển dụng", href: `${S}/xay-dung-thuong-hieu-tuyen-dung`, desc: "Thu hút và giữ chân nhân tài", icon: "branding" },
      { label: "Đào tạo tuyển dụng", href: `${S}/dao-tao-tuyen-dung`, desc: "Nâng năng lực đội ngũ HR nội bộ", icon: "training" },
      { label: "Hướng nghiệp & tư vấn cá nhân", href: `${S}/huong-nghiep-va-tu-van-ca-nhan`, desc: "Tư vấn sự nghiệp 1:1", icon: "career" },
    ],
    promo: {
      title: "Báo giá trong vài phút",
      body: "Chọn vị trí và yêu cầu ứng viên, nhận mã báo giá ngay trên website.",
      cta: "Tạo báo giá",
      href: quoteHref,
    },
  },
  { label: "Dự án", href: "/case-studies" },
  { label: "Góc nhìn", href: "/tin-tuc" },
  {
    label: "Công cụ",
    href: "/cong-cu",
    overview: "Tất cả công cụ",
    children: [
      { label: "Tính lương Gross ⇄ Net 2026", href: "/cong-cu/tinh-luong-gross-net", desc: "Theo mức giảm trừ và biểu thuế mới", icon: "salary" },
      { label: "Tính lãi kép", href: "/cong-cu/tinh-lai-kep", desc: "Tiền gửi, đầu tư định kỳ, lợi nhuận", icon: "compound" },
    ],
  },
  { label: "Việc làm", href: site.jobsUrl, external: true },
];

// English menu. Pages without an English version yet link to the Vietnamese page;
// the header marks those links "VI" so the language change is not a surprise.
export const mainNavEn: NavItem[] = [
  {
    label: "About",
    href: "/dich-vu/gioi-thieu",
    children: [
      { label: "About Light Human", href: "/dich-vu/gioi-thieu", desc: "Mission, core values and team", icon: "company" },
      { label: "Our story", href: "/cau-chuyen", desc: "How Light Human started and grew", icon: "story" },
    ],
  },
  {
    label: "Services",
    href: S,
    overview: "Services overview",
    children: [
      { label: "Executive search", href: `${S}/tuyen-dung-nhan-su-cao-cap`, desc: "Headhunting for managers and leaders", icon: "executive" },
      { label: "Mass recruitment", href: `${S}/tuyen-dung-nhan-su-so-luong-lon`, desc: "Hundreds of hires for plants and retail", icon: "mass" },
      { label: "Temporary staffing", href: `${S}/tuyen-dung-nhan-su-tam-thoi`, desc: "Seasonal and project-based staff", icon: "temporary" },
      { label: "Employer branding", href: `${S}/xay-dung-thuong-hieu-tuyen-dung`, desc: "Attract and keep the right people", icon: "branding" },
      { label: "Recruitment training", href: `${S}/dao-tao-tuyen-dung`, desc: "Upskill your in-house HR team", icon: "training" },
      { label: "Career coaching", href: `${S}/huong-nghiep-va-tu-van-ca-nhan`, desc: "One-to-one career guidance", icon: "career" },
    ],
    promo: {
      title: "A quote in minutes",
      body: "Pick the role and candidate requirements, get a quote code right on the site.",
      cta: "Build a quote",
      href: quoteHref,
    },
  },
  { label: "Case studies", href: "/case-studies" },
  { label: "Insights", href: "/tin-tuc" },
  {
    label: "Tools",
    href: "/cong-cu",
    overview: "All tools",
    children: [
      { label: "Gross ⇄ Net salary 2026", href: "/cong-cu/tinh-luong-gross-net", desc: "Vietnam's new deductions and tax brackets", icon: "salary" },
      { label: "Compound interest", href: "/cong-cu/tinh-lai-kep", desc: "Savings, regular investing, returns", icon: "compound" },
    ],
  },
  { label: "Careers", href: site.jobsUrl, external: true },
];

type FooterCol = { title: string; links: { label: string; href: string }[] };

export const footerNav: FooterCol[] = [
  {
    title: "Công ty",
    links: [
      { label: "Giới thiệu", href: "/dich-vu/gioi-thieu" },
      { label: "Câu chuyện Light Human", href: "/cau-chuyen" },
      { label: "Đội ngũ", href: "/dich-vu/gioi-thieu#doi-ngu" },
      { label: "Góc nhìn", href: "/tin-tuc" },
    ],
  },
  { title: "Dịch vụ", links: serviceNav },
  {
    title: "Tài nguyên",
    links: [
      { label: "Dự án tiêu biểu", href: "/case-studies" },
      { label: "Tính lương Gross ⇄ Net", href: "/cong-cu/tinh-luong-gross-net" },
      { label: "Tính lãi kép", href: "/cong-cu/tinh-lai-kep" },
      { label: "Liên hệ", href: "/lien-he" },
      { label: "Câu hỏi thường gặp", href: "/lien-he#faq" },
    ],
  },
];

const footerNavEn: FooterCol[] = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/dich-vu/gioi-thieu" },
      { label: "Our story", href: "/cau-chuyen" },
      { label: "Team", href: "/dich-vu/gioi-thieu#doi-ngu" },
      { label: "Insights", href: "/tin-tuc" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Executive search", href: `${S}/tuyen-dung-nhan-su-cao-cap` },
      { label: "Mass recruitment", href: `${S}/tuyen-dung-nhan-su-so-luong-lon` },
      { label: "Employer branding", href: `${S}/xay-dung-thuong-hieu-tuyen-dung` },
      { label: "Recruitment training", href: `${S}/dao-tao-tuyen-dung` },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Case studies", href: "/case-studies" },
      { label: "Gross ⇄ Net salary", href: "/cong-cu/tinh-luong-gross-net" },
      { label: "Compound interest", href: "/cong-cu/tinh-lai-kep" },
      { label: "Contact", href: "/lien-he" },
      { label: "FAQ", href: "/lien-he#faq" },
    ],
  },
];

/** Header and footer strings, per locale. */
export const chrome = {
  vi: {
    nav: mainNav,
    footer: footerNav,
    homeLabel: `${site.name} - Trang chủ`,
    mainNavLabel: "Điều hướng chính",
    openMenu: "Mở menu",
    closeMenu: "Đóng menu",
    newTab: "(mở tab mới)",
    quote: "Báo giá",
    language: "Ngôn ngữ",
    /** Shown on links that lead to a page in the other language. */
    otherLang: "",
    untranslated: "Trang này chưa có bản tiếng Anh",
    tagline: site.description,
    contactTitle: "Liên hệ",
    legal: site.legal,
  },
  en: {
    nav: mainNavEn,
    footer: footerNavEn,
    homeLabel: `${site.name} - Home`,
    mainNavLabel: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    newTab: "(opens in a new tab)",
    quote: "Get a quote",
    language: "Language",
    otherLang: "In Vietnamese",
    untranslated: "",
    tagline:
      "Light Human is a Vietnamese HR consultancy and headhunting firm: executive search, mass hiring, employer branding, training and advisory.",
    contactTitle: "Contact",
    legal:
      "© 2026 Light Human Co., Ltd. Tax code: 0316300874. Employment services licence: 33093/2024/67/SLĐTBXH-VLATLĐ. All rights reserved.",
  },
} satisfies Record<Locale, unknown>;

export type Chrome = (typeof chrome)[Locale];
