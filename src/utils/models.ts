export interface MonthlyResult {
  name: string;
  entry: number;
  revenue: number;
  revenueWithoutSocialInsurance: number;
  pensionInsurance: number;
  disabilityInsurance: number;
  sicknessInsurance: number;
  accidentInsurance: number;
  healthInsurance: number;
  healthInsuranceDeductible: number;
  fp: number;
  fgsp: number;
  ppk: number;
  income: number;
  incomeMovingSum: number;
  taxBeforeDeductions: number;
  tax: number;
  net: number;
  totalCost: number;
}

export interface EmploymentMonthlyResult extends MonthlyResult {
  revenueBelow30TimesLimit: number;
  employeePensionInsurance: number;
  employerPensionInsurance: number;
  employeeDisabilityInsurance: number;
  employerDisabilityInsurance: number;
  employeePPK: number;
  employerPPK: number;
  copyrightTaxDeductibleExpenses: number;
  taxDeductibleExpenses: number;
}

export interface B2BMonthlyResult extends MonthlyResult {
  basisOfSocialInsurance: number;
}

export interface Result<T extends MonthlyResult> {
  monthly: T[];
  average: T;
  sum: T;
  yearlyTaxCorrection: number;
}

export type EmploymentResult = Result<EmploymentMonthlyResult>;

export type B2BResult = Result<B2BMonthlyResult>;

export interface CalculationInput {
  monthly: {
    name: string;
    entry: number;
  }[];
}
