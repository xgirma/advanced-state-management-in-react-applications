const redux = require('redux');

const {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore } = redux;

const initState = { result: 1} ;

const addAction = {
  type: 'ADD',
  value: 4
};

let calculateReducer = (state = initState, action) => {
  if (action.type === 'ADD') {
    return {
      ...state,
      result: state.result + action.value
    }
  }
  return state;
};

const subscriber = () => {
  console.log('SUBSCRIPTION!!!', store.getState().calculator.result);
  console.log('RRROR SUBSCRIPTION', store.getState().error.message);
};

const initError = {message: ''};

let errorMessageReducer = (state = initError, action) => {
  if (action.type === 'SET_ERROR_MESSAGE') return {message: action.message};
  if (action.type === 'CLEAR_ERROR_MESSAGE') return {message: ''};
  return state;
};

const store = createStore(
  combineReducers({
    calculator: calculateReducer,
    error: errorMessageReducer,
  })
);

const unsubscribe = store.subscribe(subscriber);

const init = store.getState();
console.log(init); // { calculator: { result: 1 }, error: { message: '' } }

store.dispatch(addAction); // SUBSCRIPTION!!! 5 RRROR SUBSCRIPTION
store.dispatch(addAction); // SUBSCRIPTION!!! 9 RRROR SUBSCRIPTION
store.dispatch(addAction); // SUBSCRIPTION!!! 13 RRROR SUBSCRIPTION


store.dispatch({
  type: "SET_ERROR_MESSAGE",
  message: "This is going to blow your mind."
});

// SUBSCRIPTION!!! 13 RRROR SUBSCRIPTION This is going to blow your mind.

unsubscribe();
