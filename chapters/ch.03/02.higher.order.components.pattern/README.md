# Higher order components

> Take a component as input and return a warped component.

They basically take a `presentation component` and return one that is `wraped in the container` component. This is an evolution of the `container pattern. 

:factory: :factory: :factory: container factory :factory: :factory: :factory:

I tend to use it :round_pushpin: "hey, I,m going to need this state all over the place - and I don't want to pass it around." :round_pushpin:

> Adding a logout button (pulling app state out of the UI)
  In many situations, the principle of LCA is sufficient. State has a single source of truth, and is passed down to all children who need it. The problem you can run into, however, is when the LCA is very far away in your component hierarchy from the relevant children.
  
>  In this case, you can end up with many components acting as middlemen. These components must know about and pass along various pieces of shared state to leaf components, making your UI difficult to refactor. There's even a code smell of the same name in object-oriented design, suggesting that this is indeed a concern.
  
>  An example of how this could happen is if many components in your app needed to know about the current user:

![1](https://user-images.githubusercontent.com/5876481/34297696-80d56686-e6ce-11e7-9e9c-17aeac2a6e64.png)

> Assuming this many nodes need to know about the current user, the LCA would be <app>, and every component would need to pass along currentUser to every other component. This definitely smells like Middle Man.
  
>  The solution to this problem is to pull the state out of the UI hierarchy.

You can create this higher order component whenever you need that data you can simply take the `presentational` component and pass it into the `higher order component`get back a wrapped `container` component with `presentation` component. 

    presentational component => higher order component => container component ( => presentational component)
    
```javascript
const WithCount = WrappedComponent => class extends component {
  state = { count: 0 }
  increment = () => {
    this.setState(state => ({ count: state.count + 1 }));
  }
  
  render() {
    <WrappedComponent
      count={this.state.count}
      onIncrement={this.increment}
      {...this.props} 
    />
  }
}
```

**WithCount** that is a popular pattern, with React/Redux will be called something else. I like to name is based on the state I am passing in, in this case it is my basic counter. 
    
It returns :round_pushpin: `anonymous class` :round_pushpin: take this component and return as a new component. Returns whatever componen is passed in **with** all of the states that it needs. 

**Practice: with pizz-counter app**
The real power of this pattern, composing new component by taking some stateful component that made to fetch API, work with local storage, any kind of state you want to use in multiple places use higher order component. This is the cost common pattern i use when i am pulling data drom a remote sources. Even when I am using browser API. 

There is not a lot of changes. We do know that it is a function. 

Why this works? 
```javascript
const WithPizzaCalculations = WrappedComponent =>  {
  return class extends Component {

  };
};
```

It turns out `class` in JavaScript are syntactic sugar over function. So the same way I can have anonymous function i can have anonymous calss, it is just syntactic sugar. 

The major change is instead of always returning `<PizzaCalculator>` what we return the component that was passed in. Now I have the ability to create as many of these I want. 

```javascript
import React from 'react';
import { render } from 'react-dom';

import PizzaContainer from './PizzaContainer'

import './style.css';

render(<PizzaContainer />, document.getElementById('root'));
```

composing
````javascript
import React from 'react'

import WithPizzaCalculation from './WithPizzaCalculation'
import PizzaCalculator from './PizzaCalculator'

const PizzaContainer = WithPizzaCalculation(PizzaCalculator);

export default PizzaContainer
````

presentational component 
```javascript
import React, { Component } from 'react';

import Title from './Title';
import Input from './Input';
import Result from './Result';

export default class Pizza extends Component {
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

factory component 

```javascript
import React, { Component } from 'react';

import calculatePizzasNeeded from './lib/calculate-pizzas-needed';

const initialState = {
  numberOfPeople: 10,
  slicesPerPerson: 2,
};

const WithPizzaCalculation = WrappedComponent =>  {
  return class extends Component {

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
        <WrappedComponent
          numberOfPeople={numberOfPeople}
          slicesPerPerson={slicesPerPerson}
          numberOfPizzas={numberOfPizzas}
          updateNumberOfPeople={this.updateNumberOfPeople}
          updateSlicesPerPerson={this.updateSlicesPerPerson}
          reset={this.reset}
        />
      );
    }
  };
};

export default WithPizzaCalculation;
```

### sneaky problem 
<img width="1101" alt="screen shot 2017-12-22 at 5 22 39 am" src="https://user-images.githubusercontent.com/5876481/34299509-32f6bf78-e6d8-11e7-8b28-38707b3701ef.png">

Remeber how we created that `anonymous` class, owwww. it just says `_class2` that is not great. Worse there are situation where we get `unknown`. Which is not helpful in debugging. So this pattern has a problem. Easy solution. 

The naing of component happens during babel transpilation. All we need to do is figure out what to name this. Because it is a factory we don't want to call it `withPizzaCalculations` we want to know like what the child componet is. 


**We have two choices:** 

#### choice 1: on the class itself
I can store this in a variable:

```diff
import React, { Component } from 'react';

import calculatePizzasNeeded from './lib/calculate-pizzas-needed'; 

const initialState = {
  numberOfPeople: 10,
  slicesPerPerson: 2,
};

const WithPizzaCalculation = WrappedComponent =>  {
-  return class extends Component {
+  const Container = class extends Component {

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
        <WrappedComponent
          numberOfPeople={numberOfPeople}
          slicesPerPerson={slicesPerPerson}
          numberOfPizzas={numberOfPizzas}
          updateNumberOfPeople={this.updateNumberOfPeople}
          updateSlicesPerPerson={this.updateSlicesPerPerson}
          reset={this.reset}
        />
      );
    }
  };
  
+  Container.displayName = `WithPizzaCalculation`

+  return Container;
};

export default WithPizzaCalculation;
```
before `Container.displayName = `WithPizzaCalculation`` added.

<img width="1101" alt="screen shot 2017-12-22 at 5 32 36 am" src="https://user-images.githubusercontent.com/5876481/34299776-9711fa6c-e6d9-11e7-9fe4-fd96e946e1ee.png">

##### Container.displayName

After `Container.displayName = `WithPizzaCalculation`` added.

I do have to be a little careful, because i could have a stateless functional component which have a **.name** propertyor the one that i use which have a **.displayName** property. 

`WithPizzaCalculation`  this is kind of silly, `WithCurrentUser` with whatever the sate you passing in. That way if you decide to compose morthan one of these, it becomes very clear when you see the chain. 

<img width="1100" alt="screen shot 2017-12-22 at 5 39 03 am" src="https://user-images.githubusercontent.com/5876481/34299920-782036b8-e6da-11e7-9561-5e2dd65fffb6.png">


```diff
const WithPizzaCalculation = WrappedComponent =>  {
  const Container = class extends Component {
    // ...
  };

-  Container.displayName = `WithPizzaCalculation`
+  Container.displayName = `WithPizzaCalculation(${ WrappedComponent.displayName || WrappedComponent.name})`;
  return Container;
};
```

<img width="1102" alt="screen shot 2017-12-22 at 5 50 52 am" src="https://user-images.githubusercontent.com/5876481/34300275-2086b01a-e6dc-11e7-94dc-7e75e7daf5ac.png">

:tada: :confetti_ball: :balloon: Now I get `WithPizzaCalculation(PizzaCalculator`)I know exactly what I compose. :tada: :confetti_ball: :balloon: My code works with out this, but i care about my co-workers. The most important co-worker i worried about is the future me. It is not going to be easy debugging a large application and you see `unknown`. 

#### choice 2: on the instances of the class

`updateNumberOfPeople`, `updateSlicesPerPerson` ... are methods on the instances of the class of each individual component i create.  

```javascript
static displayName = `WithPizzaCalculation(${ WrappedComponent.displayName || WrappedComponent.name})`;
```

That should give me the same effect. It is a nice short hand. Makes it very clear. 

```diff
import React, { Component } from 'react';

import calculatePizzasNeeded from './lib/calculate-pizzas-needed';

const initialState = {
  numberOfPeople: 10,
  slicesPerPerson: 2,
};

const WithPizzaCalculation = WrappedComponent =>  {
-  const Container = class extends Component {
+  return class extends Component {  
+    static displayName = `WithPizzaCalculation(${ WrappedComponent.displayName || WrappedComponent.name})`;

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
        <WrappedComponent
          numberOfPeople={numberOfPeople}
          slicesPerPerson={slicesPerPerson}
          numberOfPizzas={numberOfPizzas}
          updateNumberOfPeople={this.updateNumberOfPeople}
          updateSlicesPerPerson={this.updateSlicesPerPerson}
          reset={this.reset}
        />
      );
    }
  };
-  Container.displayName = `WithPizzaCalculation(${ WrappedComponent.displayName || WrappedComponent.name})`;
-    return Container;
};

export default WithPizzaCalculation;
```

<img width="1103" alt="screen shot 2017-12-22 at 6 06 17 am" src="https://user-images.githubusercontent.com/5876481/34300731-4441f9f4-e6de-11e7-9118-945dec04bfcc.png">

I think the main problem with the `container` pattern is that is kind of `black box`. It is called whatever container, you can dig into the code to see, but remeber `thinking in React` hey  `keep it explicit, makes it very clear. Even if it is tedious to write. 

We need to strike the balance, between composing different kinds of components with different state with out passing around states all the time BUT also being very explicit about where that state is comming from. 

This takes us to the [Render Properties](https://github.com/xgirma/AdvancedStateManagementInReactApplications/tree/master/chapters/ch.03/render.properties.pattern) pattern.
