# Part Three: State Architecture Patterns

In part two, we feel some of the complexities of passing state down and user action down. 

> React `state` is stored in a component and passed down as `props` to its children.

Always thing about the actual `state` as private. We can show `state` to others but if we need to change it, everything needs to go back to what state came from.

> Data down. Events up.

**[Thinking in React](https://reactjs.org/docs/thinking-in-react.html)** Where is the best place to store state? In most cases it was in the `Application`, in some cases we get away with the `items` list. We found that when we are working on it. What is the guiding principle that led us to that decision? 

<img width="754" alt="screen shot 2017-12-21 at 5 01 44 am" src="https://user-images.githubusercontent.com/5876481/34256859-2b7996c0-e60c-11e7-9d2a-ae5580f81bcc.png">

> Though this sounds complex, it's really just a few lines of code. And it's really explicit how your data is flowing throughout the app.

While it may a little more typing than you're used to remember that code is read far more than it's written, and it's extremely easy to read modular, explicit code. 

As you start to build large libraries of components, you'll appreciate this explicitness and modularity, and with code reuse, your lines of code will start to shrink. 

May be. (Easier said than done.)

> This effectively means that all state needs to live in the topmost **common component** that needs access. 

## The Lowest Common Ancestor
Article by Sam [source](http://www.samselikoff.com/blog/lowest-common-ancestor/)

<img width="683" alt="1" src="https://user-images.githubusercontent.com/5876481/34257312-3f5892e8-e60e-11e7-888c-38c2e460b66e.png">

`isOpen` is the only piece of state in our application that changes.

<img width="705" alt="2" src="https://user-images.githubusercontent.com/5876481/34257313-3f6c5be8-e60e-11e7-9690-415afade91df.png">

We now have two elements in our application whose view depends on the same piece of state. What should we do?

One option is to add an `isOpen` property to our `<button>` component, and try to keep both properties in sync:

A better solution is to move the state up a level to `<app>`, and have `<app>` pass down `isOpen` to both `<collapsible-panel>` and `<button>`:

<img width="652" alt="3" src="https://user-images.githubusercontent.com/5876481/34257314-3f7fc016-e60e-11e7-8be7-11280ecce1a5.png">

Think of the `isOpen` properties on the two children as read-only pointers to the `isOpen` property on `<app>`. Now, both `<collapsible-panel>` and `<button>` are guaranteed to stay in sync, since they're rendered from the same state.

<img width="898" alt="4" src="https://user-images.githubusercontent.com/5876481/34257315-3f90b6f0-e60e-11e7-909a-fe369d3e9aa8.png">

In this case, it would be sufficient to move isOpen to `<main>` to ensure `isOpen` had **a single source of truth**.

Now, a definition. Given a set of components, the **Lowest Common Ancestor** of this set is the component that's deepest in the UI tree but still above each component in that set.

This definition along with the discussion above leads us to the following general principle:

> When dealing with changing application state that lives in your UI hierarchy, store that state in the **Lowest Common Ancestor** of all components that need it.

**Conclusion**

So, when should application state exist in the UI hierarchy, and when should it be pulled out? As in most areas of software design, there is no black and white answer. Instead, we must understand the tradeoffs involved, and make decisions on a case-by-case basis.

State that's stored directly in the UI hierarchy is often easier to understand and requires less boilerplate; but, the more components that need a particular piece of state, the more brittle your UI hierarchy becomes. Eventually, it makes sense to move "popular state" into a UI-independent data container, an identity map which other components can read from.

The key insight is that all changing application state should have a single owner, and thus a single source of truth. Further, only the owner should be allowed to mutate that state. If the state lives in the UI hierarchy, the single owner should be the **Lowest Common Ancestor** of all components that need that state.

To summarize,

>Start by storing state on local component instances

> Once a piece of application state is needed by more than one component, move that state up to the LCA

> Once there are many components acting as middlemen, or it feels wrong for any particular component to own some state, pull that state out of the UI hierarchy and into a data container (an Ember Service, a Flux store, etc.) 

Deep component trees.
 
<img width="689" alt="screen shot 2017-12-21 at 5 28 56 am" src="https://user-images.githubusercontent.com/5876481/34257733-ea40a938-e60f-11e7-898c-5ccf2b676e19.png">

This is a small application, what will happen if this tree grows to a big app?

# Patterns
These patterns are agnostics to Flux, Reudx, or MobiX ...

[01. container pattern](https://github.com/xgirma/advanced-state-management-in-react-applications/tree/master/chapters/ch.03/01.container.pattern)

[02. higer order components](https://github.com/xgirma/advanced-state-management-in-react-applications/tree/master/chapters/ch.03/02.higher.order.components.pattern)

[03. render properties](https://github.com/xgirma/advanced-state-management-in-react-applications/tree/master/chapters/ch.03/03.render.properties.pattern)
