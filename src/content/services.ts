/**
 * Trang Dịch vụ (/dich-vu) và 6 trang chi tiết (/dich-vu/[slug]) — nội dung lấy nguyên từ lighthuman.vn.
 * Chuỗi "rich" dùng *dấu sao* để đánh dấu phần chữ nghiêng (<em>), giống alt ảnh hero của site gốc.
 * Ký tự xuống dòng "\n" trong tiêu đề được giữ nguyên (CSS gốc dùng white-space: pre-line).
 */
import { CMS } from "./site";

export type ServiceIcon =
  | "award"
  | "briefcase"
  | "check"
  | "clipboard-check"
  | "clock"
  | "compass"
  | "crown"
  | "globe"
  | "graduation-cap"
  | "handshake"
  | "play"
  | "search"
  | "shield-check"
  | "sparkles"
  | "sprout"
  | "target"
  | "users"
  | "users-round";

export type IconItem = { icon: ServiceIcon; title: string; desc: string };
export type CaseItem = { brand: string; industry: string; headline: string; image: string };
export type FaqItem = { q: string; a: string };

export type ServiceHeroData = {
  eyebrow: string;
  /** Rich text (*em*). */
  title: string;
  lede: string;
  image: string;
  cta?: string;
  split?: boolean;
};

export type ProcessData = {
  eyebrow: string;
  title?: string;
  lede?: string;
  dark: boolean;
  steps: IconItem[];
};

export type CtaBandData = { title: string; desc: string; label: string };

export type Service = {
  slug: string;
  /** Tên dịch vụ (thẻ ở trang Dịch vụ, tiêu đề trang). */
  name: string;
  /** Mô tả ngắn trên thẻ ở trang Dịch vụ. */
  summary: string;
  icon: ServiceIcon;
  image: string;
  /** Mô tả cho thẻ meta. */
  description: string;
  hero: ServiceHeroData;
  /** Dải logo "Khách hàng tiêu biểu" ngay sau hero. */
  partners: boolean;
  scope?: { eyebrow: string; title: string; items: IconItem[] };
  features: { eyebrow: string; title: string; lede: string; items: IconItem[] };
  process: ProcessData;
  cases: { eyebrow: string; title: string; linkLabel: string; items: CaseItem[] };
  faq: { helper?: { text: string; linkLabel: string }; items: FaqItem[] };
  cta: CtaBandData;
  /** Trang "cấp cao" đặt dải CTA trước FAQ; các trang khác đặt sau. */
  ctaBeforeFaq?: boolean;
};

const img = (file: string) => `${CMS}/${file}`;

const faqHelperDefault = { text: "Không tìm thấy câu trả lời bạn cần?", linkLabel: "Liên hệ đội ngũ tư vấn →" };

export const services: Service[] = [
  {
    slug: "tuyen-dung-nhan-su-cao-cap",
    name: "Tuyển dụng nhân sự cấp cao",
    summary:
      "Tìm kiếm những người phù hợp với văn hóa, giá trị và tầm nhìn dài hạn của doanh nghiệp bạn. Mạng lưới 5.000+ profile manager đến C-level.",
    icon: "crown",
    image: img("01_executive_search_1489950848.png"),
    description:
      "Light Human giúp doanh nghiệp tìm đúng nhân sự cấp cao thông qua mạng lưới 5.000+ profile manager đến C-level, quy trình chuẩn hóa và chuyên gia headhunting nhiều kinh nghiệm.",
    hero: {
      eyebrow: "Tuyển dụng nhân sự cấp cao",
      title: "Headhunting không còn là gánh nặng",
      lede: "Light Human giúp doanh nghiệp tìm đúng nhân sự cấp cao thông qua mạng lưới 5.000+ profile manager đến C-level, quy trình chuẩn hóa và chuyên gia headhunting nhiều kinh nghiệm.",
      image: img("01_executive_search_1489950848.png"),
      cta: "Nhận tư vấn",
    },
    partners: true,
    features: {
      eyebrow: "Vì sao chọn Light Human?",
      title: "Năng lực *khác biệt* Tạo nên giá trị *vượt trội*",
      lede: "Chúng tôi kết hợp chuyên môn sâu rộng với dữ liệu thị trường toàn diện.",
      items: [
        {
          icon: "search",
          title: "Chuyên gia tuyển dụng chuyên sâu",
          desc: "Đội ngũ tư vấn giàu kinh nghiệm, am hiểu ngành và vị trí cấp cao.",
        },
        {
          icon: "users-round",
          title: "Mạng lưới ứng viên chất lượng",
          desc: "Tiếp cận ứng viên thụ động thông qua mạng lưới rộng khắp trong và ngoài nước.",
        },
        {
          icon: "clipboard-check",
          title: "Quy trình bài bản",
          desc: "Phương pháp tìm kiếm và đánh giá ứng viên khoa học, chặt chẽ.",
        },
        {
          icon: "shield-check",
          title: "Cam kết đồng hành đến khi thành công",
          desc: "Theo sát và hỗ trợ cả ứng viên và doanh nghiệp trong suốt quá trình.",
        },
      ],
    },
    process: {
      eyebrow: "Quy trình tuyển dụng nhân sự cao cấp",
      lede: "Quy trình 6 bước giúp chúng tôi tìm kiếm và thu hút đúng nhân tài cho doanh nghiệp.",
      dark: false,
      steps: [
        {
          icon: "compass",
          title: "Tiếp nhận yêu cầu và phân tích vị trí",
          desc: "Hiểu rõ nhu cầu, văn hoá và mục tiêu của doanh nghiệp.",
        },
        {
          icon: "search",
          title: "Nghiên cứu thị trường và lập kế hoạch",
          desc: "Phân tích thị trường, xác định chân dung ứng viên phù hợp.",
        },
        {
          icon: "target",
          title: "Tìm kiếm và tiếp cận ứng viên",
          desc: "Chủ động tiếp cận ứng viên tiềm năng thông qua mạng lưới và kênh chuyên biệt.",
        },
        {
          icon: "clipboard-check",
          title: "Đánh giá và sàng lọc",
          desc: "Đánh giá năng lực chuyên môn, kỹ năng lãnh đạo và sự phù hợp văn hoá.",
        },
        {
          icon: "users",
          title: "Giới thiệu ứng viên và hỗ trợ phỏng vấn",
          desc: "Giới thiệu ứng viên phù hợp và đồng hành trong quá trình phỏng vấn.",
        },
        {
          icon: "check",
          title: "Theo dõi và đảm bảo thành công",
          desc: "Hỗ trợ ứng viên hoà nhập và theo dõi sau khi nhận việc.",
        },
      ],
    },
    cases: {
      eyebrow: "Case Studies",
      title: "Dự án tuyển dụng *tiêu biểu*",
      linkLabel: "Xem tất cả case studies",
      items: [
        {
          brand: "Ngân hàng TMCP",
          industry: "Ngân hàng",
          headline: "Tuyển dụng Giám đốc Khối Ngân hàng số cho một ngân hàng TMCP hàng đầu Việt Nam.",
          image: img("download_8dfb9c65cf.jpeg"),
        },
        {
          brand: "Tập đoàn sản xuất",
          industry: "Sản xuất",
          headline: "Tuyển dụng Tổng Giám đốc dẫn dắt tái cấu trúc và mở rộng thị trường quốc tế.",
          image: img("download_41a86d2e70.jpeg"),
        },
        {
          brand: "Chuỗi bán lẻ",
          industry: "Bán lẻ",
          headline: "Tuyển dụng Giám đốc Chuỗi cung ứng tối ưu vận hành và quản trị chuỗi cung ứng toàn cầu.",
          image: img("download_bd1cb79223.jpeg"),
        },
      ],
    },
    faq: {
      items: [
        {
          q: "Light Human có thể tuyển những vị trí cấp cao nào?",
          a: "Chúng tôi tuyển các vị trí từ Giám đốc Bộ phận, Tổng Giám đốc, đến C-level và thành viên Hội đồng Quản trị, trong các ngành Tài chính, Bán lẻ, Sản xuất, Công nghệ, Bất động sản và FMCG.",
        },
        {
          q: "Thời gian trung bình để tuyển được một vị trí là bao lâu?",
          a: "Trung bình 6-10 tuần đối với vị trí cấp Giám đốc và 10-14 tuần đối với vị trí C-level, tuỳ vào độ khó và yêu cầu chuyên biệt.",
        },
        {
          q: "Chi phí dịch vụ tuyển dụng nhân sự cấp cao được tính như thế nào?",
          a: "Phí dịch vụ thường tính theo % thu nhập năm đầu tiên của ứng viên (retained hoặc contingent), được thoả thuận trước khi triển khai.",
        },
        {
          q: "Doanh nghiệp có được thay thế ứng viên nếu không phù hợp không?",
          a: "Có. Chúng tôi cam kết bảo hành 6 tháng - nếu ứng viên không phù hợp, Light Human sẽ tìm kiếm và thay thế miễn phí.",
        },
        {
          q: "Light Human có hỗ trợ onboarding cho ứng viên không?",
          a: "Có. Chúng tôi đồng hành cùng ứng viên trong 90 ngày đầu để đảm bảo quá trình hoà nhập diễn ra thuận lợi.",
        },
      ],
    },
    cta: {
      title: "Sẵn sàng *tìm kiếm nhân tài lãnh đạo* cho doanh nghiệp?",
      desc: "Đội ngũ chuyên gia của Light Human luôn sẵn sàng đồng hành cùng bạn.",
      label: "Liên hệ tư vấn ngay",
    },
    ctaBeforeFaq: true,
  },
  {
    slug: "tuyen-dung-nhan-su-so-luong-lon",
    name: "Tuyển dụng nhân sự số lượng lớn",
    summary:
      "Giải pháp tuyển dụng quy mô lớn từ 10 đến 1.000+ ứng viên, đáp ứng nhanh chóng nhu cầu mở rộng kinh doanh.",
    icon: "users-round",
    image: img("02_mass_hiring_be2b05f192.png"),
    description:
      "Giải pháp tuyển dụng quy mô lớn từ 10 đến 1.000+ ứng viên - nhanh chóng, chất lượng đồng đều, và tối ưu chi phí.",
    hero: {
      eyebrow: "Mass Recruitment",
      title: "Khi *quy mô* mới là *thử thách*",
      lede: "Giải pháp tuyển dụng quy mô lớn từ 10 đến 1.000+ ứng viên - nhanh chóng, chất lượng đồng đều, và tối ưu chi phí.",
      image: img("02_mass_hiring_be2b05f192.png"),
      cta: "Nhận lộ trình chi tiết",
    },
    partners: true,
    scope: {
      eyebrow: "Phạm vi",
      title: "Light Human Mass Hiring bao gồm",
      items: [
        {
          icon: "users-round",
          title: "Quy mô 10 - 1.000+ vị trí",
          desc: "Từ intern đến chuyên viên, đáp ứng nhiều cấp độ và chức danh cùng lúc.",
        },
        {
          icon: "shield-check",
          title: "Chất lượng đồng đều",
          desc: "Không chỉ tuyển số lượng - chúng tôi đảm bảo chất lượng nhất quán cho từng ứng viên.",
        },
        {
          icon: "clipboard-check",
          title: "Đánh giá toàn diện",
          desc: "Skill, mindset và cultural fit - phù hợp team và văn hóa doanh nghiệp.",
        },
        {
          icon: "globe",
          title: "Đăng tin đa kênh",
          desc: "Phân phối tin tuyển dụng trên nhiều nền tảng để tối đa tiếp cận.",
        },
        {
          icon: "clock",
          title: "Linh hoạt timeline",
          desc: "Tư vấn nhanh + lộ trình chi tiết miễn phí cho kế hoạch mở rộng đội ngũ.",
        },
      ],
    },
    features: {
      eyebrow: "Vì sao chọn Light Human?",
      title: "Tốc độ và chất lượng\nKhông phải đánh đổi",
      lede: "Chúng tôi vận hành mass hiring như một dự án - có recruiter chuyên trách, báo cáo realtime và công cụ chuyên dụng.",
      items: [
        {
          icon: "users-round",
          title: "Recruiter chuyên trách",
          desc: "Mỗi dự án có 1 PM + đội recruiter dành riêng, không chia sẻ pipeline với khách khác.",
        },
        {
          icon: "award",
          title: "Báo cáo realtime",
          desc: "Dashboard tiến độ tuyển dụng, funnel ứng viên, SLA từng giai đoạn - cập nhật theo ngày.",
        },
        {
          icon: "target",
          title: "Tích hợp ATS doanh nghiệp",
          desc: "Đẩy ứng viên trực tiếp vào ATS hoặc hệ thống HRIS hiện hữu - không phát sinh thao tác thủ công.",
        },
        {
          icon: "shield-check",
          title: "Cam kết SLA rõ ràng",
          desc: "Cam kết bằng văn bản về số lượng CV/tuần, tỷ lệ phỏng vấn và thời gian close mỗi vị trí.",
        },
      ],
    },
    process: {
      eyebrow: "Quy trình",
      title: "8 bước *Mass Hiring*",
      dark: true,
      steps: [
        { icon: "clipboard-check", title: "Tiếp nhận", desc: "Ghi nhận số lượng vị trí, tiêu đề và deadline" },
        { icon: "search", title: "Phân tích", desc: "Xác định đặc tính dự án và chân dung ứng viên" },
        { icon: "target", title: "Lập kế hoạch", desc: "Timeline chia giai đoạn có dự phòng" },
        { icon: "play", title: "Đăng tin đa kênh", desc: "Phân phối tin tuyển dụng rộng rãi" },
        { icon: "sparkles", title: "Sàng lọc hồ sơ", desc: "Shortlist nhanh theo tiêu chí" },
        { icon: "users", title: "Phỏng vấn tập trung", desc: "Tối ưu quy trình phỏng vấn" },
        { icon: "award", title: "Danh sách cuối cùng", desc: "Hoàn thiện roster ứng viên" },
        { icon: "handshake", title: "Bàn giao", desc: "Handoff cho khách hàng" },
      ],
    },
    cases: {
      eyebrow: "Case Studies",
      title: "Dự án mass hiring tiêu biểu",
      linkLabel: "Xem tất cả case studies",
      items: [
        {
          brand: "Chuỗi bán lẻ",
          industry: "Bán lẻ",
          headline: "Tuyển 350 nhân viên cửa hàng cho 60 điểm bán mới trong 75 ngày.",
          image: img("industry_retail_31799ec687.png"),
        },
        {
          brand: "Trung tâm BPO",
          industry: "Dịch vụ",
          headline: "Tuyển 500+ tổng đài viên tiếng Anh - Việt trong 90 ngày, đạt 92% offer-accept.",
          image: img("industry_services_63961c2cc0.png"),
        },
        {
          brand: "Nhà máy FMCG",
          industry: "Sản xuất",
          headline: "Tuyển 1.000+ công nhân vận hành cho dây chuyền mới - bàn giao đúng tiến độ go-live.",
          image: img("industry_manufacturing_e0751552a1.png"),
        },
      ],
    },
    faq: {
      helper: faqHelperDefault,
      items: [
        {
          q: "Mass hiring nhanh nhất bao lâu thì có ứng viên đầu tiên?",
          a: "Trong vòng 5-7 ngày làm việc kể từ khi chốt yêu cầu, doanh nghiệp đã có shortlist ứng viên đầu tiên để phỏng vấn.",
        },
        {
          q: "Light Human đảm bảo chất lượng ứng viên ở quy mô lớn như thế nào?",
          a: "Mọi ứng viên đều qua sàng lọc 2 lớp (recruiter + chuyên gia ngành) và bài đánh giá năng lực chuẩn hoá theo nhóm vị trí - không hạ chuẩn dù chạy số lượng lớn.",
        },
        {
          q: "Chi phí mass hiring được tính như thế nào?",
          a: "Phí theo gói (per-head hoặc per-project) tùy quy mô và độ khó vị trí - báo giá chi tiết sau buổi tư vấn đầu tiên, không phát sinh phí ẩn.",
        },
        {
          q: "Có chính sách bảo hành ứng viên không?",
          a: "Có. Bảo hành 60 ngày cho mỗi ứng viên - nếu nghỉ việc trong thời gian này, Light Human thay thế miễn phí.",
        },
        {
          q: "Doanh nghiệp theo dõi tiến độ dự án ở đâu?",
          a: "Mỗi dự án có dashboard riêng (cập nhật hàng ngày) + báo cáo tuần với PM dự án - minh bạch ở từng giai đoạn của funnel.",
        },
      ],
    },
    cta: {
      title: "Sẵn sàng *mở rộng* đội ngũ?",
      desc: "Để lại thông tin - nhận ngay lộ trình chi tiết cho kế hoạch tuyển dụng số lượng lớn.",
      label: "Liên hệ ngay",
    },
  },
  {
    slug: "tuyen-dung-nhan-su-tam-thoi",
    name: "Tuyển dụng nhân sự tạm thời",
    summary:
      "Cung ứng nhân sự linh hoạt, chất lượng cao cho các dự án ngắn hạn hoặc mùa cao điểm - tối ưu chi phí.",
    icon: "clock",
    image: img("07_temp_staffing_6ecce3b3bd.png"),
    description:
      "Hỗ trợ doanh nghiệp nhanh chóng tìm kiếm nhân sự tạm thời cho mùa cao điểm, dự án ngắn hạn hoặc thay thế vị trí thai sản - tối ưu chi phí và duy trì hiệu quả vận hành.",
    hero: {
      eyebrow: "Tuyển dụng tạm thời",
      title: "Nhân sự *tạm thời* - đúng người, đúng *lúc*",
      lede: "Hỗ trợ doanh nghiệp nhanh chóng tìm kiếm nhân sự tạm thời cho mùa cao điểm, dự án ngắn hạn hoặc thay thế vị trí thai sản - tối ưu chi phí và duy trì hiệu quả vận hành.",
      image: img("07_temp_staffing_6ecce3b3bd.png"),
      cta: "Nhận tư vấn",
    },
    partners: true,
    scope: {
      eyebrow: "Phạm vi",
      title: "Dịch vụ nhân sự tạm thời bao gồm",
      items: [
        { icon: "clock", title: "Mùa cao điểm", desc: "Bổ sung nhân sự cho mùa sale, lễ tết hoặc các chiến dịch ngắn hạn." },
        {
          icon: "users",
          title: "Thay thế vị trí",
          desc: "Thay thế nhân sự nghỉ thai sản, nghỉ phép dài hoặc trong quá trình tuyển chính thức.",
        },
        { icon: "briefcase", title: "Dự án ngắn hạn", desc: "Chuyên gia, cộng tác viên cho từng giai đoạn dự án cụ thể." },
        {
          icon: "shield-check",
          title: "Quản lý lương & bảo hiểm",
          desc: "Light Human đảm nhận hợp đồng và chi trả - doanh nghiệp tập trung vào công việc.",
        },
      ],
    },
    features: {
      eyebrow: "Vì sao chọn Light Human?",
      title: "Nguồn ứng viên sẵn có\nGiao nhân sự trong 72 giờ",
      lede: "Light Human duy trì nguồn ứng viên sẵn có cho các vị trí tạm - doanh nghiệp không phải chờ chu kỳ tuyển dụng truyền thống.",
      items: [
        {
          icon: "play",
          title: "Nguồn ứng viên đã sàng lọc sẵn",
          desc: "Ứng viên đã được đánh giá trước - gửi danh sách trong 48-72 giờ cho hầu hết vị trí.",
        },
        {
          icon: "shield-check",
          title: "Light Human chịu trách nhiệm hợp đồng",
          desc: "Chúng tôi ký hợp đồng trực tiếp với ứng viên, quản lý lương và bảo hiểm - doanh nghiệp chỉ trả phí dịch vụ.",
        },
        {
          icon: "globe",
          title: "Linh hoạt điều chỉnh quy mô",
          desc: "Tăng hoặc giảm số lượng nhân sự tạm theo nhu cầu thực - không bị ràng buộc quyết định dài hạn.",
        },
        {
          icon: "handshake",
          title: "Chuyển sang chính thức",
          desc: "Nếu ứng viên tạm phù hợp, doanh nghiệp có quyền chuyển sang hợp đồng chính thức với phí chuyển đổi hợp lý.",
        },
      ],
    },
    process: {
      eyebrow: "Quy trình",
      title: "5 bước triển khai",
      dark: true,
      steps: [
        { icon: "target", title: "Xác định nhu cầu", desc: "Số lượng, kỹ năng và thời gian cần" },
        { icon: "search", title: "Kích hoạt nguồn ứng viên", desc: "Tiếp cận nguồn ứng viên sẵn có" },
        { icon: "sparkles", title: "Sàng lọc nhanh", desc: "Danh sách ngắn trong 48-72 giờ" },
        { icon: "handshake", title: "Triển khai", desc: "Light Human quản lý hợp đồng và hội nhập" },
        { icon: "shield-check", title: "Bàn giao & hỗ trợ", desc: "Hỗ trợ liên tục trong suốt thời gian hợp đồng" },
      ],
    },
    cases: {
      eyebrow: "Case Studies",
      title: "Dự án nhân sự tạm thời tiêu biểu",
      linkLabel: "Xem tất cả case studies",
      items: [
        {
          brand: "Thương mại điện tử",
          industry: "Thương mại điện tử",
          headline: "Cung ứng 220 nhân viên kho vận cho chiến dịch 11.11 - bàn giao trong 14 ngày.",
          image: img("industry_ecommerce_9c7c4dda81.png"),
        },
        {
          brand: "Công ty dược",
          industry: "Y tế",
          headline: "Thay thế 18 vị trí nghỉ thai sản + nghỉ phép - duy trì 100% công việc vận hành.",
          image: img("industry_healthcare_b0dd13dd80.png"),
        },
        {
          brand: "Agency sự kiện",
          industry: "Sự kiện",
          headline: "Cung ứng 80 nhân viên sự kiện chuyên nghiệp cho 3 dự án liên tiếp trong quý.",
          image: img("industry_events_cad1b9323b.png"),
        },
      ],
    },
    faq: {
      helper: { text: "Cần nhân sự gấp?", linkLabel: "Liên hệ đội ngũ tư vấn →" },
      items: [
        {
          q: "Nhanh nhất bao lâu thì có ứng viên?",
          a: "48-72 giờ cho hầu hết vị trí cấp nhân viên và chuyên viên - nhờ nguồn ứng viên đã được đánh giá sẵn. Vị trí chuyên gia cấp cao 5-7 ngày.",
        },
        {
          q: "Thời hạn hợp đồng tối đa/tối thiểu?",
          a: "Tối thiểu 1 tháng, tối đa 24 tháng theo luật lao động Việt Nam. Trung bình 3-6 tháng. Có thể gia hạn nếu đúng theo luật.",
        },
        {
          q: "Doanh nghiệp hay Light Human ký hợp đồng với ứng viên?",
          a: "Light Human. Chúng tôi ký hợp đồng và chịu trách nhiệm chi trả lương, bảo hiểm, thuế TNCN - doanh nghiệp chỉ trả phí dịch vụ trọn gói theo tháng.",
        },
        {
          q: "Chuyển từ tạm sang chính thức được không?",
          a: "Được. Sau tối thiểu 3 tháng, doanh nghiệp có thể chuyển sang hợp đồng chính thức với phí chuyển đổi dựa trên lương năm mới (phí giảm dần theo thời gian đã chạy tạm).",
        },
        {
          q: "Chi phí nhân sự tạm thời như thế nào?",
          a: "Tính theo % chi phí lương hàng tháng (phí dịch vụ), đã bao gồm quản lý lương, bảo hiểm bắt buộc và thuế. Báo giá cụ thể sau buổi tư vấn yêu cầu.",
        },
      ],
    },
    cta: {
      title: "Cần *nhân sự gấp*?",
      desc: "Light Human gửi danh sách ứng viên trong 48-72 giờ cho hầu hết vị trí tạm thời.",
      label: "Liên hệ ngay",
    },
  },
  {
    slug: "dao-tao-tuyen-dung",
    name: "Đào tạo tuyển dụng",
    summary: "Nâng cao năng lực đội ngũ HR nội bộ về kỹ năng tìm kiếm, phỏng vấn và thu hút nhân tài hiệu quả.",
    icon: "graduation-cap",
    image: img("04_training_620b2066d4.png"),
    description:
      "Bạn muốn giảm lệ thuộc vào bên ngoài và hạn chế tuyển sai? Light Human đào tạo thực chiến cho đội ngũ HR nội bộ.",
    hero: {
      eyebrow: "Đào tạo tuyển dụng",
      title: "Xây đội ngũ HR *tự chủ* - bớt lệ thuộc *bên ngoài*",
      lede: "Bạn muốn giảm lệ thuộc vào bên ngoài và hạn chế tuyển sai? Light Human đào tạo thực chiến cho đội ngũ HR nội bộ.",
      image: img("04_training_620b2066d4.png"),
      cta: "Nhận tài liệu demo",
    },
    partners: true,
    scope: {
      eyebrow: "Chương trình",
      title: "3 nhóm đào tạo chính",
      items: [
        {
          icon: "play",
          title: "Huấn luyện thực chiến",
          desc: "Chia sẻ kinh nghiệm thực tế, quy trình, công cụ và kỹ năng giúp đội ngũ tự tin xử lý mọi tình huống.",
        },
        {
          icon: "shield-check",
          title: "Chuẩn hóa kỹ năng phỏng vấn",
          desc: "Xây dựng tiêu chuẩn phỏng vấn - đánh giá ứng viên đúng trọng tâm, giảm tỷ lệ tuyển sai.",
        },
        {
          icon: "users-round",
          title: "Chủ động nguồn ứng viên",
          desc: "Kỹ năng xây dựng, khai thác và nuôi dưỡng pipeline ứng viên chất lượng.",
        },
      ],
    },
    features: {
      eyebrow: "Vì sao chọn Light Human?",
      title: "Đào tạo thực chiến\nKhông phải lý thuyết",
      lede: "Giảng viên là chuyên gia headhunting với 6+ năm kinh nghiệm - chương trình thiết kế theo khoảng trống năng lực thực tế của đội HR.",
      items: [
        {
          icon: "users-round",
          title: "Giảng viên là chuyên gia đang hành nghề",
          desc: "Headhunter đang trực tiếp vận hành dự án cấp cao - chia sẻ tình huống cập nhật, không phải lý thuyết sách vở.",
        },
        {
          icon: "target",
          title: "Chương trình thiết kế riêng",
          desc: "Khảo sát năng lực đội HR trước, thiết kế lộ trình theo đúng khoảng trống - không áp khung cứng cho mọi khách.",
        },
        {
          icon: "play",
          title: "Thực hành + tình huống thực",
          desc: "70% thời gian là luyện tập và tình huống thực từ dự án Light Human đã chạy - học xong dùng được ngay.",
        },
        {
          icon: "graduation-cap",
          title: "Cố vấn 30-60 ngày sau khóa",
          desc: "Coaching theo công việc thực tế sau khóa học - đội HR áp dụng vào dự án thật, có chuyên gia review kết quả.",
        },
      ],
    },
    process: {
      eyebrow: "Khung chương trình",
      title: "8 bước đào tạo",
      dark: true,
      steps: [
        { icon: "search", title: "Khảo sát nhu cầu", desc: "Xác định năng lực và khoảng trống của đội ngũ" },
        { icon: "target", title: "Thiết kế chương trình", desc: "Lộ trình phù hợp đặc thù doanh nghiệp" },
        { icon: "clipboard-check", title: "Chuẩn bị tài liệu", desc: "Slide, bài tập và tình huống nghiên cứu" },
        { icon: "graduation-cap", title: "Đào tạo lý thuyết", desc: "Kiến thức nền và phương pháp" },
        { icon: "play", title: "Huấn luyện thực hành", desc: "Luyện tập và đóng vai tình huống" },
        { icon: "award", title: "Đánh giá kết quả", desc: "Kiểm tra và phản hồi" },
        { icon: "handshake", title: "Cố vấn thực tế", desc: "Coaching theo công việc trong 30-60 ngày" },
        { icon: "sprout", title: "Tổng kết & bàn giao", desc: "Báo cáo kết quả và cố vấn tiếp" },
      ],
    },
    cases: {
      eyebrow: "Case Studies",
      title: "Doanh nghiệp đã đào tạo cùng Light Human",
      linkLabel: "Xem tất cả case studies",
      items: [
        {
          brand: "Startup unicorn",
          industry: "Công nghệ",
          headline: "Đào tạo 12 chuyên viên tuyển dụng - giảm 60% chi phí thuê ngoài chỉ trong 6 tháng.",
          image: img("industry_tech_2befd2528e.png"),
        },
        {
          brand: "Tập đoàn sản xuất",
          industry: "Sản xuất",
          headline: "Chuẩn hóa quy trình phỏng vấn cho 8 nhà máy - tỷ lệ tuyển sai giảm từ 22% về 7%.",
          image: img("industry_manufacturing_e0751552a1.png"),
        },
        {
          brand: "Ngân hàng bán lẻ",
          industry: "Tài chính",
          headline: "Xây dựng nguồn ứng viên chủ động - thời gian tuyển trung bình rút ngắn từ 45 xuống 22 ngày.",
          image: img("industry_finance_fcba9116e4.png"),
        },
      ],
    },
    faq: {
      helper: faqHelperDefault,
      items: [
        {
          q: "Một khóa đào tạo kéo dài bao lâu?",
          a: "Tùy gói: khóa cơ bản 3-5 ngày, khóa chuyên sâu 2-3 tuần (kết hợp lý thuyết + thực hành + coaching). Khóa trọn gói xây đội HR từ đầu trung bình 3-6 tháng.",
        },
        {
          q: "Quy mô lớp học bao nhiêu là phù hợp?",
          a: "Hiệu quả nhất là 8-12 người/lớp - đủ để đóng vai tương tác, không quá đông để mất tính cá nhân. Chấp nhận tối đa 20 người.",
        },
        {
          q: "Đào tạo trực tiếp hay trực tuyến?",
          a: "Cả hai. Light Human linh hoạt kết hợp workshop trực tiếp (cho luyện tập và đóng vai) và buổi trực tuyến (cho lý thuyết và review tình huống) - tối ưu thời gian đội ngũ.",
        },
        {
          q: "Sau khóa học, đội HR có tiếp tục được hỗ trợ không?",
          a: "Có. 30-60 ngày coaching theo công việc sau khóa - chuyên gia Light Human review dự án thật, phản hồi và điều chỉnh. Sau đó có gói cố vấn dài hạn nếu doanh nghiệp cần.",
        },
        {
          q: "Chi phí đào tạo được tính thế nào?",
          a: "Theo kích thước lớp và độ chuyên sâu của chương trình. Báo giá chi tiết sau buổi tư vấn tìm hiểu miễn phí (60 phút).",
        },
      ],
    },
    cta: {
      title: "Sẵn sàng *đào tạo* đội ngũ HR?",
      desc: "Nhận bộ tài liệu đào tạo demo miễn phí và tư vấn lộ trình phù hợp.",
      label: "Đăng ký nhận tư vấn",
    },
  },
  {
    slug: "huong-nghiep-va-tu-van-ca-nhan",
    name: "Hướng nghiệp & tư vấn cá nhân",
    summary: "Tư vấn 1:1 giúp cá nhân định hướng và phát triển sự nghiệp, phát huy tối đa tiềm năng bản thân.",
    icon: "compass",
    image: img("05_career_counseling_48fda77e5d.png"),
    description:
      "Tư vấn 1:1 giúp cá nhân định hướng và phát triển sự nghiệp - từ sinh viên mới tốt nghiệp đến những người muốn chuyển hướng.",
    hero: {
      eyebrow: "Hướng nghiệp",
      title: "*Định hướng* sự nghiệp - từng bước *tự tin*",
      lede: "Tư vấn 1:1 giúp cá nhân định hướng và phát triển sự nghiệp - từ sinh viên mới tốt nghiệp đến những người muốn chuyển hướng.",
      image: img("05_career_counseling_48fda77e5d.png"),
      cta: "Đăng ký tư vấn",
    },
    partners: false,
    scope: {
      eyebrow: "Gói dịch vụ",
      title: "Chúng tôi đồng hành cùng bạn",
      items: [
        {
          icon: "compass",
          title: "Định hướng nghề nghiệp",
          desc: "Khám phá điểm mạnh, giá trị và mục tiêu - xây dựng lộ trình phù hợp.",
        },
        {
          icon: "clipboard-check",
          title: "Hoàn thiện hồ sơ",
          desc: "Tối ưu CV, thư xin việc và trang LinkedIn cho từng vị trí mục tiêu.",
        },
        { icon: "users", title: "Luyện phỏng vấn", desc: "Phỏng vấn thử với chuyên gia tuyển dụng - tự tin và ghi điểm." },
        {
          icon: "handshake",
          title: "Kết nối cơ hội",
          desc: "Giới thiệu cơ hội phù hợp từ mạng lưới 2.000+ doanh nghiệp đối tác.",
        },
      ],
    },
    features: {
      eyebrow: "Vì sao chọn Light Human?",
      title: "Góc nhìn từ\nphía nhà tuyển dụng",
      lede: "Chuyên gia của Light Human là những người hàng ngày đánh giá ứng viên - bạn nhận được góc nhìn từ phía đang tuyển, không phải lý thuyết cách xa thực tế.",
      items: [
        {
          icon: "users-round",
          title: "Chuyên gia tuyển dụng thực chiến",
          desc: "Mỗi buổi tư vấn đều với chuyên gia 5+ năm kinh nghiệm tuyển dụng cấp quản lý - hiểu rõ nhà tuyển dụng đang tìm gì.",
        },
        {
          icon: "target",
          title: "Lộ trình 3-5 năm có đích đến",
          desc: "Lộ trình nghề nghiệp dựa trên thị trường nhân sự hiện tại - không mơ mộng, không chung chung.",
        },
        {
          icon: "play",
          title: "Phỏng vấn thử sát thực tế",
          desc: "Câu hỏi và thang đánh giá lấy từ dự án tuyển dụng thật - phản hồi chi tiết theo tiêu chí nhà tuyển dụng.",
        },
        {
          icon: "handshake",
          title: "Kết nối cơ hội thực",
          desc: "Mạng lưới 2.000+ doanh nghiệp - giới thiệu trực tiếp cho HR đã hiểu rõ vị trí, không phải nộp CV ngẫu nhiên.",
        },
      ],
    },
    process: {
      eyebrow: "Quy trình",
      title: "5 buổi tư vấn",
      dark: true,
      steps: [
        { icon: "search", title: "Tìm hiểu bản thân", desc: "Hiểu rõ bản thân, giá trị và mục tiêu" },
        { icon: "target", title: "Lập lộ trình nghề nghiệp", desc: "Lộ trình nghề nghiệp 3-5 năm" },
        { icon: "clipboard-check", title: "Hồ sơ cá nhân", desc: "Tối ưu CV và trang LinkedIn" },
        { icon: "users", title: "Phỏng vấn thử", desc: "Thực hành phỏng vấn và phản hồi" },
        { icon: "handshake", title: "Giới thiệu việc làm", desc: "Kết nối cơ hội phù hợp" },
      ],
    },
    cases: {
      eyebrow: "Câu chuyện cá nhân",
      title: "Họ đã tìm được hướng đi phù hợp",
      linkLabel: "Xem tất cả câu chuyện",
      items: [
        {
          brand: "Chuyên viên Marketing",
          industry: "Chuyển ngành",
          headline:
            "Từ marketing FMCG chuyển sang vị trí growth tại startup công nghệ - nhận offer tăng 35% lương sau 4 tháng tư vấn.",
          image: img("industry_career_switch_6a47cc9805.png"),
        },
        {
          brand: "Sinh viên mới tốt nghiệp",
          industry: "Sinh viên",
          headline: "Tìm được chương trình quản trị viên tập sự đúng ngành - vượt qua 3 vòng tuyển lọc trong 2 tháng.",
          image: img("industry_students_f792a4151d.png"),
        },
        {
          brand: "Quản lý cấp cao",
          industry: "Lãnh đạo cấp trung",
          headline:
            "Chuẩn bị cho bước chuyển lên Giám đốc - được giới thiệu qua executive search và nhận 2 offer từ tập đoàn.",
          image: img("industry_mid_management_7be5ee86a6.png"),
        },
      ],
    },
    faq: {
      helper: { text: "Còn thắc mắc khác?", linkLabel: "Gửi câu hỏi đến chuyên gia →" },
      items: [
        {
          q: "Tư vấn hướng nghiệp khác với dịch vụ tìm việc như thế nào?",
          a: "Tư vấn hướng nghiệp tập trung vào định hướng lâu dài - bạn hiểu điểm mạnh, mục tiêu và lựa chọn hướng phù hợp trước khi tìm việc. Light Human giúp cả hai: xác định đích đến rồi kết nối cơ hội.",
        },
        {
          q: "Bao lâu thì thấy kết quả?",
          a: "Sau 2 buổi tìm hiểu bản thân + lập lộ trình (khoảng 3 tuần) bạn sẽ có lộ trình rõ ràng. Để nhận được offer phù hợp, trung bình 2-4 tháng (tùy cấp độ và độ cạnh tranh của vị trí).",
        },
        {
          q: "Phù hợp với những ai?",
          a: "Sinh viên sắp tốt nghiệp, người muốn chuyển ngành, quản lý cấp trung muốn thăng tiến, hay cấp cao chuẩn bị bước lên vị trí cao hơn. Light Human có chuyên gia phù hợp từng cấp độ.",
        },
        {
          q: "Tư vấn trực tuyến được không?",
          a: "Hoàn toàn trực tuyến qua Zoom hoặc Google Meet. Linh hoạt ngoài giờ làm việc, phù hợp người bận rộn.",
        },
        {
          q: "Chi phí gói tư vấn là bao nhiêu?",
          a: "Gói tìm hiểu miễn phí 30 phút để đánh giá phù hợp. Gói 5 buổi trọn được báo giá sau buổi đầu tiên - tùy cấp độ chuyên gia và dịch vụ kèm theo.",
        },
      ],
    },
    cta: {
      title: "Sẵn sàng *bước tiếp theo* trong sự nghiệp?",
      desc: "Đăng ký buổi tư vấn tìm hiểu miễn phí 30 phút với chuyên gia Light Human.",
      label: "Đăng ký tư vấn",
    },
  },
  {
    slug: "xay-dung-thuong-hieu-tuyen-dung",
    name: "Xây dựng thương hiệu tuyển dụng",
    summary:
      "Tư vấn chiến lược xây dựng hình ảnh nhà tuyển dụng hấp dẫn để thu hút và giữ chân những nhân tài tốt nhất.",
    icon: "sparkles",
    image: img("03_employer_branding_de017b1d9f.png"),
    description:
      "Bạn muốn doanh nghiệp trở thành điểm đến hấp dẫn nhất với các ứng viên chất lượng? Tư vấn chiến lược, thiết kế candidate journey và truyền thông đa kênh đồng bộ.",
    hero: {
      eyebrow: "Employer Branding",
      title: "Trở thành *điểm đến* của nhân tài *chất lượng*",
      lede: "Bạn muốn doanh nghiệp trở thành điểm đến hấp dẫn nhất với các ứng viên chất lượng? Tư vấn chiến lược, thiết kế candidate journey và truyền thông đa kênh đồng bộ.",
      image: img("03_employer_branding_de017b1d9f.png"),
      cta: "Nhận tư vấn",
      split: true,
    },
    partners: true,
    scope: {
      eyebrow: "Thành phần dịch vụ",
      title: "3 trụ cột Employer Branding",
      items: [
        {
          icon: "target",
          title: "Chiến lược thương hiệu",
          desc: "Tư vấn chiến lược xây dựng Employer Branding từ nền tảng - định vị và thông điệp cốt lõi.",
        },
        {
          icon: "compass",
          title: "Candidate Journey",
          desc: "Thiết kế hành trình ứng viên chuyên nghiệp, thân thiện từ điểm chạm đầu tiên đến onboarding.",
        },
        {
          icon: "sparkles",
          title: "Truyền thông & Content",
          desc: "Sáng tạo nội dung truyền thông thu hút, đồng bộ từ website, social, JD đến campaign tuyển dụng.",
        },
      ],
    },
    features: {
      eyebrow: "Vì sao chọn Light Human?",
      title: "EVP rõ ràng\nTruyền thông nhất quán",
      lede: "Chúng tôi không làm marketing rời rạc - mọi điểm chạm từ JD, social, đến onboarding đều cộng dồn vào cùng một câu chuyện thương hiệu.",
      items: [
        {
          icon: "search",
          title: "EVP dựa trên dữ liệu",
          desc: "Khảo sát ứng viên + nhân viên hiện hữu để định vị EVP - không dựa trên cảm tính lãnh đạo.",
        },
        {
          icon: "sparkles",
          title: "Brand book đầy đủ",
          desc: "Bộ nhận diện, tone of voice và content guideline để team nội bộ tự vận hành sau bàn giao.",
        },
        {
          icon: "globe",
          title: "Campaign đa kênh",
          desc: "LinkedIn, Facebook, TikTok, website tuyển dụng và internal comms - kế hoạch và nội dung đồng bộ.",
        },
        {
          icon: "award",
          title: "Đo lường brand health",
          desc: "KPI rõ ràng: traffic, application rate, NPS ứng viên, employer rating - báo cáo định kỳ.",
        },
      ],
    },
    process: {
      eyebrow: "Methodology",
      title: "8 giai đoạn Employer Branding",
      dark: true,
      steps: [
        { icon: "search", title: "Nghiên cứu & phân tích", desc: "Đánh giá hiện trạng thương hiệu tuyển dụng" },
        { icon: "target", title: "Xác định mục tiêu", desc: "Thông điệp cốt lõi và phong cách truyền thông" },
        { icon: "sparkles", title: "Hệ nhận diện", desc: "Slogan, visual và brand guidelines" },
        { icon: "compass", title: "Kế hoạch đa kênh", desc: "Lộ trình truyền thông trên các platform" },
        { icon: "play", title: "Sản xuất content", desc: "Article, video, hình ảnh đồng bộ" },
        { icon: "graduation-cap", title: "Đào tạo nội bộ", desc: "Nâng cao năng lực đội ngũ HR" },
        { icon: "clipboard-check", title: "Đo lường campaign", desc: "Theo dõi và đánh giá hiệu quả" },
        { icon: "sprout", title: "Tối ưu liên tục", desc: "Cải tiến dựa trên dữ liệu" },
      ],
    },
    cases: {
      eyebrow: "Case Studies",
      title: "Dự án Employer Branding tiêu biểu",
      linkLabel: "Xem tất cả case studies",
      items: [
        {
          brand: "Tập đoàn công nghệ",
          industry: "Công nghệ",
          headline: "Tái định vị EVP - tăng 3× lượng ứng viên engineer cấp cao chỉ trong 6 tháng.",
          image: img("industry_tech_2befd2528e.png"),
        },
        {
          brand: "Chuỗi F&B",
          industry: "F&B",
          headline: "Campaign tuyển dụng đa kênh giúp đẩy time-to-hire xuống còn 18 ngày.",
          image: img("industry_fnb_1f1bea02ff.png"),
        },
        {
          brand: "Ngân hàng số",
          industry: "Tài chính",
          headline: "Xây dựng brand book và content engine - application rate tăng 240% sau 1 năm.",
          image: img("industry_finance_fcba9116e4.png"),
        },
      ],
    },
    faq: {
      helper: faqHelperDefault,
      items: [
        {
          q: "Dự án Employer Branding kéo dài bao lâu?",
          a: "Trung bình 3-6 tháng cho gói cơ bản (EVP + brand book + content launch) và 9-12 tháng cho gói toàn diện bao gồm tối ưu liên tục.",
        },
        {
          q: "Doanh nghiệp nhỏ có nên đầu tư Employer Branding?",
          a: "Có. Càng nhỏ càng cần - khi không có ngân sách lớn để cạnh tranh lương, EVP rõ ràng và câu chuyện thương hiệu là lợi thế quan trọng nhất để thu hút ứng viên chất lượng.",
        },
        {
          q: "Sau bàn giao, đội ngũ nội bộ có tự vận hành được không?",
          a: "Có. Brand book, tone of voice và content playbook được thiết kế để team marketing/HR nội bộ tự triển khai. Light Human cũng đào tạo đội ngũ trong giai đoạn launch.",
        },
        {
          q: "Light Human đo lường hiệu quả Employer Branding bằng cách nào?",
          a: "KPI cụ thể: traffic vào trang tuyển dụng, application rate, cost-per-hire, time-to-hire, NPS ứng viên, employer rating trên các platform. Báo cáo định kỳ hàng tháng.",
        },
        {
          q: "Chi phí Employer Branding được tính như thế nào?",
          a: "Phí trọn gói theo phạm vi - báo giá chi tiết sau buổi tư vấn discovery 60 phút (miễn phí). Không phát sinh phí ẩn.",
        },
      ],
    },
    cta: {
      title: "Sẵn sàng *thu hút* nhân tài?",
      desc: "Nhận tư vấn xây dựng thương hiệu tuyển dụng - miễn phí lần đầu.",
      label: "Liên hệ tư vấn",
    },
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

/** Trang danh mục /dich-vu. */
export const servicesPage = {
  title: "Dịch vụ",
  description:
    "Kết nối tài năng với cơ hội hoàn hảo trong thế giới số. Light Human đồng hành cùng doanh nghiệp trong toàn bộ hành trình phát triển nguồn nhân lực.",
  hero: {
    eyebrow: "Dịch vụ",
    title: "Chúng tôi có thể *giúp gì* cho bạn?",
    lede: "Kết nối tài năng với cơ hội hoàn hảo trong thế giới số. Chúng tôi không chỉ ghép đôi CV với JD - chúng tôi tạo ra những kết nối có ý nghĩa thay đổi cuộc đời và doanh nghiệp.",
    image: img("hero_services_d63db67f3f.png"),
  } satisfies ServiceHeroData,
  grid: {
    eyebrow: "DANH MỤC DỊCH VỤ",
    title: "Các *dịch vụ* nổi bật",
    lede: "Light Human đồng hành cùng doanh nghiệp trong toàn bộ hành trình phát triển nguồn nhân lực - từ chiến lược, tuyển dụng đến phát triển tài năng và tối ưu tổ chức.",
    linkLabel: "Liên hệ tư vấn",
    linkHref: "/lien-he",
  },
  process: {
    eyebrow: "Quy trình",
    title: "6 bước Light Human đồng hành",
    dark: true,
    steps: [
      { icon: "users", title: "Lắng nghe & thấu hiểu", desc: "Nắm bắt trọn vẹn nhu cầu, mục tiêu cốt lõi" },
      { icon: "search", title: "Phân tích chuyên sâu", desc: "Đánh giá đặc thù ngành và đội ngũ hiện tại" },
      { icon: "target", title: "Xây dựng giải pháp", desc: "Thiết kế giải pháp “may đo” tối ưu" },
      { icon: "handshake", title: "Triển khai & đồng hành", desc: "Cùng bạn triển khai, đảm bảo hiệu quả" },
      { icon: "clipboard-check", title: "Đo lường & đánh giá", desc: "Theo dõi KPIs, đánh giá minh bạch" },
      { icon: "sprout", title: "Tối ưu & phát triển", desc: "Liên tục cải tiến và phát triển bền vững" },
    ],
  } satisfies ProcessData,
  cta: {
    title: "*Liên hệ* ngay hôm nay",
    desc: "Nhận tư vấn miễn phí về giải pháp nhân sự phù hợp với doanh nghiệp của bạn.",
    label: "Liên hệ tư vấn",
  } satisfies CtaBandData,
};
