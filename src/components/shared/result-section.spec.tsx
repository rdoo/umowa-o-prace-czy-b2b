import * as React from 'react';

import { render } from '@testing-library/react';

import { formatNumberToCurrency } from '../../utils/helpers';
import { ResultRow } from './result-section';

describe('ResultRow component', () => {
  it('renders label', () => {
    const label = 'test-label';
    const { getByText } = render(<ResultRow label={label} value={5}></ResultRow>);

    expect(getByText(label + ':')).toBeInTheDocument();
  });

  it('renders value', () => {
    const value = 5;
    const { getByText } = render(<ResultRow label="test-label" value={value}></ResultRow>);

    expect(getByText(formatNumberToCurrency(value))).toBeInTheDocument();
  });

  it('doesnt render description', () => {
    const { queryByRole } = render(<ResultRow label="test-label" value={5}></ResultRow>);

    expect(queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders description', () => {
    const { getByRole } = render(<ResultRow label="test-label" value={5} description="test-description"></ResultRow>);

    expect(getByRole('button')).toBeInTheDocument();
  });
});
