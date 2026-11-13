"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { calculate, type SalaryInput, type SalaryResult } from "@/lib/salary/calc";
import { formatMoney, formatRate } from "@/lib/salary/format";
import { CURRENT_RULE, salaryRules, socialCap, type Region } from "@/lib/salary/rules";
import { salaryTool } from "@/content/tools";
import {
  BigNum,
  BracketLadder,
  CalcShell,
  Card,
  Choice,
  Delta,
  EmptyState,
  FormHead,
  Insurance,
  Legal,
  Legend,
  MAX_DEPENDENTS,
  MoneyField,
  readMoney,
  RegionChoice,
  RegionHelp,
  Row,
  RRow,
  RuleChoice,
  Signed,
  SplitBar,
  Stepper,
  Tn,
  useQuerySync,
  moneyText,
  type Part,
  type RuleId,
} from "./fields";

type Mode = SalaryInput["mode"];

type State = {
  mode: Mode;
  amount: number;
  dependents: number;
  region: Region;
  insCustom: boolean;
  insAmount: number;
  ruleId: RuleId;
};

const DEFAULTS: State = {
  mode: "gross-to-net",
  amount: 30_000_000,
  dependents: 0,
  region: 1,
  insCustom: false,
  insAmount: 0,
  ruleId: CURRENT_RULE,
};

/** Share link (also used by the home page's mini card): ?m=gn|ng&v=&d=&r=&b=&y= */
function fromParams(sp: URLSearchParams): Partial<State> {
  const out: Partial<State> = {};
  const m = sp.get("m");
  if (m === "gn") out.mode = "gross-to-net";
  if (m === "ng") out.mode = "net-to-gross";
  const v = Number(sp.get("v"));
  if (v > 0) out.amount = Math.min(v, 99_999_999_999);
  const d = Number(sp.get("d"));
  if (Number.isInteger(d) && d >= 0) out.dependents = Math.min(d, MAX_DEPENDENTS);
  const r = Number(sp.get("r"));
  if ([1, 2, 3, 4].includes(r)) out.region = r as Region;
  const b = Number(sp.get("b"));
  if (b > 0) {
    out.insCustom = true;
    out.insAmount = b;
  }
  const y = sp.get("y");
  if (y === "2025" || y === "2026") out.ruleId = y;
  return out;
}

function toParams(s: State) {
  const p = new URLSearchParams({
    m: s.mode === "gross-to-net" ? "gn" : "ng",
    v: String(s.amount),
    d: String(s.dependents),
    r: String(s.region),
    y: s.ruleId,
  });
  if (s.insCustom && s.insAmount > 0) p.set("b", String(s.insAmount));
  return p.toString();
}

const P = "lg";

export function SalaryCalcWithQuery() {
  const sp = useSearchParams();
  return <SalaryCalc initial={fromParams(new URLSearchParams(sp.toString()))} />;
}

export function SalaryCalc({ initial }: { initial?: Partial<State> }) {
  const start = { ...DEFAULTS, ...initial };
  const [mode, setMode] = useState<Mode>(start.mode);
  const [amountText, setAmountText] = useState(moneyText(start.amount));
  const [dependents, setDependents] = useState(start.dependents);
  const [region, setRegion] = useState<Region>(start.region);
  const [insCustom, setInsCustom] = useState(start.insCustom);
  const [insText, setInsText] = useState(moneyText(start.insAmount));
  const [ruleId, setRuleId] = useState<RuleId>(start.ruleId);

  const amount = readMoney(amountText, true, "Nhập mức lương lớn hơn 0.");
  const ins = insCustom ? readMoney(insText, true, "Nhập mức lương đóng bảo hiểm.") : { value: 0, error: "" };
  const s: State = { mode, amount: amount.value, dependents, region, insCustom, insAmount: ins.value, ruleId };
  useQuerySync(toParams(s));

  const ready = s.amount > 0 && (!insCustom || s.insAmount > 0);
  const input = (rule: RuleId): SalaryInput => ({
    amount: s.amount,
    mode,
    dependents,
    region,
    insuranceBase: insCustom ? s.insAmount : null,
    ruleId: rule,
  });
  const r = ready ? calculate(input(ruleId)) : null;
  const other = r && ruleId === "2026" ? calculate(input("2025")) : null;

  const reset = () => {
    setMode(DEFAULTS.mode);
    setAmountText(moneyText(DEFAULTS.amount));
    setDependents(DEFAULTS.dependents);
    setRegion(DEFAULTS.region);
    setInsCustom(DEFAULTS.insCustom);
    setInsText("");
    setRuleId(DEFAULTS.ruleId);
  };

  // Switching direction keeps the "mirror" amount: Gross → Net puts the computed Net in the field.
  const switchMode = (next: Mode) => {
    if (next === mode) return;
    if (r) setAmountText(formatMoney(next === "gross-to-net" ? r.gross : r.net));
    setMode(next);
  };

  const form = (
    <>
      <FormHead step="Thông tin lương" onReset={reset} />
      <Choice
        id={`${P}-mode`}
        label="Chiều quy đổi"
        attr="data-mode"
        options={[
          { value: "gross-to-net", label: "Gross sang Net" },
          { value: "net-to-gross", label: "Net sang Gross" },
        ]}
        value={mode}
        onChange={switchMode}
      />
      <MoneyField
        id={`${P}-amount`}
        label={mode === "net-to-gross" ? "Lương Net mong muốn / tháng" : "Lương Gross / tháng"}
        text={amountText}
        setText={setAmountText}
        error={amount.error}
        placeholder="VD: 30.000.000 hoặc 30tr"
        presets={salaryTool.presets}
        presetsLabel="Mức lương gợi ý"
      />
      <div className="calc-row">
        <Stepper id={`${P}-dep`} value={dependents} onChange={setDependents} />
        <RegionChoice p={P} value={region} onChange={setRegion} />
      </div>
      <RegionHelp p={P} />
      <Insurance
        p={P}
        fullTitle="Trên lương chính thức"
        fullSub="Đóng trên toàn bộ lương Gross (có mức trần)"
        customSub="Doanh nghiệp đóng trên lương cơ bản thấp hơn"
        custom={insCustom}
        setCustom={setInsCustom}
        text={insText}
        setText={setInsText}
        error={ins.error}
        ruleId={ruleId}
        region={region}
      />
      <RuleChoice p={P} value={ruleId} onChange={setRuleId} />
    </>
  );

  return (
    <CalcShell
      p={P}
      kind="salary"
      title={salaryTool.calcTitle}
      form={form}
      resultRef={salaryTool.resultRef}
      result={
        r ? (
          <Result r={r} other={other} g2n={mode !== "net-to-gross"} />
        ) : (
          <EmptyState msg={`Nhập mức lương${insCustom ? " và lương đóng bảo hiểm" : ""} để xem kết quả quy đổi.`} />
        )
      }
    >
      <div className="calc-breakdown" data-breakdown="">
        {r && <Breakdown r={r} />}
      </div>
      <Legal list={salaryRules[CURRENT_RULE].legalBasis} disclaimer={salaryTool.disclaimer} />
    </CalcShell>
  );
}

function Result({ r, other, g2n }: { r: SalaryResult; other: SalaryResult | null; g2n: boolean }) {
  const parts: Part[] = [
    { tone: "net", label: "Lương Net", v: r.net },
    { tone: "ins", label: "Bảo hiểm (NLĐ)", v: r.employee.total },
    { tone: "tax", label: "Thuế TNCN", v: r.tax },
  ];
  const pctNet = r.gross > 0 ? r.net / r.gross : 0;
  const diff = other ? (g2n ? r.net - other.net : other.gross - r.gross) : 0;
  return (
    <>
      <BigNum
        eyebrow={`${g2n ? "Lương Net thực nhận" : "Lương Gross cần thỏa thuận"} · ${r.rules.shortLabel}`}
        value={g2n ? r.net : r.gross}
        unit="đ/tháng"
      />
      <p className="calc-r-sub">
        {g2n ? (
          <>
            Nhận về <strong>{formatRate(pctNet)}</strong> lương Gross · <Tn v={r.net * 12} /> đ/năm
          </>
        ) : (
          <>
            Để thực nhận{" "}
            <strong>
              <Tn v={r.net} /> đ
            </strong>{" "}
            mỗi tháng
          </>
        )}
      </p>
      <SplitBar
        parts={parts}
        total={r.gross}
        label={`Net ${formatMoney(r.net)} đồng, bảo hiểm ${formatMoney(r.employee.total)} đồng, thuế ${formatMoney(r.tax)} đồng`}
      />
      <Legend parts={parts} />
      <RRow label="Tổng chi phí doanh nghiệp">
        <Tn v={r.employerCost} /> đ
      </RRow>
      {Math.abs(diff) >= 1 && (
        <Delta
          badge={
            <>
              {diff > 0 ? "+" : "-"} <Tn v={Math.abs(diff)} /> đ
            </>
          }
        >
          {g2n
            ? diff > 0
              ? "Net cao hơn so với cách tính năm 2025 nhờ giảm trừ và biểu thuế mới."
              : "Net thấp hơn so với cách tính năm 2025."
            : diff > 0
              ? "Gross cần trả thấp hơn so với cách tính năm 2025."
              : "Gross cần trả cao hơn so với cách tính năm 2025."}
        </Delta>
      )}
    </>
  );
}

function Breakdown({ r }: { r: SalaryResult }) {
  const e = r.rules.employee;
  const er = r.rules.employer;
  const cap = socialCap(r.rules);
  return (
    <>
      <Card step="Diễn giải" title="Từ Gross đến Net">
        <table className="calc-table">
          <caption className="sr-only">Diễn giải chi tiết (VNĐ)</caption>
          <tbody>
            <Row label="Lương Gross" cls="is-strong">
              <Signed n={r.gross} />
            </Row>
            <Row label={`BHXH (${formatRate(e.social)})`}>
              <Signed n={r.employee.social} s="-" />
            </Row>
            <Row label={`BHYT (${formatRate(e.health)})`}>
              <Signed n={r.employee.health} s="-" />
            </Row>
            <Row label={`BHTN (${formatRate(e.unemployment)})`}>
              <Signed n={r.employee.unemployment} s="-" />
            </Row>
            <Row label="Thu nhập trước thuế" cls="is-sub">
              <Signed n={r.preTax} />
            </Row>
            <Row label="Giảm trừ bản thân">
              <Signed n={r.personalDeduction} s="-" />
            </Row>
            <Row label="Giảm trừ người phụ thuộc">
              <Signed n={r.dependentDeduction} s="-" />
            </Row>
            <Row label="Thu nhập tính thuế" cls="is-sub">
              <Signed n={r.taxable} />
            </Row>
            <Row label="Thuế TNCN">
              <Signed n={r.tax} s="-" />
            </Row>
            <Row label="Lương Net" cls="is-total">
              <Signed n={r.net} />
            </Row>
          </tbody>
        </table>
        {r.insuranceBase > cap && (
          <p className="calc-note">
            Lương đóng bảo hiểm vượt mức trần, BHXH và BHYT chỉ tính trên <Tn v={cap} /> đ.
          </p>
        )}
        {r.belowRegionalMinimum && (
          <p className="calc-note is-warn">
            Lương đóng bảo hiểm thấp hơn lương tối thiểu vùng (<Tn v={r.regionalMinimum} /> đ), chưa đúng quy định.
          </p>
        )}
      </Card>
      <Card step="Thuế TNCN" title={`Biểu lũy tiến ${r.brackets.length} bậc`}>
        <BracketLadder brackets={r.brackets} amtLabel="Chịu thuế" total={r.tax} />
      </Card>
      <Card step="Doanh nghiệp" title="Chi phí doanh nghiệp chi trả" cls="is-dark">
        <table className="calc-table">
          <caption className="sr-only">Người sử dụng lao động trả (VNĐ)</caption>
          <tbody>
            <Row label="Lương Gross" cls="is-strong">
              <Signed n={r.gross} />
            </Row>
            <Row label={`BHXH (${formatRate(er.social)})`}>
              <Signed n={r.employer.social} s="+" />
            </Row>
            <Row label={`Tai nạn lao động - BNN (${formatRate(er.accident)})`}>
              <Signed n={r.employer.accident} s="+" />
            </Row>
            <Row label={`BHYT (${formatRate(er.health)})`}>
              <Signed n={r.employer.health} s="+" />
            </Row>
            <Row label={`BHTN (${formatRate(er.unemployment)})`}>
              <Signed n={r.employer.unemployment} s="+" />
            </Row>
            <Row label="Tổng chi phí / tháng" cls="is-total">
              <Signed n={r.employerCost} />
            </Row>
            <Row label="Ước tính / năm (12 tháng)">
              <Signed n={r.employerCost * 12} />
            </Row>
          </tbody>
        </table>
        <p className="calc-note">
          Dùng con số này khi lập ngân sách tuyển dụng, chưa gồm thưởng, phúc lợi và phí dịch vụ tuyển dụng.
        </p>
      </Card>
    </>
  );
}
