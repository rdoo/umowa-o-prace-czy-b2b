import * as React from 'react';

import { fade, lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { CURRENCY } from '../../utils/constants';
import { mapObject } from '../../utils/helpers';
import { SettingType, SettingValue } from '../../utils/settings';
import { TaxThreshold } from '../../utils/tax-thresholds';
import { SettingInput } from '../ui/setting-input';

interface TaxThresholdTableProps {
  taxThresholds: TaxThreshold[];
  onChange(taxThresholds: TaxThreshold[]): void;
}

const useStyles = makeStyles(theme => ({
  root: {
    borderCollapse: 'separate',
    marginBottom: '1rem',
    '& th': {
      width: '25%',
      minWidth: 100
    },
    '& td[rowspan]:not([rowspan="1"])': {
      borderLeftWidth: 1,
      borderLeftStyle: 'solid',
      borderLeftColor: lighten(fade(theme.palette.divider, 1), 0.88)
    }
  }
}));

export const TaxThresholdTable: React.FC<TaxThresholdTableProps> = ({ taxThresholds, onChange }) => {
  const classes = useStyles();

  const controlObject = React.useMemo(
    () =>
      mapObject<any[]>((value, key) => {
        if (key === 'main' || value === Infinity) {
          const obj = Object.create(Control.prototype);
          obj.value = value;
          return obj;
        }

        if (key === 'rate') {
          return new Control(value, SettingType.PERCENT);
        }

        return new Control(value, SettingType.CURRENCY);
      }, taxThresholds),
    [taxThresholds]
  );

  const handleChange = React.useCallback(() => onChange(mapObject<TaxThreshold[]>(value => value.value, controlObject)), [onChange, controlObject]);

  return (
    <Table className={classes.root}>
      <TableHead>
        <TableRow>
          <TableCell>Dochód od</TableCell>
          <TableCell>Dochód do</TableCell>
          <TableCell>Kwota wolna</TableCell>
          <TableCell>Stawka podatku</TableCell>
        </TableRow>
      </TableHead>
      <TableBody onChange={handleChange}>
        {taxThresholds.map((taxThreshold, index) => {
          const prevTaxThreshold = taxThresholds[index - 1];
          const nextTaxThreshold = taxThresholds[index + 1];
          const control = controlObject[index];

          const hideRateColumn = prevTaxThreshold && prevTaxThreshold.rate.rate === taxThreshold.rate.rate;

          let rowspan = 1;
          if (!hideRateColumn) {
            for (let j = index + 1; j < taxThresholds.length; j++) {
              const item = taxThresholds[j];
              if (item.rate.rate === taxThreshold.rate.rate) {
                rowspan++;
              } else {
                break;
              }
            }
          }

          return (
            <TableRow key={index}>
              <TableCell>
                {index === 0 ? 0 : prevTaxThreshold.to} {CURRENCY}
              </TableCell>
              <TableCell>{taxThreshold.to === Infinity ? '∞' : control.to.element}</TableCell>
              <TableCell>
                {typeof taxThreshold.free === 'number'
                  ? control.free.element
                  : `Degresywna od ${prevTaxThreshold.free} ${CURRENCY} do ${nextTaxThreshold.free} ${CURRENCY}`}
              </TableCell>
              {!hideRateColumn && <TableCell rowSpan={rowspan}>{control.rate.rate.element}</TableCell>}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

interface Control {
  value: number;
  element: React.ReactElement;
}

const Control = (function(this: Control, value: number, type: SettingType) {
  this.value = value;
  this.element = (
    <SettingInput type={type} value={value} onChange={((value: number) => (this.value = value)) as (value: SettingValue) => number}></SettingInput>
  );
} as any) as { new (value: number, type: SettingType): Control };
