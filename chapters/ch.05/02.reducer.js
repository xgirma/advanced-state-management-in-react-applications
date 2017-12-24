import {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore,} from 'redux'

const initState = { result: 0 };

const calculateReducer = ( state = initState, action) => {
  return state;
};

const result = calculateReducer(); // { result: 0 }
