import React from 'react';
import { render } from 'react-dom';

import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import getInitialState from './initial-state';
import reducer from './reducer';

import Application from './components/Application';

import './style.css';

const middleware = [];
const enhancers = [];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  getInitialState(),
  composeEnhancers(applyMiddleware(...middleware), ...enhancers)
);

render(
  <Provider store={store}>
    <Application />
  </Provider>,
  document.getElementById('root'),
);