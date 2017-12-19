# Part One: Understanding State

## Introductions

To build our understanding of how to manage state, we're going to take a whirlwind tour of a number of approaches. 

We will start basic React component that manages its own state, a `counter` right? everything is encapsulated in that one component there is no derived state or passing it to children. 

Then to the one that drives state from others, a `pizza calculator` app. Passing state to a child and grand child component. And events have to come back. 

Then thinking about `flux`, `redux` a flux implementation. Redux is not tide to Reacts, can be used by other libraries and frameworks. Finally, `React-redux` library.

Redux does not deal with `async`. `Redux thunk`, a thunk is a way to differ action.  `Redux sega`, complex. `Mobx` takes a traditional OOP approach.

This is not a solved problem. Libraries come and go. Patterns and approaches stick around. What is it mean to manage state?

What is a state?

### what is React

The main job of React is to `take your application state` and `turn it into DOM nodes`. It is just a `view` layer. 

     logic + a state = > React => view 
     
Which means it is very un-opinionated about how you manage your state. You are incharge of managing state there is no prescribed way to manage state by React. 

In the React documentation [`Thinking in React`](https://reactjs.org/docs/thinking-in-react.html) section  states the React philosophy. 

<img width="730" alt="screen shot 2017-12-18 at 11 55 43 pm" src="https://user-images.githubusercontent.com/5876481/34146473-09e460e4-e44f-11e7-8e9a-00990647c303.png">

        1. what thing do we need to manage by hand and

        2. what thing do we need to figure out or drive from the state we have

For example, for a `full name`, what you don't want to be incharge of everytime `first name` and `last name` changes you have into go manually and `set the state` of the the `full-name`. You have all the information you need to drive that information already. 

Think of the bare-minimum amount of state you need, and drive everything from that. 

### what is state

        1. Is it passed in from a parent via props? If so, it probably isn't state. 

        2. Does it remain unchanged over time? If so, it probably isn't state. 

        3. Can you compute it based on any other state or props in your component? If so, it isn't state. 


If it remains unchanged it is a `static markup`. **The best way to get good at state management is, to manage as little state as possible**. 


### one way data flow

<img width="741" alt="screen shot 2017-12-19 at 12 10 32 am" src="https://user-images.githubusercontent.com/5876481/34147013-160863a0-e451-11e7-8292-b237fb85f6fe.png">

One way data flow, and **the flow-down the component hierarchy**. In react there is one way flow, a lot of times from our `state` into our `view`. Where the `user` can do something, and these libraries trigger **ACTION** which will change a state, and state-change will re-render the view.


### props vs. state 

`props` are not state but they are somebody's state. They are the state of a prent component. Things that change based on a user input are the things that we need to worry about. 

> State is created in the component and stays in the component. It can be passed to a children as its props. 

```html
<div id="root"></div>
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
<script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>
<script crossorigin src="https://unpkg.com/prop-types@15.6.0/prop-types.js"></script>

<script type="text/babel">
  class Counter extends React.Component {
    state = { count: 10 };

    render() {
      const { count } = this.state;
      return(
        <div>
          <h2>This is my state: { count }</h2>
          <DoubleCount count={ count } />
        </div>
      )
    }
  }

  class DoubleCount extends React.Component {
    render() {
      const { count } = this.props;
      return (<p> This is my prop: { count * 2}</p>)
    }
  }

  ReactDOM.render(
    <Counter />,
    document.getElementById('root')
  )
</script>
```

<img width="773" alt="screen shot 2017-12-19 at 12 32 05 am" src="https://user-images.githubusercontent.com/5876481/34147886-1d52ef2e-e454-11e7-9607-de4b4de5ed0e.png">

We have `Counter` and `DoubleCount`. In this case `DoubleCount` is just a second counter. It is going to take on the `state` of its parent (`Counter`), it is a child. `count` is not a state of the `DoubleCount` but definitely somebody's state. 

### all state not created equal
State is abroad term. There are different interpretation of it. There are many kinds of state: 

#### 1. model data
The nouns in your application. 

#### 2. view/UI state
Are those nouns sorted in ascending or descending order? 

#### 3. session state
Is the user even logged in?

#### 4. communication
Are we in the process of fetching the nouns from the server?

#### 5. location
Where are we in the application? Which nouns are we looking at? 

Or it might make sence to think about state relative to time. 

#### 6. long-lasting state
This is likely the data in your application. Model state. e.g. in gmail the list of email tiy looking at. 

#### 7. ephemeral state
Stuff like the value of an input field that will be wiped away when you hit "enter". e.g. what you currently type in gmail input field for search, is a short lived state

## Ask yourself: 

Does a input field need the same kind of state management as your model data?

What about form validation? 

Does it make sense to store all of your data in one place or compartmentalize it? 

> Spoiler alert: There is no silver bullet. 



