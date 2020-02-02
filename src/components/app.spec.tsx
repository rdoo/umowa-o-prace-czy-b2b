import * as React from 'react';

import { renderWithRedux } from '../test/test-utils';
import { App } from './app';

describe('App component', () => {
  it('renders header', () => {
    const { container } = renderWithRedux(<App />);

    const elements = container.getElementsByTagName('header');
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInTheDocument();
  });

  it('renders main', () => {
    const { getByRole } = renderWithRedux(<App />);

    expect(getByRole('main')).toBeInTheDocument();
  });

  it('renders footer', () => {
    const { container } = renderWithRedux(<App />);

    const elements = container.getElementsByTagName('footer');
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInTheDocument();
  });
});
