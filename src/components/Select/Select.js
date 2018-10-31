import React, { Component } from 'react';
import {SelectInput} from '../styled-components/SelectWrappers';

class Select extends Component {

  _renderOptions = (array, selected) => {
    var selectOptions = array.map(function(value, i) {
      return (
        <option key={i} value={value}>{value}</option>
      )
    })
    return selectOptions
  }

  render() {
    return (
      <SelectInput name={this.props.name} value={this.props.countryValueFromState} onChange={this.props.changeCountry}>
        {this._renderOptions(this.props.options)}
      </SelectInput>
    )
  }
}
export default Select;
