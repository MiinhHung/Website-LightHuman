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
  pageKicker: "Báo giá trực tuyến",
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
      desc: "Kéo thẻ từ bộ thẻ bên trái thả vào tờ báo giá, hoặc bấm vào thẻ. Bấm × hoặc kéo thẻ về bộ thẻ để bỏ.",
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

  /** Card deck (left) + quote sheet (right) layout. */
  board: {
    deckTitle: "Bộ thẻ yêu cầu",
    deckHint: "Kéo thẻ sang tờ báo giá, hoặc bấm vào thẻ.",
    deckHintTouch: "Chạm vào thẻ để thêm vào báo giá.",
    deckEmpty: "Đã dùng hết thẻ trong nhóm này.",
    next: "Sang mục tiếp",
    added: "Đã thêm",
    removed: "Đã bỏ",
    replaced: "Đã thay bằng",
    dropHere: "Thả thẻ vào tờ báo giá",
    dropBack: "Thả vào đây để bỏ thẻ",
    sheetTitle: "Báo giá tuyển dụng",
    sheetNo: "Số",
    sheetNoPending: "cấp khi tạo",
    sheetTo: "Kính gửi: Quý doanh nghiệp",
    sheetFrom: "Light Human — Giải pháp nhân sự",
    // TODO(BA): "3 ngày gửi CV" và "bảo hành 60 ngày" lấy từ bộ thiết kế mới; chưa khớp với từng gói dịch vụ.
    slaTitle: "Cam kết dịch vụ",
    slaItems: ["Gửi CV đầu tiên trong 3 ngày làm việc", "Bảo hành ứng viên 60 ngày"],
    requirements: "Yêu cầu ứng viên",
    slotEmptyMulti: "Thả một hoặc nhiều thẻ",
    slotEmptySingle: "Thả một thẻ",
    recipient: "Người nhận báo giá",
    progress: "Hồ sơ",
    progressItems: {
      position: "Vị trí",
      industries: "Chuyên ngành",
      experience: "Kinh nghiệm",
      region: "Khu vực",
      education: "Bằng cấp",
      contact: "Người nhận",
    },
    ready: "Đủ thông tin — sẵn sàng tạo báo giá",
    priceAfter: "Đơn giá hiển thị sau khi bạn tạo báo giá.",
    stamp: "Đã lập",
    locked: "Báo giá đã được lập. Bấm \"Tạo báo giá khác\" để chơi ván mới.",
  },

  /**
   * Paper-sheet board on /lien-he#bao-gia (approved mock). `{x}` placeholders
   * are filled by components/quote/text.ts.
   */
  sheet: {
    eyebrow: "Tờ báo giá",
    title: "Kéo thẻ vào tờ báo giá, *nhận mã ngay*",
    lede: "Chọn thẻ ở bên trái, kéo vào đúng ô trên tờ giấy, rồi bấm Tạo báo giá để nhận mã và bản PDF. Chưa có đơn giá: đội BD báo sau.",
    hintFine: "Kéo thẻ sang tờ báo giá, hoặc bấm vào thẻ.",
    hintTouch: "Chạm vào thẻ để thêm vào báo giá, hoặc giữ rồi kéo.",
    hintChip: "Bấm thẻ trên tờ giấy để bỏ ra.",
    dockRequired: "mục bắt buộc",
    dockLink: "Xem tờ báo giá",
    codePending: "BG-······",
    date: "Ngày",
    to: "Kính gửi:",
    toFallback: "Quý doanh nghiệp",
    stampBrand: "Light Human",
    qtyMinus: "Bớt một người",
    qtyPlus: "Thêm một người",
    qtyUnit: "người",
    feeLabel: "Phí dịch vụ",
    feeValue: "Đội BD báo giá sau khi nhận yêu cầu",
    feeNote: "Tờ giấy chưa in đơn giá vì bảng giá đang chờ duyệt.",
    notReady: "Chưa đủ thông tin bắt buộc.",
    ready: "Đủ thông tin, sẵn sàng tạo báo giá.",
    formErrors: "Còn {n} mục cần bổ sung, xem ghi chú đỏ trên tờ báo giá.",
    slotErrorMulti: "Kéo ít nhất 1 thẻ {group} vào ô này.",
    slotErrorSingle: "Kéo một thẻ {group} vào ô này.",
    wrongSlot: "Thẻ này thuộc nhóm {group}, chưa thả đúng ô.",
    announce: "{verb} {label}, nhóm {group}.",
    footCompany: "Công ty Cổ phần Giải pháp Nhân sự Ánh Sáng (Light Human) · MST 0316300874",
    reset: "Đã dọn tờ giấy, bắt đầu báo giá mới.",
    drag: {
      instructions:
        "Nhấn Enter để thêm thẻ vào tờ báo giá. Hoặc nhấn Space để nhấc thẻ, mũi tên phải để đưa thẻ tới ô của nhóm, Space để thả, Esc để huỷ.",
      start: "Đã nhấc thẻ {label}. Thả vào ô {group} trên tờ báo giá.",
      over: "Thẻ {label} đang ở trên ô {row}.",
      move: "Đang kéo thẻ {label}.",
      cancel: "Đã huỷ kéo thẻ {label}.",
    },
  },

  /** Result card under the stamped sheet. */
  sheetResult: {
    title: "Đã lập báo giá",
    amount: "Tạm tính",
    manualNote: "Tổ hợp yêu cầu này cần đội BD báo giá riêng.",
    // No BD webhook yet (Phase 5): the request only reaches BD if the customer sends it.
    note: "Yêu cầu này chưa tự động chuyển tới đội BD. Bấm Gửi email cho BD (nội dung đã điền sẵn) hoặc gọi {phone} kèm mã báo giá.",
    mail: "Gửi email cho BD",
    print: "In tờ báo giá",
    printNote: "Chọn \"Lưu dưới dạng PDF\" trong hộp thoại in để lưu file.",
    unit: "người",
    none: "Không yêu cầu",
    mailSubject: "Báo giá tuyển dụng {code} - {position}",
    mailGreeting: "Kính gửi đội BD Light Human,",
    mailIntro: "Tôi muốn nhận báo giá tuyển dụng:",
    mailType: "Loại dịch vụ dự kiến",
    mailCode: "Mã báo giá",
    mailPerson: "Người liên hệ",
    mailEmail: "Email",
    mailPhone: "Điện thoại",
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
