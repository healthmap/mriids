import React, { Component } from 'react'
import Spinner from '../../components/Spinner'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import {Range} from 'rc-slider'
import 'rc-slider/assets/index.css';

import CustomChart from '../../components/Chart/CustomChart'
import {
  //OverlayTrigger,
  Tooltip
} from 'react-bootstrap'

import AxisLabels from '../../components/AxisLabels'
import {Button, ButtonIcon, ButtonLink} from '../../components/styled-components/Button'
import ChartContainer from '../../components/styled-components/ChartContainer'
import EbolaChart from '../../components/styled-components/EbolaChart'
import {FlexRow} from '../../components/styled-components/LayoutHelpers'
import SvgIcon from '../../components/SvgIcon'
import TimespanButtonsWrapper from '../../components/styled-components/TimespanButtonsWrapper'
import Title from '../../components/styled-components/Title'

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
        label: 'Projection',
      })
      // columns.push({
      //   type: 'number',
      //   label: 'Projection error max',
      // })
      // columns.push({
      //   type: 'number',
      //   label: 'Projection error min',
      // })
    }
    if (country === 'All') {
      // console.log('[EbolaChartComponent.js][_prepareDataForCharts] The ebolaDataCombined is: ', ebolaDataCombined)
      ebolaDataCombined.forEach(function (row) {
        let projectionDate = new Date(row.projection_from)
        if (projection) {
          if (moment(projectionDate).isBetween(moment(dateRange.from), moment(dateRange.to))) {
            rows.push([projectionDate, parseFloat(row.aggregated)])
            // rows[rows.length - 1].push(null, null, null)
            rows[rows.length - 1].push(null)
            nextProjections = {
              oneWeek: {
                y: Number(row['y1.aggregated']),
                // ymin: Number(row['ymin1.aggregated']),
                // ymax: Number(row['ymax1.aggregated']),
              },
              twoWeeks: {
                y: Number(row['y2.aggregated']),
                // ymin: Number(row['ymin2.aggregated']),
                // ymax: Number(row['ymax2.aggregated']),
              },
              threeWeeks: {
                y: Number(row['y3.aggregated']),
                // ymin: Number(row['ymin3.aggregated']),
                // ymax: Number(row['ymax3.aggregated']),
              },
              month: {
                y: Number(row['y4.aggregated']),
                // ymin: Number(row['ymin4.aggregated']),
                // ymax: Number(row['ymax4.aggregated']),
              }
            }
          }
          // console.log('[EbolaChartComponent][_prepareDataForCharts] At line 94, the rows are: ', rows)
        } else if (!projection) {
          if (moment(projectionDate).isBetween(moment(dateRange.from), moment(dateRange.to))) {
          rows.push([projectionDate, parseFloat(row.aggregated)])
        }
      }
      })
      // console.log('[EbolaChartComponent][_prepareDataForCharts] At line 101 the rows are: ', rows)
    }

    else {
      const filteredData = ebolaData[country]
      // console.log('[EbolaChartComponent][_prepareDataForCharts] The filteredData for each country is: ', filteredData)
      Object.keys(filteredData).forEach(function (key) {
        let ebolaDailyData = filteredData[key]

        if (projection) {
          if (moment(key).isBetween(moment(dateRange.from), moment(dateRange.to))) {
            rows.push([new Date(key), parseFloat(ebolaDailyData.value)])
            // rows[rows.length - 1].push(null, null, null)
            rows[rows.length - 1].push(null)
            nextProjections = ebolaDailyData.projections
            // console.log('[EbolaChartComponent.js][_prepareDataForCharts] At row 111, the nextProjections are: ', nextProjections)
          }
        } else if (!projection) {
          if (moment(key).isBetween(moment(dateRange.from), moment(dateRange.to))) {
          rows.push([new Date(key), parseFloat(ebolaDailyData.value)])
        }
      }
      })
    }

    if (projection) {
      const {oneWeek, twoWeeks, threeWeeks, month} = nextProjections
      let oneWeekData, twoWeeksData, threeWeeksData, monthData
      // oneWeekData = [moment(rows[rows.length - 1][0]).add(7, 'days').toDate(), null, oneWeek.y, oneWeek.ymax, oneWeek.ymin]
      oneWeekData = [moment(rows[rows.length - 1][0]).add(7, 'days').toDate(), null, oneWeek.y]
      // twoWeeksData = [moment(rows[rows.length - 1][0]).add(2, 'weeks').toDate(), null, twoWeeks.y, twoWeeks.ymax, twoWeeks.ymin]
      twoWeeksData = [moment(rows[rows.length - 1][0]).add(2, 'weeks').toDate(), null, twoWeeks.y]
      // threeWeeksData = [moment(rows[rows.length - 1][0]).add(3, 'weeks').toDate(), null, threeWeeks.y, threeWeeks.ymax, threeWeeks.ymin]
      threeWeeksData = [moment(rows[rows.length - 1][0]).add(3, 'weeks').toDate(), null, threeWeeks.y]
      // monthData = [moment(rows[rows.length - 1][0]).add(1, 'month').toDate(), null, month.y, month.ymax, month.ymin]
      monthData = [moment(rows[rows.length - 1][0]).add(1, 'month').toDate(), null, month.y]
      // rows[rows.length - 1][1] = rows[rows.length - 1][1]
      // rows[rows.length - 1][2] = rows[rows.length - 1][1]
      // rows[rows.length - 1][3] = rows[rows.length - 1][1]
      // rows[rows.length - 1][4] = rows[rows.length - 1][1]
      rows = [...rows, oneWeekData, twoWeeksData, threeWeeksData, monthData]
    }

    // console.log('[EbolaChartComponent.js][_prepareDataForCharts] The columns are: ', columns)
    // console.log('[EbolaChartComponent.js][_prepareDataForCharts] The rows in line 141 are: ', rows)
    // console.log('[EbolaChartComponent.js][_prepareDataForCharts] The projectionsData is: ', projectionsData)

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
    const {filters: {country}, dataLoading} = this.props.stateDataFromApp

    let chartData
    if (!dataLoading) {
      chartData = this._prepareDataForCharts()
    }

    return (
        <ChartContainer>
          <EbolaChart>
            {
              dataLoading ? <Spinner/> :
                <AxisLabels
                  // xAxis="Time" yAxis="Ebola Cases"
                  // renderTooltip={this._renderTooltip} position="right"
                  >
                  <CustomChart
                    columns={chartData.columns}
                    rows={chartData.rows}
                    projections={chartData.projectionsData}
                    dateStart={this.props.stateDataFromApp.filters.dateRange.from}
                    dateEnd={this.props.stateDataFromApp.filters.dateRange.to}
                    eventReadyCallback={this.props.eventReadyCallback}
                    // projectionFilter={projection}
                    />
                </AxisLabels>
            }
          </EbolaChart>
          <FlexRow>
            <Range
              style={{width: '75%', marginLeft: '80px'}}
              min={0}
              max={68}
              dots
              defaultValue={[this.props.stateDataFromApp.chartRangeSlider.start, this.props.stateDataFromApp.chartRangeSlider.end]}
              tipFormatter={value => `Week ${value}`}
              onChange={this.props.changeChartDateRange}
            />
            <ProjectionToggle toggleProjectionChange={this.props.toggleProjectionChange} status={this.props.stateDataFromApp.filters.projection} />
          </FlexRow>
          <TimespanButtonsWrapper>
            <label>Timespan:</label>
            {/* <Button>1 week</Button> */}
            <Button onClick={() => this.props.timespanChangeHandler('1 month')}>1 month</Button>
            <Button onClick={() => this.props.timespanChangeHandler('3 month')}>3 months</Button>
            <Button onClick={() => this.props.timespanChangeHandler('6 month')}>6 months</Button>
            <Button onClick={() => this.props.timespanChangeHandler('1 year')}>1 year</Button>
            <Button onClick={() => this.props.timespanChangeHandler('max')}>Max</Button>
            {/* <ButtonIcon><SvgIcon icon='Previous' size={20} title="Previous" /></ButtonIcon> */}
            {/* <ButtonIcon><SvgIcon icon='Next' size={20} title="Next" /></ButtonIcon> */}
            <ButtonLink onClick={() => this.props.timespanChangeHandler('max')}>Reset</ButtonLink>
          </TimespanButtonsWrapper>
        </ChartContainer>
    )
  }
}

export default EbolaChartComponent;
