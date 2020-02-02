import { SettingValue } from '../utils/settings';
import { TaxThreshold } from '../utils/tax-thresholds';

export const enum Actions {
  UPDATE_SETTING = 'UPDATE_SETTING',
  UPDATE_PROGRESSIVE_TAX_THRESHOLDS = 'UPDATE_PROGRESSIVE_TAX_THRESHOLDS',
  UPDATE_LINEAR_TAX_THRESHOLDS = 'UPDATE_LINEAR_TAX_THRESHOLDS',
  UPDATE_EMPLOYMENT_MONTH_VALUE = 'UPDATE_EMPLOYMENT_MONTH_VALUE',
  UPDATE_B2B_MONTH_VALUE = 'UPDATE_B2B_MONTH_VALUE'
}

export function updateSetting(key: string, value: SettingValue) {
  return {
    type: Actions.UPDATE_SETTING,
    payload: {
      key,
      value
    }
  };
}

export function updateProgressiveTaxThresholds(taxThresholds: TaxThreshold[]) {
  return {
    type: Actions.UPDATE_PROGRESSIVE_TAX_THRESHOLDS,
    payload: taxThresholds
  };
}

export function updateLinearTaxThresholds(taxThresholds: TaxThreshold[]) {
  return {
    type: Actions.UPDATE_LINEAR_TAX_THRESHOLDS,
    payload: taxThresholds
  };
}

export function updateEmploymentMonthEntry(index: number, entry: number) {
  return {
    type: Actions.UPDATE_EMPLOYMENT_MONTH_VALUE,
    payload: {
      index,
      entry
    }
  };
}

export function updateB2BMonthEntry(index: number, entry: number) {
  return {
    type: Actions.UPDATE_B2B_MONTH_VALUE,
    payload: {
      index,
      entry
    }
  };
}
