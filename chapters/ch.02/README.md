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

### 2. what gets rendered
What gets rendered after we increment three times? 

<img width="769" alt="screen shot 2017-12-19 at 2 23 51 am" src="https://user-images.githubusercontent.com/5876481/34152509-b4762e20-e463-11e7-982e-b6f54a6175c3.png">

:open_mouth: Renders  Count: 1 :open_mouth:

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
