import { CMS } from "./site";

/**
 * /cau-chuyen - the Light Human story.
 * Built only from facts already published elsewhere on the site (team bios,
 * case studies, licence number, headline numbers). Anything inferred is
 * flagged TODO(BA) and must be confirmed before launch.
 */

export const storyPage = {
  title: "Câu chuyện Light Human",
  lede: "Hành trình từ những ngày đầu tại TP. Hồ Chí Minh đến đối tác tuyển dụng của hơn 800 doanh nghiệp.",
  image: `${CMS}/hero_about_c25f683d35.png`,
  imageAlt: "Đội ngũ Light Human trao đổi cùng khách hàng",
};

export const storyOrigin = {
  title: "Bắt đầu từ nghề tuyển dụng",
  paragraphs: [
    "Những người sáng lập Light Human đều trưởng thành từ nghề tuyển dụng và quản trị nhân sự: từng dẫn dắt nguồn tuyển và dịch vụ tuyển dụng tại VietVictory, phụ trách nhân sự và chiến lược tại Khả Kim, đồng sáng lập Hunter Media.",
    "Họ cùng chung một nhận định: sức cạnh tranh của doanh nghiệp nằm ở chất lượng con người, và chọn đúng người là nền móng cho mọi kế hoạch tăng trưởng. Light Human ra đời để làm tốt đúng việc đó.",
  ],
  motto: "Hành trình vạn dặm, bắt đầu từ một bước chân",
  // TODO(BA): xác nhận cách diễn giải dòng "Personnel Love" trên logo trước khi đưa lên.
  mottoNote: "Dòng chữ Personnel Love trên logo là lời nhắc về cách chúng tôi làm nghề: tận tâm với từng doanh nghiệp và từng ứng viên.",
};

export type StoryMilestone = {
  when: string;
  title: string;
  text: string;
  stats?: { num: string; label: string }[];
};

export const storyMilestones: StoryMilestone[] = [
  {
    // TODO(BA): năm thành lập suy ra từ "6+ năm kinh nghiệm" và tầm nhìn 2020-2025; cần xác nhận.
    when: "2020",
    title: "Thành lập tại TP. Hồ Chí Minh",
    text: "Light Human bắt đầu với một mục tiêu rõ ràng: làm cầu nối giữa doanh nghiệp cần nhân tài và những người đang tìm môi trường để phát triển sự nghiệp lâu dài.",
  },
  {
    when: "Sau đại dịch",
    title: "Đồng hành cùng doanh nghiệp tái cấu trúc",
    text: "Khi thị trường lao động thay đổi sau Covid-19, Light Human cùng Khả Kim Beauty tái cấu trúc nhân sự, đánh giá lại chức năng từng vị trí và tối ưu chi phí.",
  },
  {
    when: "Mở rộng",
    title: "Từ tuyển dụng chuyên môn đến giải pháp nhân sự trọn gói",
    text: "Danh mục dịch vụ mở rộng sang tuyển dụng số lượng lớn, nhân sự tạm thời, xây dựng thương hiệu tuyển dụng, đào tạo đội ngũ HR và hướng nghiệp cho cá nhân.",
  },
  {
    when: "Vượt biên giới",
    title: "Đối tác của doanh nghiệp quốc tế",
    text: "Canawan, công ty truyền thông có trụ sở tại Singapore, chọn Light Human để xây dựng đội ngũ khi mở văn phòng tại Việt Nam.",
  },
  {
    when: "2024",
    title: "Được cấp giấy phép dịch vụ việc làm",
    text: "Light Human được cấp Giấy phép hoạt động dịch vụ việc làm số 33093/2024/67/SLĐTBXH-VLATLĐ.",
  },
  {
    when: "Hôm nay",
    title: "Đối tác tuyển dụng của hơn 800 doanh nghiệp",
    text: "Từ văn phòng tại 213 Chu Văn An, Bình Thạnh, đội ngũ Light Human phục vụ khách hàng trong nước và quốc tế.",
    stats: [
      { num: "1.200+", label: "dự án nhân sự" },
      { num: "800+", label: "doanh nghiệp" },
      { num: "36.000+", label: "ứng viên được kết nối" },
    ],
  },
];

export const storyAhead = {
  title: "Chặng tiếp theo",
  // TODO(BA): tầm nhìn gốc gắn mốc 2020-2025 (top 5 thương hiệu); cần cập nhật mục tiêu sau 2025.
  text: "Trở thành công ty dịch vụ tuyển dụng am hiểu sâu sắc nhất và đáp ứng chuyên nghiệp nhất các nhu cầu tuyển dụng của doanh nghiệp Việt Nam.",
};

export const storyCta = {
  heading: "Viết tiếp câu chuyện cùng Light Human",
  desc: "Doanh nghiệp cần tuyển người: nhận báo giá trong vài phút. Ứng viên tìm cơ hội: xem các vị trí đang mở.",
};
