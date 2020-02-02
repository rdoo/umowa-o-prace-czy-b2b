import * as React from 'react';

import { act, fireEvent, render } from '@testing-library/react';

import { Tooltip } from './tooltip';

describe('Card component', () => {
  it('renders arrow by default', () => {
    const { getByRole, getByTestId } = render(
      <Tooltip title="test-title">
        <div data-testid="test-trigger">test</div>
      </Tooltip>
    );

    jest.useFakeTimers();
    fireEvent.mouseOver(getByTestId('test-trigger'));
    jest.runAllTimers();

    expect(
      getByRole('tooltip')
        .className.toLowerCase()
        .includes('arrow')
    ).toBe(true);
  });

  it('responds instantly to touch events', () => {
    const { getByRole, getByTestId } = render(
      <Tooltip title="test-title">
        <div data-testid="test-trigger">test</div>
      </Tooltip>
    );

    jest.useFakeTimers();

    act(() => {
      fireEvent.touchStart(getByTestId('test-trigger'));
      jest.advanceTimersByTime(0);
    });

    expect(getByRole('tooltip')).toBeInTheDocument();
    jest.runAllTimers();
  });
});
