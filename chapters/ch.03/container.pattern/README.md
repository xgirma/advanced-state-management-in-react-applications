# Lifting state with the container pattern

> Draws a line between state and presentation. 

Note: this is true in all the three patters, in a slightly different way. We have things that manage `state` and things that manage `view` that is effectively two parts of MVC. The Mode and the View and the controller to coordinate between the two of them. 

React originally, "your state is encapsulated in your view" 

`Container` components manage state and pass it to `presentational` components. The presentational components receive `props` and render user interface. This makes it incredibly easy to test.

It is easy to test a component where based on the props we received comes out the other end like this. 

The presentational components are the one `the user interact and change`, they do need a way to communicate back to the container component.

> Presentational component receive actions and pass them back to the container. 

For e.g. the individual `item` component `did not really manage their own state`. They received it either from the `Items` list or the `Application` component. They were effectively presentational component.

> Presentational component either only have a **render()** method or they are **stateless functional components**.

Presentational component (stateless functional components)
```javascript
const Counter = ({ count, onIncrement }) => {
  return(
    <section>
      <h1>Count: {count} </h1>
      <button onclick={onIncrement}>Increment<.button>
    </section>
  );
}
```

This is just an `arrow function` props comes in and component comes out. There is no `this.state`. Everything this component need is passed to the component. 

Container component
```javascript
import React, { Component } from 'react';
import Counter from './Counter';

export default class CounterContainer extends Component {
  state = { count: 0 }
  increment = () => {
    this.setState(state => ({ count: state.count + 1 }));
  }
  
  render(){
    const { count } = this.state;
    retuen (
      <div>
        <Counter count={ count } inIncrement={ this.increment } />
        <Counter count={ count } inIncrement={ this.increment } />
      </div>
    );
  }
}
```

Two `Counter`, just to show both _gets the same state_. All the container component is doing (1) `keep track of the state`, (2) have the method that allows the state to be `modified`, and  (3) `pass` that into the presentational component. 

Practice: change the counter app example to a container pattern. 

### before

```html
<div id="root"></div>
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
<script crossorigin src="https://unpkg.com/prop-types@15.6.0/prop-types.js"></script>
<link rel="stylesheet" href="style.css">

<script type="text/babel">
  class Counter extends React.Component {
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
      const { count } = this.state;
      return (
        <section className="Counter">
          <h1>Count: {`${count}`}</h1>
          <button onClick={this.handleIncrement} className="full-width">Increment</button>
          <button onClick={this.handleDecrement} className="full-width">Decrement</button>
          <button onClick={this.handleReset} className="full-width">Reset</button>
        </section>
      );
    }
  }

  ReactDOM.render(
    <Counter />,
    document.getElementById('root')
  )
</script>
```

### after

```javascript
import React from 'react';
import { render } from 'react-dom';
import CounterContainer from './CounterContainer';

import './index.css';

render(<CounterContainer />, document.getElementById('root'));
```

```javascript
import React from 'react'
import Counter from './Counter'

export default class CounterContainer extends React.Component {
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
    const { count } = this.state;
    return (
      <Counter
        count={count}
        onIncrement={this.handleIncrement}
        onDecrement={this.handleDecrement}
        onReset={this.handleReset}
      />
    );
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

### calculate pizza example
We use the container pattern to refactor `pizza-calculate` app. Spearating the presentation from the state. 
 
[source before](https://github.com/stevekinney/pizza-calculator/tree/master/src)

[source after](https://github.com/xgirma/AdvancedStateManagementInReactApplications/tree/master/chapters/ch.03/container.pattern/pizza.calculator.app/src)

````javascript
import React, { Component } from 'react';

import Application from './Application'

import calculatePizzasNeeded from './lib/calculate-pizzas-needed';

const initialState = {
  numberOfPeople: 10,
  slicesPerPerson: 2,
};

export default class ApplicationContainer extends Component {
  state = { ...initialState };

  updateNumberOfPeople = event => {
    const numberOfPeople = parseInt(event.target.value, 10);
    this.setState({ numberOfPeople });
  };

  updateSlicesPerPerson = event => {
    const slicesPerPerson = parseInt(event.target.value, 10);
    this.setState({ slicesPerPerson });
  };

  reset = event => {
    this.setState({ ...initialState });
  };

  render() {
    const { numberOfPeople, slicesPerPerson } = this.state;
    const numberOfPizzas = calculatePizzasNeeded(
      numberOfPeople,
      slicesPerPerson,
    );

    return (
        <Application
          numberOfPeople={numberOfPeople}
          slicesPerPerson={slicesPerPerson}
          numberOfPizzas={numberOfPizzas}
          updateNumberOfPeople={this.updateNumberOfPeople}
          updateSlicesPerPerson={this.updateSlicesPerPerson}
          reset={this.reset}
        />
    );
  }
}
````

```javascript
import React, { Component } from 'react';

import Title from './Title';
import Input from './Input';
import Result from './Result';

export default class Application extends Component {
  render() {
    const { numberOfPeople, slicesPerPerson, numberOfPizzas, updateNumberOfPeople, updateSlicesPerPerson,  reset } = this.props;

    return (
      <div className="Application">
        <Title />
        <Input
          label="Number of Guests"
          type="number"
          min={0}
          value={numberOfPeople}
          onChange={updateNumberOfPeople}
        />
        <Input
          label="Slices Per Person"
          type="number"
          min={0}
          value={slicesPerPerson}
          onChange={updateSlicesPerPerson}
        />
        <Result amount={numberOfPizzas} />
        <button className="full-width" onClick={reset}>
          Reset
        </button>
      </div>
    );
  }
}
```

:no_good: I am not gaining that much :no_good: 

Imagine we are pulling this information from a server. It will be really hard to test that. In order to test a component that show the UI based on what it gets from a server, you hav eto mock a bunch of AJAX requests. `if tetsing is hard you probably are not going to do it`.

So this allows you to pass in the `object` you want and see that the component works. 

But what happens if i have `with user date`, I want to use it in multiple places of my application, with different presentational component, **this pattern does not sound correct**.  

That takes us to [higer order components](https://github.com/xgirma/AdvancedStateManagementInReactApplications/tree/ch.03/chapters/ch.03/higer.order.components)