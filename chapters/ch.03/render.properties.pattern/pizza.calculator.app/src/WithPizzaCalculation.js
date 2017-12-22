import React, {Component} from 'react';

const initialState = {
  numberOfPeople: 10,
  slicesPerPerson: 2,
};

export default class WithPizzaCalculation extends Component {
  state = {...initialState};

  updateNumberOfPeople = event => {
    const numberOfPeople = parseInt(event.target.value, 10);
    this.setState({numberOfPeople});
  };

  updateSlicesPerPerson = event => {
    const slicesPerPerson = parseInt(event.target.value, 10);
    this.setState({slicesPerPerson});
  };

  reset = event => {
    this.setState({...initialState});
  };

  render() {
    return (
      <div className="WithPizzaCalculation">
        {
          this.props.render(
            this.state.numberOfPeople,
            this.state.slicesPerPerson,
            this.updateNumberOfPeople,
            this.updateSlicesPerPerson,
            this.reset
          )
        }
      </div>
    );
  }
};
