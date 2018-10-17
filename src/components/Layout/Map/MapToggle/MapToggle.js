import React, { Component } from 'react';

class MapToggle extends Component {
   render() {
      return (
        <ul class="nav nav--toggle">
          <li class="is-active"><a href="">Snapshot</a></li>
          <li><a href="">Risk</a></li>
        </ul>
      );
   }
}

export default MapToggle;
