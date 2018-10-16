import React, { Component } from 'react';
import './App.css';

import MapParent from './containers/MapParent'
import Root from './components/styled-components/Root'
import RightColumn from  './components/styled-components/RightColumn'
import Header from './components/styled-components/Header'

class App extends Component {
  render() {
    return (
      <Root>
        <RightColumn>
          <MapParent />
        </RightColumn>
      </Root>
    );
  }
}

export default App;
