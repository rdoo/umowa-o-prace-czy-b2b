import * as React from 'react';

import { renderWithRedux } from '../test/test-utils';
import { Main } from './main';

describe('Main component', () => {
  it('renders', () => {
    const { getByRole } = renderWithRedux(<Main />);

    expect(getByRole('main')).toBeInTheDocument();
  });
});
