import React, { Component } from 'react';
import './App.css';

import MapContainer from './components/styled-components/MapContainer'
import Map from './containers/Map'

class App extends Component {
  render() {
    return (
        <MapContainer>
          <Map />
        </MapContainer>
    );
  }
}

export default App;
