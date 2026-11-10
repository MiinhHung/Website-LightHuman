/**
 * Nội dung bộ công cụ Light Human Toolkit (/cong-cu). Văn bản do Light Human biên soạn.
 * Ảnh hero lấy từ thư viện CMS blog.lighthuman.vn — muốn đổi ảnh riêng, tải ảnh mới
 * lên CMS rồi thay tên file ở đây.
 */

import { CMS } from "./site";

export type ToolCard = {
  slug: string;
  name: string;
  desc: string;
  tag: string;
  forWho: string;
};

export const tools: ToolCard[] = [
  {
    slug: "tinh-luong-gross-net",
    name: "Tính lương Gross ⇄ Net 2026",
    desc: "Quy đổi hai chiều theo biểu thuế 5 bậc mới, kèm bảng chi phí doanh nghiệp và so sánh hai offer.",
    tag: "Lương & thuế",
    forWho: "Ứng viên · HR · Headhunter",
  },
  {
    slug: "tinh-lai-kep",
    name: "Tính lãi kép & lợi nhuận đầu tư",
    desc: "Dự báo giá trị tiền gửi, khoản đầu tư theo thời gian — biểu đồ tăng trưởng, bảng từng năm và công thức điền sẵn số của bạn.",
    tag: "Tài chính cá nhân",
    forWho: "Người đi làm · Nhà đầu tư cá nhân",
  },
];

export const toolsHub = {
  eyebrow: "Light Human Toolkit",
  title: "Công cụ nhân sự",
  titleEm: "miễn phí",
  lede: "Những công cụ đội ngũ tư vấn Light Human dùng hằng ngày khi chốt offer và tư vấn lương — nay mở cho ứng viên và doanh nghiệp.",
  image: {
    src: `${CMS}/hero_insights_d1c022601d.png`,
    alt: "Bàn làm việc với sổ tay, máy tính bảng hiển thị biểu đồ và tách cà phê",
  },
  badge: { title: "Miễn phí · Không cần đăng nhập", body: "Cập nhật theo quy định lương, thuế mới nhất 2026" },
  suggest: {
    title: "Bạn cần một công cụ khác?",
    body: "Gợi ý cho chúng tôi công cụ bạn muốn có — tính BHXH một lần, trợ cấp thôi việc, lương tháng 13…",
    cta: "Gửi đề xuất",
  },
};

export const salaryTool = {
  title: "Tính lương Gross sang Net và ngược lại 2026",
  description:
    "Công cụ tính lương Gross ⇄ Net chuẩn 2026 của Light Human: biểu thuế TNCN 5 bậc, giảm trừ gia cảnh 15,5 triệu, lương cơ sở 2,53 triệu. Có chi phí doanh nghiệp và so sánh offer.",
  hero: {
    eyebrow: "Light Human Toolkit · Lương & thuế",
    lede: "Quy đổi lương hai chiều trong vài giây, xem rõ từng khoản bảo hiểm, thuế và tổng chi phí doanh nghiệp — dữ liệu cập nhật theo quy định mới nhất.",
    image: {
      src: `${CMS}/hero_case_studies_f56ba15689.png`,
      alt: "Chuyên viên tư vấn rà soát bảng số liệu và biểu đồ tài chính",
    },
    /** Ví dụ hiển thị trên thẻ "phiếu lương" nổi — số được tính bằng chính công cụ. */
    sampleGross: 30_000_000,
    facts: [
      { value: "15,5 tr", label: "Giảm trừ bản thân / tháng" },
      { value: "6,2 tr", label: "Mỗi người phụ thuộc" },
      { value: "5 bậc", label: "Biểu thuế lũy tiến mới" },
      { value: "2,53 tr", label: "Lương cơ sở từ 01/07/2026" },
    ],
  },
  presets: [15_000_000, 25_000_000, 40_000_000, 60_000_000, 100_000_000],
  steps: [
    {
      n: "01",
      title: "Trừ bảo hiểm bắt buộc",
      body: "Người lao động đóng 10,5% trên lương đóng bảo hiểm: BHXH 8%, BHYT 1,5%, BHTN 1%. BHXH và BHYT tối đa trên 20 lần lương cơ sở (50,6 triệu); BHTN tối đa 20 lần lương tối thiểu vùng.",
    },
    {
      n: "02",
      title: "Trừ giảm trừ gia cảnh",
      body: "Lấy thu nhập trước thuế trừ 15,5 triệu cho bản thân và 6,2 triệu cho mỗi người phụ thuộc đã đăng ký. Phần còn lại là thu nhập tính thuế.",
    },
    {
      n: "03",
      title: "Áp biểu thuế 5 bậc",
      body: "Thu nhập tính thuế được chia theo từng bậc 5% → 35%. Lương Net = thu nhập trước thuế − thuế TNCN.",
    },
  ],
  advice: {
    eyebrow: "Góc tư vấn từ headhunter",
    title: "Nên chốt offer theo",
    titleEm: "Gross hay Net?",
    paragraphs: [
      "Với vị trí quản lý và chuyên gia, Light Human luôn khuyến nghị ghi lương Gross trong thư mời nhận việc. Gross là con số pháp lý trong hợp đồng, là căn cứ tính bảo hiểm, thưởng, lương tháng 13 và các chế độ khi nghỉ việc.",
      "Nếu ứng viên quen thương lượng theo Net, hãy quy đổi sang Gross và ghi rõ hai điều: mức lương đóng bảo hiểm và số người phụ thuộc giả định. Cùng một mức Net, chỉ cần khác mức đóng bảo hiểm là Gross — và tổng chi phí doanh nghiệp — đã chênh nhau hàng triệu đồng mỗi tháng.",
    ],
    checklist: [
      "Ghi rõ Gross hay Net trong thư mời",
      "Thống nhất mức lương đóng bảo hiểm",
      "Tách phụ cấp, thưởng khỏi lương cơ bản",
      "Kiểm tra lại tổng chi phí doanh nghiệp",
    ],
  },
  faqHead: {
    eyebrow: "FAQ",
    helper: "Cần tư vấn cơ cấu lương cho vị trí đang tuyển?",
    helperLink: "Trao đổi với Light Human",
  },
  faqs: [
    {
      q: "Lương Gross và lương Net khác nhau thế nào?",
      a: "Gross là tổng lương ghi trong hợp đồng, trước khi trừ bảo hiểm bắt buộc và thuế thu nhập cá nhân. Net là số tiền thực nhận về tài khoản sau khi đã trừ các khoản đó. Chênh lệch giữa hai con số phụ thuộc mức lương đóng bảo hiểm, số người phụ thuộc và bậc thuế bạn rơi vào.",
    },
    {
      q: "Thu nhập bao nhiêu thì bắt đầu phải nộp thuế TNCN năm 2026?",
      a: "Nếu đóng bảo hiểm trên toàn bộ lương và không có người phụ thuộc, lương Gross khoảng 17,32 triệu đồng/tháng trở xuống chưa phải nộp thuế. Có 1 người phụ thuộc thì ngưỡng này khoảng 24,25 triệu đồng/tháng.",
    },
    {
      q: "Mức trần đóng bảo hiểm năm 2026 là bao nhiêu?",
      a: "BHXH và BHYT tính tối đa trên 20 lần lương cơ sở, tức 50.600.000 đồng/tháng từ 01/07/2026. BHTN tính tối đa trên 20 lần lương tối thiểu vùng, ví dụ vùng I là 106.200.000 đồng/tháng. Vượt mức trần, phần bảo hiểm không tăng thêm nên tỉ lệ Net/Gross của người lương cao sẽ khác người lương trung bình.",
    },
    {
      q: "Vì sao cùng một mức Net mà mỗi công ty báo Gross khác nhau?",
      a: "Do mức lương đóng bảo hiểm khác nhau. Có doanh nghiệp đóng trên toàn bộ lương, có doanh nghiệp chỉ đóng trên lương cơ bản thấp hơn. Bạn có thể chọn \"Mức khác\" ở ô Lương đóng bảo hiểm để thấy ngay sự chênh lệch.",
    },
    {
      q: "Người phụ thuộc được tính như thế nào?",
      a: "Người phụ thuộc chỉ được giảm trừ khi đã đăng ký với cơ quan thuế (thường qua doanh nghiệp chi trả thu nhập) và đáp ứng điều kiện theo quy định, ví dụ con chưa thành niên, cha mẹ hoặc vợ/chồng không có khả năng lao động hay không có thu nhập vượt mức quy định. Mỗi người phụ thuộc được giảm trừ 6,2 triệu đồng/tháng.",
    },
    {
      q: "Doanh nghiệp phải trả tổng cộng bao nhiêu cho một nhân sự?",
      a: "Ngoài lương Gross, doanh nghiệp đóng thêm BHXH 17%, quỹ tai nạn lao động – bệnh nghề nghiệp 0,5%, BHYT 3% và BHTN 1% trên lương đóng bảo hiểm (cùng mức trần như trên). Bảng \"Doanh nghiệp chi trả\" trong công cụ hiển thị đầy đủ con số này — hữu ích khi lập ngân sách tuyển dụng.",
    },
    {
      q: "Kết quả có dùng để quyết toán thuế được không?",
      a: "Kết quả chỉ mang tính tham khảo cho cá nhân cư trú có thu nhập từ một nơi. Công cụ chưa tính các khoản phụ cấp được miễn thuế (ăn ca, trang phục…), thưởng, thu nhập từ nơi khác hay trường hợp cá nhân không cư trú (thuế suất 20%). Khi quyết toán, hãy đối chiếu với bộ phận kế toán – nhân sự của doanh nghiệp.",
    },
  ],
  cta: {
    title: "Đã có mức lương —",
    titleEm: "giờ là tìm đúng người",
    body: "Light Human giúp doanh nghiệp định vị mức offer cạnh tranh theo thị trường và tìm đúng ứng viên cho các vị trí quản lý, chuyên gia.",
    primary: { label: "Yêu cầu tư vấn tuyển dụng", href: "/lien-he" },
    secondary: { label: "Dịch vụ Headhunting", href: "/dich-vu/tuyen-dung-nhan-su-cao-cap" },
  },
  disclaimer:
    "Công cụ do Light Human phát triển, chỉ mang tính tham khảo và không thay thế tư vấn thuế chuyên môn. Số liệu áp dụng cho cá nhân cư trú, ký hợp đồng lao động từ 3 tháng trở lên.",
};

export const compoundTool = {
  title: "Tính lãi kép, giá trị tiền gửi và lợi nhuận đầu tư",
  description:
    "Công cụ tính lãi kép miễn phí của Light Human: dự báo giá trị tiền gửi tiết kiệm, khoản đầu tư có góp thêm hằng tháng, kèm biểu đồ tăng trưởng, bảng từng năm và công thức chi tiết.",
  hero: {
    eyebrow: "Light Human Toolkit · Tài chính cá nhân",
    lede: "Nhập số tiền ban đầu, khoản góp mỗi tháng và lãi suất — xem ngay tài sản của bạn lớn lên thế nào qua từng năm, tiền lãi chiếm bao nhiêu và vì sao bắt đầu sớm lại quan trọng.",
    facts: [
      { value: "4 kỳ", label: "Ghép lãi năm · quý · tháng · ngày" },
      { value: "50 năm", label: "Dự báo tối đa" },
      { value: "Lãi đơn", label: "So sánh song song" },
      { value: "Lạm phát", label: "Quy về sức mua hôm nay" },
    ],
    sample: { principal: 100_000_000, ratePct: 8, years: 20 },
  },
  presets: {
    principal: [0, 10_000_000, 50_000_000, 100_000_000, 500_000_000],
    monthly: [0, 1_000_000, 3_000_000, 5_000_000, 10_000_000],
    rateMarks: [0, 5, 10, 15, 20, 25, 30],
    yearMarks: [1, 10, 20, 30, 40, 50],
  },
  variables: [
    { sym: "FV", name: "Giá trị cuối kỳ", desc: "Tổng số tiền bạn có sau n năm" },
    { sym: "P", name: "Tiền gốc ban đầu", desc: "Số tiền bỏ vào ngay từ đầu" },
    { sym: "C", name: "Góp thêm mỗi tháng", desc: "Quy về mỗi kỳ ghép lãi: D = C × 12 ÷ m" },
    { sym: "i", name: "Lãi suất năm", desc: "Viết dạng thập phân — 8%/năm là 0,08" },
    { sym: "m", name: "Số kỳ ghép lãi / năm", desc: "Năm = 1, quý = 4, tháng = 12, ngày = 365" },
    { sym: "n", name: "Số năm", desc: "Thời gian gửi hoặc đầu tư" },
  ],
  compare: {
    eyebrow: "Lãi đơn hay lãi kép?",
    title: "Cùng 100 triệu, 8%/năm —",
    titleEm: "khác nhau ở đâu?",
    body: "Lãi đơn chỉ tính trên tiền gốc. Lãi kép nhập tiền lãi vào gốc sau mỗi kỳ, nên kỳ sau lãi được tính trên số tiền lớn hơn. Khoảng cách giữa hai cách tính nhỏ trong vài năm đầu, rồi nới rộng rất nhanh.",
  },
  tips: [
    {
      title: "Bắt đầu sớm hơn là góp nhiều hơn",
      body: "Thời gian là biến số nằm ở số mũ. Góp 3 triệu/tháng trong 30 năm thường cho kết quả lớn hơn góp 6 triệu/tháng trong 15 năm với cùng lãi suất.",
    },
    {
      title: "Góp đều đặn, tự động",
      body: "Đặt lệnh chuyển tiền tự động ngay ngày nhận lương. Khoản góp nhỏ nhưng không gián đoạn quan trọng hơn khoản lớn thất thường.",
    },
    {
      title: "Đừng quên lạm phát",
      body: "Con số danh nghĩa sau 20 năm luôn trông rất lớn. Nhập lạm phát dự kiến ở phần tùy chọn nâng cao để biết sức mua thực của khoản tiền đó.",
    },
    {
      title: "Tăng thu nhập là đòn bẩy lớn nhất",
      body: "Mỗi lần tăng lương, hãy tăng ngay khoản góp hằng tháng. Một bước chuyển việc đúng thời điểm có thể nâng tốc độ tích lũy nhiều hơn bất kỳ mức lãi suất nào.",
    },
  ],
  faqHead: {
    eyebrow: "FAQ",
    helper: "Muốn tăng thu nhập để tích lũy nhanh hơn?",
    helperLink: "Trao đổi với chuyên gia tư vấn nghề nghiệp",
  },
  faqs: [
    {
      q: "Lãi kép là gì?",
      a: "Lãi kép là cách tính lãi mà tiền lãi của kỳ trước được cộng vào gốc để tính lãi cho kỳ sau. Vì vậy số dư tăng theo cấp số nhân thay vì tăng đều như lãi đơn.",
    },
    {
      q: "Nên chọn kỳ ghép lãi nào?",
      a: "Chọn đúng kỳ mà ngân hàng hoặc sản phẩm đầu tư trả lãi và cho bạn tái tục. Gửi tiết kiệm kỳ hạn 1 tháng, tự động tái tục cả gốc lẫn lãi thì chọn \"Hằng tháng\"; kỳ hạn 12 tháng thì chọn \"Hằng năm\". Ghép lãi càng dày thì kết quả càng cao một chút với cùng lãi suất năm.",
    },
    {
      q: "Tiền góp hằng tháng được tính như thế nào?",
      a: "Khoản góp mỗi tháng được quy về từng kỳ ghép lãi (ví dụ ghép lãi theo quý thì mỗi kỳ góp 3 tháng tiền) và mặc định cộng vào cuối kỳ. Nếu bạn nạp tiền ngay đầu kỳ, hãy chọn \"Đầu kỳ\" trong tùy chọn nâng cao.",
    },
    {
      q: "Lãi suất bao nhiêu là hợp lý để dự báo?",
      a: "Với tiền gửi ngân hàng, dùng đúng lãi suất niêm yết của kỳ hạn bạn chọn. Với các kênh đầu tư có biến động, nên dự báo thận trọng và thử nhiều mức lãi suất để thấy khoảng kết quả, vì lợi nhuận quá khứ không đảm bảo cho tương lai.",
    },
    {
      q: "\"Giá trị theo sức mua hôm nay\" nghĩa là gì?",
      a: "Đó là số tiền tương lai đã được chiết khấu theo lạm phát dự kiến, cho biết khoản tiền đó mua được bao nhiêu hàng hóa nếu quy về giá của hôm nay. Ví dụ lạm phát 4%/năm thì 1 tỷ đồng sau 20 năm chỉ tương đương khoảng 456 triệu đồng hiện tại.",
    },
    {
      q: "Kết quả đã trừ thuế, phí chưa?",
      a: "Chưa. Công cụ tính trên lãi suất danh nghĩa, chưa trừ thuế thu nhập từ đầu tư vốn, phí quản lý hay phí rút trước hạn. Tiền lãi tiền gửi tiết kiệm của cá nhân tại ngân hàng hiện được miễn thuế thu nhập cá nhân.",
    },
  ],
  cta: {
    title: "Tích lũy nhanh nhất là",
    titleEm: "tăng thu nhập đúng lúc",
    body: "Light Human kết nối người đi làm với những vị trí phù hợp năng lực và mức đãi ngộ xứng đáng — miễn phí cho ứng viên.",
    primary: { label: "Xem việc làm đang tuyển", href: "https://job.lighthuman.vn" },
    secondary: { label: "Quy đổi lương Gross ⇄ Net", href: "/cong-cu/tinh-luong-gross-net" },
  },
  disclaimer:
    "Công cụ do Light Human phát triển, kết quả mang tính minh họa dựa trên lãi suất cố định do bạn nhập; không phải lời khuyên đầu tư. Lợi nhuận thực tế phụ thuộc sản phẩm, biến động thị trường, thuế và phí.",
};
