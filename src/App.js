import React, { Component } from 'react';
import Sidebar from './components/Layout/Sidebar/Sidebar';
import * as d3 from 'd3-fetch'

import './App.scss';

import Header from './containers/Header';
import MapParent from './containers/MapParent'
import EbolaChartComponent from './containers/Chart/EbolaChartComponent'

const csvLocationPath = 'csv/'
const csvExtension = '.csv'


const COUNTRIES = ['Guinea', 'Liberia', 'Sierra Leone']

const INITIAL_DATE_RANGE = {
  dateRange: {
    from: new Date(2014, 9, 1),
    to: new Date(2016, 1, 20)
  }
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataLoading: true,
      ebolaData: null,
      ebolaDataCombined: null,
      riskData: null,
      filters: {
        country: 'All',
        projection: false,
        ...INITIAL_DATE_RANGE
      },
      modal: {
        show: false,
        text: '',
        title: ''
      },
      chartObject: {}
    }
  }

  componentWillMount () {
    this._importDataFromCsv()
  }

  _importDataFromCsv = async () => {
    // const filePath = csvLocationPath + 'ebola_epicurve_data' + csvExtension
    const filePath = csvLocationPath + 'healthmap_projections_updated_10_August_2018' + csvExtension
    const data = await d3.csv(filePath)
    let newState = {}
    newState['ebolaData'] = this._prepareEbolaData(data)
    newState['ebolaDataCombined'] = await d3.csv(csvLocationPath + 'healthmap_projections_updated_10_August_2018' + csvExtension)
    newState['riskData'] = await d3.csv(csvLocationPath + 'weighted_flow' + csvExtension)

    this.setState({
      dataLoading: false,
      ...newState
    })
    // console.log('[App.js][_importDataFromCsv] The ebolaData is: ', this.state.ebolaData)
    // console.log('[App.js][_importDataFromCsv] The ebolaDataCombined is: ', this.state.ebolaDataCombined)
    // console.log('[App.js][_importDataFromCsv] The riskData is: ', this.state.riskData)
  }

  // This prepares the imported csv data to be saved in state.ebolaData. It splits the data by country and sets the projections into 'oneWeek', 'twoWeeks', and 'month'
  _prepareEbolaData = (inputData) => {
    const keys = ['y', 'ymin', 'ymax']
    const projections = ['oneWeek', 'twoWeeks', 'month']
    const projectionsMapping = {
      oneWeek: 1,
      twoWeeks: 2,
      month: 4
    }

    let newData = {
      'Guinea': {}, 'Liberia': {}, 'Sierra Leone': {}
    }

    COUNTRIES.forEach((country) => {
      inputData.forEach((item) => {
        // console.log("[_prepareEbolaData] Each item is: ", item)
        newData[country][item.projection_from] = {}
        newData[country][item.projection_from]['projections'] = {}
        projections.forEach((projection) => {
          newData[country][item.projection_from]['projections'][projection] = {}
          newData[country][item.projection_from]['projections']['originalValue'] = parseFloat(item[country])
          keys.forEach((key) => {
            newData[country][item.projection_from]['projections'][projection][key] = parseFloat(item[`${key}${projectionsMapping[projection]}.${country}`])
          })
        })
        newData[country][item.projection_from]['value'] = item[country]
      })
    })
    // console.log("[App.js][_prepareEbolaData] The prepared ebola data is: ", newData)
    return newData
  }

  _chartRangeHandler = (value) => {
    // console.log("[App.js][_chartRangeHandler] The minimum value is: ", value[0])
    let fromDate = new Date(INITIAL_DATE_RANGE.dateRange.from)
    // console.log("[App.js][_chartRangeHandler] The starting FROM date is: ", fromDate)
    fromDate.setDate(fromDate.getDate() + (7 * value[0]))
    // console.log("[App.js][_chartRangeHandler] The NEW FROM date that will be in the state is: ", fromDate)
    let toDate = new Date(INITIAL_DATE_RANGE.dateRange.to)
    // console.log('[App.js][_chartRangeHandler] The starting TO date is: ', toDate)
    toDate.setDate(toDate.getDate() + (7 * (value[1] - 68)))
    // console.log("[App.js][_chartRangeHandler] The maximum value is: ", value[1])
    // console.log('[App.js][_chartRangeHandler] The NEW TO date in the state is: ', toDate)
    this.setState((prevState) => {
      return {
        ...prevState,
        filters: {
          ...prevState.filters,
          dateRange: {
            from: fromDate,
            to: toDate
          }
        }
      }
    })
    // console.log('[App.js][_chartRangeHandler] The current state is', this.state)
  }

  _eventReadyCallback = (Chart, event) => {
    // console.log('[App.js][_eventReadyCallback] THIS FUNCTION IS BEING TRIGGERED')
    this.setState({
      chartObject: Chart
    })
  }

  _handleCountryChange = (event) => {
    // console.log('[App.js][_handleCountryChange] The country selected is: ', event.target.value)
    let selectedCountry = event.target.value
    this.setState((prevState) => {
      return {
        ...prevState,
        filters: {
          ...prevState.filters,
          country: selectedCountry
        }
      }
    })
    // console.log('[App.js][_handleCountryChange] The country selected is: ', this.state.filters.country)
  }

  _handleProjectionChange = () => {
    this.setState((prevState) => {
        return {
          ...prevState,
          filters: {
            ...prevState.filters,
            projection: !prevState.filters.projection
          }
        }
    })
  }

  render() {
    return (
      <div className="app">
        <Sidebar
        stateDataFromApp={this.state}
        changeCountry={this._handleCountryChange}
        />
        <Header />
        <MapParent stateDataFromApp={this.state} />
        <EbolaChartComponent
        eventReadyCallback={this._eventReadyCallback}
        stateDataFromApp={this.state}
        toggleProjectionChange={this._handleProjectionChange}
        changeDateRange={this._changeDateRange}
        changeChartDateRange={this._chartRangeHandler}
        />
      </div>
    );
  }
}

export default App;
