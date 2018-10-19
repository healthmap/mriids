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
      displayAnnotations: false,
      showRowNumber: true,
      thickness: 2,
      zoomButtonsOrder: ['1-week',
        '1-month', '3-months', '6-months', '1-year', 'max'
      ],
      displayRangeSelector: true,
      displayZoomButtons: true
    }

    if (projectionFilter) {
      options.displayRangeSelector = false;
      options.displayZoomButtons = false;
    }

    return (
      <Chart
        chartType="ColumnChart"
        columns={this.props.columns}
        rows={this.props.rows}
        options={options}
        graph_id="AnnotationChart"
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