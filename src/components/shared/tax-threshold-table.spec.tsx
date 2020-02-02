import * as React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { TaxThreshold } from '../../utils/tax-thresholds';
import { TaxThresholdTable } from './tax-threshold-table';

describe('TaxThresholdTable component', () => {
  it('renders proper amount of rows', () => {
    const taxThresholds = [
      { to: 8000, free: 8000, rate: { rate: 0.17 }, main: false },
      { to: 13000, free: 3089, rate: { rate: 0.17 }, main: false },
      { to: 85528, free: 0, rate: { rate: 0.17 }, main: true }
    ];
    let { getAllByRole, rerender } = render(<TaxThresholdTable taxThresholds={taxThresholds} onChange={() => {}}></TaxThresholdTable>);

    expect(getAllByRole('row')).toHaveLength(taxThresholds.length + 1);

    const taxThresholds2 = [{ to: 8000, free: 0, rate: { rate: 0.19 }, main: true }];
    rerender(<TaxThresholdTable taxThresholds={taxThresholds2} onChange={() => {}}></TaxThresholdTable>);

    expect(getAllByRole('row')).toHaveLength(taxThresholds2.length + 1);
  });

  it('renders text field for finite "to"', () => {
    const taxThresholds = [{ to: 8000, free: 0, rate: { rate: 0.19 }, main: true }];
    let { getAllByRole } = render(<TaxThresholdTable taxThresholds={taxThresholds} onChange={() => {}}></TaxThresholdTable>);

    expect(getAllByRole('cell')[1]).toContainHTML('input');
  });

  it('doesnt render text field for infinite "to"', () => {
    const taxThresholds = [{ to: Infinity, free: 0, rate: { rate: 0.19 }, main: true }];
    let { getAllByRole } = render(<TaxThresholdTable taxThresholds={taxThresholds} onChange={() => {}}></TaxThresholdTable>);

    expect(getAllByRole('cell')[1]).not.toContainHTML('input');
  });

  it('renders text field for numerical "free"', () => {
    const taxThresholds = [{ to: 8000, free: 0, rate: { rate: 0.19 }, main: true }];
    let { getAllByRole } = render(<TaxThresholdTable taxThresholds={taxThresholds} onChange={() => {}}></TaxThresholdTable>);

    expect(getAllByRole('cell')[2]).toContainHTML('input');
  });

  it('doesnt render text field for proportional "free"', () => {
    const taxThresholds: TaxThreshold[] = [
      { to: 8000, free: 8000, rate: { rate: 0.17 }, main: false },
      { to: 13000, free: 'proportional', rate: { rate: 0.17 }, main: false },
      { to: 85528, free: 3089, rate: { rate: 0.17 }, main: true }
    ];
    let { getAllByRole } = render(<TaxThresholdTable taxThresholds={taxThresholds} onChange={() => {}}></TaxThresholdTable>);

    expect(getAllByRole('row')[2].getElementsByTagName('td')[2]).not.toContainHTML('input');
  });

  it('renders only one of equal rates', () => {
    const taxRate = { rate: 0.17 };
    const taxThresholds = [
      { to: 8000, free: 8000, rate: taxRate, main: false },
      { to: 85528, free: 3089, rate: taxRate, main: true }
    ];

    let { getAllByRole } = render(<TaxThresholdTable taxThresholds={taxThresholds} onChange={() => {}}></TaxThresholdTable>);

    const rows = getAllByRole('row');
    expect(rows[1].getElementsByTagName('td')).toHaveLength(4);
    expect(rows[2].getElementsByTagName('td')).toHaveLength(3);
  });

  it('calls onChange on text field change', () => {
    const onChange = jest.fn();
    const taxThresholds = [{ to: 8000, free: 0, rate: { rate: 0.19 }, main: true }];
    let { getAllByRole } = render(<TaxThresholdTable taxThresholds={taxThresholds} onChange={onChange}></TaxThresholdTable>);

    const textFields = getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.input(textFields[0], { target: { value: '6' } });

    expect(onChange).toBeCalledTimes(1);
  });
});
