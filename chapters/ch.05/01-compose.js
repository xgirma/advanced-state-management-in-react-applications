const redux = require('redux');

const {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore
} = redux;

// Compose is not actually Redux specific.
// It takes a bunch of functions and chain them.
// Redux uses it, we use it when we put middleware together.
// It is not Redux, it is just a HELPER method.

const makeUpperCase = string => string.toUpperCase();
const repeatThreeTimes = string => string.repeat(3);
const embolden = string => string.bold(3);

const result = embolden(repeatThreeTimes(makeUpperCase('string ')));
console.log(result);
// <b>STRING STRING STRING </b>

// using redux compose
const newResult = compose(embolden, repeatThreeTimes, makeUpperCase);

console.log(newResult('string '));
// <b>STRING STRING STRING </b>
