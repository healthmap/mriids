import React, { Component } from 'react';

class HeaderNav extends Component {
   render() {
      return (
        <ul className="nav nav--main nav--inline">
          <li className="is-active"><a href="">Outbreak</a></li>
          <li><a href="">Historic</a></li>
          <li><a href="">About</a></li>
        </ul>
      );
   }
}

export default HeaderNav;
