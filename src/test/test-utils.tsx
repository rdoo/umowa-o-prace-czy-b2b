import * as React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { store } from '../state/store';

export function renderWithRedux(node: React.ReactNode, customStore = store) {
  return render(<Provider store={customStore}>{node}</Provider>);
}
