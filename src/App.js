import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-toggle">&laquo;</div>
          <div className="block search">Search</div>
          <div className="block outbreak">Outbreak</div>
          <div className="block reported-cases">Reported Cases</div>
        </div>
        <header className="header">
          <div className="logo">
            <img src="/mriids.svg" alt="mriids" />
          </div>
          <ul className="nav nav--main nav--inline">
            <li className="is-active"><a href="">Outbreak</a></li>
            <li><a href="">Historic</a></li>
            <li><a href="">About</a></li>
          </ul>
          <div className="nav nav--inline">icon nav</div>
          <div className="nav nav--inline">icon nav</div>
        </header>
        <div className="map">
          <ul class="nav nav--toggle">
            <li class="is-active"><a href="">Snapshot</a></li>
            <li><a href="">Risk</a></li>
          </ul>
          map here
          <div class="block block--floating">legend here</div>
          <div class="block block--floating">filters here</div>
        </div>
        <div className="risk">
          epicurve/risk here
        </div>
      </div>
    );
  }
}

export default App;
