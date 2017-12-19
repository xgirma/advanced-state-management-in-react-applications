import React from 'react';

const decrement = function (state) {
  if (state.count === 0) return; // wow: now i can have programatic logic
  return {count: state.count - 1}
};

class Counter extends React.Component {
  state = {count: 10};

  handleDecrement = () => {
    this.setState(decrement);
    this.setState(decrement);
    this.setState(decrement);
  };


  render() {
    const {count} = this.state;
    return (
      <section className="Counter">
        <h1>Count: {`${count}`}</h1>
        <button onClick={() => {}} className="full-width">Increment</button>
        <button onClick={this.handleDecrement} className="full-width">Decrement</button>
        <button onClick={() => {}} className="full-width">Reset</button>
      </section>
    );
  }
}

export { Counter, decrement}