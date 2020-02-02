import * as React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useSelector } from 'react-redux';

import { State } from '../../state/reducers';
import { formatNumberToCurrency, formatNumberToDisplay } from '../../utils/helpers';
import { B2BMonthlyResult } from '../../utils/models';
import { Tooltip } from '../ui/tooltip';

export function B2BDetailedResultView() {
  const b2bResult = useSelector((state: State) => state.b2bResult);

  if (!b2bResult) {
    return null;
  }

  return (
    <Table className="result-table">
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}></TableCell>
          <TableCell colSpan={6} className="table-head-group">
            Składki
          </TableCell>
          <TableCell colSpan={3}></TableCell>
        </TableRow>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Brutto</TableCell>
          <TableCell>Emerytalna</TableCell>
          <TableCell>Rentowa</TableCell>
          <TableCell>Chorobowa</TableCell>
          <TableCell>Wypadkowa</TableCell>
          <TableCell>Zdrowotna</TableCell>
          <TableCell>
            <Tooltip title="Fundusz Pracy">
              <span>FP</span>
            </Tooltip>
          </TableCell>
          <TableCell>Podatek</TableCell>
          <TableCell>Netto</TableCell>
          <TableCell>Całkowity koszt</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {b2bResult.monthly.map(createResultRow)}
        <TableRow>
          <TableCell colSpan={8}>
            Roczna korekta podatkowa - nastąpiła {b2bResult.yearlyTaxCorrection < 0 ? 'nadpłata' : 'niedopłata'} podatku w wysokości{' '}
            {formatNumberToCurrency(Math.abs(b2bResult.yearlyTaxCorrection))}
          </TableCell>
          <TableCell>{formatNumberToDisplay(b2bResult.yearlyTaxCorrection)}</TableCell>
          <TableCell>{formatNumberToDisplay(-b2bResult.yearlyTaxCorrection)}</TableCell>
          <TableCell></TableCell>
        </TableRow>
        {createResultRow(b2bResult.average)}
        {createResultRow(b2bResult.sum)}
      </TableBody>
    </Table>
  );
}

function createResultRow(result: B2BMonthlyResult) {
  return (
    <TableRow key={result.name}>
      <TableCell>{result.name}</TableCell>
      <TableCell>{formatNumberToDisplay(result.entry)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.pensionInsurance)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.disabilityInsurance)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.sicknessInsurance)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.accidentInsurance)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.healthInsurance)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.fp)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.tax)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.net)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.totalCost)}</TableCell>
    </TableRow>
  );
}
