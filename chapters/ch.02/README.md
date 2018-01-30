# Part Two: An Uncomfortably Close Look at React Component State

We start at React component state. A lot of the patern we use in React-Redux or other libraries you can implement using regular React. May be sometimes you should.

Let us start with the world's simplest React component.  

Exercise: 

[basic-counter](https://github.com/stevekinney/basic-counter)

It will have three buttons: increment, decrement and reset. 

before 

```html
<div id="root"></div>
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
<script crossorigin src="https://unpkg.com/prop-types@15.6.0/prop-types.js"></script>
<link rel="stylesheet" href="style.css">

<script type="text/babel">
  class Counter extends React.Component {
    render() {
      return (
        <section className="Counter">
          <h1>Count: {0}</h1>
          <button onClick={() => {}} className="full-width">Increment</button>
          <button onClick={() => {}} className="full-width">Decrement</button>
          <button onClick={() => {}} className="full-width">Reset</button>
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

after

If it dosen't change it should probably not a state. 

```html
<div id="root"></div>
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
<script crossorigin src="https://unpkg.com/prop-types@15.6.0/prop-types.js"></script>
<link rel="stylesheet" href="style.css">

<script type="text/babel">
  class Counter extends React.Component {
    constructor() {
      super();
      this.state = {
        count : 10
      }
    }

    render() {
      const { count } = this.state;
      return (
        <section className="Counter">
          <h1>Count: {count}</h1>
          <button onClick={() => {}} className="full-width">Increment</button>
          <button onClick={() => {}} className="full-width">Decrement</button>
          <button onClick={() => {}} className="full-width">Reset</button>
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
<img width="719" alt="screen shot 2017-12-19 at 1 40 53 am" src="https://user-images.githubusercontent.com/5876481/34150993-dc301390-e45e-11e7-89f5-03eedb2895fc.png">

But we likely aspire to change the `count`, right? Let us increment work first. We are using `setState` instead of modifying the actual state itself.

```html
<div id="root"></div>
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
<script crossorigin src="https://unpkg.com/prop-types@15.6.0/prop-types.js"></script>
<link rel="stylesheet" href="style.css">

<script type="text/babel">
  class Counter extends React.Component {
    constructor() {
      super();
      this.state = {
        count : 10
      }
    }

    handleIncrement(){
      this.setState({
        count: this.state.count + 1
      });
    }

    render() {
      const { count } = this.state;
      return (
        <section className="Counter">
          <h1>Count: {count}</h1>
          <button onClick={this.handleIncrement} className="full-width">Increment</button>
          <button onClick={() => {}} className="full-width">Decrement</button>
          <button onClick={() => {}} className="full-width">Reset</button>
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
<img width="916" alt="screen shot 2017-12-19 at 1 57 47 am" src="https://user-images.githubusercontent.com/5876481/34151447-142b2aae-e460-11e7-9fcf-efd141efd40b.png">

we need to `bind` it. Because `<button onClick={this.handleIncrement} className="full-width">Increment</button>` is going to the `event-loop` and we are going to loose track of `this`.

```html
<div id="root"></div>
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
<script crossorigin src="https://unpkg.com/prop-types@15.6.0/prop-types.js"></script>
<link rel="stylesheet" href="style.css">

<script type="text/babel">
  class Counter extends React.Component {
    constructor() {
      super();
      this.state = {
        count : 10
      }
      this.handleIncrement = this.handleIncrement.bind(this);
    }

    handleIncrement(){
      this.setState({
        count: this.state.count + 1
      });
    }

    render() {
      const { count } = this.state;
      return (
        <section className="Counter">
          <h1>Count: {count}</h1>
          <button onClick={this.handleIncrement} className="full-width">Increment</button>
          <button onClick={() => {}} className="full-width">Decrement</button>
          <button onClick={() => {}} className="full-width">Reset</button>
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

I type `this.handleIncrement = this.handleIncrement.bind(this);` too many times, and i don't like to type it anymore. **Babel** + **arrow function**. To rescue. 


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

## pop quiz game: what is the out put?

### 1. console.log 
What is the out put of `console.log` immediately after we increment three times? 

```html
<div id="root"></div>
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
<script crossorigin src="https://unpkg.com/prop-types@15.6.0/prop-types.js"></script>
<link rel="stylesheet" href="style.css">

<script type="text/babel">
  class Counter extends React.Component {
    state = { count : 0 };

    handleIncrement = () => {
      this.setState({count : this.state.count + 1});
      this.setState({count : this.state.count + 1});
      this.setState({count : this.state.count + 1});
      console.log('output: ', this.state.count)
    };


    render() {
      const { count } = this.state;
      return (
        <section className="Counter">
          <h1>Count: {`${count}`}</h1>
          <button onClick={this.handleIncrement} className="full-width">Increment</button>
          <button onClick={() => {}} className="full-width">Decrement</button>
          <button onClick={() => {}} className="full-width">Reset</button>
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

:open_mouth: Output = 0 :open_mouth: the reason for that is `this.setState() is asynchronious`. The reason is `React is trying to avoid un-necessary re-renders`. Oh, the state has changes, let me collect all these states, and i will diff virtual DOM and figure what I am suppose to do. 

<img width="998" alt="screen shot 2018-01-30 at 12 28 49 am" src="https://user-images.githubusercontent.com/5876481/35555772-1f7481f6-0555-11e8-8a7b-776e45db3de3.png">

<img width="997" alt="screen shot 2018-01-30 at 12 29 03 am" src="https://user-images.githubusercontent.com/5876481/35555773-1f8948de-0555-11e8-8f2e-31802e66e447.png">

<img width="998" alt="screen shot 2018-01-30 at 12 29 18 am" src="https://user-images.githubusercontent.com/5876481/35555775-1f9d0720-0555-11e8-94e5-e079588942c3.png">

<img width="1001" alt="screen shot 2018-01-30 at 12 29 34 am" src="https://user-images.githubusercontent.com/5876481/35555776-1fb0c418-0555-11e8-87cf-ef3e9fe94319.png">

<img width="944" alt="screen shot 2018-01-30 at 12 31 29 am" src="https://user-images.githubusercontent.com/5876481/35555777-1fc41edc-0555-11e8-854a-6c34e5068f97.png">

### 2. what gets rendered
What gets rendered after we increment three times? 

<img width="769" alt="screen shot 2017-12-19 at 2 23 51 am" src="https://user-images.githubusercontent.com/5876481/34152509-b4762e20-e463-11e7-982e-b6f54a6175c3.png">

:open_mouth: Renders  Count: 1 :open_mouth:

<img width="926" alt="screen shot 2018-01-30 at 12 31 39 am" src="https://user-images.githubusercontent.com/5876481/35555778-1fdb3c70-0555-11e8-9aed-337a54005102.png">

Effectively, you are queuing up state changes. React will batch them up, figure out the result and then efficiently make that change. it got the message `three` times. The new state of `count` is the `current count` plus `one`. And we tolled it again the `current count` plus `one`, we tolled it the third time `current count` plus `one`. Guess what `0 + 1 is` still `1`. Either we say it three times. So it quee them and try to figure out them together. 

```javascript
Object.assign(
  {},
  yourFirstcallToSetState,
  yourSecondCallToSetState, 
  yourThirdCallToSetState,
);
```

Object.assign it grabs all of those objects, merge them together, at this point it gets the same message three times, the last one won. That is why we end up with just 1. 

> The `Object.assign()` method is used to copy the values of all enumerable own properties from one or more source objects to a target object. It will return the target object. Syntax `Object.assign(target, ...sources)` Properties in the target object will be overwritten by properties in the sources if they have the same key.

For most part I pass object to this.setState(). There are other interfaces, you can use.  **Fun fact:** Do you know you can also pass a function in as an argument? Yes. That behave a little bit differently. 

### 3. pass function
```html
<div id="root"></div>
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
<script crossorigin src="https://unpkg.com/prop-types@15.6.0/prop-types.js"></script>
<link rel="stylesheet" href="style.css">

<script type="text/babel">
  class Counter extends React.Component {
    state = { count : 0 };

    handleIncrement = () => {
      this.setState((state) => { return {count : state.count + 1}});
      this.setState((state) => { return {count : state.count + 1}});
      this.setState((state) => { return {count : state.count + 1}});
    };


    render() {
      const { count } = this.state;
      return (
        <section className="Counter">
          <h1>Count: {`${count}`}</h1>
          <button onClick={this.handleIncrement} className="full-width">Increment</button>
          <button onClick={() => {}} className="full-width">Decrement</button>
          <button onClick={() => {}} className="full-width">Reset</button>
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

<img width="770" alt="screen shot 2017-12-19 at 2 42 05 am" src="https://user-images.githubusercontent.com/5876481/34153245-3ec752f0-e466-11e7-9df6-0f040bc22f58.png">

<img width="1000" alt="screen shot 2018-01-30 at 12 40 27 am" src="https://user-images.githubusercontent.com/5876481/35556350-d800c42c-0556-11e8-8ad3-5f89c6053c99.png">

<img width="995" alt="screen shot 2018-01-30 at 12 40 46 am" src="https://user-images.githubusercontent.com/5876481/35556351-d826a8ea-0556-11e8-9403-0fcfa186c250.png">

<img width="918" alt="screen shot 2018-01-30 at 12 43 16 am" src="https://user-images.githubusercontent.com/5876481/35556353-d8391c82-0556-11e8-9055-6a4cb67f102c.png">

<img width="997" alt="screen shot 2018-01-30 at 12 43 32 am" src="https://user-images.githubusercontent.com/5876481/35556354-d84c7854-0556-11e8-9b44-6cfa93a745cf.png">

Function gives us programatic control over the state. 
<img width="998" alt="screen shot 2018-01-30 at 12 47 54 am" src="https://user-images.githubusercontent.com/5876481/35556511-4318fad6-0557-11e8-877f-ee096f264bed.png">

:open_mouth: Renders  Count: 3 :open_mouth:

When we use a function, instead of merging a bunch of object, it grabs each function and plays through them. It behaves more as we expect it. 

> When you pass functions to this.setState(), it plays through each of them. 

By, the more useful feature is that it gives you some programatic control. 

<img width="590" alt="screen shot 2017-12-19 at 2 47 48 am" src="https://user-images.githubusercontent.com/5876481/34153480-11376176-e467-11e7-8e73-d11c0defedfa.png"> 

[source](https://twitter.com/dan_abramov/status/824308413559668744?lang=en)

Best kept React secret: you can declare state changes separately from the component classes. Notice how we’re passing a function to setState. React will call that function with state and props, and use the result for next state. It is safe to call setState with a function multiple times. `Updates will be queued and later executed in the order they were called`.

`Declaring state updates as pure functions makes it a breeze to test complex state transitions`. Even no need for shallow rendering!

<img width="602" alt="screen shot 2017-12-19 at 3 10 53 am" src="https://user-images.githubusercontent.com/5876481/34154412-4819de64-e46a-11e7-93b1-7489b038d322.png">

```html
<div id="root"></div>
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
<script crossorigin src="https://unpkg.com/prop-types@15.6.0/prop-types.js"></script>
<link rel="stylesheet" href="style.css">

<script type="text/babel">
  function decrement(state){
    if(state.count === 0) return // wow: now i can have programmatic logic
    return {count : state.count - 1}
  }

  class Counter extends React.Component {
    state = { count : 10 };

    handleDecrement = () => {
      this.setState(decrement);
      this.setState(decrement);
      this.setState(decrement);
    };


    render() {
      const { count } = this.state;
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

  ReactDOM.render(
    <Counter />,
    document.getElementById('root')
  )
</script>
```

e.g. this make sure decrement below `0` is not allowed. 

```javascript
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
```

```javascript
import expect from 'expect'
import { decrement } from './08';

// Best kept React secret: you can declare state changes separately from the component classes
// Declaring state updates as pure functions makes it a breeze to test complex state transitions.
// Even no need for shallow rendering!

describe('decrement', () => {
  it('should decrement by one', () => {
    expect(decrement({count: 10})).toEqual({"count": 9});
  });

  it('should not decrease less than zero', () => {
    expect(decrement({count: 0})).toEqual(undefined);
  });
});
```

### 4. callback function
`this.setState` also takes a `callback`. We can pass either `object` or `function` that will mutate a state, and then we can pass second argument that will get called once it has done state changeed. 

```html
<div id="root"></div>
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
<script crossorigin src="https://unpkg.com/prop-types@15.6.0/prop-types.js"></script>
<link rel="stylesheet" href="style.css">

<script type="text/babel">
  function decrement(state){
    if(state.count === 0) return; // wow: now i can have programmatic logic
    return {count : state.count - 1};
  }

  class Counter extends React.Component {
    state = { count : 100 };

    handleDecrement = () => {
      this.setState(decrement, () => {console.log(this.state)});
    };


    render() {
      const { count } = this.state;
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

  ReactDOM.render(
    <Counter />,
    document.getElementById('root')
  )
</script>
```
After clicking `decrement` button.

<img width="773" alt="screen shot 2017-12-19 at 3 47 30 am" src="https://user-images.githubusercontent.com/5876481/34155754-7104db30-e46f-11e7-9647-4f72f449798d.png">

Why would we use this `callback` for? e.g. we save the most recent color hahah and save it to local storage.

## Patterns and anti-patterns
Thinking in React: :closed_lock_with_key: `State should be considered private data` :closed_lock_with_key:. It can be passed down to children, but it is unique to this component. Generally speaking we don't want to modify it outside of the component. 

:skull: Dangers to work with `state` than `props`: :skull: When we're working with `props`, we have `PropTypes`. That is not the case with `state`. One solution: what is we had our state effectively passed in as props? we will see some patterns for that, e.g. the `container pattern`. 

 <img width="601" alt="screen shot 2017-12-19 at 4 08 57 am" src="https://user-images.githubusercontent.com/5876481/34156502-62299f08-e472-11e7-9927-00be6f4116d0.png">
 
 > 1. Don't use this.state for derivations of props. 
 
```javascript
class User extends Component {
  constructor(props){
    super(props);
    this.state = {
      fullName: props.firstName + ' ' + props.lastName
    }
  }
}
```
Don't so this. Instead, derive computed properties directly from the props themselves. We wont to drive it, either in the `render` method.

```javascript
class User extends Component {
  render() {
    const { firstname, lastName } = this.props;
    const fullName = firstName + ' ' + lastName;
    return <div>{fullName}</div>
  }
}
```

We have a friend, sometimes that friend is our self, 6 months later. that writes 7 ternary long, in that case you better pulling it out to a method. 

You :dart: You don't need to shove everything into your render method. :dart: You can break things out into helper methods. 

```javascript
class User extends Component {
  get fillName(){
    const { firstname, lastName } = this.props;
    return firstName + ' ' + lastName;
  }
  
  render() {
    
    return <div>{this.fullName}</div>
  }
}
```

this is just a method in the component class, it is not a state. That gives you `fullName`, based on the two part of the `state`.

Giant render method is bad, so break it down. 

before: complex render method
````javascript
class UserList extends Component {
  render() {
    const { users } = this.props;
    return (
      <section>
        <VeryImportantUserControld />
          { users.map(users => (
            <UserProfile
              key={{user.id}}
              photograph={user.mugshot}
              onLayoff={handlelayoff} 
            />
          ))}
        <SomeSpecialFooter />
      </section>
    );
  }
}
````
after: simple render method
````javascript
class UserList extends Component {
  renderUserProfile(user){
    return(
      <UserProfile
        key={{user.id}}
        photograph={user.mugshot}
        onLayoff={handlelayoff} 
      />
    )
  }
  render() {
    const { users } = this.props;
    return (
      <section>
        <VeryImportantUserControld />
          { users.map(users => (this.renderUserProfile))}
        <SomeSpecialFooter />
      </section>
    );
  }
}
````

You will be `reading` code more than you will be `writting` code. You should think about the most inportant developer in the world which is **FUTURE YOU**. Future you does not remember the code you write six month from now.

> 2. Don't use state for things you're not going to render. 

For instance,  a twitter live stream for some reason and it is using just basically an interval call the API we don't want to put that in the state we are not rendering that. We need to holdon to it so that i can get readof it when the component un-mount. Otherwise we have a memeory leak. 

before
```javascript
class TweetStream extends Component {
  constructor() {
    super();
    this.state = {
      tweets: [],
      tweetChecker: setInterval(() => {
        Api.getAll('/api/tweets').then(newTweets => {
          const { tweets } = this.state;
          this.setState({ tweets: [ ... tweets, newTweets]});
        });
      }, 10000)
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.state.tweetChecker);
  }
  
  render() { // Do stuff with tweet}
}
```
It shouldn't be in the state. You can store it in the actual class itself.

after
````javascript
class TweetStream extends Component {
  constructor() {
    super();
    this.state = {
      tweets: [],
    }
  }
  
  tweetChecker() {
    // ...
  }
  
  componentWillMount() {
    this.tweetChecker = setInterval(...);
  }
  
  componentWillUnmount() {
    clearInterval(this.tweetChecker);
  }
  
  render() { // Do stuff with tweet}
}
````

> 3. Use sensible defaults

When possible use sensible defaults. Right? If you expect to get an array from an API, you should have a default be an `array`.

````javascript
class Items extends Component {
  constructor() {
    super();
    this.state = {
      items: []
    }
  }
  
  componentDidMount() {
    Api.getAll('/api/items').then(items => {
      this.setState({ items });
    });
  }
  
  rendr () { // Do stuff with items }
}
````

## Example Application: jet setter
In a large application you have to go down a few more ancestors. Note: `chapters/ch.02/jetsetter/srcBefore/` contains the original code before modification. The same code can be found [here](https://github.com/stevekinney/jetsetter/blob/master/README.md) under the `basic-state` branch. 

It is a small app, but we have the problems we find in large applications. We have gone to pass-down stuff from parent, to children, and grand children ...  in a large app you may need to go down a few more ancestors, but the process if effectively the same. This helps to begin wrap our mind around it.
 
### 1. get the list of items on the page

```javascript
import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import CountDown from './CountDown';
import NewItem from './NewItem';
import Items from './Items';

import './Application.css';

const defaultState = [
  { value: 'Pants', id: uniqueId(), packed: false },
  { value: 'Jacket', id: uniqueId(), packed: false },
  { value: 'iPhone Charger', id: uniqueId(), packed: false },
  { value: 'MacBook', id: uniqueId(), packed: false },
  { value: 'Sleeping Pills', id: uniqueId(), packed: true },
  { value: 'Underwear', id: uniqueId(), packed: false },
  { value: 'Hat', id: uniqueId(), packed: false },
  { value: 'T-Shirts', id: uniqueId(), packed: false },
  { value: 'Belt', id: uniqueId(), packed: false },
  { value: 'Passport', id: uniqueId(), packed: true },
  { value: 'Sandwich', id: uniqueId(), packed: true },
];

class Application extends Component {
  state = {
    // Set the initial state,
  };

  // How are we going to manipualte the state?
  // Ideally, users are going to want to add, remove,
  // and check off items, right?

  render() {
    // Get the items from state

    return (
      <div className="Application">
        <NewItem />
        <CountDown />
        <Items title="Unpacked Items" items={[]} />
        <Items title="Packed Items" items={[]} />
        <button className="button full-width">Mark All As Unpacked</button>
      </div>
    );
  }
}

export default Application;
```
1. take array of default items to set the initial state

2. I need two kinds of array, packed and unpacked

3. get the entire items in the render function, by destructuring items from the initial state

4. cheat using the packed boolean, to get the packed and unpacked separately

:skull: This means I am going to filter in each of them for every render. I am ok with that for now. :skull:

5. Pass them to the component

```diff
import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import CountDown from './CountDown';
import NewItem from './NewItem';
import Items from './Items';

import './Application.css';

const defaultState = [
  { value: 'Pants', id: uniqueId(), packed: false },
  { value: 'Jacket', id: uniqueId(), packed: false },
  { value: 'iPhone Charger', id: uniqueId(), packed: false },
  { value: 'MacBook', id: uniqueId(), packed: false },
  { value: 'Sleeping Pills', id: uniqueId(), packed: true },
  { value: 'Underwear', id: uniqueId(), packed: false },
  { value: 'Hat', id: uniqueId(), packed: false },
  { value: 'T-Shirts', id: uniqueId(), packed: false },
  { value: 'Belt', id: uniqueId(), packed: false },
  { value: 'Passport', id: uniqueId(), packed: true },
  { value: 'Sandwich', id: uniqueId(), packed: true },
];

class Application extends Component {
  state = {
    // Set the initial state,
+    items: defaultState
  };

  // How are we going to manipualte the state?
  // Ideally, users are going to want to add, remove,
  // and check off items, right?

  render() {
    // Get the items from state
+    const { items } = this.state;
+    const unpackedItems = items.filter(item => !item.packed);
+    const packedItems = items.filter(item => item.packed);

    return (
      <div className="Application">
        <NewItem />
        <CountDown />
-        <Items title="Unpacked Items" items={[]} />
-        <Items title="Packed Items" items={[]} />
+        <Items title="Unpacked Items" items={unpackedItems} />
+        <Items title="Packed Items" items={packedItems} />
        <button className="button full-width">Mark All As Unpacked</button>
      </div>
    );
  }
}

export default Application;
```

Now the list is rendering on the page. 

<img width="990" alt="screen shot 2017-12-20 at 4 32 19 am" src="https://user-images.githubusercontent.com/5876481/34207326-d744cb06-e53e-11e7-9f16-22b3a062b1f0.png">

### 2. add a new item
We got all on the page and the next step is to add a new item. The `items` are currently the `state` of the `application` component. Which means the only place I have access to them is inside the `application` component, if i passed them down as `props` they are `immutable` I can't give them to the `NewItem` component. That is not going to work. 

```html
import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';

import './NewItem.css';

class NewItem extends Component {
  state = { value: '' };

  handleChange = event => {
    // Do something when the state of this input changes.
  };

  handleSubmit = event => {
    const { onSubmit } = this.props;
    const { value } = this.state;

    event.preventDefault();

    // Do something when a new value is submitted.

    // Reset the state of the component.
  };

  render() {
    const { value } = this.state;

    return (
      <form className="NewItem" onSubmit={this.handleSubmit}>
        <input
          className="NewItem-input"
          type="text"
          value={value}
          onChange={this.handleChange}
        />
        <input className="NewItem-submit button" type="submit" />
      </form>
    );
  }
}

export default NewItem;
```

Instead, I can give the `NewItem` component a function that a NewItem can call and it can manipulate state on the `Application` component. It is ** data down, action is up**.  

1. we make a new function called `addItem`, can be done with push, spread-operator

2. make a new array with all the items that are currently on state `this.setState({ items: [...this.state.items] })`

3. give the new item at the beginning `this.setState({ items: [item, ...this.state.items] })`

4. give the `addItem` function to the `NewItem` component

```diff
import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import CountDown from './CountDown';
import NewItem from './NewItem';
import Items from './Items';

import './Application.css';

const defaultState = [
  { value: 'Pants', id: uniqueId(), packed: false },
  { value: 'Jacket', id: uniqueId(), packed: false },
  { value: 'iPhone Charger', id: uniqueId(), packed: false },
  { value: 'MacBook', id: uniqueId(), packed: false },
  { value: 'Sleeping Pills', id: uniqueId(), packed: true },
  { value: 'Underwear', id: uniqueId(), packed: false },
  { value: 'Hat', id: uniqueId(), packed: false },
  { value: 'T-Shirts', id: uniqueId(), packed: false },
  { value: 'Belt', id: uniqueId(), packed: false },
  { value: 'Passport', id: uniqueId(), packed: true },
  { value: 'Sandwich', id: uniqueId(), packed: true },
];

class Application extends Component {
  state = {
    // Set the initial state,
    items: defaultState
  };

  // How are we going to manipualte the state?
  // Ideally, users are going to want to add, remove,
  // and check off items, right?

+  addItem = item => {
+    this.setState({
+      items: [item, ...this.state.items]
+    });
+  };

  render() {
    // Get the items from state
    const { items } = this.state;
    const unpackedItems = items.filter(item => !item.packed);
    const packedItems = items.filter(item => item.packed);

    return (
      <div className="Application">
-        <NewItem />
+        <NewItem onSubmit={this.addItem}/>
        <CountDown />
        <Items title="Unpacked Items" items={unpackedItems} />
        <Items title="Packed Items" items={packedItems} />
        <button className="button full-width">Mark All As Unpacked</button>
      </div>
    );
  }
}

export default Application;
``` 
Now we are going to give the ability to add an item. 
Now this function (`addItem`) is created in the `Application` scope, so it has ** access to the state ** of the `Application` component. Give it away, we passing down,  to the `NewItem` component.

1. NewItem has `handleChange` it seems like a good place to call add item, the reason I have extra method here is because it is not going to be the item it is going to be the event when they hit Submit on the form. What i really need is the `name of that NewItem

2. We don't have a great-setup right now. We will have later with Redux, ... `onSubmit( {value, id: uniqueId, packed: false} );` because the 
the presentation layer should not handle normaising of my data. Right? :smirk: :smirk: :smirk:

3. NewItem has its own state, `value` we get the value whenever it changes and we set it the `value` state

4. when submit, pass the `value` to the `addItem` function of the `Application` component 

5. after submit, clear input


```diff
import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';

import './NewItem.css';

class NewItem extends Component {
  state = { value: '' };

  handleChange = event => {
    // Do something when the state of this input changes.
+    const value = event.target.value;
+    this.setState({ value });
  };

  handleSubmit = event => {
    const { onSubmit } = this.props;
    const { value } = this.state;

    event.preventDefault();

    // Do something when a new value is submitted.
+    onSubmit( {value, id: uniqueId(), packed: false} );
+    console.log(value);

    // Reset the state of the component.
+    this.setState({ value: ''});
  };

  render() {
    const { value } = this.state;

    return (
      <form className="NewItem" onSubmit={this.handleSubmit}>
        <input
          className="NewItem-input"
          type="text"
          value={value}
          onChange={this.handleChange}
        />
        <input className="NewItem-submit button" type="submit" />
      </form>
    );
  }
}

export default NewItem;
```
 
Array of items (`Application` component) to the items list (`Items` component), and the to the item (`item` component). This is where it gets FUN :disappointed_relieved: :weary: :pensive:

To be able to check the item or remove the item, where does list of items live? `Application`, what is in the middle `Items` lis, and then `Item`. 

This means in order to get `event` listener down to the individual item you have got to start going down from the `Application`, and to the `Items` list, and down to the `Item`. And that event will call all the way back to the `Application` component.

### 3. remove an item

1. create removeItem, spare items that have different id that the one that needs to be removed

2. Now it needs to go down, each step,

3. pass down to the `Items` list 

```diff
import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import CountDown from './CountDown';
import NewItem from './NewItem';
import Items from './Items';

import './Application.css';

const defaultState = [
  { value: 'Pants', id: uniqueId(), packed: false },
  { value: 'Jacket', id: uniqueId(), packed: false },
  { value: 'iPhone Charger', id: uniqueId(), packed: false },
  { value: 'MacBook', id: uniqueId(), packed: false },
  { value: 'Sleeping Pills', id: uniqueId(), packed: true },
  { value: 'Underwear', id: uniqueId(), packed: false },
  { value: 'Hat', id: uniqueId(), packed: false },
  { value: 'T-Shirts', id: uniqueId(), packed: false },
  { value: 'Belt', id: uniqueId(), packed: false },
  { value: 'Passport', id: uniqueId(), packed: true },
  { value: 'Sandwich', id: uniqueId(), packed: true },
];

class Application extends Component {
  state = {
    // Set the initial state,
    items: defaultState
  };

  // How are we going to manipualte the state?
  // Ideally, users are going to want to add, remove,
  // and check off items, right?

  addItem = item => {
    this.setState({
      items: [item, ...this.state.items]
    });
  };

+  removeItem = itemToRemove => {
+    this.setState({
+      items: this.state.items.filter( item => item.id !== itemToRemove.id)
+    });
+  };

  render() {
    // Get the items from state
    const { items } = this.state;
    const unpackedItems = items.filter(item => !item.packed);
    const packedItems = items.filter(item => item.packed);

    return (
      <div className="Application">
        <NewItem onSubmit={this.addItem}/>
        <CountDown />
-        <Items title="Unpacked Items" items={unpackedItems} onRemove={this.removeItem} />
-        <Items title="Packed Items" items={packedItems} onRemove={this.removeItem} />
+        <Items title="Unpacked Items" items={unpackedItems} onRemove={this.removeItem} />
+        <Items title="Packed Items" items={packedItems} onRemove={this.removeItem} />
        <button className="button full-width">Mark All As Unpacked</button>
      </div>
    );
  }
}

export default Application;
```

4. On the `Items` list, extract `onRemove` from the prop

5. `<item onRemove={() => onRemove(item.id)} />` so when Remove linkis clicked on the `Item` component, that is going to passed on to Items and then to Application.  Again, this is a small application, this dosen't get better as your application grows. 

```diff
import React, { Component } from 'react';
import Item from './Item';
import Filter from './Filter';

class Items extends Component {
  state = {
    // What state does this component have?
  };

  updateSearchTerm = searchTerm => {};

  render() {
-    const { title, items } = this.props;
+    const { title, items, onRemove } = this.props;
    return (
      <section className="Items">
        <h2>
          {title} ({items.length})
        </h2>
        <Filter searchTerm={''} onChange={this.updateSearchTerm} />
        {items
          .filter(item =>
            // Hmm… this needs some work.
            item.value.toLowerCase().includes(''.toLowerCase()),
          )
          .map(item => (
            <Item
              key={item.id}
              onCheckOff={() => {}}
-              onRemove={() => {}}
+              onRemove={() => onRemove(item)}
              item={item}
            />
          ))}
      </section>
    );
  }
}

export default Items;
```

6. on the `Item`, get the `onRemove` prop. `const { item, onRemove } = this.props;`

7. add it to the button, `<button className="Item-remove" onClick={() => onRemove(item)}>`

```diff
import React, { Component } from 'react';
import './Item.css';

class Item extends Component {
  render() {
-    const { item } = this.props;
+    const { item, onRemove } = this.props;
    return (
      <article className="Item">
        <label htmlFor={item.id}>
          <input
            type="checkbox"
            checked={item.packed}
            onChange={() => {}}
            id={item.id}
          />
          {item.value}
        </label>
-        <button className="Item-remove" onClick={() => {}}>
+        <button className="Item-remove" onClick={() => onRemove(item)}>
          Remove
        </button>
      </article>
    );
  }
}

export default Item;
```

### 4. add packed/unpacked checkbox functionality 
I will **pass the function all the way down**, that what we did in the remove case. You have to be consistant on that. 

What is the easiest way to change one in an array? map over it and filter and change, otherwise stay where you are. 

IF you feel this is a little bit TEDIOUS that is the point. This is manually manipulating state, you have to pass it down, and bring back up is part of the problem, we are trying to solve. 

6. create a `toogleItem`

7. pass it down to the `Items`

```diff
import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import CountDown from './CountDown';
import NewItem from './NewItem';
import Items from './Items';

import './Application.css';

const defaultState = [
  { value: 'Pants', id: uniqueId(), packed: false },
  { value: 'Jacket', id: uniqueId(), packed: false },
  { value: 'iPhone Charger', id: uniqueId(), packed: false },
  { value: 'MacBook', id: uniqueId(), packed: false },
  { value: 'Sleeping Pills', id: uniqueId(), packed: true },
  { value: 'Underwear', id: uniqueId(), packed: false },
  { value: 'Hat', id: uniqueId(), packed: false },
  { value: 'T-Shirts', id: uniqueId(), packed: false },
  { value: 'Belt', id: uniqueId(), packed: false },
  { value: 'Passport', id: uniqueId(), packed: true },
  { value: 'Sandwich', id: uniqueId(), packed: true },
];

class Application extends Component {
  state = {
    // Set the initial state,
    items: defaultState
  };

  // How are we going to manipualte the state?
  // Ideally, users are going to want to add, remove,
  // and check off items, right?

  addItem = item => {
    this.setState({
      items: [item, ...this.state.items]
    });
  };

  removeItem = itemToRemove => {
    this.setState({
      items: this.state.items.filter( item => item.id !== itemToRemove.id)
    });
  };

+  markAsPacked = item => {
+    const otherItems = this.state.items.filter(other => other.id !== item.id);
+    const updatedItem = { ...item, packed: !item.packed };
+    this.setState({ items: [updatedItem, ...otherItems] });
+  };

  render() {
    // Get the items from state
    const { items } = this.state;
    const unpackedItems = items.filter(item => !item.packed);
    const packedItems = items.filter(item => item.packed);

    return (
      <div className="Application">
        <NewItem onSubmit={this.addItem}/>
        <CountDown />
-        <Items title="Unpacked Items" items={unpackedItems} onRemove={this.removeItem} />
-        <Items title="Packed Items" items={packedItems} onRemove={this.removeItem} />
+        <Items title="Unpacked Items" items={unpackedItems} onRemove={this.removeItem} onToggle={this.markAsPacked}/>
+        <Items title="Packed Items" items={packedItems} onRemove={this.removeItem} onToggle={this.markAsPacked} />
        <button className="button full-width">Mark All As Unpacked</button>
      </div>
    );
  }
}

export default Application;
```

8, extract `onToggle` from props

9. Pass it down to `Item`

```diff
import React, { Component } from 'react';
import Item from './Item';
import Filter from './Filter';

class Items extends Component {
  state = {
    // What state does this component have?
  };

  updateSearchTerm = searchTerm => {};

  render() {
-    const { title, items, onRemove } = this.props;
+    const { title, items, onRemove, onToggle } = this.props;
    return (
      <section className="Items">
        <h2>
          {title} ({items.length})
        </h2>
        <Filter searchTerm={''} onChange={this.updateSearchTerm} />
        {items
          .filter(item =>
            // Hmm… this needs some work.
            item.value.toLowerCase().includes(''.toLowerCase()),
          )
          .map(item => (
            <Item
              key={item.id}
-              onToggle={() => {}}
+              onToggle={() => onToggle(item)}
              onRemove={() => onRemove(item)}
              item={item}
            />
          ))}
      </section>
    );
  }
}

export default Items;
```

11. extract `onToggle` from props

10. pass data back from `Item` to `Items` and then to `Application`.

```diff
import React, { Component } from 'react';
import './Item.css';

class Item extends Component {
  render() {
-    const { item, onRemove } = this.props;
+    const { item, onRemove, onToggle } = this.props;
    return (
      <article className="Item">
        <label htmlFor={item.id}>
          <input
            type="checkbox"
            checked={item.packed}
-            onChange={() => {}}
+            onChange={() => onToggle(item)}
            id={item.id}
          />
          {item.value}
        </label>
        <button className="Item-remove" onClick={() => onRemove(item)}>
          Remove
        </button>
      </article>
    );
  }
}

export default Item;
```

### 5. enable unpack all

```diff
import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import CountDown from './CountDown';
import NewItem from './NewItem';
import Items from './Items';

import './Application.css';

const defaultState = [
  { value: 'Pants', id: uniqueId(), packed: false },
  { value: 'Jacket', id: uniqueId(), packed: false },
  { value: 'iPhone Charger', id: uniqueId(), packed: false },
  { value: 'MacBook', id: uniqueId(), packed: false },
  { value: 'Sleeping Pills', id: uniqueId(), packed: true },
  { value: 'Underwear', id: uniqueId(), packed: false },
  { value: 'Hat', id: uniqueId(), packed: false },
  { value: 'T-Shirts', id: uniqueId(), packed: false },
  { value: 'Belt', id: uniqueId(), packed: false },
  { value: 'Passport', id: uniqueId(), packed: true },
  { value: 'Sandwich', id: uniqueId(), packed: true },
];

class Application extends Component {
  state = {
    // Set the initial state,
    items: defaultState
  };

  // How are we going to manipualte the state?
  // Ideally, users are going to want to add, remove,
  // and check off items, right?

  addItem = item => {
    this.setState({
      items: [item, ...this.state.items]
    });
  };

  removeItem = itemToRemove => {
    this.setState({
      items: this.state.items.filter( item => item.id !== itemToRemove.id)
    });
  };

  markAsPacked = item => {
    const otherItems = this.state.items.filter(other => other.id !== item.id);
    const updatedItem = { ...item, packed: !item.packed };
    this.setState({ items: [updatedItem, ...otherItems] });
  };

+  markAllAsUnpacked = () => {
+    const unpacked = this.state.items.map(item => {
+      return {...item, packed: false}
+    });
+    this.setState({ items: unpacked});
+  };

  render() {
    // Get the items from state
    const { items } = this.state;
    const unpackedItems = items.filter(item => !item.packed);
    const packedItems = items.filter(item => item.packed);

    return (
      <div className="Application">
        <NewItem onSubmit={this.addItem}/>
        <CountDown />
        <Items title="Unpacked Items" items={unpackedItems} onRemove={this.removeItem} onToggle={this.markAsPacked}/>
        <Items title="Packed Items" items={packedItems} onRemove={this.removeItem} onToggle={this.markAsPacked} />
-        <button className="button full-width" >Mark All As Unpacked</button>
+        <button className="button full-width" onClick={this.markAllAsUnpacked}>Mark All As Unpacked</button>
      </div>
    );
  }
}

export default Application;
```

### 6 enable filter
```diff
import React, { Component } from 'react';
import Item from './Item';
import Filter from './Filter';

class Items extends Component {
  state = {
    searchTerm: ''
  };

+  updateSearchTerm = searchTerm => {
+    this.setState({
+      searchTerm
+    })
+  };

  render() {
    const { title, items, onRemove, onToggle } = this.props;
    const { searchTerm } = this.state
    return (
      <section className="Items">
        <h2>
          {title} ({items.length})
        </h2>
-        <Filter searchTerm={''} onChange={this.updateSearchTerm} />
+        <Filter searchTerm={searchTerm} onChange={this.updateSearchTerm} />
        {items
          .filter(item =>
            // Hmm… this needs some work.
+            item.value.toLowerCase().includes(''.toLowerCase()),
+            item.value.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map(item => (
            <Item
              key={item.id}
              onToggle={() => onToggle(item)}
              onRemove={() => onRemove(item)}
              item={item}
            />
          ))}
      </section>
    );
  }
}

export default Items;
```