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

const addAction = {
  type: 'ADD',
  value: 4
};

const errorAction = {
  type: 'SET_ERROR_MESSAGE',
  value: 'Fix the error, and move on'
};

// reducer 1
const calculatorReducer = (state = initialState, action) => {
  if (action.type === 'ADD') {
    return {
      ...state,
      result: state.result + action.value
    }
  }
  
  return state;
};

// reducer 2
const errorReducer = (state = initialErrorState, action) => {
  if(action.type === 'SET_ERROR_MESSAGE') return { message: action.value};
  if(action.type === 'CLEAR_ERROR_MESSAGE') return { message: ''};
  return state;
};

// const store = createStore(calculatorReducer); // before
const store = createStore(combineReducers({
  calculator: calculatorReducer,
  error: errorReducer
}));

const subscriber = () => {
  console.log('SUBSCRIPTION!!!');
  console.log(store.getState());
};

store.subscribe(subscriber);

store.dispatch(addAction);
store.dispatch(errorAction);
store.dispatch(addAction);

/*
    SUBSCRIPTION!!!
    { calculator: { result: 4 }, error: { message: '' } }
    SUBSCRIPTION!!!
    { calculator: { result: 4 },
      error: { message: 'Fix the error, and move on' } }
    SUBSCRIPTION!!!
    { calculator: { result: 8 },
      error: { message: 'Fix the error, and move on' } }
*/