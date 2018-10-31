import React, { Component } from 'react';
import Moment from 'moment'
import { extendMoment } from 'moment-range'

import SidebarWrapper from '../../styled-components/SidebarWrapper';
import {BlockPadded} from '../../styled-components/Block';
import {SelectSearchWrapper, SelectOutbreakWrapper} from '../../styled-components/SelectWrappers';

import SidebarToggle from './SidebarToggle/SidebarToggle';
import Select from '../../Select/Select';
import ReportedCases from './ReportedCases/ReportedCases';

const moment = extendMoment(Moment)
const COUNTRIES = ['Guinea', 'Liberia', 'Sierra Leone']

class Sidebar extends Component {

  _prepareCountryEbolaData = () => {
    // console.log('[MapParent.js][_prepareDataForMap] The data coming from App.js is: ', this.props.stateDataFromApp)
    const {ebolaData, filters: {dateRange, projection}} = this.props.stateDataFromApp
    const momentDateRange = moment().range(dateRange.from, dateRange.to)
    let countryEbolaData = {}
    COUNTRIES.map((country) => {
      countryEbolaData[country] = 0
      let filteredData = ebolaData[country]
      Object.keys(filteredData).forEach(function (key) {
        let ebolaDailyData = filteredData[key]
        if (!projection) {
          if (momentDateRange.contains(moment(key))) {
            countryEbolaData[country] += parseInt(ebolaDailyData.value)
          }
        } else if (projection) {
          if (momentDateRange.contains(moment(key))) {
            countryEbolaData[country] += parseInt(ebolaDailyData.projections.month.y)
          }
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
          <SelectSearchWrapper>
            <Select
            changeCountry={this.props.changeCountry}
            name='location'
            type="location"
            options={['All','Guinea','Liberia','Sierra Leone']}
            countryValueFromState={this.props.stateDataFromApp.filters.country}
            />
          </SelectSearchWrapper>
          <SelectOutbreakWrapper>
            <Select name='outbreak' type="outbreak" options={['Ebola Outbreak']} />
          </SelectOutbreakWrapper>
          <BlockPadded>
            <p>{filters.projection ? "Projection" : "Reported Cases"} from:<br />
            {moment(this.props.stateDataFromApp.filters.dateRange.from).format('DD MMM YYYY')} to {moment(this.props.stateDataFromApp.filters.dateRange.to).format('DD MMM YYYY')}</p>
            {/* <h2>{ebolaData}</h2> */}
            <ReportedCases label={filters.projection ? "Projected cases" : "Suspected and confirmed"} color={filters.projection ? "#CB4627" : "#4D73CE"} value={ebolaData}/>
            {/* <ReportedCases label="Probable" color="#7BBAFC" value="287"/>
            <ReportedCases label="Suspected" color="#B7E3FE" value="621"/> */}
          </BlockPadded>
          <BlockPadded>
            Summary
            <p>From {moment(this.props.stateDataFromApp.filters.dateRange.from).format('DD MMM YYYY')} to {moment(this.props.stateDataFromApp.filters.dateRange.to).format('DD MMM YYYY')}, the Ebola outbreak in {country} {filters.projection ? "is projected to affect" : "has affected"} {ebolaData} people
{!filters.projection ? " (suspected and confirmed cases)" : null}.</p>
          </BlockPadded>
        </SidebarWrapper>
      );
   }
}

export default Sidebar;
