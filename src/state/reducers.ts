import { AnyAction } from 'redux';

import { calcB2BResult } from '../formulas/b2b-formulas';
import { calcEmploymentResult } from '../formulas/employment-formulas';
import { settings, Settings } from '../utils/settings';
import { Actions } from './actions';

export const initialState = {
  settings,
  employmentResult: calcEmploymentResult(settings),
  b2bResult: calcB2BResult(settings)
};

export type State = typeof initialState;

export function reducer(state = initialState, action: AnyAction): State {
  const settings = settingsReducer(state.settings, action);
  const employmentResult = calcEmploymentResult(settings);
  const b2bResult = calcB2BResult(settings);

  return {
    settings,
    employmentResult,
    b2bResult
  };
}

export function settingsReducer(state: Settings = initialState.settings, action: AnyAction): Settings {
  switch (action.type) {
    case Actions.UPDATE_SETTING:
      const newState = {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          value: action.payload.value
        }
      };

      if (action.payload.key === state.employmentEntryValue.key) {
        newState.employmentMonths = state.employmentMonths.map(month => ({ ...month, entry: action.payload.value }));
      }

      if (action.payload.key === state.b2bEntryValue.key) {
        newState.b2bMonths = state.b2bMonths.map(month => ({ ...month, entry: action.payload.value }));
      }

      return newState;
    case Actions.UPDATE_PROGRESSIVE_TAX_THRESHOLDS:
      return {
        ...state,
        progressiveTaxThresholds: action.payload
      };
    case Actions.UPDATE_LINEAR_TAX_THRESHOLDS:
      return {
        ...state,
        linearTaxThresholds: action.payload
      };
    case Actions.UPDATE_EMPLOYMENT_MONTH_VALUE:
      return {
        ...state,
        employmentMonths: state.employmentMonths.map((month, index) => {
          if (index === action.payload.index) {
            return { ...month, entry: action.payload.entry };
          }
          return { ...month };
        })
      };
    case Actions.UPDATE_B2B_MONTH_VALUE:
      return {
        ...state,
        b2bMonths: state.b2bMonths.map((month, index) => {
          if (index === action.payload.index) {
            return { ...month, entry: action.payload.entry };
          }
          return { ...month };
        })
      };
    default:
      return state;
  }
}
