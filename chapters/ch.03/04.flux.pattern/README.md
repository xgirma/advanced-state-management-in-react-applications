# Pattern 04: Flux pattern
We need dispatcher, action, and store. And we need to wire them together. 

        1. Dispatcher
        2. Action
        3. Store
        
        npm install flux events
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
-              onToggle={() => onToggle(item)}
-              onRemove={() => onRemove(item)}
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

END OF PATTERNS