import { updateB2BMonthEntry, updateEmploymentMonthEntry, updateLinearTaxThresholds, updateProgressiveTaxThresholds, updateSetting } from './actions';
import { initialState, settingsReducer } from './reducers';

describe(__filename.slice(__dirname.length + 1, -8), () => {
  describe('settingsReducer', () => {
    it('properly updates a setting', () => {
      const state = initialState.settings;

      expect(state.ageOver26.value).toBe(true);

      const action = updateSetting(state.ageOver26.key, false);
      const newState = settingsReducer(state, action);

      expect(newState.ageOver26.value).toBe(false);
    });

    it('properly updates progressive tax thresholds', () => {
      const state = initialState.settings;
      const newTaxThresholds = [{ to: 8000, free: 0, rate: { rate: 0.19 }, main: true }];
      const action = updateProgressiveTaxThresholds(newTaxThresholds);
      const newState = settingsReducer(state, action);

      expect(newState.progressiveTaxThresholds).toEqual(newTaxThresholds);
    });

    it('properly updates linear tax thresholds', () => {
      const state = initialState.settings;
      const newTaxThresholds = [{ to: 8000, free: 0, rate: { rate: 0.19 }, main: true }];
      const action = updateLinearTaxThresholds(newTaxThresholds);
      const newState = settingsReducer(state, action);

      expect(newState.linearTaxThresholds).toEqual(newTaxThresholds);
    });

    it('properly updates employment month entry', () => {
      const state = initialState.settings;
      const monthIndex = 2;
      const monthEntry = 5000;
      const action = updateEmploymentMonthEntry(monthIndex, monthEntry);
      const newState = settingsReducer(state, action);

      expect(newState.employmentMonths[monthIndex].entry).toBe(monthEntry);
    });

    it('properly updates B2B month entry', () => {
      const state = initialState.settings;
      const monthIndex = 2;
      const monthEntry = 5000;
      const action = updateB2BMonthEntry(monthIndex, monthEntry);
      const newState = settingsReducer(state, action);

      expect(newState.b2bMonths[monthIndex].entry).toBe(monthEntry);
    });
  });
});
