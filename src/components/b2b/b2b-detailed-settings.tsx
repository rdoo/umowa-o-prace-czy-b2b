import * as React from 'react';

import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';

import { updateB2BMonthEntry, updateLinearTaxThresholds, updateProgressiveTaxThresholds, updateSetting } from '../../state/actions';
import { State } from '../../state/reducers';
import { SettingValue } from '../../utils/settings';
import { TaxThreshold } from '../../utils/tax-thresholds';
import { MonthlyEntryTable } from '../shared/monthly-entry-table';
import { SettingsSection } from '../shared/settings-section';
import { TaxThresholdTable } from '../shared/tax-threshold-table';

export function B2BDetailedSettings() {
  const settings = useSelector((state: State) => {
    const settings = state.settings;

    return {
      months: settings.b2bMonths,
      general: [
        settings.b2bEntryValue,
        settings.b2bZUSType,
        settings.b2bLinearTaxEnabled,
        settings.minimumWage,
        settings.averageWage,
        settings.averageWageInEnterpriseSector
      ],
      insurances: [
        settings.b2bPensionInsurancePremium,
        settings.b2bDisabilityInsurancePremium,
        settings.b2bSicknessInsuranceEnabled,
        settings.b2bSicknessInsurancePremium,
        settings.b2bHealthInsurancePremium,
        settings.b2bHealthInsurancePremiumDeductible,
        settings.b2bAccidentInsurancePremium,
        settings.b2bFPPremium,
        settings.basisOfSocialInsurancePremiumForNormalZUS,
        settings.basisOfSocialInsurancePremiumForPreferentialZUS,
        settings.basisOfHealthInsurancePremium
      ],
      progressiveTaxThresholds: settings.progressiveTaxThresholds,
      linearTaxThresholds: settings.linearTaxThresholds
    };
  });
  const dispatch = useDispatch();

  const dispatchUpdateSetting = React.useCallback((key: string, value: SettingValue) => dispatch(updateSetting(key, value)), []);
  const dispatchUpdateB2BMonthEntry = React.useCallback((index: number, value: number) => dispatch(updateB2BMonthEntry(index, value)), []);
  const dispatchUpdateProgressiveTaxThresholds = React.useCallback(
    (taxThresholds: TaxThreshold[]) => dispatch(updateProgressiveTaxThresholds(taxThresholds)),
    []
  );
  const dispatchUpdateLinearTaxThresholds = React.useCallback(
    (taxThresholds: TaxThreshold[]) => dispatch(updateLinearTaxThresholds(taxThresholds)),
    []
  );

  return (
    <>
      <Typography variant="h6" component="h3" gutterBottom>
        Ustawienia ogólne
      </Typography>
      <SettingsSection settings={settings.general} onChange={dispatchUpdateSetting}></SettingsSection>

      <Typography variant="h6" component="h3" gutterBottom>
        Kwota netto na fakturze w poszczególnych miesiącach
      </Typography>
      <MonthlyEntryTable months={settings.months} onChange={dispatchUpdateB2BMonthEntry}></MonthlyEntryTable>

      <Typography variant="h6" component="h3" gutterBottom>
        Ustawienia składek
      </Typography>
      <SettingsSection settings={settings.insurances} onChange={dispatchUpdateSetting}></SettingsSection>

      <Typography variant="h6" component="h3">
        Ustawienia podatku progresywnego (zasady ogólne)
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Dotyczy umowy o pracę i B2B (jednakże na umowie B2B mamy możliwość zmiany podatku progresywnego na liniowy)
      </Typography>
      <div className="scrolling-table-container">
        <TaxThresholdTable taxThresholds={settings.progressiveTaxThresholds} onChange={dispatchUpdateProgressiveTaxThresholds}></TaxThresholdTable>
      </div>

      <Typography variant="h6" component="h3">
        Ustawienia podatku liniowego
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Możemy z niego korzystać po złożeniu odpowiedniego oświadczenia podczas zakładania działalności gospodarczej. Formę opodatkowania można także
        zmieniać na początku każdego roku kalendarzowego
      </Typography>
      <div className="scrolling-table-container">
        <TaxThresholdTable taxThresholds={settings.linearTaxThresholds} onChange={dispatchUpdateLinearTaxThresholds}></TaxThresholdTable>
      </div>
    </>
  );
}
