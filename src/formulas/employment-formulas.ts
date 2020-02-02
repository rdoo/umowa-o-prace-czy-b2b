import * as R from 'ramda';

import { MONTHS_LENGTH } from '../utils/constants';
import { round2 } from '../utils/helpers';
import { CalculationInput, EmploymentMonthlyResult, EmploymentResult } from '../utils/models';
import { Settings } from '../utils/settings';
import {
    attachPropertiesWithValues, attachPropertyWithValue, calcAverageResult, calcCumulativeArray, calcMonthlyTaxForEmployment, calcSumResult,
    calcYearlyTax, getTaxThresholdsWithNoTax
} from './shared-formulas';

const calcRevenue = (settings: Settings) => (result: EmploymentMonthlyResult) => result.entry;

// used when calculating pension and disability insurances as those are limited to 30 times average wage
const calcRevenuesBelow30TimesLimit = (settings: Settings) => (results: EmploymentMonthlyResult[]) => {
  let revenueLimit = 30 * settings.averageWage.value;

  return results.map(result => {
    const revenue = Math.min(result.revenue, revenueLimit);
    revenueLimit -= revenue;

    return revenue;
  });
};

const calcEmployerPensionInsurance = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  round2(result.revenueBelow30TimesLimit * settings.employerPensionInsurancePremium.value);

const calcEmployerDisabilityInsurance = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  round2(result.revenueBelow30TimesLimit * settings.employerDisabilityInsurancePremium.value);

const calcEmployerAccidentInsurance = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  round2(result.revenue * settings.employerAccidentInsurancePremium.value);

// not paid when wage below minimum, TODO there are other circumstances albeit minor ones
const calcEmployerFP = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  result.revenue < settings.minimumWage.value ? 0 : round2(result.revenue * settings.employerFPPremium.value);

const calcEmployerFGSP = (settings: Settings) => (result: EmploymentMonthlyResult) => round2(result.revenue * settings.employerFGSPPremium.value);

// TODO is this rounded to 2?
const calcEmployerPPK = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  settings.ppkEnabled.value ? round2(result.revenue * settings.employerPPKPremium.value) : 0;

const calcTotalCost = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  result.revenue +
  result.employerPPK +
  result.employerPensionInsurance +
  result.employerDisabilityInsurance +
  result.accidentInsurance +
  result.fp +
  result.fgsp;

const calcEmployeePensionInsurance = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  round2(result.revenueBelow30TimesLimit * settings.employeePensionInsurancePremium.value);

const calcEmployeeDisabilityInsurance = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  round2(result.revenueBelow30TimesLimit * settings.employeeDisabilityInsurancePremium.value);

const calcEmployeeSicknessInsurance = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  round2(result.revenue * settings.employeeSicknessInsurancePremium.value);

// TODO is this rounded to 2?
const calcEmployeePPK = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  settings.ppkEnabled.value ? round2(result.revenue * settings.employeePPKPremium.value) : 0;

const calcTotalPensionInsurance = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  result.employerPensionInsurance + result.employeePensionInsurance;

const calcTotalDisabilityInsurance = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  result.employerDisabilityInsurance + result.employeeDisabilityInsurance;

const calcTotalPPK = (settings: Settings) => (result: EmploymentMonthlyResult) => result.employeePPK + result.employerPPK;

const calcRevenueWithoutSocialInsurance = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  result.revenue - result.employeePensionInsurance - result.employeeDisabilityInsurance - result.sicknessInsurance;

// TODO holidays, sickness
const calcCopyrightTaxDeductibleExpenses = (settings: Settings) => (results: EmploymentMonthlyResult[]) => {
  if (!settings.copyrightTaxDeductibleExpensesEnabled.value) {
    return Array(MONTHS_LENGTH).fill(0);
  }

  let yearlyCopyrightTaxDeductibleExpensesLimit = settings.limitOfCopyrightTaxDeductibleExpenses.value;
  return results.map(result => {
    const copyrightExpenses = Math.min(
      0.5 * settings.copyrightTaxDeductibleExpenses.value * result.revenueWithoutSocialInsurance,
      yearlyCopyrightTaxDeductibleExpensesLimit
    );
    yearlyCopyrightTaxDeductibleExpensesLimit -= copyrightExpenses;

    return copyrightExpenses;
  });
};

// TODO should employeeTaxDeductibleExpenses be equal 0 when fully on copyright expenses?
const calcTaxDeductibleExpenses = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  result.copyrightTaxDeductibleExpenses +
  (settings.employmentOutsidePlaceOfResidence.value
    ? settings.employeeTaxDeductibleExpensesOutsidePlaceOfResidence.value
    : settings.employeeTaxDeductibleExpensesInPlaceOfResidence.value);

// can be negative
const calcIncome = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  Math.round(result.revenueWithoutSocialInsurance - result.taxDeductibleExpenses);

const calcIncomeMovingSums = (settings: Settings) => (results: EmploymentMonthlyResult[]) => R.pipe(R.pluck('income'), calcCumulativeArray)(results);

const calcTaxBeforeDeductions = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  calcMonthlyTaxForEmployment(settings.progressiveTaxThresholds, result.incomeMovingSum, result.income);

// lower health insurance to tax before deductions
const calcEmployeeHealthInsurance = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  round2(Math.min(result.revenueWithoutSocialInsurance * settings.employeeHealthInsurancePremium.value, result.taxBeforeDeductions));

const adjustTaxForYoungs = (settings: Settings) => (result: EmploymentMonthlyResult) => {
  if (settings.ageOver26.value) {
    return result.taxBeforeDeductions;
  }

  return calcMonthlyTaxForEmployment(
    getTaxThresholdsWithNoTax(settings.progressiveTaxThresholds, settings.limitForNoIncomeTaxUnder26.value),
    result.incomeMovingSum,
    result.income
  );
};

// lower health insurance deductible to tax before deductions
// TODO is this rounded to 2?
const calcEmployeeHealthInsuranceDeductible = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  round2(Math.min(result.revenueWithoutSocialInsurance * settings.employeeHealthInsurancePremiumDeductible.value, result.taxBeforeDeductions));

// cant be negative because healthInsuranceDeductible is at max equal to taxBeforeDeductions
const calcTax = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  Math.round(result.taxBeforeDeductions - result.healthInsuranceDeductible);

const calcNet = (settings: Settings) => (result: EmploymentMonthlyResult) =>
  result.revenueWithoutSocialInsurance - result.healthInsurance - result.employeePPK - result.tax;

// max 0 needed because healthInsuranceDeductible can be positive while tax is equal 0
const calcYearlyTaxCorrection = (settings: Settings) => (result: EmploymentResult) =>
  Math.round(
    Math.max(
      calcYearlyTax(
        settings.ageOver26.value
          ? settings.progressiveTaxThresholds
          : getTaxThresholdsWithNoTax(settings.progressiveTaxThresholds, settings.limitForNoIncomeTaxUnder26.value),
        result.sum.income
      ) - result.sum.healthInsuranceDeductible,
      0
    ) - result.sum.tax
  );

const adjustSumResultWithTaxCorrection = (result: EmploymentResult) =>
  R.pipe(
    R.assocPath(['sum', 'tax'], result.sum.tax + result.yearlyTaxCorrection),
    R.assocPath(['sum', 'net'], result.sum.net - result.yearlyTaxCorrection)
  )(result);

export function calcEmploymentResult(settings: Settings): EmploymentResult | null {
  if (settings.employmentMonths.every(month => !month.entry)) {
    return null;
  }

  const calcMonthlyResults = R.pipe(
    (result: EmploymentResult) => result.monthly,
    R.map(R.pipe(attachPropertyWithValue('revenue', calcRevenue(settings)))),
    attachPropertiesWithValues('revenueBelow30TimesLimit', calcRevenuesBelow30TimesLimit(settings)),
    R.map(
      // cast to avoid 10 arguments type limit
      (R.pipe as any)(
        attachPropertyWithValue('employerPensionInsurance', calcEmployerPensionInsurance(settings)),
        attachPropertyWithValue('employerDisabilityInsurance', calcEmployerDisabilityInsurance(settings)),
        attachPropertyWithValue('accidentInsurance', calcEmployerAccidentInsurance(settings)),
        attachPropertyWithValue('fp', calcEmployerFP(settings)),
        attachPropertyWithValue('fgsp', calcEmployerFGSP(settings)),
        attachPropertyWithValue('employerPPK', calcEmployerPPK(settings)),
        attachPropertyWithValue('totalCost', calcTotalCost(settings)),
        attachPropertyWithValue('employeePensionInsurance', calcEmployeePensionInsurance(settings)),
        attachPropertyWithValue('employeeDisabilityInsurance', calcEmployeeDisabilityInsurance(settings)),
        attachPropertyWithValue('sicknessInsurance', calcEmployeeSicknessInsurance(settings)),
        attachPropertyWithValue('employeePPK', calcEmployeePPK(settings)),
        attachPropertyWithValue('pensionInsurance', calcTotalPensionInsurance(settings)),
        attachPropertyWithValue('disabilityInsurance', calcTotalDisabilityInsurance(settings)),
        attachPropertyWithValue('ppk', calcTotalPPK(settings)),
        attachPropertyWithValue('revenueWithoutSocialInsurance', calcRevenueWithoutSocialInsurance(settings))
      )
    ),
    attachPropertiesWithValues('copyrightTaxDeductibleExpenses', calcCopyrightTaxDeductibleExpenses(settings)),
    R.map(
      R.pipe(
        attachPropertyWithValue('taxDeductibleExpenses', calcTaxDeductibleExpenses(settings)),
        attachPropertyWithValue('income', calcIncome(settings))
      )
    ),
    attachPropertiesWithValues('incomeMovingSum', calcIncomeMovingSums(settings)),
    R.map(
      R.pipe(
        attachPropertyWithValue('taxBeforeDeductions', calcTaxBeforeDeductions(settings)), // need to calculate original taxBeforeDeductions even for youngs to properly limit healthInsurance
        attachPropertyWithValue('healthInsurance', calcEmployeeHealthInsurance(settings)),
        attachPropertyWithValue('taxBeforeDeductions', adjustTaxForYoungs(settings)),
        attachPropertyWithValue('healthInsuranceDeductible', calcEmployeeHealthInsuranceDeductible(settings)),
        attachPropertyWithValue('tax', calcTax(settings)),
        attachPropertyWithValue('net', calcNet(settings))
      )
    )
  );

  const calcResult: (input: CalculationInput) => EmploymentResult = R.pipe(
    attachPropertyWithValue('monthly', calcMonthlyResults),
    attachPropertyWithValue('sum', calcSumResult),
    attachPropertyWithValue('yearlyTaxCorrection', calcYearlyTaxCorrection(settings)),
    adjustSumResultWithTaxCorrection,
    attachPropertyWithValue('average', calcAverageResult)
  );

  return calcResult({ monthly: settings.employmentMonths.map(month => ({ ...month, entry: month.entry || 0 })) });
}
