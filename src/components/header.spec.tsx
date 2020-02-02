import * as React from 'react';

import { renderWithRedux } from '../test/test-utils';
import { Header } from './header';

describe('Header component', () => {
  it('renders', () => {
    const { container } = renderWithRedux(<Header />);

    const elements = container.getElementsByTagName('header');
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInTheDocument();
  });
});
