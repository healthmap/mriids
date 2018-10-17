import React, { Component } from 'react';
import SidebarToggle from './SidebarToggle/SidebarToggle';

class Sidebar extends Component {
   render() {
      return (
        <div className="sidebar">
          <SidebarToggle />
          <div className="block search">Search</div>
          <div className="block outbreak">Outbreak</div>
          <div className="block reported-cases">Reported Cases</div>
        </div>
      );
   }
}

export default Sidebar;
