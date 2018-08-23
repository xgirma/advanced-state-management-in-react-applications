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

// the view layer wants to know what is changed and update the view, by subscribing
const subscriber = () => {
  console.log('SUBSCRIPTION!!!');
  console.log(store.getState());
};

store.subscribe(subscriber);
