import * as React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { HelpButton } from './help-button';

describe('HelpButton component', () => {
  it('shows tooltip on button click', () => {
    const { getByRole } = render(<HelpButton description="test-desc"></HelpButton>);

    jest.useFakeTimers();
    fireEvent.click(getByRole('button'));
    jest.runAllTimers();

    expect(getByRole('tooltip')).toBeInTheDocument();
  });

  it('renders description', () => {
    const description = 'test-desc';
    const { getByRole } = render(<HelpButton description={description}></HelpButton>);

    jest.useFakeTimers();
    fireEvent.click(getByRole('button'));
    jest.runAllTimers();

    expect(getByRole('tooltip')).toHaveTextContent(description);
  });
});
