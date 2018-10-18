import React, { Component } from 'react'
import * as d3 from 'd3-fetch'
import produce from 'immer'
import Spinner from '../../components/Spinner'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

import CustomChart from '../../components/Chart/CustomChart'
import {
  ToggleButtonGroup,
  // Modal,
  Button,
  ButtonGroup,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'

import AxisLabels from '../../components/AxisLabels'
import Header from '../../components/styled-components/Header'
import RightColumn from '../../components/styled-components/RightColumn'
// import CountryToggleButtonStyled from '../../components/styled-components/CountryToggleButtonStyled'
// import ModalButton from '../../components/styled-components/ModalButton'
// import ProjectionToggleButtonStyled from '../../components/styled-components/ProjectionToggleButtonStyled'
import EbolaChart from '../../components/styled-components/EbolaChart'
import ChartContainer from '../../components/styled-components/ChartContainer'
import Title from '../../components/styled-components/Title'
// import ModalTitle from '../../components/styled-components/ModalTitle'

// import styled, { injectGlobal } from 'styled-components'

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

class EbolaChartComponent extends Component {
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
    const filePath = csvLocationPath + 'ebola_epicurve_data' + csvExtension
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
        newData[country][item.Projections_from] = {}
        newData[country][item.Projections_from]['projections'] = {}
        projections.forEach((projection) => {
          newData[country][item.Projections_from]['projections'][projection] = {}
          newData[country][item.Projections_from]['projections']['originalValue'] = parseFloat(item[country])
          keys.forEach((key) => {
            newData[country][item.Projections_from]['projections'][projection][key] = parseFloat(item[`${key}${projectionsMapping[projection]}.${country}`])
          })
        })
        newData[country][item.Projections_from]['value'] = item[country]
      })
    })
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
    var hue, s, l
    if (value < 0.5) {
      hue = 175
      s = ((-145 * value) + 105).toString(10) // s = '98%' / 40
      l = (((value) * 180) + 11).toString(10) // l = '20%' / 92
    } else if (value > 0.5) {
      hue = 40
      s = (((value) * 90) - 4).toString(10) // s = '46%' / 87
      l = (((-133 * value) + 163)).toString(10) // l = '90%' / 30
    } else {
      hue = 0
      s = 100
      l = 100
    }
    return ['hsl(', hue, ',', s, '%,', l, '%)'].join('')
  }

  // _handleModalHide = () => {
  //   this.setState({
  //     modal: {
  //       show: false,
  //       text: ''
  //     }
  //   })
  // }

  // _handleModalShow = (title = 'Modal name', text = 'Modal text') => {
  //   this.setState({
  //     modal: {
  //       show: true,
  //       text: text,
  //       title: title
  //     }
  //   })
  // }

  // _renderModal = () => {
  //   const {modal: {show, text, title}} = this.state
  //   return (
  //     <Modal
  //       show={show}
  //       onHide={this._handleModalHide}
  //       bsSize="sm"
  //       aria-labelledby="contained-modal-title-lg"
  //     >
  //       <Modal.Header closeButton>
  //         <ModalTitle>{title}</ModalTitle>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <p>
  //           {text}
  //         </p>
  //       </Modal.Body>
  //       <Modal.Footer>
  //         <ModalButton secondary onClick={this._handleModalHide}>Secondary</ModalButton>
  //         <ModalButton onClick={this._handleModalHide}>Call to action</ModalButton>
  //       </Modal.Footer>
  //     </Modal>
  //   )
  // }

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
    const {filters: {country, projection}, rightColumnWidth, dataLoading} = this.state
    
    let chartData
    if (!dataLoading) {
      chartData = this._prepareDataForCharts()
    }

    return (
          <ChartContainer>
            <EbolaChart projections={projection}>
              <Title>
                <OverlayTrigger 
                  placement="top"
                  overlay={this._renderTooltip(`Mouseover placeholder ebola cases ${country}`)}>
                  <p>Ebola Cases</p>
                </OverlayTrigger>
                {
                projection &&
                <div style={{display: 'flex', flex: 1, flexDirection: 'row', marginLeft: '30px' }}>
                  <div style={{display: 'flex', flexDirection: 'column', }}>
                    <div style={{alignItems: 'flex-start', justifyContent: 'flex-start', display: 'flex'}}>
                      Period Start: {moment(this.state.filters.dateRange.from).format('MMM, DD, YYYY')}
                    </div>
                    <div style={{alignItems: 'center', justifyContent: 'flex-start', display: 'flex'}}>
                      Adjust start:
                      <ButtonGroup>
                        <Button onClick={this._changeDateRange(7, 'days', 'add', 'from')}>Add 7 days</Button>
                        <Button onClick={this._changeDateRange(7, 'days', 'subtract', 'from')}>Subtract 7 days</Button>
                      </ButtonGroup>
                    </div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', marginLeft: '30px'}}>
                    <div style={{alignItems: 'flex-start', justifyContent: 'flex-start', display: 'flex'}}>
                      Period End: {moment(this.state.filters.dateRange.to).format('MMM, DD, YYYY')}
                    </div>
                    <div style={{alignItems: 'center', justifyContent: 'flex-start', display: 'flex'}}>
                      Adjust end: 
                      <ButtonGroup>
                        <Button onClick={this._changeDateRange(7, 'days', 'add', 'to')}>Add 7 days</Button>
                        <Button onClick={this._changeDateRange(7, 'days', 'subtract', 'to')}>Subtract 7 days</Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </div>
                
              }
              </Title>
              
              {
                dataLoading ? <Spinner/> :
                  <AxisLabels
                    xAxis="Time" yAxis="Ebola Cases"
                    renderTooltip={this._renderTooltip} position="right">
                    <CustomChart
                      columns={chartData.columns}
                      rows={chartData.rows}
                      projections={chartData.projectionsData}
                      eventCallback={this._eventCallback}
                      eventReadyCallback={this._eventReadyCallback}
                      projectionFilter={projection}/>
                  </AxisLabels>
              }
            </EbolaChart>
          </ChartContainer>
    )
  }
}

export default EbolaChartComponent;

// const Image = styled.img`
//   margin-right: 10px;
// `

// injectGlobal`
//   .google-visualization-atl .border {
//       border: none!important;
//   }
//   `