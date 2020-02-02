import * as React from 'react';

import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';

import { State } from '../../state/reducers';
import { formatNumberToCurrency } from '../../utils/helpers';
import { Card } from '../ui/card';

export function Summary() {
  const employmentResult = useSelector((state: State) => state.employmentResult?.average);
  const b2bResult = useSelector((state: State) => state.b2bResult?.average);

  if (!employmentResult || !b2bResult) {
    return null;
  }

  return (
    <Card title="Podsumowanie">
      <Typography variant="subtitle1" component="p">
        Wybierając umowę B2B:
      </Typography>
      <ul>
        <li>otrzymasz {formatDiff(b2bResult.net - employmentResult.net)} netto ("na rękę")</li>
        <li>
          zapłacisz:
          <ul>
            <li>{formatDiff(b2bResult.tax - employmentResult.tax, false)} podatku dochodowego</li>
            <li>{formatDiff(b2bResult.pensionInsurance - employmentResult.pensionInsurance, false)} na składkę emerytalną</li>
            <li>{formatDiff(b2bResult.disabilityInsurance - employmentResult.disabilityInsurance, false)} na składkę rentową</li>
            <li>{formatDiff(b2bResult.sicknessInsurance - employmentResult.sicknessInsurance, false)} na składkę chorobową</li>
            <li>{formatDiff(b2bResult.accidentInsurance - employmentResult.accidentInsurance, false)} na składkę wypadkową</li>
            <li>{formatDiff(b2bResult.healthInsurance - employmentResult.healthInsurance, false)} na składkę zdrowotną</li>
            <li>{formatDiff(b2bResult.fp - employmentResult.fp, false)} na składkę na Fundusz Pracy</li>
            <li>{formatDiff(b2bResult.fgsp - employmentResult.fgsp, false)} na składkę na Fundusz Gwarantowanych Świadczeń Pracowniczych</li>
            {employmentResult.ppk !== 0 && (
              <li>{formatDiff(b2bResult.ppk - employmentResult.ppk, false)} na składkę na Pracownicze Plany Kapitałowe</li>
            )}
          </ul>
        </li>
        <li>Twój pracodawca wyda {formatDiff(b2bResult.totalCost - employmentResult.totalCost, false)} na Twoje zatrudnienie</li>
      </ul>
    </Card>
  );
}

function formatDiff(diff: number, moreIsBetter = true) {
  if (diff > 0) {
    return <span className={moreIsBetter ? 'text-plus' : 'text-minus'}>{formatNumberToCurrency(diff)} więcej</span>;
  } else if (diff < 0) {
    return <span className={moreIsBetter ? 'text-minus' : 'text-plus'}>{formatNumberToCurrency(-diff)} mniej</span>;
  }

  return <span>tyle samo</span>;
}
