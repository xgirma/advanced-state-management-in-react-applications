const initialState = {
  result: 0
};

const addAction = {
  type: 'ADD',
  value: 4
};

const calculatorReducer = (action, state = initialState) => {
  if(action.type === 'ADD'){
    return {
      ...state,
      result: state.result + action.value
    }
  }
  
  return state;
};

console.log(calculatorReducer(addAction));