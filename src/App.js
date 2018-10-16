import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-toggle">&laquo;</div>
          <div className="search">Search</div>
          <div className="outbreak">Outbreak</div>
          <div className="reported-cases">Reported Cases</div>
        </div>
        <header className="header">
          <div className="logo">
            <img src="/mriids.svg" alt="mriids" />
          </div>
          <ul className="nav nav--inline">
            <li className="is-active"><a href="">Outbreak</a></li>
            <li><a href="">Historic</a></li>
            <li><a href="">About</a></li>
          </ul>
          <div className="nav nav--inline">icon nav</div>
          <div className="nav nav--inline">icon nav</div>
        </header>
        <div className="map">
          <ul class="nav nav--inline nav--toggle">
            <li><a href="">Snapshot</a></li>
            <li><a href="">Risk</a></li>
          </ul>
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
