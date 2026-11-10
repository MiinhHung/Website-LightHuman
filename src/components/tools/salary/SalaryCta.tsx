import { salaryTool } from "@/content/tools";
import { salaryRules, CURRENT_RULE } from "@/lib/salary/rules";
import { ToolCta } from "../ToolCta";

/** Căn cứ pháp lý + lời gọi hành động dẫn về dịch vụ tuyển dụng của Light Human. */
export function SalaryCta() {
  return <ToolCta cta={salaryTool.cta} legal={salaryRules[CURRENT_RULE].legalBasis} disclaimer={salaryTool.disclaimer} />;
}
