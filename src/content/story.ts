import { CMS, site } from "./site";

/**
 * /cau-chuyen - the Light Human story.
 * Built only from facts already published elsewhere on the site (team bios,
 * case studies, licence number, headline numbers). Anything inferred is
 * flagged TODO(BA) and must be confirmed before launch.
 */

export const storyMeta = {
  title: "Câu chuyện Light Human: hành trình từ TP.HCM",
  description:
    "Hành trình của Light Human từ những ngày đầu tại TP. Hồ Chí Minh: người sáng lập, các mốc phát triển, giấy phép dịch vụ việc làm và chặng đường phía trước.",
};

export const storyPage = {
  kicker: "Câu chuyện",
  crumb: "Câu chuyện",
  title: "Câu chuyện Light Human",
  lede: "Hành trình từ những ngày đầu tại TP. Hồ Chí Minh đến đối tác tuyển dụng của hơn 800 doanh nghiệp.",
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

/** Closing proof block: only facts already public in the footer and on the blog. */
export const storyRecord = {
  title: "Những gì bạn có thể *kiểm chứng*",
  lede: "Giấy phép, mã số thuế và văn phòng đều công khai. Doanh nghiệp có thể đối chiếu trước khi ký hợp đồng.",
  facts: [
    { label: "Giấy phép dịch vụ việc làm", value: "33093/2024/67/SLĐTBXH-VLATLĐ", mono: true },
    { label: "Mã số thuế", value: "0316300874", mono: true },
    { label: "Văn phòng", value: site.contact.address, mono: false },
  ],
  photo: {
    url: `${CMS}/large_lh_talkshow_cv_vu_xuan_vinh_cover_bf66a44d70.jpg`,
    alt: "Sinh viên và diễn giả chụp ảnh chung trên sân khấu talk show kỹ năng viết CV",
    caption: "Talk show kỹ năng viết CV cùng anh Vũ Xuân Vinh, cố vấn chiến lược Light Human, tháng 6/2024.",
    href: "/blog/bien-cv-hoa-nhap-khong-hoa-tan-cung-anh-vu-xuan-vinh",
    linkLabel: "Đọc bài viết",
  },
};

/** What makes a milestone concrete: a named client, a link, a number. Built only from facts already on the site. */
export type StoryProof =
  | { kind: "roots"; label: string; items: string[] }
  | { kind: "case"; slug: string; linkLabel: string }
  | { kind: "services"; label: string }
  | { kind: "link"; label: string; href: string };

export type StoryMilestone = {
  when: string;
  title: string;
  text: string;
  stats?: { num: string; label: string }[];
  proof?: StoryProof;
};

export const storyMilestones: StoryMilestone[] = [
  {
    // TODO(BA): năm thành lập suy ra từ "6+ năm kinh nghiệm" và tầm nhìn 2020-2025; cần xác nhận.
    when: "2020",
    title: "Thành lập tại TP. Hồ Chí Minh",
    text: "Light Human bắt đầu với một mục tiêu rõ ràng: làm cầu nối giữa doanh nghiệp cần nhân tài và những người đang tìm môi trường để phát triển sự nghiệp lâu dài.",
    proof: { kind: "roots", label: "Kinh nghiệm mang theo từ", items: ["VietVictory", "Khả Kim", "Hunter Media"] },
  },
  {
    when: "Sau đại dịch",
    title: "Đồng hành cùng doanh nghiệp tái cấu trúc",
    text: "Khi thị trường lao động thay đổi sau Covid-19, Light Human cùng Khả Kim Beauty tái cấu trúc nhân sự, đánh giá lại chức năng từng vị trí và tối ưu chi phí.",
    proof: { kind: "case", slug: "kha-kim-beauty", linkLabel: "Xem dự án Khả Kim Beauty" },
  },
  {
    when: "Mở rộng",
    title: "Từ tuyển dụng chuyên môn đến giải pháp nhân sự trọn gói",
    text: "Danh mục dịch vụ mở rộng sang tuyển dụng số lượng lớn, nhân sự tạm thời, xây dựng thương hiệu tuyển dụng, đào tạo đội ngũ HR và hướng nghiệp cho cá nhân.",
    proof: { kind: "services", label: "Sáu dịch vụ hiện có" },
  },
  {
    when: "Vượt biên giới",
    title: "Đối tác của doanh nghiệp quốc tế",
    text: "Canawan, công ty truyền thông có trụ sở tại Singapore, chọn Light Human để xây dựng đội ngũ khi mở văn phòng tại Việt Nam.",
    proof: { kind: "case", slug: "canawan", linkLabel: "Xem dự án Canawan" },
  },
  {
    when: "2024",
    title: "Được cấp giấy phép dịch vụ việc làm",
    text: "Light Human được cấp Giấy phép hoạt động dịch vụ việc làm số 33093/2024/67/SLĐTBXH-VLATLĐ.",
    proof: { kind: "link", label: "Đối chiếu giấy phép và mã số thuế", href: "#kiem-chung" },
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

export const storyTimeline = {
  title: "Hành trình *từng chặng*",
  lede: "Mốc nào chưa có năm chính xác, chúng tôi ghi theo giai đoạn.",
  aheadWhen: "Phía trước",
};

export const storyAhead = {
  title: "Chặng tiếp theo",
  // TODO(BA): tầm nhìn gốc gắn mốc 2020-2025 (top 5 thương hiệu); cần cập nhật mục tiêu sau 2025.
  text: "Trở thành công ty dịch vụ tuyển dụng am hiểu sâu sắc nhất và đáp ứng chuyên nghiệp nhất các nhu cầu tuyển dụng của doanh nghiệp Việt Nam.",
};

export const storyCta = {
  heading: "Viết tiếp câu chuyện cùng Light Human",
  desc: "Doanh nghiệp cần tuyển người: nhận báo giá trong vài phút. Ứng viên tìm cơ hội: xem các vị trí đang mở.",
};
