import React, { Component } from 'react';
import './ReportedCases.scss';

class ReportedCases extends Component {
   render() {
      return (
        <div className="reported-cases">
          <div className="reported-cases-label">{this.props.label}</div>
          <div className="reported-cases-color" style={{backgroundColor: this.props.color}}></div>
          <div className="reported-cases-value">{this.props.value}</div>
        </div>
      );
   }
}

export default ReportedCases;
