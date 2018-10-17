import React, { Component } from 'react';
import HeaderNav from './HeaderNav/HeaderNav';

class Header extends Component {
   render() {
      return (
        <header className="header">
          <div className="logo">
            <img src="/mriids.svg" alt="mriids" />
          </div>
          <HeaderNav />
          <div className="nav nav--inline">icon nav</div>
          <div className="nav nav--inline">icon nav</div>
        </header>
      );
   }
}

export default Header;
