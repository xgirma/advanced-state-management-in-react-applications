# Pattern 03: Render properties pattern
Yet another pattern to separate your `state` from your `presentation`. It circumvent the problem we have seen before. Things are not `black box` anymore. <Counter/> container was not clear when you stare at that code.  

The Render properties allows you to see very clearly what the actual hierarchy is. it give you the advantage of the container pattern and the HOC. 

```javascript
import React from 'react';
import { render } from 'react-dom';
import CounterContainer from './CounterContainer';

import './index.css';

render(<CounterContainer />, document.getElementById('root'));
```

```javascript
import React, { Component } from 'react'

import Counter from './Counter'
import WithCount from './WithCount'

export default class CounterContainer extends Component {
  render(){
    return (
      <WithCount render={
        (count, handleIncrement, handleDecrement, handleReset) => (
          <Counter
            count={count}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onReset={handleReset}
          />
        )
      }/>
    )
  }
}
```
You have a property called `render` It would be pass in as `props`. We can see the hierarchy. It is getting all the props, from the `WithCount` component but at the same time the hierarchy is very clear. 
```javascript
import React, { Component } from 'react'

export default class Counter extends Component {
  render() {
    const { count, onIncrement, onDecrement, onReset } = this.props;
    return (
      <section className="Counter">
        <h1>Count: {`${count}`}</h1>
        <button onClick={onIncrement} className="full-width">Increment</button>
        <button onClick={onDecrement} className="full-width">Decrement</button>
        <button onClick={onReset} className="full-width">Reset</button>
      </section>
    );
  }
}
```
It got the same state as before. This component takes a `property called render` which is going to be a function. Right it calls that function. 
```javascript
import React from 'react'

export default class WithCount extends React.Component {
  state = { count : 10 };

  handleIncrement = () => {
    this.setState({
      count : this.state.count + 1
    })
  };

  handleDecrement = () => {
    this.setState({
      count : this.state.count - 1
    })
  };

  handleReset = () => {
    this.setState ({
      count : 0
    })
  };

  render() {
    return (
      <div className="WithCount">
        {
          this.props.render(
            this.state.count,
            this.handleIncrement,
            this.handleDecrement,
            this.handleReset
          )
        }
      </div>
    );
  }
}
```

<img width="1068" alt="screen shot 2017-12-22 at 9 03 58 am" src="https://user-images.githubusercontent.com/5876481/34306271-2ed5a07a-e6f7-11e7-9266-88b966d53664.png">

Refactored: pizza-calculator with "Render properties"

<img width="1083" alt="screen shot 2017-12-22 at 9 55 28 am" src="https://user-images.githubusercontent.com/5876481/34307700-503307c4-e6fe-11e7-9f5f-12ba77222b62.png">