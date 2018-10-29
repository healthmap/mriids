import React, { Component } from 'react'
import Spinner from '../../components/Spinner'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import {Range} from 'rc-slider'
import 'rc-slider/assets/index.css';

import CustomChart from '../../components/Chart/CustomChart'
import {
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'

import AxisLabels from '../../components/AxisLabels'
import EbolaChart from '../../components/styled-components/EbolaChart'
import OnOffSwitch from '../../components/styled-components/OnOffSwitch'
import ChartContainer from '../../components/styled-components/ChartContainer'
import Title from '../../components/styled-components/Title'

import ProjectionToggle from '../ProjectionToggle'

const moment = extendMoment(Moment)

class EbolaChartComponent extends Component {

  _prepareDataForCharts = () => {
    // console.log('[EbolaChartComponent.js][_prepareDataForCharts] The state data is coming from App.js is: ', this.props.stateDataFromApp)
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
                // ymin: Number(row['ymin1.aggregated']),
                // ymax: Number(row['ymax1.aggregated']),
              },
              twoWeeks: {
                y: Number(row['y2.aggregated']),
                // ymin: Number(row['ymin2.aggregated']),
                // ymax: Number(row['ymax2.aggregated']),
              },
              month: {
                y: Number(row['y4.aggregated']),
                // ymin: Number(row['ymin4.aggregated']),
                // ymax: Number(row['ymax4.aggregated']),
              }
            }
            // console.log('[EbolaChartComponent][_prepareDataForCharts] state.country is All. nextProjections is: ', nextProjections)
            // console.log('[EbolaChartComponent][_prepareDataForCharts] state.country is All. projectionDate is: ', projectionDate)
            // console.log('[EbolaChartComponent][_prepareDataForCharts] state.country is All. Date range starts on: ', dateRange.from)
            // console.log('[EbolaChartComponent][_prepareDataForCharts] state.country is All. Date range ends on: ', dateRange.to)
          }
        } else {
          rows.push([projectionDate, parseFloat(row.aggregated)])
        }

      })
      // console.log('[EbolaChartComponent][_prepareDataForCharts] At line 91 the rows are: ', rows)
    }

    else {
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
      // console.log('[EbolaChartComponent.js][_prepareDataForCharts] oneWeekData is: ', oneWeekData)
      // console.log('[EbolaChartComponent.js][_prepareDataForCharts] twoWeeksData is: ', twoWeeksData)
      // console.log('[EbolaChartComponent.js][_prepareDataForCharts] monthData is: ', monthData)
      rows[rows.length - 1][2] = rows[rows.length - 1][1]
      rows[rows.length - 1][3] = rows[rows.length - 1][1]
      rows[rows.length - 1][4] = rows[rows.length - 1][1]
      rows = [...rows, oneWeekData, twoWeeksData, monthData]
      // console.log('[EbolaChartComponent.js][_prepareDataForCharts] If projection is true at row 112, the rows are: ', rows)
    }

    // console.log('[EbolaChartComponent.js][_prepareDataForCharts] The columns are: ', columns)
    // console.log('[EbolaChartComponent.js][_prepareDataForCharts] The rows are: ', rows)
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
    const {filters: {country, projection}, dataLoading} = this.props.stateDataFromApp

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
            </Title>
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
                    projectionFilter={projection}/>
                </AxisLabels>
            }
            <ProjectionToggle />
          </EbolaChart>
          <div>
            <Range
              style={{width: '80%', marginTop: '20px', marginLeft: '80px'}}
              min={0}
              max={68}
              defaultValue={[0, 68]}
              tipFormatter={value => `Week ${value}`}
              onChange={this.props.changeChartDateRange}
            />
          </div>
        </ChartContainer>
    )
  }
}

export default EbolaChartComponent;
