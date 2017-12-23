import React, { Component } from 'react';

import PizzaCalculatorStore from './PizzaCalculatorStore'
import * as actions from './actions';
import PizzaCalculator from './PizzaCalculator';

import calculatePizzasNeeded from './lib/calculate-pizzas-needed';

export default class PizzaCalculatorContainer extends Component {
  state = PizzaCalculatorStore.getState();

  updateNumberOfPeople = event => {
    const numberOfPeople = parseInt(event.target.value, 10);
    actions.updateNumberOfPeople(numberOfPeople);
  };

  updateSlicesPerPerson = event => {
    const slicesPerPerson = parseInt(event.target.value, 10);
    actions.updateSlicesPerPerson(slicesPerPerson);
  };

  updateState = () => {
    this.setState(PizzaCalculatorStore.getState())
  };

  componentDidMount = () => {
    PizzaCalculatorStore.on('change', this.updateState);
  };

  componentWillUnmount = () => {
    PizzaCalculatorStore.off('change', this.updateState);
  };

  render() {
    const { numberOfPeople, slicesPerPerson } = this.state;
    const numberOfPizzas = calculatePizzasNeeded(
      numberOfPeople,
      slicesPerPerson,
    );

    return (
      <PizzaCalculator
        {...this.state}
        numberOfPizzas={numberOfPizzas}
        updateNumberOfPeople={this.updateNumberOfPeople}
        updateSlicesPerPerson={this.updateSlicesPerPerson}
        reset={actions.reset}
      />
    );
  }
}
