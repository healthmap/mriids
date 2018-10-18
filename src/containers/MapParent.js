import React, { Component } from 'react'
import * as d3 from 'd3-fetch'
import produce from 'immer'
import Spinner from '../components/Spinner'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

import Map from './Map'
import {
  Modal,
  Tooltip
} from 'react-bootstrap'

import Header from '../components/styled-components/Header'
import Container from '../components/styled-components/Container'
import ModalButton from '../components/styled-components/ModalButton'
import {
  LegendWrapper,
  LegendInfo,
  LegendLevel,
  LegendText
} from '../components/styled-components/Legend'
import MapContainer from '../components/styled-components/MapContainer'
import ModalTitle from '../components/styled-components/ModalTitle'

// import { injectGlobal } from 'styled-components'

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

const sevenDaysInSeconds = 60 * 60 * 24 * 7 * 1000

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
        rightColumnWidth: `${window.innerWidth - 230}px`,
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

  componentDidMount () {
    this.setState({
      rightColumnWidth: `${window.innerWidth - 230}px`
    })
    window.addEventListener('resize', () => {
      this.setState({
        rightColumnWidth: `${window.innerWidth - 230}px`
      })
    })
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
  }

  _eventCallback = (Chart, event) => {
    if (this.state.filters.projection) {
      Chart.chart.setVisibleChartRange(this.state.filters.dateRange.from, this.state.filters.dateRange.to)
    }
    if (event.end - event.start < sevenDaysInSeconds) {
      let minDate = moment(event.start).add(7, 'days')
      if (Chart.chart.hN.max > minDate) {
        Chart.chart.setVisibleChartRange(event.start, minDate.toDate())
      } else {
        minDate = moment(event.end).subtract(7, 'days')
        Chart.chart.setVisibleChartRange(minDate.toDate(), event.end)
      }
    }
    this.setState((prevState) => {
      return {
        ...prevState,
        filters: {
          ...prevState.filters,
          dateRange: {
            from: event.start,
            to: event.end
          }
        }
      }
    })
  }

  _eventReadyCallback = (Chart, event) => {
    this.setState({
      chartObject: Chart
    })
  }

  _prepareDataForCharts = () => {
    const {ebolaData, ebolaDataCombined, filters: {country, projection, dateRange}} = this.state
    let rows = []
    let projectionsData = {}
    let nextProjections
    const columns = [
      {
        type: 'date',
        label: 'Date',
      },
      {
        type: 'number',
        label: 'Ebola Cases',
      },
    ]
    if (projection) {
      columns.push({
        type: 'number',
        label: 'Projection',
      })
      columns.push({
        type: 'number',
        label: 'Projection error max',
      })
      columns.push({
        type: 'number',
        label: 'Projection error min',
      })
    }
    if (country === 'All') {
      ebolaDataCombined.forEach(function (row) {
        let projectionDate = new Date(row.projection_from)
        if (projection) {
          if (moment(projectionDate).isBetween(moment(dateRange.from), moment(dateRange.to))) {
            rows.push([projectionDate, parseFloat(row.aggregated)])
            rows[rows.length - 1].push(null, null, null)
            nextProjections = {
              oneWeek: {
                y: Number(row['y1.aggregated']),
                ymin: Number(row['ymin1.aggregated']),
                ymax: Number(row['ymax1.aggregated']),
              },
              twoWeeks: {
                y: Number(row['y2.aggregated']),
                ymin: Number(row['ymin2.aggregated']),
                ymax: Number(row['ymax2.aggregated']),
              },
              month: {
                y: Number(row['y4.aggregated']),
                ymin: Number(row['ymin4.aggregated']),
                ymax: Number(row['ymax4.aggregated']),
              }
            }
          }
        } else {
          rows.push([projectionDate, parseFloat(row.aggregated)])
        }

      })
    } else {
      const filteredData = ebolaData[country]
      Object.keys(filteredData).forEach(function (key) {
        let ebolaDailyData = filteredData[key]

        if (projection) {
          if (moment(key).isBetween(moment(dateRange.from), moment(dateRange.to))) {
            rows.push([new Date(key), parseFloat(ebolaDailyData.value)])
            rows[rows.length - 1].push(null, null, null)
            nextProjections = ebolaDailyData.projections
          }
        } else {
          rows.push([new Date(key), parseFloat(ebolaDailyData.value)])
        }

      })
    }

    if (projection) {
      const {oneWeek, twoWeeks, month} = nextProjections
      let oneWeekData, twoWeeksData, monthData
      oneWeekData = [moment(rows[rows.length - 1][0]).add(7, 'days').toDate(), null, oneWeek.y, oneWeek.ymax, oneWeek.ymin]
      twoWeeksData = [moment(rows[rows.length - 1][0]).add(2, 'weeks').toDate(), null, twoWeeks.y, twoWeeks.ymax, twoWeeks.ymin]
      monthData = [moment(rows[rows.length - 1][0]).add(1, 'month').toDate(), null, month.y, month.ymax, month.ymin]
      rows[rows.length - 1][2] = rows[rows.length - 1][1]
      rows[rows.length - 1][3] = rows[rows.length - 1][1]
      rows[rows.length - 1][4] = rows[rows.length - 1][1]
      rows = [...rows, oneWeekData, twoWeeksData, monthData]
    }

    return {
      columns,
      rows,
      projectionsData
    }
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

    // console.log("[MapParent.js][_prepareDataForMap] The mapData is: ", mapData)
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

  _prepareEbolaDataOld = (inputData) => {
    const keys = ['y', 'ymin', 'ymax']
    const projections = ['oneWeek', 'twoWeeks', 'month']
    const projectionsMapping = {
      oneWeek: 1,
      twoWeeks: 2,
      month: 4
    }

    const a = COUNTRIES.map((country) => {
      const data = inputData.map((item) => {
        const dateProjections = projections.map((projection) => {
          const projectionData = keys.map((key) => {
            return {
              [key]: item[`${key}${projectionsMapping[projection]}.${country}`]
            }
          })
          return {aaa: projectionData}
        })
        return {
          [item.Projections_from]: {
            value: [item[country]],
            projections: dateProjections
          }
        }
      })
      return {
        [country]: data
      }
    })
    return a
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
      let additionalStyles = {}
      let additionalStylesForText = {}
      // This sets the rounded corners for the first and last labels
      if (i === 9) {
        additionalStyles['borderTopLeftRadius'] = 6
        additionalStyles['borderTopRightRadius'] = 6
        additionalStylesForText['borderTopLeftRadius'] = 6
      } else if (i === 0) {
        additionalStyles['borderBottomLeftRadius'] = 6
        additionalStyles['borderBottomRightRadius'] = 6
        additionalStylesForText['borderBottomLeftRadius'] = 6
      }
      var value = i / len
      components.push(
        <LegendLevel key={`uniqueColorId${i}`}
                     style={{...additionalStyles, backgroundColor: this._resolveColor(value)}}>
          <LegendInfo style={{...additionalStylesForText}}>
            <LegendText>
              {Math.round(value * scale)}
            </LegendText>
          </LegendInfo>
        </LegendLevel>)
    }
    // console.log("[MapParent.js][_renderLegend] The components are: ", components)
    return components.reverse()
  }

  _handleModalHide = () => {
    this.setState({
      modal: {
        show: false,
        text: ''
      }
    })
  }

  _handleModalShow = (title = 'Modal name', text = 'Modal text') => {
    this.setState({
      modal: {
        show: true,
        text: text,
        title: title
      }
    })
  }

  _renderModal = () => {
    const {modal: {show, text, title}} = this.state
    return (
      <Modal
        show={show}
        onHide={this._handleModalHide}
        bsSize="sm"
        aria-labelledby="contained-modal-title-lg"
      >
        <Modal.Header closeButton>
          <ModalTitle>{title}</ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <p>
            {text}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <ModalButton secondary onClick={this._handleModalHide}>Secondary</ModalButton>
          <ModalButton onClick={this._handleModalHide}>Call to action</ModalButton>
        </Modal.Footer>
      </Modal>
    )
  }

  _renderTooltip = (text) => (
    <Tooltip id="tooltip">
      {text}
    </Tooltip>
  )

  _changeDateRange = (by, period, method, field) => () => {
    this.setState(
      produce(draft => {
          const date = moment(draft.filters.dateRange[field])

          if (method === 'add') {
            let newDate = date.clone().add(by, period)
            if (field === 'from') {
              if (newDate.isAfter(moment(draft.filters.dateRange.to).clone().subtract(by, period)) || newDate.isSame(moment(draft.filters.dateRange.to).clone().subtract(by, period))) {
                newDate = moment(draft.filters.dateRange.from)
              }
            }
            draft.filters.dateRange[field] = newDate.toDate()
          } else {
            let newDate = date.clone().subtract(by, period)
            if (field === 'to') {
              if (newDate.clone().subtract(by, period).isSame(moment(draft.filters.dateRange.from)) || newDate.clone().subtract(by, period).isBefore(moment(draft.filters.dateRange.from))) {
                newDate = moment(draft.filters.dateRange.to)
              }
            }
            draft.filters.dateRange[field] = newDate.toDate()
          }
      }
    ), () => {
      this.state.chartObject.chart.setVisibleChartRange(this.state.filters.dateRange.from, moment(this.state.filters.dateRange.to).add(1, 'month').toDate())
    })
  }

  render () {
    const {rightColumnWidth, dataLoading} = this.state

    let mapData, scale
    if (!dataLoading) {
      mapData = this._prepareDataForMap()
      scale = this._resolveScale(mapData)
    }

    return (
        <Container>
          <MapContainer>
            {
              dataLoading ? <Spinner/> : <Map data={mapData} scale={scale} colorFunction={this._resolveColor}/>
            }
          </MapContainer>
          {
            dataLoading ? <Spinner/> : <div style={
              {
              width: '100px',
              height: '100%',
              position: 'absolute',
              top: '30%',
              left: '5%'
              }}>
              <Header>Case Counts</Header>
              <LegendWrapper>
                {this._renderLegend(scale)}
              </LegendWrapper>
            </div>
          }
          </Container>
    )
  }
}

export default MapComponent

// injectGlobal`
//   .google-visualization-atl .border {
//       border: none!important;
//   }
//   `
