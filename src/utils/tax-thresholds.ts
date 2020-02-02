interface TaxRate {
  rate: number;
}

export interface TaxThreshold<T = number | 'proportional'> {
  to: number;
  free: T;
  rate: TaxRate;
  main: boolean;
}

const taxRateIn1TaxThreshold = { rate: 0.17 };
const taxRateIn2TaxThreshold = { rate: 0.32 };

export const progressiveTaxThresholds: TaxThreshold[] = [
  { to: 8000, free: 8000, rate: taxRateIn1TaxThreshold, main: false },
  { to: 13000, free: 'proportional', rate: taxRateIn1TaxThreshold, main: false },
  { to: 85528, free: 3089, rate: taxRateIn1TaxThreshold, main: true },
  { to: 127000, free: 'proportional', rate: taxRateIn2TaxThreshold, main: false },
  { to: Infinity, free: 0, rate: taxRateIn2TaxThreshold, main: true }
];

export const linearTaxThresholds: TaxThreshold<number>[] = [{ to: Infinity, free: 0, rate: { rate: 0.19 }, main: true }];
