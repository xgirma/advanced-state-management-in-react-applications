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

You can create this HOC whenever you need that data you can simply take the `presentational` component and pass it into the `HOC`get back a wrapped `container` component with `presentation` component. 

    presentational component => HOC => container component ( => presentational component)
    
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

Practice: with pizz-counter app