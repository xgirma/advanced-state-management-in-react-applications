import React, { Component } from 'react';

import './Filter.css';

class Filter extends Component {
  handleChange = event => {
    const value = event.target.value;
    this.props.updateFilter(value);
  };

  render() {
    const { value } = this.props;
    return (
      <input
        className="Items-searchTerm"
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}

export default Filter;
