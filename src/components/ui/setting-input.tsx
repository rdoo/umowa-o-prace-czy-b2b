import * as React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import { CURRENCY } from '../../utils/constants';
import { SettingType, SettingValue } from '../../utils/settings';

export interface SettingInputProps {
  id?: string;
  type?: SettingType;
  options?: { name: string; value: string }[];
  value: SettingValue;
  onChange(value: SettingValue): void;
}

export const SettingInput: React.FC<SettingInputProps> = ({ id, type, options, value, onChange }) => {
  const [textFieldValue, setTextFieldValue] = React.useState('');

  if (type === SettingType.BOOLEAN) {
    return <Switch id={id} checked={value as boolean} onChange={event => onChange(event.target.checked)} color="primary" />;
  }

  if (type === SettingType.OPTIONS) {
    return (
      <RadioGroup id={id} value={value} onChange={event => onChange(event.target.value)}>
        {options &&
          options.map(option => <FormControlLabel key={option.value} value={option.value} label={option.name} control={<Radio color="primary" />} />)}
      </RadioGroup>
    );
  }

  const isPercent = type === SettingType.PERCENT;

  if (isPercent && value != null) {
    (value as number) *= 100;
    value = Number((value as number).toFixed(12)); // fixing floating point inaccuracy
  }

  if (textFieldValue !== '' && value == null) {
    setTextFieldValue('');
    return null;
  }

  if (value != null && (textFieldValue === '' || Number(textFieldValue.replace(',', '.')) !== value)) {
    setTextFieldValue(String(value).replace('.', ','));
    return null;
  }

  return (
    <TextField
      id={id}
      variant="outlined"
      inputProps={{
        inputMode: 'decimal'
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" disablePointerEvents={true}>
            {isPercent ? '%' : CURRENCY}
          </InputAdornment>
        )
      }}
      value={textFieldValue}
      onChange={event => {
        let value = event.target.value as string;
        if (value === '') {
          setTextFieldValue(value);
          onChange(null);
          return;
        }

        value = value.replace(',', '.');
        if (value === '.') {
          value = '0.';
        }

        let number = Number(value);
        if (!Number.isNaN(number)) {
          setTextFieldValue(value.replace('.', ','));

          if (isPercent) {
            number /= 100;
          }
          onChange(number);
        }
      }}
    />
  );
};
