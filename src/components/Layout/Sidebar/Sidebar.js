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
          <div className="block">
            Summary
            <p>From 1 March to 31 March 2015, the Ebola outbreak in Liberia has affected 207 people
(69 confirmed, 21 probable, 117 suspected cases).</p>
            <p>The regions affected by the Ebola outbreak in Liberia are:</p>
            <ol>
              <li>Bomi (45)</li>
              <li>Margibi (29)</li>
              <li>Gbarpolu (27)</li>
              <li>Nimba (26)</li>
              <li>Montserrado (19)</li>
              <li>Bong (14)</li>
            </ol>
          </div>
        </div>
      );
   }
}

export default Sidebar;
