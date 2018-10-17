import React, { Component } from 'react';
import MapToggle from './MapToggle/MapToggle';

class Map extends Component {
   render() {
      return (
        <div className="map">
          <MapToggle />
          map here
          <div className="block block--floating">legend here</div>
          <div className="block block--floating">filters here</div>
        </div>
      );
   }
}

export default Map;
