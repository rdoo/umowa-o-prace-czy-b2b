import * as React from 'react';

import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';

import { updateEmploymentMonthEntry, updateProgressiveTaxThresholds, updateSetting } from '../../state/actions';
import { State } from '../../state/reducers';
import { SettingValue } from '../../utils/settings';
import { TaxThreshold } from '../../utils/tax-thresholds';
import { MonthlyEntryTable } from '../shared/monthly-entry-table';
import { SettingsSection } from '../shared/settings-section';
import { TaxThresholdTable } from '../shared/tax-threshold-table';

export function EmploymentDetailedSettings() {
  const settings = useSelector((state: State) => {
    const settings = state.settings;

    return {
      months: settings.employmentMonths,
      general: [
        settings.employmentEntryValue,
        settings.ageOver26,
        settings.limitForNoIncomeTaxUnder26,
        settings.ppkEnabled,
        settings.employeePPKPremium,
        settings.employerPPKPremium,
        settings.minimumWage
      ],
      taxDeductibleExpenses: [
        settings.employmentOutsidePlaceOfResidence,
        settings.employeeTaxDeductibleExpensesInPlaceOfResidence,
        settings.employeeTaxDeductibleExpensesOutsidePlaceOfResidence,
        settings.copyrightTaxDeductibleExpensesEnabled,
        settings.copyrightTaxDeductibleExpenses,
        settings.limitOfCopyrightTaxDeductibleExpenses
      ],
      employeeInsurances: [
        settings.employeePensionInsurancePremium,
        settings.employeeDisabilityInsurancePremium,
        settings.employeeSicknessInsurancePremium,
        settings.employeeHealthInsurancePremium,
        settings.employeeHealthInsurancePremiumDeductible
      ],
      employerInsurances: [
        settings.employerPensionInsurancePremium,
        settings.employerDisabilityInsurancePremium,
        settings.employerAccidentInsurancePremium,
        settings.employerFPPremium,
        settings.employerFGSPPremium
      ],
      progressiveTaxThresholds: settings.progressiveTaxThresholds
    };
  });
  const dispatch = useDispatch();

  const dispatchUpdateSetting = React.useCallback((key: string, value: SettingValue) => dispatch(updateSetting(key, value)), []);
  const dispatchUpdateEmploymentMonthEntry = React.useCallback(
    (index: number, value: number) => dispatch(updateEmploymentMonthEntry(index, value)),
    []
  );
  const dispatchUpdateProgressiveTaxThresholds = React.useCallback(
    (taxThresholds: TaxThreshold[]) => dispatch(updateProgressiveTaxThresholds(taxThresholds)),
    []
  );

  return (
    <>
      <Typography variant="h6" component="h3" gutterBottom>
        Ustawienia ogólne
      </Typography>
      <SettingsSection settings={settings.general} onChange={dispatchUpdateSetting}></SettingsSection>

      <Typography variant="h6" component="h3" gutterBottom>
        Kwota brutto w poszczególnych miesiącach
      </Typography>
      <MonthlyEntryTable months={settings.months} onChange={dispatchUpdateEmploymentMonthEntry}></MonthlyEntryTable>

      <Typography variant="h6" component="h3" gutterBottom>
        Ustawienia kosztów uzyskania przychodu
      </Typography>
      <SettingsSection settings={settings.taxDeductibleExpenses} onChange={dispatchUpdateSetting}></SettingsSection>

      <Typography variant="h6" component="h3" gutterBottom>
        Ustawienia składek pracownika
      </Typography>
      <SettingsSection settings={settings.employeeInsurances} onChange={dispatchUpdateSetting}></SettingsSection>

      <Typography variant="h6" component="h3" gutterBottom>
        Ustawienia składek pracodawcy
      </Typography>
      <SettingsSection settings={settings.employerInsurances} onChange={dispatchUpdateSetting}></SettingsSection>

      <Typography variant="h6" component="h3">
        Ustawienia podatku progresywnego (zasady ogólne)
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Dotyczy umowy o pracę i B2B (jednakże na umowie B2B mamy możliwość zmiany podatku progresywnego na liniowy)
      </Typography>
      <div className="scrolling-table-container">
        <TaxThresholdTable taxThresholds={settings.progressiveTaxThresholds} onChange={dispatchUpdateProgressiveTaxThresholds}></TaxThresholdTable>
      </div>
    </>
  );
}
