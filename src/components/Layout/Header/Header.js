import React, { Component } from 'react';
import HeaderNav from './HeaderNav/HeaderNav';
import Logo from '../../Logo/Logo';
import './Header.scss';

class Header extends Component {
   render() {
      return (
        <header className="header">
          <Logo />
          <HeaderNav />
          <div className="nav nav--inline">icon nav</div>
          <div className="nav nav--inline">icon nav</div>
        </header>
      );
   }
}

export default Header;
