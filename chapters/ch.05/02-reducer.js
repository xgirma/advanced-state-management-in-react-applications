// simplest reducer
const initialState = {
  result: 0
};

const calculatorReducer = (action, state = initialState) => {
  return state;
};

console.log(calculatorReducer());