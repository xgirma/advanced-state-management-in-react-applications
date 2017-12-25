import { ADD_NEW_ITEM, REMOVE_ITEM, TOGGLE_ITEM, MARK_ALL_AS_UNPACKED } from '../constants';

export default function(state = {}, action) {
  if(action.type === ADD_NEW_ITEM) {
    const item = action.item;
    return [...state, item]
  }

  if(action.type === REMOVE_ITEM){
    const id = action.id;
    return state.filter(item => item.id !== id);
  }

  if(action.type === TOGGLE_ITEM){
    const id = action.id;
    return state.map( item => {
      if(item.id === id){
        return {...item, packed: !item.packed};
      }
      return item;
    });
  }

  if(action === MARK_ALL_AS_UNPACKED){
    return state.map(item => {return {...item, packed: false}});
  }

  return state;
}
