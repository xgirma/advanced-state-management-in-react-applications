const redux = require('redux');

const {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore
} = redux;

const initialState = { result: 0 };

const initialErrorState = { message: '' };

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

// middleware
const logger = ({ getState }) => {
  return next => action => {
    console.log('MIDDLEWARE', getState(), action);
    return next(action);
  }
};

const store = createStore(combineReducers({
  calculator: calculatorReducer,
  error: errorReducer
}), {}, applyMiddleware(logger));

const add = value => ({ type: 'ADD', value });
const setError = message => ({ type: 'SET_ERROR_MESSAGE', message });
const clearError = () => ({ type: 'CLEAR_ERROR_MESSAGE' });

store.dispatch(add(4));
store.dispatch(setError('Fix the error, and move on'));
store.dispatch(clearError());

/*
    MIDDLEWARE { calculator: { result: 0 }, error: { message: '' } } { type: 'ADD', value: 4 }
    MIDDLEWARE { calculator: { result: 4 }, error: { message: '' } } { type: 'SET_ERROR_MESSAGE',
      message: 'Fix the error, and move on' }
    MIDDLEWARE { calculator: { result: 4 }, error: { message: undefined } } { type: 'CLEAR_ERROR_MESSAGE' }
*/