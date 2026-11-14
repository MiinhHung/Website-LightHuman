export type Region = 1 | 2 | 3 | 4;

export type TaxBracket = {
  readonly max: number;
  readonly rate: number;
  readonly quick: number;
};

export type SalaryRuleSet = {
  readonly baseSalary: number;
  readonly regionalMinimum: Record<Region, number>;
  readonly socialCapMultiplier: number;
  readonly unemploymentCapMultiplier: number;
  readonly rates: {
    readonly employee: {
      readonly social: number;
      readonly health: number;
      readonly unemployment: number;
    };
    readonly employer: {
      readonly social: number;
      readonly health: number;
      readonly unemployment: number;
      readonly union: number;
    };
  };
  readonly personalDeduction: number;
  readonly dependentDeduction: number;
  readonly brackets: readonly TaxBracket[];
};

export type SalaryInput = {
  salary: number;
  region: Region;
  dependents: number;
  insuranceSalary?: number;
};

export type BracketRow = {
  tier: number;
  threshold: string;
  rate: number;
  taxableInBracket: number;
  tax: number;
};

export type SalaryResult = {
  gross: number;
  net: number;
  insurance: {
    social: number;
    health: number;
    unemployment: number;
    total: number;
  };
  employer: {
    social: number;
    health: number;
    unemployment: number;
    union: number;
    total: number;
    cost: number;
  };
  beforeTax: number;
  deductions: {
    personal: number;
    dependents: number;
    total: number;
  };
  taxable: number;
  pit: number;
  brackets: readonly BracketRow[];
};

export type PitCase = "resident" | "short" | "nonresident";

export type PitInput = {
  salary: number;
  region: Region;
  dependents: number;
  insuranceSalary?: number;
  pitCase: PitCase;
  customDeduction?: number;
};

export type PitResult = {
  caseType: PitCase;
  gross: number;
  beforeTax: number;
  deduction: number;
  taxable: number;
  tax: number;
  net: number;
  effectiveRate: number;
  marginalRate: number;
  brackets: readonly BracketRow[];
};
