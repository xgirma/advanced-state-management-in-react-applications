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
