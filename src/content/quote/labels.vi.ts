/**
 * Vietnamese UI strings for the quote feature.
 * The page component imports from here; nothing else hardcodes customer-facing
 * copy (industry / language / experience / region / education labels live next
 * to their option values in catalog.ts).
 *
 * The UI says "báo giá" throughout. The PDF keeps the BD template's own wording
 * ("báo phí") and filename.
 */

export const vi = {
  pageTitle: "Báo giá tuyển dụng",
  pageSubtitle:
    "Chọn vị trí và yêu cầu ứng viên để nhận báo giá ngay. Đội BD sẽ liên hệ lại trong 24 giờ làm việc.",

  steps: {
    position: {
      title: "Vị trí cần tuyển",
      desc: "Tên vị trí sẽ được in trên bản báo giá.",
    },
    criteria: {
      title: "Yêu cầu ứng viên",
      desc: "Bấm để chọn, hoặc kéo thẻ vào khung Đã chọn.",
    },
    contact: {
      title: "Thông tin liên hệ",
      desc: "Đội BD dùng thông tin này để gửi báo giá và tư vấn thêm.",
    },
  },

  group: {
    multi: "chọn nhiều",
    single: "chọn một",
    optional: "không bắt buộc",
  },

  panel: {
    title: "Đã chọn",
    empty: "Chưa có yêu cầu nào. Bấm vào thẻ để chọn, hoặc kéo thả thẻ vào đây.",
    missing: "Còn thiếu:",
    complete: "Đã đủ thông tin bắt buộc.",
    typeLabel: "Loại dịch vụ dự kiến",
    typePending: "Chưa đủ thông tin",
    typeNote: "Dựa trên kinh nghiệm, bằng cấp và ngôn ngữ bạn chọn.",
    multiLanguage: "Có từ 2 ngôn ngữ trở lên.",
  },

  removeChip: "Bỏ chọn",
  selectedSuffix: "(đã chọn)",

  position: "Vị trí tuyển dụng",
  positionPlaceholder: "Ví dụ: Telesale tài chính",
  positionHint: "Từ 2 đến 100 ký tự.",

  quantity: "Số lượng người",

  contact: {
    legend: "Thông tin liên hệ",
    name: "Họ và tên",
    company: "Công ty",
    email: "Email",
    phone: "Số điện thoại",
    needEmailOrPhone: "Cần ít nhất một trong hai: email hoặc số điện thoại.",
  },

  submit: "Tạo báo giá",
  submitting: "Đang tạo báo giá…",

  result: {
    pricedTitle: "Báo giá đã sẵn sàng",
    pricedBody:
      "Bạn có thể tải bản PDF bên dưới. Đội BD của Light Human đã nhận yêu cầu và sẽ liên hệ trong 24 giờ làm việc.",
    manualTitle: "Yêu cầu đang được xem xét",
    manualBody:
      "Tổ hợp yêu cầu này cần đội BD báo giá riêng. Chúng tôi sẽ liên hệ trong 24 giờ làm việc.",
    // TODO: copy pending approval.
    draftTitle: "Đã tạo báo giá",
    draftBody:
      "Bản báo giá đã được tạo nhưng chưa có đơn giá. Đội BD sẽ liên hệ để hoàn thiện trong 24 giờ làm việc.",
    downloadMass: "Tải báo giá PDF (Mass)",
    downloadHunt: "Tải báo giá PDF (Hunt)",
    downloadUnavailable: "Chưa tạo được liên kết tải PDF. Đội BD sẽ gửi bản báo giá qua email.",
    code: "Mã báo giá",
    requestCode: "Mã yêu cầu",
    type: "Loại dịch vụ",
    reset: "Tạo báo giá khác",
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
