import React, { Component } from 'react';
//import HeaderNav from './HeaderNav/HeaderNav';
import Logo from '../components/Logo/Logo';
import SvgIcon from '../components/SvgIcon';

import HeaderWrapper from '../components/styled-components/HeaderWrapper';
import HeaderNavWrapper from '../components/styled-components/HeaderNavWrapper';
import IconNavWrapper from '../components/styled-components/IconNavWrapper';

class Header extends Component {
   render() {
      return (
        <HeaderWrapper>
          <div>
            <Logo />
            <HeaderNavWrapper>
              <li className="is-active"><a href="">Outbreak</a></li>
              <li><a href="">Historic</a></li>
              <li><a href="">About</a></li>
            </HeaderNavWrapper>
          </div>
          <div>
            <IconNavWrapper>
              <li><SvgIcon icon='Report' size={15} title="Download PDF Report" /></li>
              <li><SvgIcon icon='Print' size={15} title="Print" /></li>
              <li><SvgIcon icon='Share' size={15} title="Share" /></li>
            </IconNavWrapper>
            <IconNavWrapper>
              <li><SvgIcon icon='Search' size={15} title="Search" /></li>
              <li><SvgIcon icon='Notifications' size={15} title="Notifications" /></li>
              <li><SvgIcon icon='Settings' size={15} title="Settings" /></li>
              <li><SvgIcon icon='Account' size={15} title="My Account" /></li>
            </IconNavWrapper>
          </div>
        </HeaderWrapper>
      );
   }
}

export default Header;
