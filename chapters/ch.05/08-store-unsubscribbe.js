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

const addAction = {
  type: 'ADD',
  value: 4
};

const calculatorReducer = (state = initialState, action) => {
  if (action.type === 'ADD') {
    return {
      ...state,
      result: state.result + action.value
    }
  }
  
  return state;
};

const store = createStore(calculatorReducer);

const subscriber = () => {
  console.log('SUBSCRIPTION!!!');
  console.log(store.getState());
};

const unsubscribe = store.subscribe(subscriber);

store.dispatch(addAction);
store.dispatch(addAction);
store.dispatch(addAction);

unsubscribe();
store.dispatch(addAction);
console.log(store.getState());

/*
    SUBSCRIPTION!!!
    { result: 4 }
    SUBSCRIPTION!!!
    { result: 8 }
    SUBSCRIPTION!!!
    { result: 12 }
    { result: 16 }
*/