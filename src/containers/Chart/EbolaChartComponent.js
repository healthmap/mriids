import React, { Component } from 'react'
import Spinner from '../../components/Spinner'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import {Range} from 'rc-slider'
import 'rc-slider/assets/index.css';

import CustomChart from '../../components/Chart/CustomChart'
import {
  Tooltip
} from 'react-bootstrap'

import AxisLabels from '../../components/AxisLabels'
import {Button, ButtonLink} from '../../components/styled-components/Button'
import ChartContainer from '../../components/styled-components/ChartContainer'
import {FlexRow} from '../../components/styled-components/LayoutHelpers'
import TimespanButtonsWrapper from '../../components/styled-components/TimespanButtonsWrapper'

import ProjectionToggle from '../ProjectionToggle'

const moment = extendMoment(Moment)

class EbolaChartComponent extends Component {

  _prepareDataForCharts = () => {
    const {ebolaData, ebolaDataCombined, filters: {country, projection, dateRange}} = this.props.stateDataFromApp
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
        label: 'Projected future cases',
      })
    }
    if (country === 'All') {
      ebolaDataCombined.forEach(function (row) {
        let projectionDate = new Date(row.projection_from)
        if (projection) {
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
        } else if (!projection) {
          if (moment(projectionDate).isBetween(moment(dateRange.from), moment(dateRange.to))) {
          rows.push([projectionDate, parseFloat(row.aggregated)])
        }
      }
      })
    }

    else {
      const filteredData = ebolaData[country]
      Object.keys(filteredData).forEach(function (key) {
        let ebolaDailyData = filteredData[key]

        if (projection) {
          if (moment(key).isBetween(moment(dateRange.from), moment(dateRange.to))) {
            rows.push([new Date(key), parseFloat(ebolaDailyData.value)])
            rows[rows.length - 1].push(null)
            nextProjections = ebolaDailyData.projections
          }
        } else if (!projection) {
          if (moment(key).isBetween(moment(dateRange.from), moment(dateRange.to))) {
          rows.push([new Date(key), parseFloat(ebolaDailyData.value)])
        }
      }
      })
    }

    if (projection) {
      const {oneWeek, twoWeeks, threeWeeks, fourWeeks} = nextProjections
      let oneWeekData, twoWeeksData, threeWeeksData, fourWeeksData
      oneWeekData = [moment(rows[rows.length - 1][0]).add(7, 'days').toDate(), null, oneWeek.y]
      twoWeeksData = [moment(rows[rows.length - 1][0]).add(2, 'weeks').toDate(), null, twoWeeks.y]
      threeWeeksData = [moment(rows[rows.length - 1][0]).add(3, 'weeks').toDate(), null, threeWeeks.y]
      fourWeeksData = [moment(rows[rows.length - 1][0]).add(4, 'weeks').toDate(), null, fourWeeks.y]
      rows = [...rows, oneWeekData, twoWeeksData, threeWeeksData, fourWeeksData]
    }

    return {
      columns,
      rows,
      projectionsData
    }
  }

  _renderTooltip = (text) => (
    <Tooltip id="tooltip">
      {text}
    </Tooltip>
  )

  render () {
    const {filters, dataLoading, chartRangeSlider} = this.props.stateDataFromApp
    let chartData
    if (!dataLoading) {
      chartData = this._prepareDataForCharts()
    }

    return (
        <ChartContainer>
          {
            dataLoading ? <Spinner/> :
              <AxisLabels
                >
                <CustomChart
                  columns={chartData.columns}
                  rows={chartData.rows}
                  projections={chartData.projectionsData}
                  dateStart={filters.dateRange.from}
                  dateEnd={filters.dateRange.to}
                  eventReadyCallback={this.props.eventReadyCallback}
                  />
              </AxisLabels>
          }
          <FlexRow>
            <Range
              style={{width: '75%', marginLeft: '80px'}}
              min={0}
              max={68}
              dots
              value={[chartRangeSlider.start, chartRangeSlider.end]}
              tipFormatter={value => `Week ${value}`}
              onChange={this.props.changeChartDateRange}
            />
            <ProjectionToggle toggleProjectionChange={this.props.toggleProjectionChange} status={filters.projection} />
          </FlexRow>
          <TimespanButtonsWrapper>
            <label>Timespan:</label>
            {/* <Button>1 week</Button> */}
            <Button onClick={() => this.props.timespanChangeHandler('1 month')}>1 month</Button>
            <Button onClick={() => this.props.timespanChangeHandler('3 month')}>3 months</Button>
            <Button onClick={() => this.props.timespanChangeHandler('6 month')}>6 months</Button>
            <Button onClick={() => this.props.timespanChangeHandler('1 year')}>1 year</Button>
            <Button onClick={() => this.props.timespanChangeHandler('max')}>Max</Button>
            <ButtonLink onClick={() => this.props.timespanChangeHandler('max')}>Reset</ButtonLink>
          </TimespanButtonsWrapper>
        </ChartContainer>
    )
  }
}

export default EbolaChartComponent;
