import * as React from 'react';

import Divider from '@material-ui/core/Divider';
import { useDispatch, useSelector } from 'react-redux';

import { updateSetting } from '../../state/actions';
import { State } from '../../state/reducers';
import { SettingValue } from '../../utils/settings';
import { ResultSection } from '../shared/result-section';
import { SettingsSection } from '../shared/settings-section';
import { Card } from '../ui/card';
import { DialogTrigger } from '../ui/dialog-trigger';
import { B2BDetailedResultView } from './b2b-detailed-result';
import { B2BDetailedSettings } from './b2b-detailed-settings';

export function B2B() {
  const [settings, result] = useSelector((state: State) => {
    const stateSettings = state.settings;
    const settings = [
      stateSettings.b2bEntryValue,
      stateSettings.b2bZUSType,
      stateSettings.b2bSicknessInsuranceEnabled,
      stateSettings.b2bLinearTaxEnabled
    ];

    const result = state.b2bResult?.average;

    return [settings, result];
  });
  const dispatch = useDispatch();

  const dispatchUpdateSetting = (key: string, value: SettingValue) => dispatch(updateSetting(key, value));

  return (
    <Card title="Umowa B2B">
      <SettingsSection settings={settings} onChange={dispatchUpdateSetting}></SettingsSection>

      <div className="text-center">
        <DialogTrigger label="Ustawienia zaawansowane">
          <B2BDetailedSettings></B2BDetailedSettings>
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
            <DialogTrigger label="Wynik szczegółowy" title="Wynik szczegółowy dla umowy B2B" fullWidth={true}>
              <B2BDetailedResultView></B2BDetailedResultView>
            </DialogTrigger>
          </div>
        </>
      )}
    </Card>
  );
}
