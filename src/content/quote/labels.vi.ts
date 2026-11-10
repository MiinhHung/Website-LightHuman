/**
 * Vietnamese UI strings for the quote feature.
 * The page component imports from here; nothing else hardcodes customer-facing
 * copy (industry / language / experience / region / education labels live next
 * to their option values in catalog.ts).
 */

export const vi = {
  pageTitle: "Báo giá tuyển dụng",
  pageSubtitle:
    "Kéo thả hạng mục bạn cần, chúng tôi gửi báo giá ngay cùng đội BD liên hệ lại trong 24 giờ.",

  palette: "Hạng mục",
  paletteHint: "Kéo thả hoặc bấm để thêm vào yêu cầu của bạn.",
  board: "Yêu cầu của bạn",
  boardEmpty: "Chưa có hạng mục nào. Hãy thêm từ cột bên trái.",
  removeChip: "Bỏ chọn",

  position: "Vị trí tuyển dụng",
  positionPlaceholder: "Ví dụ: Telesale tài chính",
  positionHint: "Tên vị trí sẽ in trên bản báo phí (2–100 ký tự).",

  quantity: "Số lượng",
  quantityHint: "Số lượng người cần tuyển (≥ 1).",

  typeSuggestion: "Loại báo giá đề xuất",
  typeNote: "Gợi ý sơ bộ. Loại thực tế do hệ thống xác định khi nhận yêu cầu.",
  multiLanguageBadge: "Trên 1 ngôn ngữ",

  contact: {
    legend: "Thông tin liên hệ",
    name: "Họ và tên",
    company: "Công ty",
    email: "Email",
    phone: "Số điện thoại",
    needEmailOrPhone: "Cung cấp ít nhất email hoặc số điện thoại hợp lệ.",
  },

  submit: "Xuất báo giá",
  submitting: "Đang xử lý…",

  result: {
    pricedTitle: "Báo giá đã sẵn sàng",
    pricedBody:
      "Bạn có thể tải PDF bên dưới. Đội BD của Light Human cũng đã nhận yêu cầu và sẽ liên hệ trong 24 giờ làm việc.",
    manualTitle: "Yêu cầu đang được xem xét",
    manualBody:
      "Trường hợp này cần BD của chúng tôi khảo giá thủ công. Đội BD sẽ liên hệ trong 24 giờ làm việc.",
    downloadMass: "Tải báo giá (Mass)",
    downloadHunt: "Tải báo giá (Hunt)",
    errorTitle: "Chưa gửi được yêu cầu",
    errorBody: "Vui lòng thử lại hoặc gọi hotline.",
  },

  types: {
    mass: "Lao động phổ thông (Mass)",
    hunt: "Nhân sự chất lượng cao (Hunt)",
  },

  errors: {
    generic: "Có lỗi xảy ra, vui lòng thử lại.",
    rateLimited: "Bạn gửi yêu cầu quá nhanh, vui lòng thử lại sau ít phút.",
  },
} as const;
