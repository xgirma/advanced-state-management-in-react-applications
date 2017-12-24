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
[1.] **Dispatcher**. this is the first part in the circle. Make a dispatcher.  
 ```javascript
const AppDispatcher = new Dispatcher();
```
**action creator** creates action, it is just a function that dispatches an action `object` to the dispatcher.
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

2. Stores: You can have multiple **stores**. they are just objects.  
<img width="665" alt="screen shot 2017-12-23 at 8 12 29 am" src="https://user-images.githubusercontent.com/5876481/34320964-0f0baeac-e7b9-11e7-952f-9944ab2a94c2.png">

3. To `listen to` actions object from the dispatcher stores need to **register** them with the dispatcher to listen to actions they care. Hey I am a store, I care about what you say, please let me know when you receive actions can you let me know. Dispatchers " ... like i tell everyone everything I don't keep secret".

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

4.We start getting from the **actions** from dispatcher 

Dispatcher will send them the action it hears. Store contains your **models**. It register itself with the dispatcher and receives actions. **action**(_noun_): The minimal amount of information necessary to represent the change that should occur. When possible, we want to drive state. Action is the only way to initiate a change to the store. The simplest possible action `{}`. 

```javascript
{ type: 'INCREMENT'}
```

Action can have additional information. 
```javascript
{ type: 'INCREMENT', amount: 5}
```

Whenever a store does something based on an action, it `emits a chang`e event.
<img width="662" alt="screen shot 2017-12-23 at 8 17 27 am" src="https://user-images.githubusercontent.com/5876481/34320997-bf099562-e7b9-11e7-9285-fd64a876ef0e.png">

5. We have all these presentational components.  If it is a higher order component it is `WithCurrentUser` ... Hooks in to the store and pass it whatever presentational component it gets. These presentational components are super testable.  
<img width="661" alt="screen shot 2017-12-23 at 8 19 10 am" src="https://user-images.githubusercontent.com/5876481/34321008-fcb2cce4-e7b9-11e7-8fad-3711beeba49c.png">

6. **View wants to listen to the store.**
```javascript

import PizzaCalculatorStore from './PizzaCalculatorStore'

export default class PizzaCalculatorContainer extends Component {
  state = PizzaCalculatorStore.getState();

  render() {} // ...
}
```

<img width="662" alt="screen shot 2017-12-23 at 8 21 19 am" src="https://user-images.githubusercontent.com/5876481/34321029-4b5abcbc-e7ba-11e7-9189-ff92b3f963b9.png">

7. **store emit those change events** change, "here I change, here is the new thing ..." View asks Store, What is the new state in the world, view get that through props. The UI changes.  

```javascript
class PizzaCalculatorStore extends EventEmitter {
  constructor() {
    super();

    AppDispatcher.register((action) => {
      if (action.type === 'UPDATE_NUMBER_OF_PEOPLE') {
        calculator.numberOfPeople = action.value;
        this.emit('change');
      }
    });
  }
}
```

```javascript
export default class PizzaCalculatorContainer extends Component {

  componentDidMount = () => {
    PizzaCalculatorStore.on('change', this.updateState);
  };

  componentWillUnmount = () => {
    PizzaCalculatorStore.off('change', this.updateState);
  }; // ...
}
```
<img width="670" alt="screen shot 2017-12-23 at 8 22 35 am" src="https://user-images.githubusercontent.com/5876481/34321036-76af0d5a-e7ba-11e7-8cf6-9792ed1d57d7.png">

8. **The user**, touches or input stuff, as they do they trigger click event ... Those sent to the action creator. 

```javascript
 import { addItem } from '../actions';
 
 class NewItem extends Component {
   state = { value: '' };
 
   handleSubmit = event => {
     const { value } = this.state;
 
     event.preventDefault();
 
     // Do something when a new value is submitted.
     addItem(value);
 
     // Reset the state of the component.
     this.setState({ value: ''});
   };
 
   render() {} // ...
 }
```
<img width="665" alt="screen shot 2017-12-23 at 8 24 10 am" src="https://user-images.githubusercontent.com/5876481/34321048-ae864d60-e7ba-11e7-85bb-012d0aea215e.png">

9. The event got sent to the `action creator`. where is the action creator? in the dispatcher. Here we make the circle. Which then goes to the dispatcher and then to the store, which triggers another change - updating the view.
<img width="662" alt="screen shot 2017-12-23 at 8 26 33 am" src="https://user-images.githubusercontent.com/5876481/34321060-089dd110-e7bb-11e7-8a35-19821a4a57da.png">

Thinking in React, what kind of data flow, do we have in React? uni-directional. The data is flowing one way.

<img width="665" alt="screen shot 2017-12-23 at 8 28 24 am" src="https://user-images.githubusercontent.com/5876481/34321074-47d541b0-e7bb-11e7-8f44-9701347e662c.png">

By using Flux, we keep that uni-directional data flow, but we just removed it from the component tree. We can keep this anywhere, because it floats outside of your component hierarchy. 
 
        => Dicpatcher => Store => View => Dispatcher => ...
        
        
## Jetsetter  example in flux
We need dispatcher, action, and store. And we need to wire them together. 

        1. Dispatcher
        2. Action
        3. Store
        
        npm install flux
        import { Dispatcher } from 'flux';
        import EventEmitter from 'events';
        
We will be using the `jeysetter` example.
        
### Dispatcher

```javascript
import { Dispatcher } from 'flux';

export default new Dispatcher();
```

### Actions
We have three actions: `add new item`, `remove an item`, and `change the status of an item`. We have actions already implemented. For example `NewItem` component have `onSubmit( {value, id: uniqueId(), packed: false} );` we do that in the view layer, which i didn't feel good about it. We have a place to put it now. We are not going to pass this through a component hierarchy anymore. 

 
> addItem: The action should get a bare `minimum` information from the UI and `get the action ready`. The only thing we need from the UI is what ever is in the `input field`. We can do the `uniqueId` and the `packed` state can be set into `false` in here, in the action.

> toggleItem: we can toggle the item here, we do not need to get it from the App. 

> removeItem: we can remove item, also we don't need any thing from the App. 

When these action makes it to the store the store knows what to do.

```javascript
import uniqueId from 'lodash/uniqueId';
import AppDispatcher from './AppDispatcher';

export const addItem = value => {
  AppDispatcher.dispatch({
    type: 'ADD_NEW_ITEM',
    item: { value, packed: false, id: uniqueId() }
  })
}

export const toggleItem = (item) => {
  AppDispatcher.dispatch({
    type: 'UPDATE_ITEM',
    item: { ...item, packed: !item.packed },
  });
};

export const removeItem = (item) => {
  AppDispatcher.dispatch({
    type: 'REMOVE_ITEM',
    item
  });
};
```

### Store     

```javascript
import EventEmitter from 'events';
import uniqueId from 'lodash/uniqueId';

import AppDispatcher from './AppDispatcher';

let items = [
  { value: 'Pants', id: uniqueId(), packed: false },
  { value: 'Jacket', id: uniqueId(), packed: false },
  { value: 'iPhone Charger', id: uniqueId(), packed: false },
  { value: 'MacBook', id: uniqueId(), packed: false },
  { value: 'Sleeping Pills', id: uniqueId(), packed: true },
  { value: 'Underwear', id: uniqueId(), packed: false },
  { value: 'Hat', id: uniqueId(), packed: false },
  { value: 'T-Shirts', id: uniqueId(), packed: false },
  { value: 'Belt', id: uniqueId(), packed: false },
  { value: 'Passport', id: uniqueId(), packed: true },
  { value: 'Sandwich', id: uniqueId(), packed: true },
];

class ItemStore extends EventEmitter {
  constructor() {
    super();

    AppDispatcher.register((action) => {
      console.log('IN STORE', action);
      if (action.type === 'ADD_NEW_ITEM') { return this.addItem(action.item); }
      if (action.type === 'UPDATE_ITEM') { return this.updateItem(action.item); }
      if (action.type === 'REMOVE_ITEM') {return this.removeItem(action.item);}
    });
  }

  getItems() {
    return items;
  }

  addItem(newItem) {
    function findDuplicate(item){
      return newItem.value !== item.value;
    }
    if(items.every(findDuplicate)) {
      items = [...items, newItem];
      this.emit('change');
    }
  }

  updateItem(updatedItem) {
    items = items.map(item => {
      if (item.id !== updatedItem.id) return item;
      return updatedItem;
    });
    this.emit('change');
  }

  removeItem(itemToRemove) {
    items = items.filter(item => item.id !== itemToRemove.id);
    this.emit('change');
  }
}

export default new ItemStore();
```

### Application
````diff
import React, { Component } from 'react';
import CountDown from './CountDown';
import NewItem from './NewItem';
import Items from './Items';

import './Application.css';

- const defaultState = [
-    { value: 'Pants', id: uniqueId(), packed: false },
-    { value: 'Jacket', id: uniqueId(), packed: false },
-    { value: 'iPhone Charger', id: uniqueId(), packed: false },
-    { value: 'MacBook', id: uniqueId(), packed: false },
-    { value: 'Sleeping Pills', id: uniqueId(), packed: true },
-    { value: 'Underwear', id: uniqueId(), packed: false },
-    { value: 'Hat', id: uniqueId(), packed: false },
-    { value: 'T-Shirts', id: uniqueId(), packed: false },
-    { value: 'Belt', id: uniqueId(), packed: false },
-    { value: 'Passport', id: uniqueId(), packed: true },
-    { value: 'Sandwich', id: uniqueId(), packed: true },
-  ];

+ import ItemStore from '../ItemStore';

class Application extends Component {
  state = {
-    items: defaultState  
+    items: ItemStore.getItems(),
  };
  
-  addItem = item => {
-    this.setState({
-      items: [item, ...this.state.items]
-    });
-  };
    
-  removeItem = itemToRemove => {
-    this.setState({
-      items: this.state.items.filter( item => item.id !== itemToRemove.id)
-   });
-  };
    
-  markAsPacked = item => {
-    const otherItems = this.state.items.filter(other => other.id !== item.id);
-    const updatedItem = { ...item, packed: !item.packed };
-    this.setState({ items: [updatedItem, ...otherItems] });
-  };

  markAllAsUnpacked = () => {
+    // const items = this.state.items.map(item => ({ ...item, packed: false }));
+    // this.setState({ items });
  };

+  updateItems = () => {
+    this.setState({ items: ItemStore.getItems() });
+  }

+  componentDidMount() {
+    ItemStore.on('change', this.updateItems);
+  }

+  componentWillUnmount() {
+    ItemStore.off('change', this.updateItems);
+  }

  render() {
    const { items } = this.state;
    const unpackedItems = items.filter(item => !item.packed);
    const packedItems = items.filter(item => item.packed);

    return (
      <div className="Application">
-        <NewItem onSubmit={this.addItem}/>
+        <NewItem />
         <CountDown {...this.state} />
-        <Items 
-          title="Unpacked Items" 
-          items={unpackedItems} 
-          onRemove={this.removeItem} 
-          onToggle={this.markAsPacked}
-        />
+        <Items
+          title="Unpacked Items"
+          items={unpackedItems}
+         />
-        <Items 
-          title="Packed Items" 
-          items={packedItems} 
-          onRemove={this.removeItem} 
-          onToggle={this.markAsPacked} 
-         />
+        <Items
+          title="Packed Items"
+          items={packedItems}
+         />
-        <button 
-          className="button full-width" 
-          onClick={this.markAllAsUnpacked}>
           Mark All As Unpacked
          </button>
+         <button className="button full-width" onClick={this.markAllAsUnpacked} disabled>
           Mark All As Unpacked
          </button>
      </div>
    );
  }
}

export default Application;
````

### NewItems

```diff
import React, { Component } from 'react';

import './NewItem.css';

+ import { addItem } from '../actions';

class NewItem extends Component {
  state = { value: '' };

  handleChange = event => {
    // Do something when the state of this input changes.
    const value = event.target.value;
    this.setState({ value });
  };

  handleSubmit = event => {
-   const { onSubmit } = this.props;
    const { value } = this.state;

    event.preventDefault();

    // Do something when a new value is submitted.
-    onSubmit( {value, id: uniqueId(), packed: false} );    
+    addItem(value);

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

### Items
```diff
import React, { Component } from 'react';
import Item from './Item';
import Filter from './Filter';

class Items extends Component {
  state = {
    searchTerm: ''
  };

  updateSearchTerm = searchTerm => {
    this.setState({
      searchTerm
    })
  };

  render() {
-    const { title, items, onRemove, onToggle } = this.props;
+    const { title, items } = this.props;
    const { searchTerm } = this.state;
    return (
      <section className="Items">
        <h2>
          {title} ({items.length})
        </h2>
        <Filter searchTerm={searchTerm} onChange={this.updateSearchTerm} />
        {items
          .filter(item =>
            // Hmm… this needs some work.
            item.value.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map(item => (
            <Item
              key={item.id}
-             onToggle={() => onToggle(item)}
-             onRemove={() => onRemove(item)}
              item={item}
            />
          ))}
      </section>
    );
  }
}

export default Items;
```

### Item
```diff
import React, { Component } from 'react';
import './Item.css';

+ import { toggleItem, removeItem } from '../actions';

class Item extends Component {
+  handleChange = () => {
+    toggleItem(this.props.item);
+  };

+  handleRemove = () => {
+    removeItem(this.props.item);
+  };

  render() {
-    const { item, onRemove, onToggle } = this.props;
+    const { item } = this.props;
    return (
      <article className="Item">
        <label htmlFor={item.id}>
          <input
            type="checkbox"
            checked={item.packed}
-           onChange={() => onToggle(item)}
+           onChange={this.handleChange}
            id={item.id}
          />
          {item.value}
        </label>
-        <button className="Item-remove" onClick={() => onRemove(item)}>
+        <button className="Item-remove" onClick={this.handleRemove}>
          Remove
        </button>
      </article>
    );
  }
}

export default Item;
```
