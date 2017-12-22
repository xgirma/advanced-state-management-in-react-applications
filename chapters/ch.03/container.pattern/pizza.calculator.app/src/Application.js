import React, { Component } from 'react';

import Title from './Title';
import Input from './Input';
import Result from './Result';

export default class Application extends Component {
  render() {
    const { numberOfPeople, slicesPerPerson, onUpdateNumberOfPeople, onUpdateSlicesPerPerson, numberOfPizzas, onReset } = this.props;

    return (
      <div className="Application">
        <Title />
        <Input
          label="Number of Guests"
          type="number"
          min={0}
          value={numberOfPeople}
          onChange={onUpdateNumberOfPeople}
        />
        <Input
          label="Slices Per Person"
          type="number"
          min={0}
          value={slicesPerPerson}
          onChange={onUpdateSlicesPerPerson}
        />
        <Result amount={numberOfPizzas} />
        <button className="full-width" onClick={onReset}>
          Reset
        </button>
      </div>
    );
  }
}
