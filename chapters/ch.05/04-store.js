const redux = require('redux');

const {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore
} = redux;

console.log(createStore());
// throw new Error('Expected the reducer to be a function.');
// NOTE: store created with a reducer param