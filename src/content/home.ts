import { CMS } from "./site";

/** Nội dung trang chủ, theo lighthuman.vn. */

export const hero = {
  image: `${CMS}/lighthuman_hero_7ee1a27bba.png`,
  // Shortened from the original site copy so the hero reads in one glance.
  lede: "Giải pháp tuyển dụng và quản lý nhân sự cho doanh nghiệp Việt, từ headhunting cấp cao đến tuyển dụng số lượng lớn.",
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
