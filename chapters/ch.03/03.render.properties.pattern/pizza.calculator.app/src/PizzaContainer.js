import React, {Component} from 'react'

import WithPizzaCalculation from './WithPizzaCalculation'
import PizzaCalculator from './PizzaCalculator'

export default class PizzaContainer extends Component {
  render() {
    return (
      <WithPizzaCalculation render={
        (numberOfPeople, slicesPerPerson, updateNumberOfPeople, updateSlicesPerPerson, reset) => (
          <PizzaCalculator
            numberOfPeople={numberOfPeople}
            slicesPerPerson={slicesPerPerson}
            updateNumberOfPeople={updateNumberOfPeople}
            updateSlicesPerPerson={updateSlicesPerPerson}
            reset={reset}
          />)
      }/>
    )
  }
}
