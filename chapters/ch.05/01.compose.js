import {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore,} from 'redux'

const makeLouder = string => string.toUpperCase();
const repeatThreeTimes = string => string.repeat(3);
const embolden = string => string.bold();

const result = embolden(repeatThreeTimes(makeLouder('string ')));
console.log(result); // <b>STRING STRING STRING </b>

const newResult = compose (makeLouder, repeatThreeTimes, embolden);

console.log(newResult('string')); // <B>STRING</B><B>STRING</B><B>STRING</B>
