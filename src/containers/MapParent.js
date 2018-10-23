import React, { Component } from 'react'
import * as d3 from 'd3-fetch'
import Spinner from '../components/Spinner'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

import Map from './Map'

import MapLegend from '../components/Layout/MapLegend/MapLegend'


const moment = extendMoment(Moment)
const csvLocationPath = 'csv/'
const csvExtension = '.csv'


const COUNTRIES = ['Guinea', 'Liberia', 'Sierra Leone']

const INITIAL_DATE_RANGE = {
  dateRange: {
    from: new Date(2014, 4, 14),
    to: new Date(2016, 0, 20)
  }
}

class MapComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataLoading: true,
      ebolaData: null,
      ebolaDataCombined: null,
      filters: {
        country: 'Guinea',
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
    newState['ebolaDataCombined'] = await d3.csv(csvLocationPath + 'healthmap_projections' + csvExtension)

    this.setState({
      dataLoading: false,
      ...newState
    })
    console.log('[MapParent.js][_importDataFromCsv] The ebolaData is: ', this.state.ebolaData)
    console.log('[MapParent.js][_importDataFromCsv] The ebolaDataCombined is: ', this.state.ebolaDataCombined)
  }

  _prepareDataForMap = () => {
    const {ebolaData, filters: {dateRange}} = this.state
    const momentDateRange = moment().range(dateRange.from, dateRange.to)
    let mapData = {}
    COUNTRIES.map((country) => {
      mapData[country] = 0
      let filteredData = ebolaData[country]
      Object.keys(filteredData).forEach(function (key) {
        let ebolaDailyData = filteredData[key]
        if (momentDateRange.contains(moment(key))) {
          mapData[country] += parseInt(ebolaDailyData.value)
        }
      })
    })

    console.log("[MapParent.js][_prepareDataForMap] The mapData is: ", mapData)
    return mapData
  }

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
    // console.log("[MapParent.js][_prepareEbolaData] The ebola data is: ", newData)
    return newData
  }

  _handleCountryChange = (country) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        filters: {
          ...prevState.filters,
          country: country
        }
      }
    })
  }

  _handleProjectionChange = (projection) => {
    this.setState((prevState) => {
        return {
          ...prevState,
          filters: {
            ...prevState.filters,
            projection: projection
          }
        }
    }, () => {
      this.state.chartObject.chart.setVisibleChartRange(
        this.state.filters.dateRange.from,
        moment(this.state.filters.dateRange.to).add(1, 'month').toDate()
      )
    })
  }

  _resolveColor = (value) => {
    let color
    if (value === 0) {
      color = "#FDF1DD"
    } else if (value > 0 && value <= 0.1) {
      color = "#FBE7C6"
    } else if (value > 0.1 && value <= 0.2) {
      color = "#F8D1B6"
    } else if (value > 0.2 && value <= 0.3) {
      color = "#F5BCA7"
    } else if (value > 0.3 && value <= 0.4) {
      color = "#F1A697"
    } else if (value > 0.4 && value <= 0.5) {
      color = "#EE9187"
    } else if (value > 0.5 && value <= 0.6) {
      color = "#EB7C77"
    } else if (value > 0.6 && value <= 0.7) {
      color = "#E86769"
    } else if (value > 0.7 && value <= 0.8) {
      color = "#E55259"
    } else if (value > 0.8) {
      color = "#E23D4A"
    }
    return color
  }

  _resolveScale = (mapData) => {
    let maxValue = Math.max(...Object.values(mapData))
    if (maxValue < 20) {
      maxValue = 20
    } else if (maxValue < 50) {
      maxValue = 50
    } else if (maxValue < 500) {
      maxValue = Math.ceil(maxValue / 50) * 50
    } else if (maxValue < 1000) {
      maxValue = Math.ceil(maxValue / 100) * 100
    } else if (maxValue < 5000) {
      maxValue = Math.ceil(maxValue / 500) * 500
    } else {
      maxValue = Math.ceil(maxValue / 1000) * 1000
    }

    return maxValue
  }

  _renderLegend = (scale) => {
    // This represents the number of levels in the legend
    // console.log("[MapParent.js][_renderLegend] The scale is: ", scale)
    let len = 9
    let components = []
    for (var i = 0; i <= len; i++) {
      var value = i / len
      components.push(
        <MapLegend key={`uniqueColorId${i}`} color={this._resolveColor(value)} value={Math.round(value * scale)} />
      )
    }
    // console.log("[MapParent.js][_renderLegend] The components are: ", components)
    return components.reverse()
  }

  render () {
    const {dataLoading} = this.state

    let mapData, scale
    if (!dataLoading) {
      mapData = this._prepareDataForMap()
      scale = this._resolveScale(mapData)
    }

    return (
        <div className="map-parent">
          <div className="map-container">
            {
              dataLoading ? <Spinner/> : <Map data={mapData} scale={scale} colorFunction={this._resolveColor}/>
            }
          </div>
          {
            dataLoading ? <Spinner/> : <div className="map-legend">
              <h3>Case Counts</h3>
              {this._renderLegend(scale)}
            </div>
          }
        </div>
    )
  }
}

export default MapComponent