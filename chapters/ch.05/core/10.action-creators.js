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

const initialErrorState = {
  message: ''
};

// before
// const addAction = {
//   type: 'ADD',
//   value: 4
// };
//
// const errorAction = {
//   type: 'SET_ERROR_MESSAGE',
//   value: 'Fix the error, and move on'
// };

const calculatorReducer = (state = initialState, action) => {
  if (action.type === 'ADD') {
    return {
      ...state,
      result: state.result + action.value
    }
  }
  
  return state;
};

const errorReducer = (state = initialErrorState, action) => {
  if(action.type === 'SET_ERROR_MESSAGE') return { message: action.value};
  if(action.type === 'CLEAR_ERROR_MESSAGE') return { message: ''};
  return state;
};

const store = createStore(combineReducers({
  calculator: calculatorReducer,
  error: errorReducer
}));

const subscriber = () => {
  console.log('SUBSCRIPTION!!!');
  console.log(store.getState());
};

store.subscribe(subscriber);

// action creators
const add = value => ({ type: 'ADD', value });
const setError = message => ({ type: 'SET_ERROR_MESSAGE', message });
const clearError = () => ({ type: 'CLEAR_ERROR_MESSAGE' });

store.dispatch(add(4));
store.dispatch(setError('Fix the error, and move on'));
store.dispatch(add(10));
store.dispatch(clearError());

/*
    SUBSCRIPTION!!!
    { calculator: { result: 4 }, error: { message: '' } }
    SUBSCRIPTION!!!
    { calculator: { result: 4 }, error: { message: undefined } }
    SUBSCRIPTION!!!
    { calculator: { result: 14 }, error: { message: undefined } }
    SUBSCRIPTION!!!
    { calculator: { result: 14 }, error: { message: '' } }
 */