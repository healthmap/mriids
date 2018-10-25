import React, { Component } from 'react';
import Moment from 'moment'
import { extendMoment } from 'moment-range'

import SidebarWrapper from '../../styled-components/SidebarWrapper';

import SidebarToggle from './SidebarToggle/SidebarToggle';
import Select from '../../Select/Select';
import ReportedCases from './ReportedCases/ReportedCases';

const moment = extendMoment(Moment)
const COUNTRIES = ['Guinea', 'Liberia', 'Sierra Leone']

class Sidebar extends Component {

  _prepareCountryEbolaData = () => {
    // console.log('[MapParent.js][_prepareDataForMap] The data coming from App.js is: ', this.props.stateDataFromApp)
    const {ebolaData, filters: {dateRange}} = this.props.stateDataFromApp
    const momentDateRange = moment().range(dateRange.from, dateRange.to)
    let countryEbolaData = {}
    COUNTRIES.map((country) => {
      countryEbolaData[country] = 0
      let filteredData = ebolaData[country]
      Object.keys(filteredData).forEach(function (key) {
        let ebolaDailyData = filteredData[key]
        if (momentDateRange.contains(moment(key))) {
          countryEbolaData[country] += parseInt(ebolaDailyData.value)
        }
      })
    })

    // console.log("[Sidebar.js][_prepareCountryEbolaData] The countryEbolaData is: ", countryEbolaData)
    return countryEbolaData
  }

   render() {
      const {filters, dataLoading} = this.props.stateDataFromApp

      // This adds the aggregated case count data to the sidebar
      let ebolaData
      if (!dataLoading && filters.country === 'All') {
        let countryEbolaData = this._prepareCountryEbolaData()
        // console.log("The ebola data for all countries is: ", countryEbolaData)
        ebolaData = countryEbolaData['Guinea'] + countryEbolaData['Liberia'] + countryEbolaData['Sierra Leone']
        // console.log('The case counts for all countries is: ', ebolaData)
      } else if (!dataLoading && filters.country !== "All") {
        let countryEbolaData = this._prepareCountryEbolaData()
        ebolaData = countryEbolaData[filters.country]
      }

      // This adds the country name to the sidebar
      let country
      if (!dataLoading && filters.country === "All") {
        country = "West Africa"
      } else if (!dataLoading && filters.country !== "All") {
        country = filters.country
      }

      return (
        <SidebarWrapper>
          <SidebarToggle />
          <Select changeCountry={this.props.changeCountry} name='location' type="location" options={['All','Guinea','Liberia','Sierra Leone']} countryValueFromState={this.props.stateDataFromApp.filters.country} />
          {/* <select value={this.props.stateDataFromApp.filters.country} name='location' >
            <option value="All">All</option>
            <option value="Guinea">Guinea</option>
            <option value="Liberia">Liberia</option>
            <option value="Sierra Leone">Sierra Leone</option>
          </select> */}
          <Select name='outbreak' type="outbreak" options={['Ebola Outbreak']} />
          <div className="block">
            <p>Reported cases from:<br />
            6 October 2014 to 18 January 2016</p>
            <h2>{ebolaData}</h2>
            <ReportedCases label="Confirmed" color="#4D73CE" value="589"/>
            <ReportedCases label="Probable" color="#7BBAFC" value="287"/>
            <ReportedCases label="Suspected" color="#B7E3FE" value="621"/>
          </div>
          <div className="block">
            Summary
            <p>From 6 October 2014 to 18 January 2016, the Ebola outbreak in {country} has affected 207 people
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
        </SidebarWrapper>
      );
   }
}

export default Sidebar;
