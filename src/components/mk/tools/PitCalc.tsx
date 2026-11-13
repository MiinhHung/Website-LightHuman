"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  computePit,
  marginalTax,
  SHORT_TERM_THRESHOLD,
  taxFreeThreshold,
  taxUnderRules,
  type PitCase,
  type PitInput,
  type PitResult,
} from "@/lib/salary/pit";
import { formatMoney, formatRate } from "@/lib/salary/format";
import { CURRENT_RULE, salaryRules, type Region } from "@/lib/salary/rules";
import { fixCopy } from "@/lib/mk";
import { pitTool } from "@/content/tools";
import { Ico } from "../ui";
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
  moneyText,
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
  type Part,
  type RuleId,
} from "./fields";

type State = {
  case: PitCase;
  income: number;
  exempt: number;
  dependents: number;
  region: Region;
  insCustom: boolean;
  insAmount: number;
  ruleId: RuleId;
};

const DEFAULTS: State = {
  case: "resident",
  income: 30_000_000,
  exempt: 0,
  dependents: 0,
  region: 1,
  insCustom: false,
  insAmount: 0,
  ruleId: CURRENT_RULE,
};

const CASES: PitCase[] = ["resident", "short", "nonresident"];
const CASE_CODE: Record<PitCase, string> = { resident: "cu", short: "ng", nonresident: "kh" };

/** Share link: ?k=cu|ng|kh&v=&x=&d=&g=&b=&y= */
function fromParams(sp: URLSearchParams): Partial<State> {
  const out: Partial<State> = {};
  const k = CASES.find((c) => CASE_CODE[c] === sp.get("k"));
  if (k) out.case = k;
  const v = Number(sp.get("v"));
  if (v > 0) out.income = Math.min(v, 99_999_999_999);
  const x = Number(sp.get("x"));
  if (x > 0) out.exempt = Math.min(x, 99_999_999_999);
  const d = Number(sp.get("d"));
  if (Number.isInteger(d) && d >= 0) out.dependents = Math.min(d, MAX_DEPENDENTS);
  const g = Number(sp.get("g"));
  if ([1, 2, 3, 4].includes(g)) out.region = g as Region;
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
  const p = new URLSearchParams({ k: CASE_CODE[s.case], v: String(s.income), d: String(s.dependents), g: String(s.region), y: s.ruleId });
  if (s.exempt > 0) p.set("x", String(s.exempt));
  if (s.insCustom && s.insAmount > 0) p.set("b", String(s.insAmount));
  return p.toString();
}

const P = "tt";

export function PitCalcWithQuery() {
  const sp = useSearchParams();
  return <PitCalc initial={fromParams(new URLSearchParams(sp.toString()))} />;
}

export function PitCalc({ initial }: { initial?: Partial<State> }) {
  const start = { ...DEFAULTS, ...initial };
  const [kase, setKase] = useState<PitCase>(start.case);
  const [incomeText, setIncomeText] = useState(moneyText(start.income));
  const [exemptText, setExemptText] = useState(moneyText(start.exempt));
  const [dependents, setDependents] = useState(start.dependents);
  const [region, setRegion] = useState<Region>(start.region);
  const [insRadio, setInsRadio] = useState(start.insCustom);
  const [insText, setInsText] = useState(moneyText(start.insAmount));
  const [ruleId, setRuleId] = useState<RuleId>(start.ruleId);

  const resident = kase === "resident";
  const insCustom = resident && insRadio;
  const income = readMoney(incomeText, true, "Nhập thu nhập lớn hơn 0.");
  const exempt = kase === "short" ? { value: 0, error: "" } : readMoney(exemptText, false);
  const ins = insCustom ? readMoney(insText, true, "Nhập mức lương đóng bảo hiểm.") : { value: 0, error: "" };
  const exemptError =
    exempt.value > income.value && income.value > 0 ? "Phần miễn thuế lớn hơn tổng thu nhập, công cụ tính bằng tổng thu nhập." : exempt.error;

  const s: State = {
    case: kase,
    income: income.value,
    exempt: exempt.value,
    dependents,
    region,
    insCustom: insRadio,
    insAmount: insRadio ? readMoney(insText, true).value : 0,
    ruleId,
  };
  useQuerySync(toParams(s));

  const reset = () => {
    setKase(DEFAULTS.case);
    setIncomeText(moneyText(DEFAULTS.income));
    setExemptText("");
    setDependents(DEFAULTS.dependents);
    setRegion(DEFAULTS.region);
    setInsRadio(DEFAULTS.insCustom);
    setInsText("");
    setRuleId(DEFAULTS.ruleId);
  };

  const ready = s.income > 0 && (!insCustom || ins.value > 0);
  const input: PitInput = {
    case: kase,
    income: s.income,
    exempt: s.exempt,
    dependents,
    region,
    insuranceBase: insCustom ? ins.value : null,
    ruleId,
  };
  const t = pitTool;

  const form = (
    <>
      <FormHead step="Thông tin thu nhập" onReset={reset} />
      <Choice
        id={`${P}-case`}
        label="Bạn thuộc trường hợp nào?"
        attr="data-case"
        options={CASES.map((c) => ({ value: c, label: t.cases[c].label }))}
        value={kase}
        onChange={setKase}
      >
        {CASES.map((c) => (
          <p key={c} className="calc-hint calc-hint-ico" data-case-desc={c} hidden={c !== kase}>
            <Ico name="info" />
            <span>{fixCopy(t.cases[c].desc)}</span>
          </p>
        ))}
      </Choice>
      <MoneyField
        id={`${P}-income`}
        label={kase === "short" ? "Số tiền mỗi lần chi trả" : "Tổng thu nhập / tháng (Gross)"}
        text={incomeText}
        setText={setIncomeText}
        error={income.error}
        placeholder="VD: 30.000.000 hoặc 30tr"
        presets={t.presets}
        presetsLabel="Mức thu nhập gợi ý"
      />
      <MoneyField
        id={`${P}-exempt`}
        label="Trong đó: thu nhập miễn thuế"
        hint={t.exemptHint}
        text={exemptText}
        setText={setExemptText}
        error={exemptError}
        placeholder="Không có thì để trống"
        dataAttr="data-exempt-field"
        hidden={kase === "short"}
      />
      <div data-resident-only="" hidden={!resident}>
        <div className="calc-row">
          <Stepper id={`${P}-dep`} value={dependents} onChange={setDependents} />
          <RegionChoice p={P} value={region} onChange={setRegion} />
        </div>
        <RegionHelp p={P} />
        <Insurance
          p={P}
          fullTitle="Trên toàn bộ thu nhập"
          fullSub="Có mức trần theo quy định"
          customSub="Doanh nghiệp đóng trên lương cơ bản"
          custom={insRadio}
          setCustom={setInsRadio}
          text={insText}
          setText={setInsText}
          error={ins.error}
          ruleId={ruleId}
          region={region}
        />
        <RuleChoice p={P} value={ruleId} onChange={setRuleId} />
      </div>
    </>
  );

  const r = ready ? computePit(input) : null;
  const legal = [...salaryRules[CURRENT_RULE].legalBasis.slice(0, 2), t.legalExtra];

  return (
    <CalcShell
      p={P}
      kind="pit"
      title={t.calcTitle}
      form={form}
      resultRef={t.resultRef}
      result={
        r ? (
          <Result r={r} input={input} caseShort={t.cases[kase].short} />
        ) : (
          <EmptyState msg={`Nhập thu nhập${insCustom ? " và lương đóng bảo hiểm" : ""} để xem số thuế phải nộp.`} />
        )
      }
    >
      <div className="calc-breakdown calc-breakdown-two" data-breakdown="">
        {r && <Breakdown r={r} dependents={dependents} />}
      </div>
      <Legal list={legal} disclaimer={t.disclaimer} />
    </CalcShell>
  );
}

function Result({ r, input, caseShort }: { r: PitResult; input: PitInput; caseShort: string }) {
  const resident = r.case === "resident";
  const perPayment = r.case === "short";
  const old = resident && input.ruleId === "2026" ? taxUnderRules(r, input.dependents, "2025") : null;
  const saved = old === null ? 0 : old - r.tax;
  const extra = perPayment ? null : marginalTax(input);
  const threshold = resident
    ? taxFreeThreshold({ exempt: input.exempt, dependents: input.dependents, region: input.region, insuranceBase: null, ruleId: input.ruleId })
    : null;
  const parts: Part[] = [{ tone: "net", label: "Thực nhận", v: r.net }];
  if (resident) parts.push({ tone: "ins", label: "Bảo hiểm (NLĐ)", v: r.insurance.total });
  parts.push({ tone: "tax", label: "Thuế TNCN", v: r.tax });

  return (
    <>
      <BigNum
        eyebrow={`Thuế TNCN ${perPayment ? "khấu trừ mỗi lần chi trả" : "mỗi tháng"} · ${caseShort}`}
        value={r.tax}
        unit={perPayment ? "đ/lần" : "đ/tháng"}
      />
      <p className="calc-r-sub">
        {r.tax > 0 ? (
          <>
            Thuế suất thực tế <strong>{formatRate(r.effectiveRate, 2)}</strong>
            {resident && ` · bậc cao nhất ${formatRate(r.topRate)}`}
            {!perPayment && (
              <>
                {" · "}
                <Tn v={r.tax * 12} /> đ/năm
              </>
            )}
          </>
        ) : perPayment ? (
          `Dưới ${formatMoney(SHORT_TERM_THRESHOLD)} đ mỗi lần chi trả nên chưa bị khấu trừ.`
        ) : (
          "Bạn chưa phải nộp thuế với mức thu nhập này."
        )}
      </p>
      <SplitBar
        parts={parts}
        total={r.income}
        label={`Thực nhận ${formatMoney(r.net)} đồng, bảo hiểm ${formatMoney(r.insurance.total)} đồng, thuế ${formatMoney(r.tax)} đồng`}
      />
      <Legend parts={parts} />
      {extra !== null && (
        <RRow label="Mỗi 1 triệu tăng thêm">
          +<Tn v={extra} /> đ thuế
        </RRow>
      )}
      {threshold !== null && (
        <RRow label="Chưa nộp thuế nếu thu nhập từ">
          <Tn v={threshold} /> đ trở xuống
        </RRow>
      )}
      {saved > 0 && (
        <Delta
          badge={
            <>
              - <Tn v={saved} /> đ
            </>
          }
        >
          Nộp ít hơn mỗi tháng so với luật cũ (giảm trừ 11 triệu, biểu 7 bậc), <Tn v={saved * 12} /> đ mỗi năm.
        </Delta>
      )}
    </>
  );
}

function Breakdown({ r, dependents }: { r: PitResult; dependents: number }) {
  const resident = r.case === "resident";
  const perPayment = r.case === "short";
  const e = r.rules.employee;
  const notes = perPayment
    ? [
        `Áp dụng cho mỗi lần chi trả từ ${formatMoney(SHORT_TERM_THRESHOLD)} đ trở lên, không trừ bảo hiểm hay giảm trừ gia cảnh.`,
        "Đây là khoản tạm khấu trừ. Cuối năm, nếu tổng thu nhập sau giảm trừ chưa đến mức chịu thuế, bạn được hoàn khi quyết toán.",
        "Chỉ có một nguồn thu nhập và ước tính cả năm chưa đến mức chịu thuế: có thể làm cam kết mẫu 08/CK-TNCN để không bị khấu trừ.",
      ]
    : [
        "Không được giảm trừ gia cảnh cho bản thân và người phụ thuộc.",
        "Thu nhập chịu thuế xác định như với cá nhân cư trú: tổng thu nhập trừ các khoản được miễn.",
        'Ở Việt Nam từ 183 ngày trong năm hoặc có nơi ở thường xuyên thì là cá nhân cư trú: chọn "HĐLĐ từ 3 tháng".',
      ];
  return (
    <>
      <Card step="Diễn giải" title="Từ thu nhập đến số thuế">
        <table className="calc-table">
          <caption className="sr-only">Diễn giải chi tiết (VNĐ)</caption>
          <tbody>
            <Row label={perPayment ? "Số tiền chi trả" : "Tổng thu nhập"} cls="is-strong">
              <Signed n={r.income} />
            </Row>
            {!perPayment && (
              <>
                <Row label="Thu nhập miễn thuế">
                  <Signed n={r.exempt} s="-" />
                </Row>
                <Row label="Thu nhập chịu thuế" cls="is-sub">
                  <Signed n={r.taxableIncome} />
                </Row>
              </>
            )}
            {resident && (
              <>
                <Row label={`BHXH (${formatRate(e.social)})`}>
                  <Signed n={r.insurance.social} s="-" />
                </Row>
                <Row label={`BHYT (${formatRate(e.health)})`}>
                  <Signed n={r.insurance.health} s="-" />
                </Row>
                <Row label={`BHTN (${formatRate(e.unemployment)})`}>
                  <Signed n={r.insurance.unemployment} s="-" />
                </Row>
                <Row label="Giảm trừ bản thân">
                  <Signed n={r.personalDeduction} s="-" />
                </Row>
                <Row label={`Giảm trừ ${dependents} người phụ thuộc`}>
                  <Signed n={r.dependentDeduction} s="-" />
                </Row>
              </>
            )}
            <Row label="Thu nhập tính thuế" cls="is-sub">
              <Signed n={r.assessable} />
            </Row>
            <Row label={`Thuế TNCN${r.flatRate !== null ? ` (${formatRate(r.flatRate)})` : ""}`}>
              <Signed n={r.tax} s="-" />
            </Row>
            <Row label="Thực nhận" cls="is-total">
              <Signed n={r.net} />
            </Row>
          </tbody>
        </table>
      </Card>
      {resident ? (
        <Card step="Thuế theo bậc" title={`Biểu lũy tiến ${r.brackets.length} bậc`}>
          <BracketLadder brackets={r.brackets} amtLabel="Tính thuế" total={r.tax} />
        </Card>
      ) : (
        <Card
          step="Thuế suất cố định"
          title={`${formatRate(r.flatRate ?? 0)} trên ${perPayment ? "tổng thu nhập" : "thu nhập chịu thuế"}`}
          cls="is-dark"
        >
          <ul className="calc-notes">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
