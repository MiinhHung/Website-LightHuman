import { CMS } from "./site";

/**
 * Bộ lọc ngành trên trang /case-studies — đúng thứ tự site gốc
 * (site gốc có hai danh mục cùng tên "Sản xuất"; xem TODO(BA) bên dưới).
 */
export const caseCategories = [
  { id: "san-xuat", label: "Sản xuất" },
  { id: "my-pham", label: "Mỹ phẩm" },
  { id: "marketing", label: "Marketing" },
  { id: "giao-duc", label: "Giáo dục" },
  // TODO(BA): the original site labelled this "Sản xuất" too (duplicate); shown as FMCG until confirmed.
  { id: "fmcg", label: "FMCG" },
] as const;

export type CaseCategoryId = (typeof caseCategories)[number]["id"];

export type CaseStudy = {
  slug: string;
  brand: string;
  industry: string;
  headline: string;
  tags: string[];
  image: string;
  /** Danh mục dùng cho bộ lọc trang /case-studies. */
  category: CaseCategoryId;
  /** Nội dung thẻ trên trang /case-studies (site gốc dùng câu chữ đầy đủ hơn trang chủ). */
  listing: { brand: string; industry: string; headline: string; tags: string[] };
  /** Lời nhận xét đi kèm câu chuyện (trước đây nằm riêng ở section Testimonials). */
  quote: { text: string; name: string; role: string };
};

export const caseStudiesPage = {
  hero: {
    eyebrow: "Khách hàng & Câu chuyện",
    title: "Câu chuyện thành công của Light Human",
    lede: "Light Human đồng hành cùng các doanh nghiệp Việt và quốc tế trong hành trình tối ưu đội ngũ nhân sự.",
    image: `${CMS}/hero_case_studies_f56ba15689.png`,
  },
  allLabel: "Tất cả",
  cta: {
    heading: "Bạn muốn trở thành câu chuyện tiếp theo?",
    desc: "Liên hệ Light Human để nhận tư vấn giải pháp nhân sự phù hợp với doanh nghiệp của bạn.",
    action: { label: "Liên hệ tư vấn", href: "/lien-he" },
  },
};

/** Câu chuyện thành công — theo lighthuman.vn. */
export const caseStudies: CaseStudy[] = [
  {
    slug: "kha-kim-beauty",
    brand: "Khả Kim Beauty",
    industry: "Mỹ phẩm",
    headline: "Tái cấu trúc nhân sự hậu Covid - tiết kiệm chi phí và đánh giá lại chức năng nhiệm vụ từng vị trí.",
    tags: ["Tư vấn cơ cấu nhân sự", "Tối ưu payroll"],
    image: `${CMS}/cs_kha_kim_beauty_4583cff848.png`,
    category: "my-pham",
    listing: {
      brand: "Khả Kim Beauty",
      industry: "Mỹ phẩm",
      headline:
        "Tái cấu trúc nhân sự hậu Covid - Khả Kim Beauty tiết kiệm chi phí và đánh giá lại chức năng nhiệm vụ từng vị trí với Light Human.",
      tags: ["Tư vấn cơ cấu nhân sự", "Tối ưu payroll"],
    },
    quote: {
      text: "Trải qua mùa Covid, Khả Kim Beauty phải thực hiện tái cấu trúc nhân sự và điều chỉnh chức năng từng vị trí. Light Human đã đồng hành cùng chúng tôi tối ưu chi phí và xây dựng lại đội ngũ vững mạnh hơn trước.",
      name: "Mr. Thành",
      role: "CMO, Khả Kim Beauty",
    },
  },
  {
    slug: "tan-hiep-phat",
    brand: "Tân Hiệp Phát",
    industry: "FMCG / Giải khát",
    headline: "Bổ sung kịp thời nhân sự chuyên môn cho Tahefa Corp với chi phí phù hợp.",
    tags: ["Tuyển dụng chuyên môn"],
    image: `${CMS}/cs_tan_hiep_phat_4888a599fc.png`,
    category: "san-xuat",
    listing: {
      brand: "Tân Hiệp Phát (Tahefa Corp)",
      industry: "Sản xuất",
      headline: "Bổ sung kịp thời nhân sự chuyên môn cho Tahefa Corp với chi phí phù hợp - dịch vụ tuyển dụng chuyên sâu.",
      tags: ["Tuyển dụng chuyên môn"],
    },
    quote: {
      text: "Công ty của chúng tôi đang sử dụng dịch vụ tuyển dụng nhân sự chuyên môn của Light Human và rất hài lòng với chất lượng ứng viên cũng như tốc độ phản hồi của đội ngũ.",
      name: "Mr. Huy",
      role: "Giám Đốc, CTCP SX - TMCN Tân Hiệp Phát",
    },
  },
  {
    slug: "canawan",
    brand: "Canawan",
    industry: "Marketing / Truyền thông",
    headline: "Trụ sở Singapore mở văn phòng tại Việt Nam - Light Human đáp ứng nhu cầu nhân sự cross-border.",
    tags: ["Executive Search", "Mass Hiring"],
    image: `${CMS}/cs_canawan_52c2c825eb.png`,
    category: "marketing",
    listing: {
      brand: "Canawan",
      industry: "Marketing / Truyền thông",
      headline: "Trụ sở tại Singapore mở văn phòng ở Việt Nam - Light Human đáp ứng nhu cầu nhân sự cross-border.",
      tags: ["Executive Search", "Mass Hiring"],
    },
    quote: {
      text: "Canawan hoạt động trong lĩnh vực truyền thông - Marketing, trụ sở chính tại Singapore. Light Human đã đáp ứng tốt nhu cầu nhân sự cross-border khi chúng tôi mở văn phòng tại Việt Nam.",
      name: "Mr. Thanh",
      role: "Founder, Canawan",
    },
  },
  {
    slug: "pg-ung-vien",
    brand: "P&G (ứng viên)",
    industry: "FMCG",
    headline: "Lưu Tuyết Hoa - kỹ thuật viên vận hành máy được kết nối với công việc yêu thích tại P&G.",
    tags: ["Career Coaching"],
    image: `${CMS}/cs_pg_operator_849ec8d77f.png`,
    category: "fmcg",
    listing: {
      brand: "P&G - Lưu Tuyết Hoa",
      industry: "FMCG",
      headline: "Kỹ thuật viên vận hành máy được kết nối với công việc yêu thích tại P&G nhờ đội ngũ tư vấn của Light Human.",
      tags: ["Career Coaching"],
    },
    quote: {
      text: "Em gửi lời cảm ơn chân thành tới team Light Human đã hỗ trợ em suốt thời gian tìm việc, kết nối em với công việc kỹ thuật vận hành máy tại P&G - đúng chuyên môn và phù hợp với mong muốn.",
      name: "Lưu Tuyết Hoa",
      role: "Kỹ thuật viên vận hành máy, P&G",
    },
  },
  {
    slug: "dh-nguyen-tat-thanh",
    brand: "ĐH Nguyễn Tất Thành",
    industry: "Giáo dục",
    headline: "Sinh viên năm 3 tìm được công việc part-time tại công ty F&B nhờ đội ngũ tư vấn của Light Human.",
    tags: ["Hướng nghiệp"],
    image: `${CMS}/cs_student_fnb_3ba2ed39d8.png`,
    category: "giao-duc",
    listing: {
      brand: "ĐH Nguyễn Tất Thành - Nguyễn Thiên Nhiên",
      industry: "Giáo dục",
      headline: "Sinh viên năm 3 tìm được công việc part-time tại công ty F&B nhờ đội ngũ tư vấn của Light Human.",
      tags: ["Hướng nghiệp"],
    },
    quote: {
      text: "Em vẫn chưa hoàn thành việc học tại trường, nhưng em đã có một công việc part-time đúng định hướng nhờ đội ngũ tư vấn của Light Human. Trải nghiệm rất tận tâm và thực tế.",
      name: "Nguyễn Thiên Nhiên",
      role: "Sinh viên năm 3, ĐH Nguyễn Tất Thành",
    },
  },
];
