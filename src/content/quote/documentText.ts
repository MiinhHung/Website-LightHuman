/**
 * Static copy of the BD quote template, transcribed verbatim from
 * docs/quote-templates/*.png. Edit here, never inside PDF components.
 */

export const EMPTY_CELL = "—";

export const DOCUMENT_TEXT = {
  title: "BÁO PHÍ DỊCH VỤ TUYỂN DỤNG LIGHT HUMAN",
  header: {
    customer: "Khách hàng:",
    recipient: "Người nhận:",
    mail: "Mail:",
    owner: "Người phụ trách:",
    phone: "Số điện thoại:",
    date: "Ngày báo phí:",
  },
  unitNote: "Đơn vị: VND",
  banners: {
    fee: "PHÍ DỊCH VỤ",
    warranty: "PHÍ BẢO HÀNH 1 ĐỔI 1",
  },
  columns: {
    index: "STT",
    position: "Vị trí",
    quantity: "Số lượng",
    eligibility: "Ứng viên đủ điều kiện tính phí",
    warrantyPeriod: "Thời gian bảo hành thêm",
    warrantyAnchor: "Mốc thời gian tính bảo hành",
    warrantySuccess: "Điều kiện bảo hành thành công",
    discount: "Chiết khấu",
  },
  plan1: {
    title: "PHƯƠNG ÁN 1 - KHÔNG BẢO HÀNH",
  },
  plan2: {
    title: "PHƯƠNG ÁN 2 - BẢO HÀNH 1 ĐỔI 1",
    subtitle: "(Ứng viên được tính bảo hành 1 đổi 1 ngay khi ứng viên on-board)",
    footnote:
      "Ứng viên được kích hoạt bảo hành 1 đổi 1 kể từ ngày on-board khi ứng viên đủ điều kiện tính phí",
  },
  discount: {
    // `{pct}` is replaced by the program percentage, or EMPTY_CELL.
    line: "Chương trình chiết khấu: {pct} phí dịch vụ/ứng viên",
    cell: "{pct}, tối đa {cap}/ứng viên",
  },
  surcharges: {
    title: "Phụ phí áp dụng (tính riêng cho từng vị trí)",
    none: "Không có phụ phí áp dụng.",
    afterSurcharge: "Phí/ứng viên sau phụ phí:",
  },
  // Hunt template only. The "Ví dụ: …" line from the image is intentionally
  // omitted (TODO(BA): aggregation formula not confirmed).
  minimumFee: {
    title: "Phí dịch vụ tối thiểu (tính riêng cho từng vị trí)",
    rule: "Phí dịch vụ cho mỗi ứng viên không thấp hơn mức phí tối thiểu của vị trí đó. Cách tính: Phí tối thiểu = Mức lương thấp nhất trong khung lương cứng (gross) của vị trí x Hệ số phí dịch vụ đã thỏa thuận",
    floor: "Mức sàn: nếu kết quả thấp hơn {below} VNĐ thì tính {charge} VNĐ/ứng viên",
  },
  salaryFee: {
    multiple: "{m} x tháng lương gross",
    minimum: "Phí tối thiểu:",
  },
  notes: {
    title: "GHI CHÚ",
    items: [
      "Lương gross là tổng thu nhập mỗi tháng của người lao động, bao gồm lương cơ bản và các khoản trợ cấp, phụ cấp,... mà chưa trừ các khoản đóng bảo hiểm bắt buộc và nộp thuế thu nhập cá nhân (nếu có).",
      "Phí trên chưa bao gồm 8% VAT.",
      "Bảo hành ứng viên nếu ứng viên tự ý nghỉ việc hoặc không đáp ứng được yêu cầu của khách hàng trong thời gian bảo hành.",
      "Thời gian thanh toán: Thanh toán 100% phí dịch vụ trong vòng 1-3 ngày kể từ ngày hai bên hoàn tất đối soát.",
      "Báo phí có hiệu lực trong vòng 07 ngày kể từ ngày gửi.",
    ],
  },
  watermark: "BẢN NHÁP, CHƯA ĐIỀN ĐƠN GIÁ",
  pageLabel: "Trang {n}/{total}",
} as const;
