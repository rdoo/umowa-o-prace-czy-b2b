// @ts-nocheck

import * as R from 'ramda';

import { MONTHS_LENGTH } from '../utils/constants';
import { TaxThreshold } from '../utils/tax-thresholds';

export const reduceIndexed = R.addIndex(R.reduce);

export const calcCumulativeArray = R.pipe(R.scan(R.add, 0), R.tail);

export const attachPropertyWithValue = R.curry((propertyName: string, propertyValueFunction: (...args: any) => any) =>
  R.converge(R.assoc(propertyName), [propertyValueFunction, R.identity])
);

export const attachPropertiesWithValues = R.curry((propertyName: string, propertyValueFunction: (...args: any) => any[]) =>
  R.converge(R.zipWith(R.assoc(propertyName)), [propertyValueFunction, R.identity])
);

export const calcSumResult = R.pipe(R.prop('monthly'), R.converge(R.reduce(R.mergeWith(R.add)), [R.head, R.tail]), R.assoc('name', 'Suma'));

export const calcAverageResult = R.pipe(R.prop('sum'), R.map(R.divide(R.__, MONTHS_LENGTH)), R.assoc('name', 'Średnia'));

export const getMainTaxThresholds = R.filter(R.propEq('main', true));

export const getTaxThresholdsWithNoTax = (taxThresholds: TaxThreshold[], noTaxLimit: number) => [
  { to: noTaxLimit, free: noTaxLimit, rate: { rate: 0 }, main: true },
  ...taxThresholds.map(item => ({ ...item, to: item.to + noTaxLimit }))
];

export const calcProportionalTaxAllowance = (
  currTaxThreshold: TaxThreshold,
  prevTaxThreshold: TaxThreshold<number>,
  nextTaxThreshold: TaxThreshold<number>,
  income: number
) =>
  // formula based on examples from https://pl.wikipedia.org/wiki/Kwota_wolna_od_podatku
  prevTaxThreshold.free * prevTaxThreshold.rate.rate -
  ((prevTaxThreshold.free * prevTaxThreshold.rate.rate - nextTaxThreshold.free * nextTaxThreshold.rate.rate) * (income - prevTaxThreshold.to)) /
    (currTaxThreshold.to - prevTaxThreshold.to);

export const calcYearlyTaxAllowance = R.curry((taxThresholds: TaxThreshold[], income: number) =>
  reduceIndexed(
    (acc: number, curr: TaxThreshold, index: number, array: TaxThreshold[]) => {
      const prev = array[index - 1];
      if (income <= curr.to && (!prev || income > prev.to)) {
        if (typeof curr.free === 'number') {
          return curr.free * curr.rate.rate;
        }

        const next = array[index + 1];
        return calcProportionalTaxAllowance(curr, prev, next, income);
      }

      return acc;
    },
    0,
    taxThresholds
  )
);

export const calcMonthlyTaxAllowance = R.curry(
  (taxThresholds: TaxThreshold[], income: number) => calcYearlyTaxAllowance(getMainTaxThresholds(taxThresholds), income) / MONTHS_LENGTH
);

export const calcYearlyTax = R.curry((taxThresholds: TaxThreshold[], yearlyIncome: number) => {
  if (yearlyIncome < 0) {
    return 0;
  }

  let incomeToTax = yearlyIncome;
  let prevTaxedIncome = 0;

  return R.pipe(
    getMainTaxThresholds,
    R.reduce((acc: number, taxThreshold: TaxThreshold) => {
      const taxedIncome = R.min(incomeToTax, taxThreshold.to - prevTaxedIncome);
      incomeToTax -= taxedIncome;
      prevTaxedIncome = taxedIncome;
      return (acc += taxedIncome * taxThreshold.rate.rate);
    }, 0),
    R.subtract(R.__, calcYearlyTaxAllowance(taxThresholds, yearlyIncome)),
    R.max(0)
  )(taxThresholds);
});

export const calcMonthlyTaxForEmployment = R.curry((taxThresholds: TaxThreshold[], totalIncome: number, monthlyIncome: number) => {
  if (monthlyIncome < 0) {
    return 0;
  }

  const prevMonthTotalIncome = totalIncome - monthlyIncome;

  return R.pipe(
    getMainTaxThresholds,
    // find correct tax threshold (only 1 is needed for monthly tax for employment)
    reduceIndexed((acc: TaxThreshold, curr: TaxThreshold, index: number, array: TaxThreshold[]) => {
      const prev = array[index - 1];
      if (prevMonthTotalIncome <= curr.to && (!prev || prevMonthTotalIncome > prev.to)) {
        return curr;
      }
      return acc;
    }, null),
    (taxThreshold: TaxThreshold) => monthlyIncome * taxThreshold.rate.rate,
    R.subtract(R.__, calcMonthlyTaxAllowance(taxThresholds, prevMonthTotalIncome)),
    R.max(0)
  )(taxThresholds);
});

export const calcMonthlyTaxForB2B = R.curry((taxThresholds: TaxThreshold[], totalIncome: number, monthlyIncome: number) => {
  if (monthlyIncome < 0) {
    return 0;
  }

  const prevMonthTotalIncome = totalIncome - monthlyIncome;
  let incomeToTax = monthlyIncome;

  return R.pipe(
    getMainTaxThresholds,
    R.reduce((acc: number, taxThreshold: TaxThreshold) => {
      if (prevMonthTotalIncome > taxThreshold.to) {
        return acc;
      }

      const taxedIncome = R.min(incomeToTax, taxThreshold.to - prevMonthTotalIncome);
      incomeToTax -= taxedIncome;
      return (acc += taxedIncome * taxThreshold.rate.rate);
    }, 0),
    R.subtract(R.__, calcMonthlyTaxAllowance(taxThresholds, prevMonthTotalIncome)),
    R.max(0)
  )(taxThresholds);
});
