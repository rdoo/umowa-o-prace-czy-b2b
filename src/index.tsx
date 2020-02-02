import * as React from 'react';

import './index.scss';

import { StylesProvider } from '@material-ui/core/styles';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './components/app';
import { store } from './state/store';

ReactDOM.render(
  <Provider store={store}>
    <StylesProvider injectFirst>
      <App></App>
    </StylesProvider>
  </Provider>,
  document.getElementById('app')
);
