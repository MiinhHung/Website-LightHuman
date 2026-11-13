import { CMS, quoteHref, site } from "./site";

/** Nội dung trang chủ, theo lighthuman.vn. */

export const hero = {
  image: `${CMS}/lighthuman_hero_7ee1a27bba.png`,
};

export type TrustIcon = "award" | "building" | "briefcase" | "users";

export const homeStats: { icon: TrustIcon; num: string; label: string }[] = [
  { icon: "award", num: "6+", label: "năm kinh nghiệm" },
  { icon: "building", num: "800+", label: "doanh nghiệp tin chọn" },
  { icon: "briefcase", num: "1.200+", label: "dự án nhân sự" },
  { icon: "users", num: "36.000+", label: "ứng viên được kết nối" },
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
  tax: {
    tag: "Thuế TNCN 2026",
    title: "Biểu thuế mới còn 5 bậc",
    upTo: "Đến",
    over: "Trên",
    unit: "tr",
    cta: "Tính thuế TNCN",
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
  layers: "Phía sau mỗi lần tuyển",
  stories: "Kết quả ra sao",
  start: "Bắt đầu từ đâu",
  next: "Tiếp theo",
};

/** One-line client strip under the hero. */

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

/** Copy of the home sections as approved in the static mock (E:/ClaudeMD/website/LightHuman). */
export const mkHome = {
  services: { title: "Sáu cách chúng tôi *tìm đúng người*", lede: "Từ một vị trí giám đốc đến một nghìn công nhân cho dây chuyền mới.", all: "Tất cả dịch vụ", more: "Xem dịch vụ" },
  process: { title: "Làm *như thế nào*", lede: "Sáu bước lặp lại cho mọi dự án, từ một vị trí giám đốc đến một nghìn công nhân.", cta: "Nhận báo giá" },
  cases: { title: "Kết quả *ra sao*", all: "Xem tất cả câu chuyện", more: "Xem câu chuyện", tablist: "Khách hàng" },
  testimonials: { title: "Khách hàng nói gì", sub: "Lời từ doanh nghiệp và ứng viên đã làm việc với Light Human", more: "Xem câu chuyện" },
  toolkit: { kicker: "Light Human Toolkit", taxTag: "Thuế TNCN 2026", taxTitle: "Biểu thuế 5 bậc mới", taxBody: "Cư trú, hợp đồng dưới 3 tháng, người không cư trú.", taxCta: "Tính thuế" },
  posts: { title: "Góc nhìn *từ đội tư vấn*", all: "Tất cả bài viết", minutes: "phút đọc" },
  statsLabel: "Light Human qua các con số",
  cta: {
    title: "Bắt đầu với một bản báo giá",
    desc: "Chọn vị trí và yêu cầu ứng viên, nhận mã báo giá ngay. Đội BD liên hệ lại trong 24 giờ làm việc.",
    action: { label: "Nhận báo giá", href: quoteHref },
    secondary: { label: "Bạn đang tìm việc? Xem việc làm", href: site.jobsUrl },
  },
};

export type LayerIcon = "briefcase" | "branding" | "clipboard-check" | "award";

/** "Mỗi lần tuyển có nhiều lớp phía sau": four alternating cool / warm cards. */
export const layersHead = {
  kicker: "Quy trình vận hành",
  title: { before: "Mỗi lần tuyển có ", em: "nhiều lớp phía sau" },
  lede: "Từ chân dung ứng viên đến ngày nhận việc, mỗi lớp có đội ngũ chuyên gia phụ trách riêng và tiêu chuẩn kiểm soát chất lượng độc lập.",
  layer: "Lớp",
};

// TODO(BA): "Đánh giá 3 vòng" và bảo hành 60 ngày lấy từ bản mẫu, chưa đối chiếu hợp đồng mẫu.
export const layerItems: { icon: LayerIcon; title: string; desc: string; tag: string }[] = [
  { icon: "briefcase", title: "Phân tích & Chân dung", desc: "Xác định đặc tính dự án, văn hóa tổ chức và chân dung ứng viên mục tiêu chi tiết.", tag: "Chuyên môn ngành" },
  { icon: "branding", title: "Đăng tin đa kênh", desc: "Phân phối thông điệp tuyển dụng rộng rãi trên hệ thống đối tác và nguồn ứng viên sẵn có.", tag: "Tiếp cận đa tầng" },
  { icon: "clipboard-check", title: "Sàng lọc hồ sơ", desc: "Shortlist nhanh theo tiêu chí, kiểm tra tham chiếu và phỏng vấn hành vi độc lập.", tag: "Đánh giá 3 vòng" },
  { icon: "award", title: "Bàn giao & Bảo hành", desc: "Bàn giao nhân sự hoàn chỉnh, cam kết bảo hành và đồng hành trong 60 ngày thử việc.", tag: "Cam kết văn bản" },
];

/** "Vì sao doanh nghiệp chọn Light Human": six real points picked from the services' own "why us" lists. */
export const whyHead = {
  kicker: "Lợi thế",
  title: { before: "Vì sao doanh nghiệp chọn ", em: "Light Human" },
  lede: "Sáu điểm lấy từ cách chúng tôi vận hành từng dịch vụ: người phụ trách riêng, nguồn ứng viên sẵn có, tích hợp hệ thống và cam kết bằng văn bản.",
};

/** [service slug, index in its features.items, icon]. */
export const whyPicks: [string, number, string][] = [
  ["tuyen-dung-nhan-su-so-luong-lon", 0, "users-round"],
  ["tuyen-dung-nhan-su-cao-cap", 1, "globe"],
  ["tuyen-dung-nhan-su-tam-thoi", 0, "clock"],
  ["tuyen-dung-nhan-su-so-luong-lon", 3, "shield-check"],
  ["tuyen-dung-nhan-su-so-luong-lon", 2, "target"],
  ["dao-tao-tuyen-dung", 3, "graduation-cap"],
];

export const processAction = { label: "Nhận báo giá", href: quoteHref };
