import * as React from 'react';

import Divider from '@material-ui/core/Divider';
import { useDispatch, useSelector } from 'react-redux';

import { updateSetting } from '../../state/actions';
import { State } from '../../state/reducers';
import { Setting, SettingValue } from '../../utils/settings';
import { ResultSection } from '../shared/result-section';
import { SettingsSection } from '../shared/settings-section';
import { Card } from '../ui/card';
import { DialogTrigger } from '../ui/dialog-trigger';
import { EmploymentDetailedResultView } from './employment-detailed-result';
import { EmploymentDetailedSettings } from './employment-detailed-settings';

export function Employment() {
  const [settings, result] = useSelector((state: State) => {
    const stateSettings = state.settings;
    const settings: Setting[] = [
      stateSettings.employmentEntryValue,
      stateSettings.ageOver26,
      stateSettings.employmentOutsidePlaceOfResidence,
      stateSettings.ppkEnabled
    ];

    if (stateSettings.ppkEnabled.value) {
      settings.push(stateSettings.employeePPKPremium);
      settings.push(stateSettings.employerPPKPremium);
    }

    settings.push(stateSettings.copyrightTaxDeductibleExpensesEnabled);

    if (stateSettings.copyrightTaxDeductibleExpensesEnabled.value) {
      settings.push(stateSettings.copyrightTaxDeductibleExpenses);
    }

    const result = state.employmentResult?.average;

    return [settings, result];
  });
  const dispatch = useDispatch();

  const dispatchUpdateSetting = React.useCallback((key: string, value: SettingValue) => dispatch(updateSetting(key, value)), []);

  return (
    <Card title="Umowa o pracę">
      <SettingsSection settings={settings} onChange={dispatchUpdateSetting}></SettingsSection>

      <div className="text-center">
        <DialogTrigger label="Ustawienia zaawansowane">
          <EmploymentDetailedSettings></EmploymentDetailedSettings>
        </DialogTrigger>
      </div>

      {result && (
        <>
          <Divider className="main-divider" />
          {/* <Typography variant="h6" component="h3" gutterBottom className="text-center">
                            Elementy składowe
                        </Typography> */}
          <ResultSection result={result}></ResultSection>

          <div className="text-center">
            <DialogTrigger label="Wynik szczegółowy" title="Wynik szczegółowy dla umowy o pracę" fullWidth={true}>
              <EmploymentDetailedResultView></EmploymentDetailedResultView>
            </DialogTrigger>
          </div>
        </>
      )}
    </Card>
  );
}
