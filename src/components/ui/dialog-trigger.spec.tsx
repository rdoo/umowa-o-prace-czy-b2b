import * as React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { DialogTrigger } from './dialog-trigger';

describe('DialogTrigger component', () => {
  it('renders button with proper label', () => {
    const label = 'test-label';
    const { getByRole } = render(<DialogTrigger label={label}></DialogTrigger>);

    expect(getByRole('button')).toHaveTextContent(label);
  });

  it('opens dialog on button click', () => {
    const { getByRole, queryByRole } = render(<DialogTrigger label="test-label"></DialogTrigger>);

    expect(queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(getByRole('button'));

    expect(getByRole('dialog')).toBeInTheDocument();
  });

  it('renders dialog title', () => {
    const title = 'test-title';
    const { getByRole } = render(<DialogTrigger label="test-label" title={title}></DialogTrigger>);

    fireEvent.click(getByRole('button'));

    expect(getByRole('heading')).toHaveTextContent(title);
  });

  it('renders dialog title equal to label if title is not provided', () => {
    const label = 'test-label';
    const { getByRole } = render(<DialogTrigger label={label}></DialogTrigger>);

    fireEvent.click(getByRole('button'));

    expect(getByRole('heading')).toHaveTextContent(label);
  });

  it('renders dialog children', () => {
    const children = <div data-testid="test-children">test children</div>;
    const { getByRole, getByTestId } = render(<DialogTrigger label="test-label">{children}</DialogTrigger>);

    fireEvent.click(getByRole('button'));

    expect(getByTestId('test-children')).toBeInTheDocument();
  });
});
