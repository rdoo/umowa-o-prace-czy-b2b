import * as React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useSelector } from 'react-redux';

import { State } from '../../state/reducers';
import { formatNumberToCurrency, formatNumberToDisplay } from '../../utils/helpers';
import { EmploymentMonthlyResult } from '../../utils/models';
import { Tooltip } from '../ui/tooltip';

export function EmploymentDetailedResultView() {
  const employmentResult = useSelector((state: State) => state.employmentResult);

  if (!employmentResult) {
    return null;
  }

  return (
    <Table className="result-table">
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}></TableCell>
          <TableCell colSpan={5} className="table-head-group">
            Składki pracownika
          </TableCell>
          <TableCell colSpan={6} className="table-head-group">
            Składki pracodawcy
          </TableCell>
          <TableCell colSpan={3}></TableCell>
        </TableRow>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Brutto</TableCell>
          <TableCell>Emerytalna</TableCell>
          <TableCell>Rentowa</TableCell>
          <TableCell>Chorobowa</TableCell>
          <TableCell>Zdrowotna</TableCell>
          <TableCell>
            <Tooltip title="Pracownicze Plany Kapitałowe">
              <span>PPK</span>
            </Tooltip>
          </TableCell>
          <TableCell>Emerytalna</TableCell>
          <TableCell>Rentowa</TableCell>
          <TableCell>Wypadkowa</TableCell>
          <TableCell>
            <Tooltip title="Fundusz Pracy">
              <span>FP</span>
            </Tooltip>
          </TableCell>
          <TableCell>
            <Tooltip title="Fundusz Gwarantowanych Świadczeń Pracowniczych">
              <span>FGŚP</span>
            </Tooltip>
          </TableCell>
          <TableCell>
            <Tooltip title="Pracownicze Plany Kapitałowe">
              <span>PPK</span>
            </Tooltip>
          </TableCell>
          <TableCell>Podatek</TableCell>
          <TableCell>Netto</TableCell>
          <TableCell>Całkowity koszt</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {employmentResult.monthly.map(createResultRow)}
        <TableRow>
          <TableCell colSpan={13}>
            Roczna korekta podatkowa - nastąpiła {employmentResult.yearlyTaxCorrection < 0 ? 'nadpłata' : 'niedopłata'} podatku w wysokości{' '}
            {formatNumberToCurrency(Math.abs(employmentResult.yearlyTaxCorrection))}
          </TableCell>
          <TableCell>{formatNumberToDisplay(employmentResult.yearlyTaxCorrection)}</TableCell>
          <TableCell>{formatNumberToDisplay(-employmentResult.yearlyTaxCorrection)}</TableCell>
          <TableCell></TableCell>
        </TableRow>
        {createResultRow(employmentResult.average)}
        {createResultRow(employmentResult.sum)}
      </TableBody>
    </Table>
  );
}

function createResultRow(result: EmploymentMonthlyResult) {
  return (
    <TableRow key={result.name}>
      <TableCell>{result.name}</TableCell>
      <TableCell>{formatNumberToDisplay(result.entry)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.employeePensionInsurance)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.employeeDisabilityInsurance)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.sicknessInsurance)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.healthInsurance)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.employeePPK)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.employerPensionInsurance)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.employerDisabilityInsurance)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.accidentInsurance)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.fp)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.fgsp)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.employerPPK)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.tax)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.net)}</TableCell>
      <TableCell>{formatNumberToDisplay(result.totalCost)}</TableCell>
    </TableRow>
  );
}
