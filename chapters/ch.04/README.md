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
**We are not going to manage the state anymore**. Who is going to manage the state for us? Flux. Hence, no `setState`.

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
  
- reset = event => {
-   this.setState({ ...initialState });
- };

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
TODO: add more note

### Confusing chart 

<img width="1116" alt="flux-diagram-white-background" src="https://user-images.githubusercontent.com/5876481/34320915-f8e3d3d0-e7b7-11e7-9058-9145904810d4.png">

### Scientific chart: step by step
[1.] This is a **dispatcher**. this is the first part in the circle.

[1.1.] make a dispatcher.  
 ```javascript
const AppDispatcher = new Dispatcher();
```
[1.2.] action creator creates action and dispatches an object
```javascript
export const addItem = value => {
  AppDispatcher.dispatch({
    type: 'ADD_NEW_ITEM',
    item: {
      id: uniqueId(),
      packed: false,
      value,
    },
  });
};
```
<img width="673" alt="screen shot 2017-12-23 at 8 11 06 am" src="https://user-images.githubusercontent.com/5876481/34320957-de82dd82-e7b8-11e7-893a-f0ce66cc37a8.png">

2. You can have multiple **stores**. they are objects.  
<img width="665" alt="screen shot 2017-12-23 at 8 12 29 am" src="https://user-images.githubusercontent.com/5876481/34320964-0f0baeac-e7b9-11e7-952f-9944ab2a94c2.png">

3. To hook object with dispatcher you need to **register** them with the dispatcher. Hey I am a store, i care about what you say, please let me know when you receive actions can you let me know. Dispatchers like i tell everyone everything I don't keep secret. I want to subscribe to your news letter.

```javascript
class ItemStore extends EventEmmitter {
  constructor() {
    super();
    AppDispatcher.register(action => {
      if (action.type === 'UPDATE_NUMBER_OF_PEOPLE') { // ..}
      if (action.type === 'UPDATE_SLICES_PER_PERSON') { //...}
    });
  }
}
```

<img width="668" alt="screen shot 2017-12-23 at 8 13 48 am" src="https://user-images.githubusercontent.com/5876481/34320976-3cb395cc-e7b9-11e7-96b6-0327c19941d5.png">

Store contains your **models**. It register itself with the dispatcher and receives actions. 

action(noun): The minimal amount of information necessary to represent the change that should occur. 

Action is the only way to initiate a change to the store. The simplest possible action 

```javascript
{ type: 'INCREMENT'}
```

Action can have additional information. 

```javascript
{ type: 'INCREMENT', ampunt: 5}
```

Whenever it does something based on an action, it emits a change event. 

4.We start getting from the **actions** from dispatcher 
<img width="662" alt="screen shot 2017-12-23 at 8 17 27 am" src="https://user-images.githubusercontent.com/5876481/34320997-bf099562-e7b9-11e7-9285-fd64a876ef0e.png">

5. We have all these presentational components.  
<img width="661" alt="screen shot 2017-12-23 at 8 19 10 am" src="https://user-images.githubusercontent.com/5876481/34321008-fcb2cce4-e7b9-11e7-8fad-3711beeba49c.png">

6. **View wants to listen to the store.**
<img width="662" alt="screen shot 2017-12-23 at 8 21 19 am" src="https://user-images.githubusercontent.com/5876481/34321029-4b5abcbc-e7ba-11e7-9189-ff92b3f963b9.png">

7. **store emit those change events** change, here is the new thing ... What is the new state in the world, view get that through props. The UI changes.  
<img width="670" alt="screen shot 2017-12-23 at 8 22 35 am" src="https://user-images.githubusercontent.com/5876481/34321036-76af0d5a-e7ba-11e7-8cf6-9792ed1d57d7.png">

8. **The user**, touches or input stuff, and click event, for instance, even triggered. 
<img width="665" alt="screen shot 2017-12-23 at 8 24 10 am" src="https://user-images.githubusercontent.com/5876481/34321048-ae864d60-e7ba-11e7-85bb-012d0aea215e.png">

9. The event got sent to the `action creator`. where is the action creator? in the dispatcher. Here we make the circle. 
<img width="662" alt="screen shot 2017-12-23 at 8 26 33 am" src="https://user-images.githubusercontent.com/5876481/34321060-089dd110-e7bb-11e7-8a35-19821a4a57da.png">

Thinking in React, what kind of data flow, do we have in React? uni-directional. 

Data flow chart: 

<img width="665" alt="screen shot 2017-12-23 at 8 28 24 am" src="https://user-images.githubusercontent.com/5876481/34321074-47d541b0-e7bb-11e7-8f44-9701347e662c.png">

By using Flux, we keep that uni-directional data flow, but we just removed it from the component tree. We can keep this anywhere, because it flows outside of your component hierarchy. 
 