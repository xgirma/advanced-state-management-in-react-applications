import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Application from './components/Application';
import store from './store'

import './index.css';

render(
  <Provider store={store}>
    <Application />
  </Provider>
, document.getElementById('root')
);
