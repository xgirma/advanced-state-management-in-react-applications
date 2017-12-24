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

## Compose
Compose is not actually Redux specific. It takes a bunch of functions and chain them. Redux uses it, we use it when we put middleware together. It is not Redux, it is just a helper method. 

```javascript
const makeLouder = string => string.toUpperCase();
const repeatThreeTimes = string => string.repeat(3);
const embolden = string => string.bold(3);

const result = embolden(repeatThreeTimes(makeLouder('string ')));
console.log(result); // <b>STRING STRING STRING </b>
```
It is hard to read that backwards. What compsose does is, takes a bunch of function and return a function. 

using compose form Redux
```javascript
import {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore,} from 'redux'

const makeLouder = string => string.toUpperCase();
const repeatThreeTimes = string => string.repeat(3);
const embolden = string => string.bold();

const result = embolden(repeatThreeTimes(makeLouder('string ')));
console.log(result); // <b>STRING STRING STRING </b>

const newResult = compose(makeLouder, repeatThreeTimes, embolden);

console.log(newResult('string')); // <B>STRING</B><B>STRING</B><B>STRING</B>
```

## Idea of reducer
The world simplest reducer, ignore everything and returns the state. 
```javascript
import {
  applyMiddleware,
  bindActionCreators,
  combineReducers,
  compose,
  createStore,} from 'redux'

const initState = { result: 0 };

const calculateReducer = ( state = initState, action) => {
  return state;
};

const result = calculateReducer(); // { result: 0 }
```

Your application is not care about the the simplest reducer. We don't do with the action just yet. Let say we have action that is called `ADD`. Probably we need the `action type` and the `value` we want to add. 

```javascript
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
```

We have produced new state of the world, we need to store that somewhere.

## createStore

```javascript
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

const store = createStore(calculateReducer);
console.log(store);

/*
{ dispatch: [Function: dispatch],
  subscribe: [Function: subscribe],
  getState: [Function: getState],
  replaceReducer: [Function: replaceReducer] }
*/
```
## Subscribe 
```javascript
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

const store = createStore(calculateReducer);

const subscriber = () => {
  console.log('SUBSCRIPTION!!!', store.getState().result);
};

const unsubscribe = store.subscribe(subscriber);

store.dispatch(addAction); // SUBSCRIPTION!!! 5
```
Let us call it again, o look the current state is now 9 !!!
```javascript
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

const store = createStore(calculateReducer);

const subscriber = () => {
  console.log('SUBSCRIPTION!!!', store.getState().result);
};

const unsubscribe = store.subscribe(subscriber);

store.dispatch(addAction); // SUBSCRIPTION!!! 5
store.dispatch(addAction); // SUBSCRIPTION!!! 9
```
So the store is keeping track of the state of the world. Now we have a way to manage state, and manipulate state. 

What is if we unsubscribe after we call it once, but call twice

```javascript
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

const store = createStore(calculateReducer);

const subscriber = () => {
  console.log('SUBSCRIPTION!!!', store.getState().result);
};

const unsubscribe = store.subscribe(subscriber);

store.dispatch(addAction); // SUBSCRIPTION!!! 5

unsubscribe();

store.dispatch(addAction);
``` 

React ONLY have one tree, one reducer. 
## combineReducer
One tree for the entire app. Grate. App grow. We can only  have one reducer, you don't want your reducer to grow and grow and grow. Ideally likely be able to split it out. Unfortunately React only have the idea of one reducer. 

We can only have one reducer, but what we could do is, we could have small reducers and when we setup a store we could theoretically combine them together into one.  

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
store.dispatch(addAction); // SUBSCRIPTION!!! 9 RRROR SUBSCRIPTION
store.dispatch(addAction); // SUBSCRIPTION!!! 13 RRROR SUBSCRIPTION


store.dispatch({
  type: "SET_ERROR_MESSAGE",
  message: "This is going to blow your mind."
});

// SUBSCRIPTION!!! 13 RRROR SUBSCRIPTION This is going to blow your mind.

unsubscribe();
```

We are now with full Redux setup.

## Action creators  
Easy
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
```

## bindActionCreators 
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

## applyMiddleware
let us add more loggers: 

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


// Middleware
const logger = ({ getState}) => { return next => action => {
  console.log('MIDDLEWARE: ', getState(), action );
  const value = next(action);
  console.log({value});

}};


const store = createStore(
  combineReducers({
    calculator: calculateReducer,
    error: errorMessageReducer,
  }), {}, applyMiddleware(logger)
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
<img width="716" alt="screen shot 2017-12-24 at 4 07 09 am" src="https://user-images.githubusercontent.com/5876481/34326414-3241835e-e860-11e7-96e6-be72452c130e.png">



# Footnote
To use babel and node in the command line

        npm i babael-cli
        npx babel-node script.js
        
