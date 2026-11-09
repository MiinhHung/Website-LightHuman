import { CMS } from "./site";

/** Trang /gioi-thieu — nội dung lấy theo lighthuman.vn/gioi-thieu. */

export const aboutHero = {
  eyebrow: "Về Light Human",
  title: "Building Better Teams, One Hire At A Time",
  lede: "Light Human - đơn vị tư vấn nhân sự và headhunting hàng đầu Việt Nam. Giải pháp nhân sự ánh sáng - đồng hành cùng doanh nghiệp Việt và quốc tế.",
  image: `${CMS}/hero_about_c25f683d35.png`,
  cta: { label: "Liên hệ tư vấn", href: "/lien-he" },
};

export const aboutIntro = {
  mission: {
    id: "su-menh",
    title: "Sứ mệnh",
    text: "Light Human là cầu nối giữa doanh nghiệp tìm kiếm nhân tài phù hợp với sự phát triển của công ty, đồng thời kết nối những chuyên gia có năng lực với môi trường nuôi dưỡng sự nghiệp lâu dài.",
  },
  vision: {
    id: "tam-nhin",
    title: "Tầm nhìn",
    text: "Trở thành công ty dịch vụ tuyển dụng am hiểu sâu sắc nhất và đáp ứng chuyên nghiệp nhất các nhu cầu tuyển dụng của doanh nghiệp - thiết lập Light Human như một trong 5 thương hiệu dịch vụ tuyển dụng hàng đầu Việt Nam (2020-2025).",
  },
  quote: "Hành trình vạn dặm, bắt đầu từ một bước chân",
  closing:
    "Sức cạnh tranh của một tổ chức phụ thuộc vào chất lượng vốn con người - việc lựa chọn nhân tài đúng tạo nền móng cho sự thành công của các đối tác kinh doanh.",
};

export type AboutStatIcon = "briefcase" | "users-round" | "building-2" | "heart-handshake";

export const aboutStats = {
  eyebrow: "Con số",
  title: "Light Human qua những con số",
  items: [
    { icon: "briefcase", num: "1.200+", label: "Dự án hoàn thành" },
    { icon: "users-round", num: "36K+", label: "Ứng viên tiềm năng" },
    { icon: "building-2", num: "800+", label: "Doanh nghiệp hợp tác" },
    { icon: "heart-handshake", num: "98%", label: "Khách hàng hài lòng" },
  ] satisfies { icon: AboutStatIcon; num: string; label: string }[],
};

export type ValueIcon = "heart-handshake" | "shield-check" | "sparkles" | "sprout";

export const coreValuesSection = {
  eyebrow: "Giá trị cốt lõi",
  title: "Những điều Light Human theo đuổi",
  lede: "Bốn giá trị định hình cách chúng tôi làm việc với khách hàng và ứng viên.",
  items: [
    {
      icon: "heart-handshake",
      title: "Tận tâm",
      desc: "Coi nhu cầu của khách hàng và ứng viên như của chính mình - đồng hành đến khi thành công.",
    },
    {
      icon: "shield-check",
      title: "Chuyên nghiệp",
      desc: "Quy trình chuẩn hóa, am hiểu sâu sắc thị trường lao động Việt Nam.",
    },
    {
      icon: "sparkles",
      title: "Đổi mới",
      desc: "Tích hợp công nghệ video, công cụ thông minh và phân tích dữ liệu vào quy trình tuyển dụng.",
    },
    {
      icon: "sprout",
      title: "Bền vững",
      desc: "Tập trung vào mối quan hệ dài hạn - nhân sự gắn bó, doanh nghiệp phát triển.",
    },
  ] satisfies { icon: ValueIcon; title: string; desc: string }[],
};

export const teamSection = {
  eyebrow: "Đội ngũ",
  title: "Những người đứng sau Light Human",
  lede: "Chuyên gia HR với nhiều năm kinh nghiệm trong tư vấn nhân sự và headhunting cho các doanh nghiệp Việt và quốc tế.",
  members: [
    {
      name: "Ninh Quang Minh",
      role: "Nhà sáng lập - Chủ tịch HĐQT",
      photo: `${CMS}/Gemini_Generated_Image_3pqrq63pqrq63pqr_b4b9801926.png`,
      bio: "Thạc sĩ Quản trị Kinh doanh với nhiều năm kinh nghiệm trong lĩnh vực chiến lược, phát triển doanh nghiệp và tuyển dụng. Ông từng là Giám đốc Chiến lược tại Khả Kim, Giám đốc Phát triển tại Tập đoàn Nam Hương, Trưởng phòng Nguồn tuyển tại VietVictory và hiện là Giảng viên Doanh nhân tại Đại học Nguyễn Tất Thành.",
    },
    {
      name: "Nguyễn Ngọc Hương Trâm",
      role: "Nhà đồng sáng lập - Tổng Giám đốc",
      photo: `${CMS}/Gemini_Generated_Image_gi5qlegi5qlegi5q_eee261e899.png`,
      bio: "Thạc sĩ Quản trị Kinh doanh với nhiều năm kinh nghiệm trong quản trị nhân sự, tuyển dụng và phát triển doanh nghiệp. Trước đây, bà là Đồng sáng lập Hunter Media, từng là Giám đốc Nhân sự tại Khả Kim, Giám đốc Dịch vụ Tuyển dụng tại VietVictory và hiện là Giảng viên Doanh nhân tại Đại học Nguyễn Tất Thành.",
    },
    {
      name: "Nguyễn Hữu Thanh",
      role: "Thành viên HĐQT",
      photo: `${CMS}/Gemini_Generated_Image_kvlldjkvlldjkvll_d9d3f096f7.png`,
      bio: "Doanh nhân có nhiều năm kinh nghiệm trong lĩnh vực truyền thông và marketing. Ông là Đồng sáng lập Hunter Media, Nhà sáng lập Canawan tại Singapore và Công ty Cổ phần Thương mại Dịch vụ Khả Kim. Hiện ông tham gia định hướng chiến lược và phát triển doanh nghiệp tại Light Human.",
    },
  ],
};

export const aboutCta = {
  heading: "Tham gia hành trình cùng Light Human",
  desc: "Bạn là doanh nghiệp cần tư vấn nhân sự, hay ứng viên tìm kiếm cơ hội? Hãy kết nối với chúng tôi.",
  action: { label: "Liên hệ ngay", href: "/lien-he" },
};
