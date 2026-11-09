/** Định nghĩa form liên hệ (khớp form gốc lighthuman.vn/lien-he) — dùng chung cho UI (client) và Server Action. */

/** Tuỳ chọn "Dịch vụ bạn quan tâm" — value/label giữ nguyên như trang gốc. */
export const serviceOptions = [
  { value: "executive-search", label: "Tuyển dụng nhân sự cấp cao" },
  { value: "mass-hiring", label: "Tuyển dụng số lượng lớn" },
  { value: "temp-staffing", label: "Tuyển dụng theo yêu cầu" },
  { value: "training", label: "Đào tạo & Phát triển" },
  { value: "consulting", label: "Tư vấn chiến lược nhân sự" },
  { value: "employer-branding", label: "Employer Branding" },
  { value: "other", label: "Khác" },
] as const;

export type ContactField = "name" | "email" | "phone" | "role" | "company" | "service" | "message";

export const CONTACT_FIELDS: ContactField[] = ["name", "email", "phone", "role", "company", "service", "message"];

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  values?: Partial<Record<ContactField, string>>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^(\+?84|0)[\d\s.-]{8,12}$/;
const MAX = 3000;

export function validateContact(values: Partial<Record<ContactField, string>>) {
  const errors: Partial<Record<ContactField, string>> = {};
  const v = (k: ContactField) => (values[k] ?? "").trim();

  if (v("name").length < 2) errors.name = "Vui lòng nhập họ và tên.";
  if (!EMAIL.test(v("email"))) errors.email = "Email chưa đúng định dạng.";
  if (!PHONE.test(v("phone"))) errors.phone = "Số điện thoại chưa hợp lệ (ví dụ 0901 234 567).";
  if (v("role").length > 200) errors.role = "Chức vụ quá dài.";
  if (v("company").length < 2) errors.company = "Vui lòng nhập tên công ty.";
  if (!serviceOptions.some((o) => o.value === v("service"))) errors.service = "Vui lòng chọn dịch vụ.";
  if (v("message").length < 10) errors.message = "Vui lòng mô tả nhu cầu (ít nhất 10 ký tự).";
  if (v("message").length > MAX) errors.message = "Nội dung tối đa 3.000 ký tự.";

  return errors;
}
