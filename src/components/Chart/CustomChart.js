import React from 'react'
import { Chart } from 'react-google-charts'

class CustomChart extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return (
      JSON.stringify(nextProps.columns) !== JSON.stringify(this.props.columns) ||
      JSON.stringify(nextProps.rows) !== JSON.stringify(this.props.rows) ||
      nextProps.projectionFilter !== this.props.projectionFilter
    )
  }

  render () {
    const {projectionFilter} = this.props;
    var options = {
      isStacked: true
      // zoomButtonsOrder: ['1-week',
      //   '1-month', '3-months', '6-months', '1-year', 'max'
      // ]
    }

    const controls = [
      {
        controlType: 'ChartRangeFilter',
        options: {
          filterColumnIndex: 0,
          ui: {
            chartType: 'LineChart',
            chartOptions: {
              chartArea: { width: '80%', height: '20%' },
              hAxis: { baselineColor: 'none' },
            },
          },
        },
        controlPosition: 'bottom',
        controlWrapperParams: {
          state: {
            range: { start: this.props.dateStart, end: this.props.dateEnd },
          },
        },
      }
    ]

    return (
      <Chart
        chartType="ColumnChart"
        columns={this.props.columns}
        rows={this.props.rows}
        options={options}
        controls={controls}
        graph_id="ColumnChart"
        width="100%"
        height='95%'
        chartEvents={[
          {
            eventName: 'rangechange',
            callback: this.props.eventCallback
        }, {
            eventName: 'ready',
            callback: this.props.eventReadyCallback
        }
          ]}
      />
    )
  }
}

export default CustomChart