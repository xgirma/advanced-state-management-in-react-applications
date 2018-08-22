const redux = require('redux');

const {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore } = redux;

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

const store = createStore(calculateReducer);

const subscriber = () => {
  console.log('SUBSCRIPTION!!!', store.getState().result);
};

const unsubscribe = store.subscribe(subscriber);

store.dispatch(addAction); // SUBSCRIPTION!!! 5
store.dispatch(addAction); // SUBSCRIPTION!!! 9
