import React, { Component } from 'react'
import Spinner from '../components/Spinner'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

import Map from './Map'
import RiskMap from './RiskMap'

import {BlockDropshadow} from '../components/styled-components/Block'
import CountToggle from '../components/CountToggle'
import {MapOuterWrapper, MapInnerWrapper, MapLegendWrapper, MapFiltersWrapper} from '../components/styled-components/MapWrappers'
import MapToggle from './MapToggle/MapToggle'
import MapLegend from '../components/Layout/MapLegend/MapLegend'


const moment = extendMoment(Moment)

const COUNTRIES = ['Guinea', 'Liberia', 'Sierra Leone']

const RELATIVE_RISK_COUNTRIES = ['Angola', 'Burundi', 'Benin', 'Burkina Faso', 'Botswana', 'Central African Republic', 'Côte d’Ivoire', 'Cameroon', 'Congo - Kinshasa', 'Congo - Brazzaville', 'Comoros', 'Cape Verde', 'Djibouti', 'Algeria', 'Egypt', 'Eritrea', 'Ethiopia', 'Gabon', 'Ghana', 'Guinea', 'Gambia', 'Guinea-Bissau', 'Equatorial Guinea', 'Kenya', 'Liberia', 'Libya', 'Lesotho', 'Morocco', 'Madagascar', 'Mali', 'Mozambique', 'Mauritania', 'Mauritius', 'Malawi', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sudan', 'Senegal', 'St. Helena', 'Sierra Leone', 'Somalia', 'South Sudan', 'São Tomé and Príncipe', 'Swaziland', 'Seychelles', 'Chad', 'Togo', 'Tunisia', 'Tanzania', 'Uganda', 'South Africa', 'Zambia', 'Zimbabwe']

class MapComponent extends Component {
  state = {
    showCaseCounts: true
  }
  
  _prepareDataForMap = () => {
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

    return mapData
  }

  _prepareRiskDataForMap = () => {
    const {riskData} = this.props.stateDataFromApp
    let newRiskData = {
      'Angola': {},'Burundi': {}, 'Benin': {}, 'Burkina Faso': {}, 'Botswana': {}, 'Central African Republic': {}, 'Côte d’Ivoire': {}, 'Cameroon': {}, 'Congo - Kinshasa': {}, 'Congo - Brazzaville': {}, 'Comoros': {}, 'Cape Verde': {}, 'Djibouti': {}, 'Algeria': {}, 'Egypt': {}, 'Eritrea': {}, 'Ethiopia': {}, 'Gabon': {}, 'Ghana': {}, 'Guinea': {}, 'Gambia': {}, 'Guinea-Bissau': {}, 'Equatorial Guinea': {}, 'Kenya': {}, 'Liberia': {}, 'Libya': {}, 'Lesotho': {}, 'Morocco': {}, 'Madagascar': {}, 'Mali': {}, 'Mozambique': {}, 'Mauritania': {}, 'Mauritius': {}, 'Malawi': {}, 'Namibia': {}, 'Niger': {}, 'Nigeria': {}, 'Rwanda': {}, 'Sudan': {}, 'Senegal': {}, 'St. Helena': {}, 'Sierra Leone': {}, 'Somalia': {}, 'South Sudan': {}, 'São Tomé and Príncipe': {}, 'Swaziland': {}, 'Seychelles': {}, 'Chad': {}, 'Togo': {}, 'Tunisia': {}, 'Tanzania': {}, 'Uganda': {}, 'South Africa': {}, 'Zambia': {}, 'Zimbabwe': {}
    }

    RELATIVE_RISK_COUNTRIES.forEach((country) => {
      let relativeRisk
      riskData.forEach((item) => {
        if (item.country === country) {
          relativeRisk = parseFloat(item.wtd_rel_risk)
        }
      })
      newRiskData[country]['relative_risk'] = relativeRisk
    })
    return newRiskData
  }

  // This sets the colors for the 'snapshot' map view and the map legend
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

  // This toggles whether the case counts are shown on the map or not
  toggleMapCaseCounts = () => {
    this.setState((prevState) => {
      return {
      ...prevState,
      showCaseCounts: !prevState.showCaseCounts
      }
    })
  }

  // This renders either the RiskMap or the Map depending on the mapView in the state in App.js
  renderMap = (mapData, scale) => {
    if (this.props.stateDataFromApp.mapView === 'risk') {
      return (
        <RiskMap
          stateDataFromApp={this.props.stateDataFromApp}
        />
      )
    } else {
      return (
        <Map
          stateDataFromApp={this.props.stateDataFromApp}
          data={mapData}
          scale={scale}
          colorFunction={this._resolveColor}
          showCaseCounts={this.state.showCaseCounts}
        />
      )
    }
  }

  // This renders the levels in the map legend
  _renderLegendLevels = (scale) => {
    let len = 9
    let components = []
    for (var i = 0; i <= len; i++) {
      var value = i / len
      components.push(
        <MapLegend key={`uniqueColorId${i}`} color={this._resolveColor(value)} value={Math.round(value * scale)} />
      )
    }
    return components.reverse()
  }

  // This renders the map legend for the 'snapshot' map
  _renderSnapshotMapLegend = (scale) => {
    let legendHeader
    if (this.props.stateDataFromApp.filters.projection) {
      legendHeader = 'Total outbreak projections'
    } else {
      legendHeader = "Case Counts"
    }
    if (this.props.stateDataFromApp.mapView === 'snapshot') {
      return (
        <MapLegendWrapper><BlockDropshadow>
              <h3>{legendHeader}</h3>
              {this._renderLegendLevels(scale)}
              <CountToggle status={this.state.showCaseCounts} toggleMapCaseCounts={this.toggleMapCaseCounts}/>
            </BlockDropshadow>
            </MapLegendWrapper>
      )
    } else {
      return null
    }
  }

  // This renders the legend for the 'risk' map
  _renderRiskLegend = () => {
    const riskColors = [ '#6c4ce1', '#7c64d3', '#9c8de7', '#c0b6fa', '#dad3fe' ]
    const riskLabels = [ 'High', '', 'Med', '', 'Low' ]
    return (
      <MapLegendWrapper>
        <BlockDropshadow>
          <h3>Projected Import Risk</h3>
          {riskColors.map((color, index) => {
            return (
              <MapLegend key={index} color={color} value={riskLabels[index]} />
            )
          })}
        </BlockDropshadow>
      </MapLegendWrapper>
    )
  }

  _renderMapFilters = () => {
    return (
      <MapFiltersWrapper>
        <BlockDropshadow>
          <h3>Coming soon</h3>
          <label><input type="checkbox" disabled /> Health Facilities</label>
          <label><input type="checkbox" disabled /> Population Density</label>
          <label><input type="checkbox" disabled /> Vaccination Coverage</label>
        </BlockDropshadow>
      </MapFiltersWrapper>
    )
  }

  render () {
    const {dataLoading} = this.props.stateDataFromApp

    let mapData, scale
    if (!dataLoading) {
      mapData = this._prepareDataForMap()
      scale = this._resolveScale(mapData)
    }

    return (
      <MapOuterWrapper className={this.props.stateDataFromApp.mapView === 'snapshot' ? 'has-chart' : ''}>
        <MapInnerWrapper>
          <MapToggle changeMapView={this.props.changeMapView} active={this.props.stateDataFromApp.mapView} />
          {
            dataLoading ? <Spinner/> : this.renderMap(mapData, scale)
          }
          {
            dataLoading ? <Spinner/> : this._renderSnapshotMapLegend(scale)
          }
          { this.props.stateDataFromApp.mapView === 'risk' &&
            this._renderRiskLegend()
          }
          {
            this._renderMapFilters()
          }
        </MapInnerWrapper>
      </MapOuterWrapper>
    )
  }
}

export default MapComponent
