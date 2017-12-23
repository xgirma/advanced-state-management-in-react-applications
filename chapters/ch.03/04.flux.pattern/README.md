# Flux
We need dispatcher, action, and store. And we need to wire them together. 

        1. Dispatcher
        2. Action
        3. Store
        
        npm install flux events
        import { Dispatcher } from 'flux';
        import EventEmitter from 'events';
        
We will be using the `jeysetter` example.
        
### Dispatcher

        
### Actions
We have three actions: `add new item`, `remove an item`, and `change the status of an item`. We have actions already implemented. For example `NewItem` component have `onSubmit( {value, id: uniqueId(), packed: false} );` we do that in the view layer, which i didn't feel good about it. We have a place to put it now. We are not going to pass this through a component hierarchy anymore. 

 
> addItem: The action should get a bare `minimum` information from the UI and `get the action ready`. The only thing we need from the UI is what ever is in the `input field`. We can do the `uniqueId` and the `packed` state can be set into `false` in here, in the action.

> toggleItem: we can toggle the item here, we do not need to get it from the App. 

> removeItem: we can remove item, also we don't need any thing from the App. 

When these action makes it to the store the store knows what to do.

### Store     