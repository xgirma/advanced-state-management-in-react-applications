# Part Six: React and Redux
Using the pizza calculator example. 

```javascript
import React from 'react';
import { render } from 'react-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import getInitialState from './initial-state';
import reducer from './reducer';

import Application from './components/Application';

import './style.css';

const store = createStore(reducer, getInitialState());

render(
  <Provider store={store}>
    <Application />
  </Provider>,
  document.getElementById('root'),
);
```

We have got a little bit of starting point: with `const store = createStore(reducer, getInitialState());` We don't need to combine reducers because this is a very simple app.  

action
```javascript
export const updateNumberOfPeople = value => ({
  type: 'UPDATE_NUMBER_OF_PEOPLE',
  value,
});

export const updateSlicesPerPerson = value => ({
  type: 'UPDATE_SLICES_PER_PERSON',
  value,
});

export const reset = () => ({
  type: 'RESET',
});
```

reducer
```javascript
import getInitialState from './initial-state';
import calculate from './lib/calculate-pizzas-needed';

export default function(state = getInitialState(), action) {
  if (action.type === 'UPDATE_NUMBER_OF_PEOPLE') {
    return {
      ...state,
      numberOfPeople: action.value,
      numberOfPizzasNeeded: calculate(action.value, state.slicesPerPerson),
    };
  }

  if (action.type === 'UPDATE_SLICES_PER_PERSON') {
    return {
      ...state,
      slicesPerPerson: action.value,
      numberOfPizzasNeeded: calculate(state.numberOfPeople, action.value),
    };
  }

  if (action.type === 'RESET') {
    return getInitialState();
  }

  return state;
}
```
initial state
```javascript
import calculatePizzasNeeded from './lib/calculate-pizzas-needed';

const getInitialState = () => {
  const numberOfPeople = 10;
  const slicesPerPerson = 2;
  const numberOfPizzasNeeded = calculatePizzasNeeded(
    numberOfPeople,
    slicesPerPerson,
  );

  return { numberOfPeople, slicesPerPerson, numberOfPizzasNeeded };
};

export default getInitialState;
```

We have our actions and reducers we do need to connect it to React now (i.e connect it to the view).

Theoretically import the store, into each one and do it on a `componentDidMount`? and update the sate you can do all of that.  right? But Redux actually gives us another abstraction to use and we don't have to do that manual pull-in waiting for the `componentDidMount` do subscribe, and when the `componentDidUnmount` unsubscribe.

 
## Provider
We wrap the entire application on this provider and we pass it the instance of the store. This is the majic happening wit the `react-redux` library.  
```javascript
render(
  <Provider store={store}>
    <Application />
  </Provider>,
  document.getElementById('root'),
);
```
## container component
We have Redux, now we need to create the container components to hook Redux too. Note all the component in the `/components` folder are presentational or `stateless components`. These are components that receive everything they need. 

## middleware
Login to the console everytime is tedious. So we will hookup with the dev-tool middleware. In the below example, we are not actually using middleware, but we are going to use `enhancers`.

`window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose ;` what is this?  This is checking if Redux devtool is installed on the `windows` object of Chrome or use compose. Compose will take regular functions and puts them together.

`composeEnhancers(applyMiddleware(...middleware), ...enhancers)` use any middleware and enhancers we provided. 

```javascript
import React from 'react';
import { render } from 'react-dom';

import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import getInitialState from './initial-state';
import reducer from './reducer';

import Application from './components/Application';

import './style.css';

const middleware = [];
const enhancers = [];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  getInitialState(),
  composeEnhancers(applyMiddleware(...middleware), ...enhancers)
);

render(
  <Provider store={store}>
    <Application />
  </Provider>,
  document.getElementById('root'),
);
```

<img width="1186" alt="screen shot 2017-12-24 at 10 10 30 pm" src="https://user-images.githubusercontent.com/5876481/34334049-b72babb6-e8f7-11e7-8cde-60b19a3a2895.png">

## containers
We use `connect` from the `react-redux` library. `Connect is going to wrap up higher order components nicely for us. A given component does not care about the entire state tree, it only concerned to a specific data it needs. 

```javascript
export default connect(mapStateToProps, mapDispatchToProps)
```

`mapStateToProps` allows you to get the entire tree, pick the parts you care about and pass it to the component.. 

1. The tree is very large, you don't want to deal with it.

2. Props re-render the component the less you pass-in you are not going to have needless re-renders. 

`mapDispatchToProps` it creates an object, when we bound those `action creators` and pass it as well. Basically set a props and the sate you want to have, the action you want to pass in. 

### NumberOfPeopleContainer
The Input component have multiple vars. 
```html
<input
    value={value}
    type={type}
    max={max}
    min={min}
    placeholder={label}
    onChange={handleChange}
/>
```
But what we care about now is `value`. Let us map state to props. 

```javascript
import { connect } from 'react-redux';

import { Input } from '../components/Input';

const mapStateToProps = (state) => {
  return {
    value: state.numberOfPeople
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Input)
```

Dispatching: map state to props. Now we are seeing the store's dispatch method. Passing a result of object or an action creator to dispatch (kik off) the entire process. 

## React state vs. Redux state
What goes into React and Redux state? 

Dan article: [You might not need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)

Side loading state might not require, or even you don't even need to use only one kind of approach. Should i put things in Redux? it depends. Like most things, it is a trade off. 

If you think about the `NewItem` component with basic state, everything we needed was in this component. 

```javascript
import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';

import './NewItem.css';

class NewItem extends Component {
  state = { value: '' };

  handleChange = event => {
    // Do something when the state of this input changes.
    const value = event.target.value;
    this.setState({ value });
  };

  handleSubmit = event => {
    const { onSubmit } = this.props;
    const { value } = this.state;

    event.preventDefault();

    // Do something when a new value is submitted.
    onSubmit( {value, id: uniqueId(), packed: false} );

    // Reset the state of the component.
    this.setState({ value: ''});
  };

  render() {
    const { value } = this.state;

    return (
      <form className="NewItem" onSubmit={this.handleSubmit}>
        <input
          className="NewItem-input"
          type="text"
          value={value}
          onChange={this.handleChange}
        />
        <input className="NewItem-submit button" type="submit" />
      </form>
    );
  }
}

export default NewItem;
```

Should we break-it-up into Redux? Well we will have four files.

        1. NewItem.js
        2. NewItemContainer.js
        3. new-item-actions.js
        4. items-reducer.js
        
You have to make the tradeoff. At the end of the day `this.setState()` is inherently simpler to reason about than actions, reducers, and stores. 

## react-redux library
It is a small library: have only the `<Provider />` component and the `connect()` method. 

### connect()
`connect(mapStateToProps, mapDispatchToProps)(WrappedComponent)` it is the higher-order component pattern. 

    1. Pick which things you want from the store. 
    2. (Maybe transform the data if you need to.)
    3. Pick which actions this component needs (putting together the action creators you need)
    4. Mix these two together and pass them as props to a presentational component
    
This is a function that you make that takes the entire state tree and boils it down to just what your components needs. 

```javascript
const mapStateToProps = (state) => {
  return {
    value: state.numberOfPeople
  };
};
```
Transforming: this would be just the packed items. 
```javascript
const mapStateToProps = (state) => {
  return {
    items: items.filter(item => item.packed );
  };
};
```
A function that recives `store.dispatch` and then returns an **object** with methods that will call dispatch. 

```javascript
const mapDispatchToProps = (dispatch) => ({
  onCheckOff(id){
    dispatch(toggleItem(id)):
  },
  onRemove(id){
    dispatch(removeItem(id));
  }
})
```
You can do it by hand as above or use our friend `bindActionCreators` Redux. like below.

```javascript
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
      updateNewItemValue,
      addNewItem
  }, dispatch)
};
```

This is all very cool, but where is the store and how does connect() know about it? We passed the store to the `<Provider />` component and we never talked about it again. 

```javascript
<Provider store={store}>
    <Application />
</Provider>
```

Somehow `connect` knows about it. That is strange. The black-majic in react-redyx library is 

> The provider is a component that sets the context of all of its children. 

This leads us to the next question. `What is context?` 

```javascript
this.props;
this.state;
this.context;
```
`Context` is the third never talked about child. You may say, I have never used `this.context` good you should never use context. Even in the React documentation there ia an article titled [`why not to use context`](https://reactjs.org/docs/context.html). 

<img width="932" alt="screen shot 2017-12-24 at 11 58 24 pm" src="https://user-images.githubusercontent.com/5876481/34335781-62ebfd9e-e906-11e7-9da3-0540e51440f4.png">

In the second paragrap, it explicltly says it is for Redux and MobX. 

It is not because it is unstable API. It is just you are not ment to use it. `It is for React-Redux and MobX-React, it is for them to use to create this functionality that all the child components should know about the store`.

This is an over simplification of the `<Provider />` component. 

```javascript
class Provider extends Component {
  getChildContext() {
    return { store: this.props.store }
  }
  
  render() {
    return Children.only(this.props.children)
  }
}
```
So the provider extends the component and it had this method `getChildContext` which is built in to React, which will take the store and pass it as a prop. and return it as `context.store`. And the provider then passes `getChildContext` to all of its children. Now all of its children now get its child context. It will not work unless you difine `childContextTypes`.

```javascript
class Provider extends Component { // ... }

Provider.childContextTypes = {
  store: PropTypes.shape({
      subscribe: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      getState: PropTypes.func.isRequired,
  }),
  storeSubscription: PropTypes.shape({
    trySubscribe: PropTypes.func.isRequired,
    tryUnsubscribe: PropTypes.func.isRequired,
    notifyNestedSubs: PropTypes.func.isRequired,
    isSubscribed: PropTypes.func.isRequired
  })
}
}
```

It is not like normal PropTypes. This is for React-Redux, would be different for MobX. You can see it is looking for `subscribe, dispatch`, and `getState`. It is litterally pasing the store to every child component. And `connect()` know that, t**hat is where it is getting dispatch from**. This is the blackest of the majic React-Redux usese.

All the child components would need this `contextTypes` 

```javascript
class SomePresentationaComponet extends Component {
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  })
};
``` 

Connect is doing all these for us, and we don't have to do all this by hand. 

> So when something is teriable, you should abstract it to a library, then you should never do it again. 

