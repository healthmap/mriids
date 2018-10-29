import React from 'react'
import { Chart } from 'react-google-charts'

class CustomChart extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return (
      JSON.stringify(nextProps.columns) !== JSON.stringify(this.props.columns) ||
      JSON.stringify(nextProps.rows) !== JSON.stringify(this.props.rows)
    )
  }

  render () {
    var options = {
      isStacked: true,
      hAxis: {
        textStyle: {
          fontSize: 11,
        },
        gridlines: {
          color: '#ececec',
        },
        minorGridlines: {
          color: '#ececec',
        },
      },
      vAxis: {
        textStyle: {
            fontSize: 11,
        },
        gridlines: {
          color: '#ececec',
        },
        minorGridlines: {
          color: '#ececec',
        },
        baselineColor: '#ccc',
      },
      legend: {
        textStyle: {
          fontSize: 11,
        }
      },
      chartArea: {
        left: 80,
        width: '80%',
      },
      // zoomButtonsOrder: ['1-week',
      //   '1-month', '3-months', '6-months', '1-year', 'max'
      // ]
    }

    return (
      <Chart
        chartType="ColumnChart"
        columns={this.props.columns}
        rows={this.props.rows}
        options={options}
        graph_id="ColumnChart"
        width="100%"
        height='100%'
        chartEvents={[
          {
            eventName: 'ready',
            callback: this.props.eventReadyCallback
          }
        ]}
      />
    )
  }
}

export default CustomChart
