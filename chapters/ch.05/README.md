# Part Five: Redux
Redux is considered to be an implementation of the Flux pattern.

Remember Flux is not a program you download, it is an approach you use to manage your application. 

There is a third library we are going to cover, called `react-redux`. Redux itself is no way React specific. That is why we have `react-redux` library to create that binding.  

With Flux, you'd probably end up with a different store for every noun/model in your application.

Redux takes a different approach. The whole state tree of your application is kept in one store. All the view state is in one immutable state tree. `Immutable state tree` is a very fancy word to impress people. When yu really mean is just one plain old JavaScript object :yum:

Scientific chart: React is just a JavaScript objects and functions.

### 1. Reducer
<img width="426" alt="screen shot 2017-12-23 at 9 13 13 pm" src="https://user-images.githubusercontent.com/5876481/34324390-319ecd38-e826-11e7-8d07-5727c50aee89.png">

Reduce is a function and takes two arguments. `action` and `current state`.

<img width="423" alt="screen shot 2017-12-23 at 9 16 18 pm" src="https://user-images.githubusercontent.com/5876481/34324407-8f3308a6-e826-11e7-9fbb-55b43038e4e0.png">

It takes some kind of action. That action is just a JavaScript object. It has a `type` property. And it take the current state of your application.

<img width="425" alt="screen shot 2017-12-23 at 9 19 30 pm" src="https://user-images.githubusercontent.com/5876481/34324418-ff8945de-e826-11e7-9cc2-a85d466a450b.png">

        action + current state = reducer = new state
        
We use `action creators`, but we could create object by hand. Writing action by hand is tedious, so we will write a function that does that for us.

Ideally you create a state to do something. display it to the user.

<img width="424" alt="screen shot 2017-12-23 at 9 30 22 pm" src="https://user-images.githubusercontent.com/5876481/34324453-837d8642-e828-11e7-919b-b82ce1376805.png">

To a view, who have event listener, like ow, I am clicked, I am changed ... Those in-turn will create action triggers. Again we have archived the React uni-directional data flow principle.

**Redux is small.**
How samll it is? It is five methods.
```javascript
applyMiddleware: function()
bindActionCreators: function()
combineReducers: function()
compose: function()
createStore: function()
``` 

# 1. Compose
Compose is not actually Redux specific. It takes a bunch of functions and chain them. `Redux uses it, we use it when we put middleware together`. It is not Redux, it is just a helper method. 

```javascript
const makeUpperCase = string => string.toUpperCase();
const repeatThreeTimes = string => string.repeat(3);
const embolden = string => string.bold(3);

const result = embolden(repeatThreeTimes(makeUpperCase('string ')));
console.log(result);
// <b>STRING STRING STRING </b>
```
It is hard to read that backwards. What compose does is, takes a bunch of function and return a function. 

using Redux's compose
```javascript
const redux = require('redux');

const {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore
} = redux;

const makeUpperCase = string => string.toUpperCase();
const repeatThreeTimes = string => string.repeat(3);
const embolden = string => string.bold(3);

// using redux compose
const newResult = compose(embolden, repeatThreeTimes, makeUpperCase);

console.log(newResult('string '));
// <b>STRING STRING STRING </b>
```

# Reducer
The world simplest reducer, ignore everything and returns the state. 
```javascript
// simplest reducer
const initialState = {
  result: 0
};

const calculatorReducer = (action, state = initialState) => {
  return state;
};

console.log(calculatorReducer());
```

Now, let say we have action that is called `ADD`. Probably we need the `action type` and the `value` we want to add. 

```javascript
const initialState = {
  result: 0
};

const action = {
  type: 'ADD',
  value: 4
};

const calculatorReducer = ({state = initialState, action}) => {
  if(action.type === 'ADD'){
    return {
      ...state,
      result: state.result + action.value
    }
  }
  
  return state;
};

console.log(calculatorReducer({ action }));
console.log(calculatorReducer({ action }));

// { result: 4 }
// { result: 4 }
```

We have produced `new state of the world, we need to store that somewhere`.

# 2. Store: createStore
```javascript
const redux = require('redux');

const {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore
} = redux;

console.log(createStore());
// throw new Error('Expected the reducer to be a function.');
// NOTE: store created with a reducer param
```

As shown in the error message, to create a store we need to provide a `reducer`.


```javascript
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

/*
{
  dispatch: [Function: dispatch],
  subscribe: [Function: subscribe],
  getState: [Function: getState],
  replaceReducer: [Function: replaceReducer],
  [Symbol(observable)]: [Function: observable]
}
*/
```
Store have `dispatch`, `subscribe`, `getState`, and `replaceReducer` methods.`

## Store: Subscribe 
```javascript
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
```

## Store: dispatch
Now let us dispatch an action three times
```javascript
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

store.subscribe(subscriber);

store.dispatch(addAction);
store.dispatch(addAction);
store.dispatch(addAction);

/*
    SUBSCRIPTION!!!
      { result: 4 }
    SUBSCRIPTION!!!
      { result: 8 }
    SUBSCRIPTION!!!
      { result: 12 }
*/

```
So the store is keeping track of the state of the world. Now we have a way to manage state and manipulate state. 

## Store: unsubscribe
What is if we unsubscribe after we dispatch three actions, and dispatch one more time?

```javascript
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
``` 

# 3. combineReducers: one store 
React only has the idea of one store, one tree, and one reducer. 

>Combining reducers allowes you to break your application into smaller parts. 

One tree for the entire app. Grate. App grow, over time. You don't want your reducer to grow and grow and grow. Ideally likely be able to split it out. Unfortunately React only have the idea of one reducer. 

Solution: what we could do is split the reducer into small reducers and when we setup a store we could theoretically combine them together into one.  

```javascript
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
```

We are now with full Redux setup.

# Action creators  
Easy...
```javascript
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
```

# 4. bindActionCreators (draft)
You could write this function in about one line. 

```javascript
import {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore,
} from 'redux'

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

store.dispatch({
  type: "SET_ERROR_MESSAGE",
  message: "This is going to blow your mind."
});

// SUBSCRIPTION!!! 5 RRROR SUBSCRIPTION This is going to blow your mind.

// action creator

const add = (value ) => {return { type: 'ADD', value }};

store.dispatch(add(40));

// SUBSCRIPTION!!! 45 RRROR SUBSCRIPTION This is going to blow your mind.


const setError = (message) => ({ type: "SET_ERROR_MESSAGE", message });
const clearError = (message) => ({ type: "CLEAR_ERROR_MESSAGE", message });

// custom singular bind
const bindActionCreator = (action, dispatch) => (...args) => dispatch(action( ...args));

const addValue = bindActionCreator(add, store.dispatch);

addValue(12);

// SUBSCRIPTION!!! 57 RRROR SUBSCRIPTION This is going to blow your mind.
```

What is this `bindActionCreators`?

# 5. applyMiddleware
We use this to apply middleware. It is really a take on compose, which is, it will allow you to kind of go in and, build intermediary steps in this processes.

> createStore(reducer, preloadedState, enhancer) [source](https://github.com/reduxjs/redux/blob/master/docs/api/createStore.md)

Let us add more loggers: 

```javascript
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
``` 

`applyMiddleware` can take multiple argument, using compose. We are in full circle.

# Testing
Redux is a collection of function and actions. The good thing about that it is easy to test. You want to test a reducer? that is a function.

action
```javascript
import { ADD_NEW_ITEM, REMOVE_ITEM, TOGGLE_ITEM, MARK_ALL_AS_UNPACKED } from '../constants';

export const markAllAsUnpacked = () => ({
  type: MARK_ALL_AS_UNPACKED
});
``` 

reducer
```javascript
import { UPDATE_NEW_ITEM_VALUE } from '../constants';

export default function(state = '', action) {
  if(action.type === UPDATE_NEW_ITEM_VALUE){
    return action.value
  }
  return state;
}
```

test
```javascript
describe('New Item Actions', () => {
  describe('updateNewItemValue', () => {
    it('should return UPDATE_NEW_ITEM_VALUE as the item type', () => {
      const action = updateNewItemValue('item name');
      expect(action.type).toBe(constants.UPDATE_NEW_ITEM_VALUE);
    });

    it('should return the provided text', () => {
      const value = 'item name';
      const action = updateNewItemValue(value);
      expect(action.value).toBe(value);
    });
  });

});

describe('updateNewItemValue', () => {
  it('should update the newItemValue field on the resulting state', () => {
    const value = 'item name';
    const action = updateNewItemValue(value);
    const state = reducer(initialState, action);
    expect(state.newItemValue).toBe(value);
  });
});
```
I use flux at work, but I dig this reducer pattern! Can I use it? Yes. All of of these stuff is objects and functions and even better than that `flux` library in the `flux/utils` folder has a util called `ReduceStore` effectively that is you do a Redux reducer in a normal implementation. 

```javascript
import { ReduceStore } from 'flux/utils';

class ItemStore extends ReduceStore {
  constructor() { super(AppDispatcher); }
  
  getInitialState() { return []; }
  
  reduce(state, action){
    if(action.type === 'ADD_NEW_ITEm'){
      return [ ...state.items, action.item ]
    }
    
    return stste;
  }
}
```

# Footnote
To use babel and node in the command line

        npm i babael-cli
        npx babel-node script.js
        
