import { CMS, quoteHref } from "./site";

/** Nội dung trang chủ, theo lighthuman.vn. */

export const hero = {
  image: `${CMS}/lighthuman_hero_7ee1a27bba.png`,
};

export type TrustIcon = "award" | "building" | "briefcase" | "users";

export const homeStats: { icon: TrustIcon; num: string; label: string }[] = [
  { icon: "award", num: "6+", label: "Năm kinh nghiệm, 1.200+ dự án nhân sự" },
  { icon: "building", num: "800+", label: "Khách hàng doanh nghiệp, Đa quốc gia & nội địa" },
  { icon: "briefcase", num: "100+", label: "Dự án mỗi năm, Hoàn thành đúng tiến độ" },
  { icon: "users", num: "36.000+", label: "Ứng viên, Kết nối thành công" },
];

export type StepIcon = "users" | "search" | "target" | "handshake" | "clipboard" | "sprout";

export const processSteps: { icon: StepIcon; title: string; desc: string }[] = [
  { icon: "users", title: "Lắng nghe & thấu hiểu", desc: "Nắm bắt trọn vẹn nhu cầu, mục tiêu cốt lõi của doanh nghiệp" },
  { icon: "search", title: "Phân tích chuyên sâu", desc: "Đánh giá đặc thù ngành, văn hóa và đội ngũ hiện tại" },
  { icon: "target", title: "Xây dựng giải pháp", desc: "Thiết kế giải pháp “may đo”, tối ưu theo đặc thù doanh nghiệp" },
  { icon: "handshake", title: "Triển khai & đồng hành", desc: "Cùng bạn triển khai, đảm bảo quá trình hiệu quả, suôn sẻ" },
  { icon: "clipboard", title: "Đo lường & đánh giá", desc: "Theo dõi KPIs, đánh giá minh bạch hiệu quả giải pháp" },
  { icon: "sprout", title: "Tối ưu & phát triển", desc: "Liên tục cải tiến, hỗ trợ doanh nghiệp phát triển bền vững" },
];

export type IntentIcon = "executive" | "mass" | "temporary" | "branding";

/** Hero shortcut: "what do you need?" chips that route straight to a service. */
export const heroIntents = {
  label: "Bạn đang cần tuyển",
  items: [
    { icon: "executive", label: "Lãnh đạo, quản lý", href: "/dich-vu/tuyen-dung-nhan-su-cao-cap" },
    { icon: "mass", label: "Hàng trăm nhân sự", href: "/dich-vu/tuyen-dung-nhan-su-so-luong-lon" },
    { icon: "temporary", label: "Nhân sự thời vụ", href: "/dich-vu/tuyen-dung-nhan-su-tam-thoi" },
    { icon: "branding", label: "Thu hút nhân tài", href: "/dich-vu/xay-dung-thuong-hieu-tuyen-dung" },
  ] satisfies { icon: IntentIcon; label: string; href: string }[],
};

/** "Try it now" band: live salary preview + quote board and compound teasers. */
export const homeToolkit = {
  title: "Tính trước, quyết nhanh hơn",
  lede: "Công cụ đội tư vấn Light Human dùng mỗi ngày khi chốt offer và lập báo giá, nay mở cho bạn. Không cần đăng ký.",
  salary: {
    tag: "Lương Gross ⇄ Net 2026",
    title: "Gross bao nhiêu thì thực nhận bao nhiêu?",
    gross: "Lương Gross mỗi tháng",
    dependents: "Người phụ thuộc",
    net: "Thực nhận (Net)",
    insurance: "Bảo hiểm",
    tax: "Thuế TNCN",
    note: "Luật 2026, vùng I, đóng bảo hiểm trên lương Gross.",
    cta: "Xem bảng tính chi tiết",
    unit: "đ",
  },
  quote: {
    tag: "Báo giá tuyển dụng",
    title: "Kéo thẻ, nhận báo giá",
    body: "Chọn chuyên ngành, kinh nghiệm, khu vực như xếp bài lên bàn. Báo giá lập ngay, đội BD liên hệ trong 24 giờ làm việc.",
    cards: ["Kế toán", "3–5 năm", "TP. HCM", "Đại học"],
    sheet: "Báo giá",
    cta: "Thử bàn báo giá",
  },
  compound: {
    tag: "Lãi kép",
    title: "Gửi 5 triệu mỗi tháng, 10 năm sau có bao nhiêu?",
    cta: "Tính lãi kép",
  },
};

/** Hero play button: opens the company film in a lightbox. */
export const homeVideo = {
  play: "Xem phim giới thiệu",
  close: "Đóng video",
  dialog: "Phim giới thiệu Light Human",
};

/**
 * Scroll-lit statement between the client logos and the services. Segments
 * marked `em` are lit in gold; the rest in white.
 */
export const manifesto = {
  segments: [
    { text: "Một người đúng có thể thay đổi" },
    { text: "cả một đội.", em: true },
    { text: "Việc của chúng tôi là tìm ra người đó, rồi đồng hành đến khi họ" },
    { text: "thật sự ở lại.", em: true },
  ] as { text: string; em?: boolean }[],
  sign: "Đội ngũ Light Human",
};

/**
 * The home page reads as one story: each chapter is the question a visitor
 * would ask next, and the end of each chapter teases the following one.
 */
export const homeChapters = {
  belief: "Điều chúng tôi tin",
  services: "Chúng tôi làm gì",
  process: "Làm như thế nào",
  stories: "Kết quả ra sao",
  start: "Bắt đầu từ đâu",
  next: "Tiếp theo",
};

/** One-line client strip under the hero. */
export const partnerStrip = "Hơn 800 doanh nghiệp đã chọn Light Human";

/** Editorial home: short hero copy (the long CMS lede stays in `hero.lede`). */
export const edHero = {
  kicker: "Đối tác nhân sự chiến lược",
  title: { before: "Con người ", em1: "xuất sắc", middle: " kiến tạo doanh nghiệp ", em2: "phi thường." },
  lede: "Headhunting, tuyển dụng số lượng lớn và tư vấn nhân sự cho hơn 800 doanh nghiệp trong nước và quốc tế.",
  primary: { label: "Nhận báo giá", href: quoteHref },
  secondary: { label: "Khám phá dịch vụ", href: "/dich-vu" },
  imageAlt: "Chuyên viên Light Human trao đổi cùng ứng viên",
  film: "Phim giới thiệu",
};

export const servicesHead = {
  title: "Sáu dịch vụ, một đầu mối nhân sự",
  lede: "Từ tìm lãnh đạo cấp cao đến tuyển hàng trăm người cho dây chuyền mới, Light Human lo trọn quy trình.",
  all: "Xem tổng quan dịch vụ",
};

export const processHead = {
  title: "Sáu bước, mỗi bước có người chịu trách nhiệm",
  lede: "Từ thấu hiểu nhu cầu đến tối ưu liên tục, bạn luôn biết dự án đang ở đâu và ai đang lo.",
};
