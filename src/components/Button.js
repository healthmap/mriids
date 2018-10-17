import React, { Component } from 'react';

class Button extends Component {
  handleClick = () => {
    // click function
  }

  render() {
    return (
      <button onClick={this.handleClick} className={`button button--${this.props.type} is-${this.props.status}`}>
        {this.props.label}
      </button>
    )
  }
}

export default Button;
