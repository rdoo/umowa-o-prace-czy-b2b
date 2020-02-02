import * as R from 'ramda';

import { MONTHS_LENGTH } from '../utils/constants';
import { round2 } from '../utils/helpers';
import { B2BMonthlyResult, B2BResult, CalculationInput } from '../utils/models';
import { Settings, ZUSTypes } from '../utils/settings';
import {
    attachPropertiesWithValues, attachPropertyWithValue, calcAverageResult, calcCumulativeArray, calcMonthlyTaxForB2B, calcSumResult, calcYearlyTax
} from './shared-formulas';

const calcRevenue = (settings: Settings) => (result: B2BMonthlyResult) => result.entry;

const calcBasisOfSocialInsurance = (settings: Settings) => (result: B2BMonthlyResult) => {
  switch (settings.b2bZUSType.value) {
    case ZUSTypes.NORMAL:
      return Array(MONTHS_LENGTH).fill(settings.basisOfSocialInsurancePremiumForNormalZUS.value * settings.averageWage.value);
    case ZUSTypes.PREFERENTIAL:
      return Array(MONTHS_LENGTH).fill(settings.basisOfSocialInsurancePremiumForPreferentialZUS.value * settings.minimumWage.value);
    case ZUSTypes.NONE:
      const monthsOfNoneZUS = 6;
      return [
        ...Array(monthsOfNoneZUS).fill(0),
        ...Array(MONTHS_LENGTH - monthsOfNoneZUS).fill(settings.basisOfSocialInsurancePremiumForPreferentialZUS.value * settings.minimumWage.value)
      ];
    default:
      throw new Error('Unknown ZUS type: ' + settings.b2bZUSType.value);
  }
};

const calcTotalCost = (settings: Settings) => (result: B2BMonthlyResult) => result.revenue;

const calcPensionInsurance = (settings: Settings) => (result: B2BMonthlyResult) =>
  round2(result.basisOfSocialInsurance * settings.b2bPensionInsurancePremium.value);

const calcDisabilityInsurance = (settings: Settings) => (result: B2BMonthlyResult) =>
  round2(result.basisOfSocialInsurance * settings.b2bDisabilityInsurancePremium.value);

const calcSicknessInsurance = (settings: Settings) => (result: B2BMonthlyResult) =>
  settings.b2bSicknessInsuranceEnabled.value ? round2(result.basisOfSocialInsurance * settings.b2bSicknessInsurancePremium.value) : 0;

const calcAccidentInsurance = (settings: Settings) => (result: B2BMonthlyResult) =>
  round2(result.basisOfSocialInsurance * settings.b2bAccidentInsurancePremium.value);

// TODO not paid below minimum wage???
const calcFP = (settings: Settings) => (result: B2BMonthlyResult) =>
  settings.b2bZUSType.value === ZUSTypes.NORMAL ? round2(result.basisOfSocialInsurance * settings.b2bFPPremium.value) : 0;

const calcFGSP = (settings: Settings) => (result: B2BMonthlyResult) => 0; // no FGŚP in B2B

const calcPPK = (settings: Settings) => (result: B2BMonthlyResult) => 0; // TODO no PPK in B2B?

const calcRevenueWithoutSocialInsurance = (settings: Settings) => (result: B2BMonthlyResult) =>
  result.revenue - result.pensionInsurance - result.disabilityInsurance - result.sicknessInsurance - result.accidentInsurance - result.fp;

// TODO should this be lowered to taxBeforeDeductions? seems like not
const calcHealthInsurance = (settings: Settings) => (result: B2BMonthlyResult) =>
  round2(settings.basisOfHealthInsurancePremium.value * settings.averageWageInEnterpriseSector.value * settings.b2bHealthInsurancePremium.value);

// TODO should this be lowered to taxBeforeDeductions? seems like not
// TODO is this rounded to 2?
const calcHealthInsuranceDeductible = (settings: Settings) => (result: B2BMonthlyResult) =>
  round2(
    settings.basisOfHealthInsurancePremium.value * settings.averageWageInEnterpriseSector.value * settings.b2bHealthInsurancePremiumDeductible.value
  );

// TODO taxDeductibleExpenses?
const calcIncome = (settings: Settings) => (result: B2BMonthlyResult) => Math.round(result.revenueWithoutSocialInsurance);

const calcIncomeMovingSums = (settings: Settings) => (results: B2BMonthlyResult[]) => R.pipe(R.pluck('income'), calcCumulativeArray)(results);

const calcTaxBeforeDeductions = (settings: Settings) => (result: B2BMonthlyResult) =>
  calcMonthlyTaxForB2B(
    settings.b2bLinearTaxEnabled.value ? settings.linearTaxThresholds : settings.progressiveTaxThresholds,
    result.incomeMovingSum,
    result.income
  );

// TODO can be negative if healthInsuranceDeductible is not lowered to taxBeforeDeductions
const calcTax = (settings: Settings) => (result: B2BMonthlyResult) =>
  Math.max(Math.round(result.taxBeforeDeductions - result.healthInsuranceDeductible), 0);

const calcNet = (settings: Settings) => (result: B2BMonthlyResult) => result.revenueWithoutSocialInsurance - result.healthInsurance - result.tax;

// max 0 needed because healthInsuranceDeductible can be positive while tax is equal 0
const calcYearlyTaxCorrection = (settings: Settings) => (result: B2BResult) => {
  return Math.round(
    Math.max(
      calcYearlyTax(settings.b2bLinearTaxEnabled.value ? settings.linearTaxThresholds : settings.progressiveTaxThresholds, result.sum.income) -
        result.sum.healthInsuranceDeductible,
      0
    ) - result.sum.tax
  );
};

const adjustSumResultWithTaxCorrection = (result: B2BResult) =>
  R.pipe(
    R.assocPath(['sum', 'tax'], result.sum.tax + result.yearlyTaxCorrection),
    R.assocPath(['sum', 'net'], result.sum.net - result.yearlyTaxCorrection)
  )(result);

export function calcB2BResult(settings: Settings): B2BResult | null {
  if (settings.b2bMonths.every(month => !month.entry)) {
    return null;
  }

  const calcMonthlyResults = R.pipe(
    (result: B2BResult) => result.monthly,
    R.map(R.pipe(attachPropertyWithValue('revenue', calcRevenue(settings)))),
    attachPropertiesWithValues('basisOfSocialInsurance', calcBasisOfSocialInsurance(settings)),
    R.map(
      // cast to avoid 10 arguments type limit
      (R.pipe as any)(
        attachPropertyWithValue('totalCost', calcTotalCost(settings)),
        attachPropertyWithValue('pensionInsurance', calcPensionInsurance(settings)),
        attachPropertyWithValue('disabilityInsurance', calcDisabilityInsurance(settings)),
        attachPropertyWithValue('sicknessInsurance', calcSicknessInsurance(settings)),
        attachPropertyWithValue('accidentInsurance', calcAccidentInsurance(settings)),
        attachPropertyWithValue('fp', calcFP(settings)),
        attachPropertyWithValue('fgsp', calcFGSP(settings)),
        attachPropertyWithValue('ppk', calcPPK(settings)),
        attachPropertyWithValue('revenueWithoutSocialInsurance', calcRevenueWithoutSocialInsurance(settings)),
        attachPropertyWithValue('healthInsurance', calcHealthInsurance(settings)),
        attachPropertyWithValue('healthInsuranceDeductible', calcHealthInsuranceDeductible(settings)),
        attachPropertyWithValue('income', calcIncome(settings))
      )
    ),
    attachPropertiesWithValues('incomeMovingSum', calcIncomeMovingSums(settings)),
    R.map(
      R.pipe(
        attachPropertyWithValue('taxBeforeDeductions', calcTaxBeforeDeductions(settings)),
        attachPropertyWithValue('tax', calcTax(settings)),
        attachPropertyWithValue('net', calcNet(settings))
      )
    )
  );

  const calcResult: (input: CalculationInput) => B2BResult = R.pipe(
    attachPropertyWithValue('monthly', calcMonthlyResults),
    attachPropertyWithValue('sum', calcSumResult),
    attachPropertyWithValue('yearlyTaxCorrection', calcYearlyTaxCorrection(settings)),
    adjustSumResultWithTaxCorrection,
    attachPropertyWithValue('average', calcAverageResult)
  );

  return calcResult({ monthly: settings.b2bMonths.map(month => ({ ...month, entry: month.entry || 0 })) });
}
