import React, { Component } from 'react';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import Header from './components/Layout/Header/Header';
import Map from './components/Layout/Map/Map';
import Risk from './components/Layout/Risk/Risk';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Sidebar />
        <Header />
        <Map />
        <Risk />
      </div>
    );
  }
}

export default App;
