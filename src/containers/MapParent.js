import React, { Component } from 'react'
import Spinner from '../components/Spinner'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

import Map from './Map'

import {BlockDropshadow} from '../components/styled-components/Block'
import {MapOuterWrapper, MapInnerWrapper, MapLegendWrapper, MapFiltersWrapper} from '../components/styled-components/MapWrappers'
import MapLegend from '../components/Layout/MapLegend/MapLegend'


const moment = extendMoment(Moment)

const COUNTRIES = ['Guinea', 'Liberia', 'Sierra Leone']

class MapComponent extends Component {

  _prepareDataForMap = () => {
    // console.log('[MapParent.js][_prepareDataForMap] The ebolaData is: ', this.props.stateDataFromApp.ebolaData)
    const {ebolaData, filters: {dateRange, projection}} = this.props.stateDataFromApp
    const momentDateRange = moment().range(dateRange.from, dateRange.to)
    let mapData = {}
    COUNTRIES.map((country) => {
      mapData[country] = 0
      let filteredData = ebolaData[country]
      Object.keys(filteredData).forEach(function (key) {
        let ebolaDailyData = filteredData[key]
        if (!projection) {
          if (momentDateRange.contains(moment(key))) {
            mapData[country] += parseInt(ebolaDailyData.value)
          }
        } else if (projection) {
          if (momentDateRange.contains(moment(key))) {
            mapData[country] += parseInt(ebolaDailyData.projections.month.y)
          }
        }
      })
    })

    console.log("[MapParent.js][_prepareDataForMap] The mapData is: ", mapData)
    return mapData
  }

  _resolveColor = (value) => {
    if (!this.props.stateDataFromApp.filters.projection) {
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
    } else if (this.props.stateDataFromApp.filters.projection) {
      let color
      if (value === 0) {
        color = "#FDF1DD"
      } else if (value > 0 && value <= 0.1) {
        color = "#D3E6D2"
      } else if (value > 0.1 && value <= 0.2) {
        color = "#AADBC7"
      } else if (value > 0.2 && value <= 0.3) {
        color = "#83CFBC"
      } else if (value > 0.3 && value <= 0.4) {
        color = "#5BC4B2"
      } else if (value > 0.4 && value <= 0.5) {
        color = "#36B9A7"
      } else if (value > 0.5 && value <= 0.6) {
        color = "#32B1A2"
      } else if (value > 0.6 && value <= 0.7) {
        color = "#2DAA9E"
      } else if (value > 0.7 && value <= 0.8) {
        color = "#29A199"
      } else if (value > 0.8) {
        color = "#259994"
      }
      return color
    }
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
    const {dataLoading, filters: {projection}} = this.props.stateDataFromApp

    let mapData, scale
    if (!dataLoading) {
      mapData = this._prepareDataForMap()
      scale = this._resolveScale(mapData)
    }

    let legendHeader
    if (projection) {
      legendHeader = 'Projected Case Counts'
    } else {
      legendHeader = "Case Counts"
    }

    return (
      <MapOuterWrapper>
        <MapInnerWrapper>
          {
            dataLoading ? <Spinner/> : <Map stateDataFromApp={this.props.stateDataFromApp} data={mapData} scale={scale} colorFunction={this._resolveColor}/>
          }
          {
            dataLoading ? <Spinner/> : <MapLegendWrapper><BlockDropshadow>
              <h3>{legendHeader}</h3>
              {this._renderLegend(scale)}
            </BlockDropshadow></MapLegendWrapper>
          }
          <MapFiltersWrapper>
            <BlockDropshadow>
              <h3>Coming soon</h3>
              <label><input type="checkbox" disabled /> Health Facilities</label>
              <label><input type="checkbox" disabled /> Population Density</label>
              <label><input type="checkbox" disabled /> Vaccination Coverage</label>
            </BlockDropshadow>
          </MapFiltersWrapper>
        </MapInnerWrapper>
      </MapOuterWrapper>
    )
  }
}

export default MapComponent
