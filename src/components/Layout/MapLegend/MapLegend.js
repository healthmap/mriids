import React from 'react'
import './MapLegend.scss'

function MapLegend(props) {
  return (
    <div className="map-legend-item">
      <div className="map-legend-item-color" key={props.key}
        style={{backgroundColor: props.color}}>
      </div>
      <div className="map-legend-item-value">
        {props.value}
      </div>
    </div>
  )
}

export default MapLegend
