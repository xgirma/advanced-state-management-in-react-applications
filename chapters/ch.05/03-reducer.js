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
