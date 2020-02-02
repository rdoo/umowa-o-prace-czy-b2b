import * as React from 'react';

import { render } from '@testing-library/react';

import { Card } from './card';

describe('Card component', () => {
  it('renders title', () => {
    const title = 'test-title';
    const { getByRole } = render(<Card title={title} />);

    expect(getByRole('heading')).toHaveTextContent(title);
  });

  it('renders children', () => {
    const children = <div data-testid="test-children">test children</div>;
    const { getByTestId } = render(<Card title="test-title">{children}</Card>);

    expect(getByTestId('test-children')).toBeInTheDocument();
  });
});
