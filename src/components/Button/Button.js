import React, { Component } from 'react';
import './Button.scss';

class Button extends Component {
  handleClick = () => {
    // click function
    // console.log('[Button.js] This is firing!')
  }

  render() {
    return (
      <button onClick={() => this.props.changeMapView(this.props.value)} className={`button button--${this.props.type} is-${this.props.status}`}>
        {this.props.label}
      </button>
    )
  }
}

export default Button;
