import React from 'react'

export default class WithCount extends React.Component {
  state = { count : 10 };

  handleIncrement = () => {
    this.setState({
      count : this.state.count + 1
    })
  };

  handleDecrement = () => {
    this.setState({
      count : this.state.count - 1
    })
  };

  handleReset = () => {
    this.setState ({
      count : 0
    })
  };

  render() {
    return (
      <div className="WithCount">
        {
          this.props.render(
            this.state.count,
            this.handleIncrement,
            this.handleDecrement,
            this.handleReset
          )
        }
      </div>
    );
  }
}