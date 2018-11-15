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
            countryEbolaData[country] += parseInt(ebolaDailyData.projections.fourWeeks.y)
          }
        }
      })
    })

    // console.log("[Sidebar.js][_prepareCountryEbolaData] The countryEbolaData is: ", countryEbolaData)
    return countryEbolaData
  }

  _renderFutureProjectedCases = () => {
    const {ebolaData, ebolaDataCombined, filters: {country, dateRange}} = this.props.stateDataFromApp
    let rows = []
    let nextProjections
    if (country === 'All') {
      ebolaDataCombined.forEach(function (row) {
        let projectionDate = new Date(row.projection_from)
          if (moment(projectionDate).isBetween(moment(dateRange.from), moment(dateRange.to))) {
            rows.push([projectionDate, parseFloat(row.aggregated)])
            rows[rows.length - 1].push(null)
            nextProjections = {
              oneWeek: {
                y: Number(row['y1.aggregated'])
              },
              twoWeeks: {
                y: Number(row['y2.aggregated'])
              },
              threeWeeks: {
                y: Number(row['y3.aggregated'])
              },
              fourWeeks: {
                y: Number(row['y4.aggregated'])
              }
            }
          }
      })
    }

    else {
      const filteredData = ebolaData[country]
      Object.keys(filteredData).forEach(function (key) {
        let ebolaDailyData = filteredData[key]
          if (moment(key).isBetween(moment(dateRange.from), moment(dateRange.to))) {
            rows.push([new Date(key), parseFloat(ebolaDailyData.value)])
            rows[rows.length - 1].push(null)
            nextProjections = ebolaDailyData.projections
          }
      })
    }
      const {oneWeek, twoWeeks, threeWeeks, fourWeeks} = nextProjections
      let oneWeekData, twoWeeksData, threeWeeksData, fourWeeksData
      oneWeekData = [moment(rows[rows.length - 1][0]).add(7, 'days').toDate(), oneWeek.y]
      twoWeeksData = [moment(rows[rows.length - 1][0]).add(2, 'weeks').toDate(), twoWeeks.y]
      threeWeeksData = [moment(rows[rows.length - 1][0]).add(3, 'weeks').toDate(), threeWeeks.y]
      fourWeeksData = [moment(rows[rows.length - 1][0]).add(4, 'weeks').toDate(), fourWeeks.y]

      let combinedFutureProjections = oneWeekData[1] + twoWeeksData[1] + threeWeeksData[1] + fourWeeksData[1]

    return (
      <ReportedCases label="Projected future cases" color="#F8AE32" value={Math.round(combinedFutureProjections)}/>
    )
  }

  _renderRiskList = () => {
    if (this.props.stateDataFromApp.mapView === 'risk') {
      return (
        <BlockPadded>
          <p>The top 10 countries with the highest relative risk of Ebola spread are:</p>
          <ol>
            <li>Guinea</li>
            <li>Nigeria</li>
            <li>Ivory Coast</li>
            <li>Sierra Leone</li>
            <li>Mali</li>
            <li>Liberia</li>
            <li>Senegal</li>
            <li>Ghana</li>
            <li>Burkina Faso</li>
            <li>Democratic Republic of the Congo</li>
          </ol>
        </BlockPadded>
      )
    } else {
      return null
    }
  }

   render() {
      const {filters, dataLoading} = this.props.stateDataFromApp

      // This adds the aggregated case count data to the sidebar
      let ebolaData
      if (!dataLoading && filters.country === 'All') {
        let countryEbolaData = this._prepareCountryEbolaData()
        ebolaData = countryEbolaData['Guinea'] + countryEbolaData['Liberia'] + countryEbolaData['Sierra Leone']
      } else if (!dataLoading && filters.country !== "All") {
        let countryEbolaData = this._prepareCountryEbolaData()
        ebolaData = countryEbolaData[filters.country]
      }

      // This calls the _renderFutureProjectedCases() function if projections are on
      let futureProjectedCases
      if (!dataLoading && filters.projection) {
        futureProjectedCases = this._renderFutureProjectedCases()
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
          {this.props.stateDataFromApp.mapView === 'snapshot' &&
            <BlockPadded className="reported-cases-wrapper">
              <p><strong>{filters.projection ? "Projection" : "Reported Cases"} from:<br />
              {moment(this.props.stateDataFromApp.filters.dateRange.from).format('DD MMM YYYY')} to {moment(this.props.stateDataFromApp.filters.dateRange.to).format('DD MMM YYYY')}</strong></p>
              <ReportedCases label={filters.projection ? "Total outbreak projections" : "Suspected and confirmed"} color={filters.projection ? "#259994" : "#4D73CE"} value={ebolaData}/>
              {futureProjectedCases}
            </BlockPadded>
          }
          <BlockPadded>
            <h4>SUMMARY</h4>
            <p>From {moment(this.props.stateDataFromApp.filters.dateRange.from).format('DD MMM YYYY')} to {moment(this.props.stateDataFromApp.filters.dateRange.to).format('DD MMM YYYY')}, the Ebola outbreak in {country} {filters.projection ? "is projected to affect" : "has affected"} {ebolaData} people
{!filters.projection ? " (suspected and confirmed cases)" : null}.</p>
          </BlockPadded>
          {this._renderRiskList()}
        </SidebarWrapper>
      );
   }
}

export default Sidebar;
