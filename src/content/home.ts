import { CMS } from "./site";

/** Nội dung trang chủ, theo lighthuman.vn. */

export const hero = {
  image: `${CMS}/lighthuman_hero_7ee1a27bba.png`,
  lede:
    "Giải pháp tuyển dụng & quản lý nhân sự hiệu quả. Hành trình vạn dặm bắt đầu từ một bước chân - cùng Light Human xây dựng đội ngũ nhân sự tinh hoa, song hành cùng sự phát triển của doanh nghiệp.",
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
  eyebrow: "Thử ngay · Miễn phí",
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
