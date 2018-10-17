import React, { Component } from 'react';
import SidebarToggle from './SidebarToggle/SidebarToggle';
import ReportedCases from './ReportedCases/ReportedCases';

class Sidebar extends Component {
   render() {
      return (
        <div className="sidebar">
          <SidebarToggle />
          <div className="block search">Search</div>
          <div className="block outbreak">Outbreak</div>
          <div className="block">
            <p>Reported cases from:<br />
            1 April 2014 to 31 March 2015</p>
            <h2>1,497</h2>
            <ReportedCases label="Confirmed" color="#4D73CE" value="589"/>
            <ReportedCases label="Probable" color="#7BBAFC" value="287"/>
            <ReportedCases label="Suspected" color="#B7E3FE" value="621"/>
          </div>
        </div>
      );
   }
}

export default Sidebar;
