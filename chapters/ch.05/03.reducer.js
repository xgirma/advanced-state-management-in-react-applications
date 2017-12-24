import {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore,} from 'redux'

const initState = { result: 1 };

const addAction = {
  type: 'ADD',
  value: 4
};

const calculateReducer = ( state = initState, action) => {
  if (action.type === 'ADD') {
    return {
      ...state,
      result: state.result + action.value
    }
  }
};

const result = calculateReducer(initState, addAction);
console.log(result); // { result: 5 }
