import React, { Component } from 'react';
import Button from '../../components/Button/Button';
import './MapToggle.scss';

class MapToggle extends Component {
   render() {
      return (
        <div className="nav nav--toggle map-toggle">
          <Button label="Snapshot" type="toggle" status="active"/>
          <Button label="Risk" type="toggle" />
        </div>
      );
   }
}

export default MapToggle;
