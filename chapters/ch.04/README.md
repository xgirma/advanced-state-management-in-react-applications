# Part Four: The Flux Pattern

The idea to move out state management out of React. We will have more flexibility. Remember React plain is just a view layer. Managing state on the view layer increases the complexity of your application. 

When should we pull it out, first it makes sense to use `setState` and wait until it hearts. The cool, thing about the `container pattern` if you start with the container pattern, you have already separated out the state from your UI. So, should you decide, that `setState` hearts, it is not hard to refactor your app. 

If you jammed your presentation and state management, refactoring will be painful, also to move to Flux, Reduc, or Mobx. 

Example with `pizza-calculator`

### Dispatcher 
Flux is a pattern, there is not a Flux library. When you `npm install flux` you get a very light weight sets of tools, you do not get the entire flux pattern. You get effectively a `dispatcher` and some `utils`. 

A dispatcher is a going to be the thing that receives that a bunch of thins that happen and figures out what to do with it. 

if you ever use the `pub-sub` pattern before that it can broadcast things (dispatch). It is similar with one important difference. With the pub-sub pattern you usually subscribe to a given message. You want to respond to. 
if you use even't listener in `jquery` or vanilla `DOM` you effectively use the pub-sub pattern. e.g. add listener for `click event`. 

With the dispatcher, anyone who listen to the dispatcher gets everything. It is just like a radio. Than a mobile phone. Everyone can hear everything. So the only thing we need to do is just create instances of the dispatcher. That is going to be our entire dispatcher. 

```javascript
import { Dispatcher } from 'flux';

export const new Dispatcher();
```

Definition: Dispatcher received action and broadcast them out.

Next: get action to dispatcher (action file) or listening to dispatcher (TODO). 

### Actions
Action is a notification something happen. 

An action is a `object`, we need to tell what kind of action happen (`type`), the user can do increment/decrement number of gusts, increase/decrease slices per person ... lots of other `types` of actions can happen. I am calling it `type` because it is a common pattern, but it can be anything. 
 
You look the UI and see what are the action a user can take. 

**An action is a thing that happen and the bare minimum amount of information you need in order to communicate that.**

```javascript
import AppDispatcher from './AppDispatcher';

{ type: 'UPDATE_NUMBER_OF_GUESTS', value: 0}
```
This is error pron. So we use an Action Creator. 

#### Action creator
Action creator is a function that creates an action. It is simply you pass in something an it returns one of these objects `{ type: 'UPDATE_NUMBER_OF_GUESTS', value: 0}`.

```javascript
import AppDispatcher from './AppDispatcher';

export const updateNumberOfPeople = (value) =>{
  const action = { type: 'UPDATE_NUMBER_OF_PEOPLE', value};
  AppDispatcher.dispatch(action);
};

export const updateSlicesPerPerson = (value) => {
  AppDispatcher.dispatch({
    type: 'UPDATE_SLICES_PER_PERSON',
    value
  });
};

export const reset = () =>{
  AppDispatcher.dispatch({ type: 'RESET'})
};
```

All these actions go to the dispatcher. The dispatcher broadcast them. So the next thing we are going to do is create a `store`. 

### Store
Store is theoretically the thing that hold the `data` for our application.  Dispatcher will tell all the stores in your application that an action occurred. 

**All the NOUNS in your application will likely to have a store.**

e.g. for a Yelp clone, we need a `restorant` store. 

**The store needs to tell components that the data has changed``.** 

We need some kind of event library. We are using `webpack`, which means we can use all the `node` standard library, such as `events`, out of the box.  

[events doc](https://nodejs.org/api/events.html)

Eventemitter emit(broadcast) events. Because Eventemitter does some setup at the beginning we need a constructor.  Dispatcher tells everyone, that does not mean everyone cares about that. My current store cares about `UPDATE_NUMBER_OF_PEOPLE`, `UPDATE_SLICES_PER_PERSON` and `RESET` nothing else. Other events `LOGGED_IN` ... will be ignored.

```javascript
import EventEmitter from 'events'

export default class PizzaCalculatorStore {
  constructor(){
    super();
  }
}
```

**so we need to listen to different kinds of actions*** The dispatcher is dispatching, but we are not listening, or turn the Radio on. We need to register oneself with the AppDispatcher.

```javascript
import AppDispatcher from './AppDispatcher';
import EventEmitter from 'events'

export default class PizzaCalculatorStore {
  constructor(){
    super();

    AppDispatcher.register((action) => {
      if(action.type === 'UPDATE_NUMBER_OF_PEOPLE') { return }
      if(action.type === 'UPDATE_SLICES_PER_PERSON') { return }
      if(action.type === 'RESET') { return }
    });
  }

}
```
 
Action is dispatched with type and value: We use `action.value` for updating the data in the store. 

````javascript
export const updateNumberOfPeople = (value) =>{
  const action = { type: 'UPDATE_NUMBER_OF_PEOPLE', value};
  AppDispatcher.dispatch(action);
};
````

In the store we need to update the data with that value. Modify the data object, in the store. 

```javascript
import AppDispatcher from './AppDispatcher';
import EventEmitter from 'events'

let calculator = {
  numberOfPeople: 10,
  slicesPerPerson: 2
};

export default class PizzaCalculatorStore {
  constructor(){
    super();

    AppDispatcher.register((action) => {
      if(action.type === 'UPDATE_NUMBER_OF_PEOPLE') {
        calculator.numberOfPeople = action.value
      }
      if(action.type === 'UPDATE_SLICES_PER_PERSON') { return }
      if(action.type === 'RESET') { return }
    });
  }

}
```
One more thing, we need to notify all of the views that are eventually listen. Hey I just change this value. Who cares i changed it it is different now. `this.emit('change')`

````javascript
import AppDispatcher from './AppDispatcher';
import EventEmitter from 'events'

let calculator = {
  numberOfPeople: 10,
  slicesPerPerson: 2
};

export default class PizzaCalculatorStore {
  constructor(){
    super();

    AppDispatcher.register((action) => {
      if(action.type === 'UPDATE_NUMBER_OF_PEOPLE') {
        calculator.numberOfPeople = action.value;
        this.emit('change');
      }
      
      if(action.type === 'UPDATE_SLICES_PER_PERSON') { return }
      if(action.type === 'RESET') { return }
    });
  }

}
````

**stores tell the view**

```javascript
import AppDispatcher from './AppDispatcher';
import EventEmitter from 'events'

const initialState = {
  numberOfPeople: 10,
  slicesPerPerson: 2
};

let calculator = {...initialState};

class PizzaCalculatorStore {
  constructor() {
    super();

    AppDispatcher.register((action) => {
      if (action.type === 'UPDATE_NUMBER_OF_PEOPLE') {
        calculator.numberOfPeople = action.value;
        this.emit('change');
      }

      if (action.type === 'UPDATE_SLICES_PER_PERSON') {
        calculator.slicesPerPerson = action.value;
        this.emit('change');
      }

      if (action.type === 'RESET') {
        calculator = {...initialState};
        this.emit('change');
      }
    });
  }
}

export default PizzaCalculatorStore();
```

`this.emit` comes from the `EventEmitter`. We inherited few methods from it. The only thing we care about `EventEmitter` is `on, off` and `emit`. On adds event listener. Off takes it off. And emit tells everyone tha we add an event listener. 

### using a container patter with flux
We are not going to manage the state anymore. Who is going to manage the state for us? Flux. Hence, no `setState`.

```diff
import React, { Component } from 'react';

import Application from './Application'

import calculatePizzasNeeded from './lib/calculate-pizzas-needed';

const initialState = {
  numberOfPeople: 10,
  slicesPerPerson: 2,
};

export default class PizzaContainer extends Component {
- state = { ...initialState };
  updateNumberOfPeople = event => {
    const numberOfPeople = parseInt(event.target.value, 10);
-   this.setState({ numberOfPeople });   
  };

  updateSlicesPerPerson = event => {
-  this.setState({ slicesPerPerson });
   const slicesPerPerson = parseInt(event.target.value, 10);
  };
  
-  reset = event => {
-    this.setState({ ...initialState });
-  };

  render() {

    return (
      <div className="Application">
        <Title />
        <Input
          label="Number of Guests"
          type="number"
          min={0}
          value={numberOfPeople}
          onChange={updateNumberOfPeople}
        />
        <Input
          label="Slices Per Person"
          type="number"
          min={0}
          value={slicesPerPerson}
          onChange={updateSlicesPerPerson}
        />
        <Result amount={numberOfPizzas} />
        <button className="full-width" onClick={reset}>
          Reset
        </button>
      </div>
    );
  }
}
```