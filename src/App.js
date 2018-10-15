import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="sidebar">
          sidebar here
        </div>
        <header className="header">
          header here
        </header>
        <div className="map">
          map here
        </div>
        <div className="epicurve">
          epicurve here
        </div>
      </div>
    );
  }
}

export default App;
