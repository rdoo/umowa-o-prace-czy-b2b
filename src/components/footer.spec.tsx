import * as React from 'react';

import { renderWithRedux } from '../test/test-utils';
import { Footer } from './footer';

describe('Footer component', () => {
  it('renders', () => {
    const { container } = renderWithRedux(<Footer />);

    const elements = container.getElementsByTagName('footer');
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInTheDocument();
  });
});
