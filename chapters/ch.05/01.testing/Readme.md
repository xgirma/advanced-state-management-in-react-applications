# Testing
Redux is a collection of function and actions. The good thing about that it is easy to test. You want to test a reducer? that is a function. 

You should not test everything. For example, I put the `input-field` in the Redux store just for demonstration purpose. 

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