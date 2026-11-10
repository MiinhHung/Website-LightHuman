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

export const homeServices = [
  {
    title: "Tuyển dụng nhân sự số lượng lớn",
    href: "/dich-vu/tuyen-dung-nhan-su-so-luong-lon",
    image: `${CMS}/home_mass_hiring_35da30b200.png`,
  },
  {
    title: "Xây dựng thương hiệu tuyển dụng",
    href: "/dich-vu/xay-dung-thuong-hieu-tuyen-dung",
    image: `${CMS}/home_employer_branding_8377e1c680.png`,
  },
  {
    title: "Tuyển dụng nhân sự tạm thời",
    href: "/dich-vu/tuyen-dung-nhan-su-tam-thoi",
    image: `${CMS}/home_temp_staffing_b552198d35.png`,
  },
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
