import React, { Component } from 'react';
import styled from 'styled-components';

import SvgIcon from './SvgIcon'

export const CountToggleWrapper = styled.div`
  position: absolute;
  bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1em;
  padding: 1em .5em 0 .5em;
  border-top: 1px solid #ccc;
  cursor: pointer;
  label {
    margin-left: .8em;
    line-height: 1.1;
    color: #666;
    cursor: pointer;
  }
`

class CountToggle extends Component {
  handleClick = () => {
    // click function
  }

  render() {
    const icon = (this.props.status) ? 'Hide' : 'Show';
    return (
      <CountToggleWrapper onClick={this.props.toggleMapCaseCounts}>
        <SvgIcon icon={icon} size="20" title={`${icon} Count`} />
        <label>{`${icon} Count`}</label>
      </CountToggleWrapper>
    )
  }
}

export default CountToggle;
