import React, { Component } from 'react';
//import HeaderNav from './HeaderNav/HeaderNav';
import Logo from '../components/Logo/Logo';

import HeaderWrapper from '../components/styled-components/HeaderWrapper';
import HeaderNavWrapper from '../components/styled-components/HeaderNavWrapper';

class Header extends Component {
   render() {
      return (
        <HeaderWrapper>
          <Logo />
          <HeaderNavWrapper>
            <li className="is-active"><a href="">Outbreak</a></li>
            <li><a href="">Historic</a></li>
            <li><a href="">About</a></li>
          </HeaderNavWrapper>
          <div className="nav nav--inline">icon nav</div>
          <div className="nav nav--inline">icon nav</div>
        </HeaderWrapper>
      );
   }
}

export default Header;
