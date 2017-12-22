# Render properties


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

