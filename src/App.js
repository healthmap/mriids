import React, { Component } from 'react';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import Header from './components/Layout/Header/Header';
import MapParent from './containers/MapParent'
import Risk from './components/Layout/Risk/Risk';
import './App.scss';


class App extends Component {
  render() {
    return (
      <div className="app">
        <Sidebar />
        <Header />
        <MapParent />
        <Risk />
      </div>
    );
  }
}

export default App;
