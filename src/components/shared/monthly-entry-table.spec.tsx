import * as React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { MONTHS } from '../../utils/constants';
import { MonthlyEntryTable } from './monthly-entry-table';

describe('ResultRow component', () => {
  const months = MONTHS.map((month, index) => ({ name: month, entry: (index + 1) * 10 }));

  it('renders proper amount of rows', () => {
    const { getAllByRole } = render(<MonthlyEntryTable months={months} onChange={() => {}}></MonthlyEntryTable>);

    expect(getAllByRole('row')).toHaveLength(months.length + 1);
  });

  it('renders month names', () => {
    const { getByText } = render(<MonthlyEntryTable months={months} onChange={() => {}}></MonthlyEntryTable>);

    months.forEach(month => expect(getByText(month.name)).toBeInTheDocument());
  });

  it('renders text fields with proper values', () => {
    const { getAllByRole } = render(<MonthlyEntryTable months={months} onChange={() => {}}></MonthlyEntryTable>);

    const textFields = getAllByRole('textbox') as HTMLInputElement[];
    textFields.forEach((textField, index) => expect(textField.value).toBe(String(months[index].entry)));
  });

  it('calls onChange on text field change', () => {
    const onChange = jest.fn();
    const { getAllByRole } = render(<MonthlyEntryTable months={months} onChange={onChange}></MonthlyEntryTable>);

    const textFields = getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.input(textFields[0], { target: { value: '6' } });

    expect(onChange).toBeCalledTimes(1);
  });
});
