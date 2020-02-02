import * as React from 'react';

import { fireEvent } from '@testing-library/react';

import { renderWithRedux } from '../../test/test-utils';
import { Employment } from './employment';

describe('Employment component', () => {
  it('opens detailed settings on button click', () => {
    const { getByText, getByRole } = renderWithRedux(<Employment></Employment>);

    fireEvent.click(getByText('ustawienia', { exact: false }));

    expect(getByRole('dialog')).toHaveTextContent('Ustawienia zaawansowane');
  });

  it('calculates result on entry value change', () => {
    const { getByText, container } = renderWithRedux(<Employment></Employment>);

    fireEvent.input(container.querySelector('#employmentEntryValue')!, { target: { value: '5000' } });

    expect(getByText('wynik', { exact: false })).toBeInTheDocument();
  });

  it('opens detailed results on button click', () => {
    const { getByText, getByRole, container } = renderWithRedux(<Employment></Employment>);

    fireEvent.input(container.querySelector('#employmentEntryValue')!, { target: { value: '5000' } });
    fireEvent.click(getByText('wynik', { exact: false }));

    expect(getByRole('dialog')).toHaveTextContent('Wynik szczegółowy');
  });
});
