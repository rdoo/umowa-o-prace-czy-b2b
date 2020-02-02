import * as React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { CURRENCY } from '../../utils/constants';
import { SettingType } from '../../utils/settings';
import { SettingInput } from './setting-input';

describe('SettingInput component', () => {
  describe('when type is BOOLEAN', () => {
    it('renders a checkbox', () => {
      const { getByRole } = render(<SettingInput value={true} onChange={() => {}} type={SettingType.BOOLEAN}></SettingInput>);

      expect(getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders checked checkbox', () => {
      const { getByRole } = render(<SettingInput value={true} onChange={() => {}} type={SettingType.BOOLEAN}></SettingInput>);

      expect((getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
    });

    it('renders unchecked checkbox', () => {
      const { getByRole } = render(<SettingInput value={false} onChange={() => {}} type={SettingType.BOOLEAN}></SettingInput>);

      expect((getByRole('checkbox') as HTMLInputElement).checked).toBe(false);
    });

    it('calls onChange on checkbox click', () => {
      const onChange = jest.fn();
      const { getByRole } = render(<SettingInput value={true} onChange={onChange} type={SettingType.BOOLEAN}></SettingInput>);

      fireEvent.click(getByRole('checkbox'));

      expect(onChange).toBeCalledTimes(1);
    });

    it('calls onChange with proper arguments', () => {
      const onChange = jest.fn();
      const { getByRole } = render(<SettingInput value={true} onChange={onChange} type={SettingType.BOOLEAN}></SettingInput>);

      fireEvent.click(getByRole('checkbox'));

      expect(onChange).toBeCalledWith(false);
    });
  });

  describe('when type is OPTIONS', () => {
    const options = [
      {
        name: 'test-name-1',
        value: 'test-value-1'
      },
      {
        name: 'test-name-2',
        value: 'test-value-2'
      },
      {
        name: 'test-name-3',
        value: 'test-value-3'
      }
    ];

    it('renders radio buttons', () => {
      const { getAllByRole } = render(
        <SettingInput value={options[0].value} onChange={() => {}} type={SettingType.OPTIONS} options={options}></SettingInput>
      );

      const buttons = getAllByRole('radio');
      expect(buttons.length).toBe(options.length);
      buttons.forEach(button => expect(button).toBeInTheDocument());
    });

    it('renders radio buttons with proper values', () => {
      const { getAllByRole } = render(
        <SettingInput value={options[0].value} onChange={() => {}} type={SettingType.OPTIONS} options={options}></SettingInput>
      );

      const buttons = getAllByRole('radio') as HTMLInputElement[];
      buttons.forEach((button, index) => expect(button.value).toBe(options[index].value));
    });

    it('calls onChange on radio button click', () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <SettingInput value={options[0].value} onChange={onChange} type={SettingType.OPTIONS} options={options}></SettingInput>
      );

      const buttons = getAllByRole('radio');
      fireEvent.click(buttons[1]);

      expect(onChange).toBeCalledTimes(1);
    });

    it('calls onChange with proper arguments', () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <SettingInput value={options[0].value} onChange={onChange} type={SettingType.OPTIONS} options={options}></SettingInput>
      );

      const buttons = getAllByRole('radio');
      const radioIndex = 1;
      fireEvent.click(buttons[radioIndex]);

      expect(onChange).toBeCalledWith(options[radioIndex].value);
    });
  });

  describe('when type is CURRENCY', () => {
    it('renders currency text field', () => {
      const { getByRole, container } = render(<SettingInput value={5} onChange={() => {}} type={SettingType.CURRENCY}></SettingInput>);

      expect(getByRole('textbox')).toBeInTheDocument();
      expect(container.querySelector('.MuiInputAdornment-root')).toHaveTextContent(CURRENCY);
    });

    it('renders currency text field when type is not provided', () => {
      const { getByRole, container } = render(<SettingInput value={5} onChange={() => {}}></SettingInput>);

      expect(getByRole('textbox')).toBeInTheDocument();
      expect(container.querySelector('.MuiInputAdornment-root')).toHaveTextContent(CURRENCY);
    });

    it('renders currency text field with proper value', () => {
      const value = 5;
      const { getByRole } = render(<SettingInput value={value} onChange={() => {}} type={SettingType.CURRENCY}></SettingInput>);

      expect((getByRole('textbox') as HTMLInputElement).value).toBe(String(value));
    });

    it('calls onChange on text field change', () => {
      const onChange = jest.fn();
      const { getByRole } = render(<SettingInput value={5} onChange={onChange} type={SettingType.CURRENCY}></SettingInput>);

      fireEvent.input(getByRole('textbox'), { target: { value: '6' } });

      expect(onChange).toBeCalledTimes(1);
    });

    it('calls onChange with proper arguments', () => {
      const onChange = jest.fn();
      const { getByRole } = render(<SettingInput value={5} onChange={onChange} type={SettingType.CURRENCY}></SettingInput>);

      fireEvent.input(getByRole('textbox'), { target: { value: '6' } });

      expect(onChange).toBeCalledWith(6);
    });
  });

  describe('when type is PERCENT', () => {
    it('renders percent text field', () => {
      const { getByRole, container } = render(<SettingInput value={5} onChange={() => {}} type={SettingType.PERCENT}></SettingInput>);

      expect(getByRole('textbox')).toBeInTheDocument();
      expect(container.querySelector('.MuiInputAdornment-root')).toHaveTextContent('%');
    });

    it('renders percent text field with proper value', () => {
      const value = 0.05;
      const { getByRole } = render(<SettingInput value={value} onChange={() => {}} type={SettingType.PERCENT}></SettingInput>);

      expect((getByRole('textbox') as HTMLInputElement).value).toBe(String(value * 100));
    });

    it('calls onChange on text field change', () => {
      const onChange = jest.fn();
      const { getByRole } = render(<SettingInput value={5} onChange={onChange} type={SettingType.PERCENT}></SettingInput>);

      fireEvent.input(getByRole('textbox'), { target: { value: '6' } });

      expect(onChange).toBeCalledTimes(1);
    });

    it('calls onChange with proper arguments', () => {
      const onChange = jest.fn();
      const { getByRole } = render(<SettingInput value={5} onChange={onChange} type={SettingType.PERCENT}></SettingInput>);

      fireEvent.input(getByRole('textbox'), { target: { value: '6' } });

      expect(onChange).toBeCalledWith(0.06);
    });
  });
});
