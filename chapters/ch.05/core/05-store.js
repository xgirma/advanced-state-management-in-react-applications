const redux = require('redux');

const {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore
} = redux;

const initialState = {
  result: 0
};

const calculatorReducer = (state = initialState, action = 'ADD') => {
  if (action.type === 'ADD') {
    return {
      ...state,
      result: state.result + action.value
    }
  }
  
  return state;
};


const store = createStore(calculatorReducer);

console.log(store);

/**
 * store has few methods
 * {
 *   dispatch: [Function: dispatch],
 *   subscribe: [Function: subscribe],
 *   getState: [Function: getState],
 *   replaceReducer: [Function: replaceReducer],
 *   [Symbol(observable)]: [Function: observable]
 * }
*/