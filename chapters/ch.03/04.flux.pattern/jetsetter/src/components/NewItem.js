import React, { Component } from 'react';

import './NewItem.css';

import { addItem } from '../actions';

class NewItem extends Component {
  state = { value: '' };

  handleChange = event => {
    // Do something when the state of this input changes.
    const value = event.target.value;
    this.setState({ value });
  };

  handleSubmit = event => {
    const { value } = this.state;

    event.preventDefault();

    // Do something when a new value is submitted.
    addItem(value);

    // Reset the state of the component.
    this.setState({ value: ''});
  };

  render() {
    const { value } = this.state;

    return (
      <form className="NewItem" onSubmit={this.handleSubmit}>
        <input
          className="NewItem-input"
          type="text"
          value={value}
          onChange={this.handleChange}
        />
        <input className="NewItem-submit button" type="submit" />
      </form>
    );
  }
}

export default NewItem;
