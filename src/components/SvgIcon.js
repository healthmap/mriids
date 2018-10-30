import React, { Component } from 'react';
import icons from '../assets/icons'

class SvgIcon extends Component {
   render() {
      return (
        <svg
          width={`${this.props.size}px`}
          height={`${this.props.size}px`}
          viewBox="0 0 100 100"
          role="img"
          alt={this.props.title}
          aria-hidden='true'
          style={{ width: this.props.size + 'px', height: this.props.size + 'px' }}
        >
          <g>
            <title>{this.props.title}</title>
            <path d={icons[this.props.icon]} fill='#000000' />
          </g>
        </svg>
      );
   }
}

export default SvgIcon;
