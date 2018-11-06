import React, { Component } from 'react';
import Button from '../../components/Button/Button';
import MapToggleWrapper from '../../components/styled-components/MapToggleWrapper';

class MapToggle extends Component {
   render() {
    //  console.log(this.props.active)
      return (
        <MapToggleWrapper>
          <Button changeMapView={this.props.changeMapView} value='snapshot' label="Snapshot" type="toggle" status={this.props.active === 'snapshot' ? 'active' : '' } />
          <Button changeMapView={this.props.changeMapView} value='risk' label="Risk" type="toggle" status={(this.props.active === 'risk') ? 'active' : '' } />
        </MapToggleWrapper>
      );
   }
}

export default MapToggle;
