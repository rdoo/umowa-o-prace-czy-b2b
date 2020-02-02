import * as React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { SettingValue } from '../../utils/settings';
import { SettingInput } from '../ui/setting-input';

interface MonthlyEntryTableProps {
  months: { name: string; entry: number | null }[];
  onChange(index: number, entry: number): void;
}

const useStyles = makeStyles(theme => ({
  root: {
    borderCollapse: 'separate',
    marginBottom: '1rem',
    '& th': {
      width: '50%'
    }
  }
}));

export const MonthlyEntryTable: React.FC<MonthlyEntryTableProps> = ({ months, onChange }) => {
  const classes = useStyles();

  const handleChange = React.useCallback((index: number) => (value: number) => onChange(index, value), [onChange]) as (
    index: number
  ) => (value: SettingValue) => void;

  return (
    <Table className={classes.root}>
      <TableHead>
        <TableRow>
          <TableCell>Miesiąc</TableCell>
          <TableCell>Kwota</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {months.map((month, index) => {
          return (
            <TableRow key={month.name}>
              <TableCell>{month.name}</TableCell>
              <TableCell>
                <SettingInput value={month.entry} onChange={handleChange(index)}></SettingInput>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
