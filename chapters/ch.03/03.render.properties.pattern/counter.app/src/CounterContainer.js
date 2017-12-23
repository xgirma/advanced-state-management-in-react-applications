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