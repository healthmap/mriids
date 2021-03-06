import React, {Component} from 'react';
import ReactMapGL from 'react-map-gl';
import { ScaleControl } from 'mapbox-gl';

import {ZoomButtons, ZoomButton} from '../components/styled-components/ZoomButtons'

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY29tcGVwaSIsImEiOiJjam4zaDd0cm4wZWE1M3JsYm8zMnJtcTU2In0.my4lxowcqSdygJmxVgz5sA'
const MAX_BOUNDS = [
  [-180, -90],
  [180, 90]
]

class RiskMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapStylesLoaded: false,
      viewport: {
        width: 500,
        height: 300,
        latitude: 2.450552,
        longitude: 20.799039,
        zoom: 2.75,
        minZoom: 2,
        pitch: 0,
        bearing: 0
      },
      settings: {
        dragPan: true,
        dragRotate: true,
        scrollZoom: true,
        touchZoom: true,
        touchRotate: true,
        keyboard: true,
        doubleClickZoom: true,
      }
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
    const map = this.mapRef.getMap()
    map.on('load', () => {
      map.setMaxBounds(MAX_BOUNDS);
      map.addControl(
        new ScaleControl({
          maxWidth: 150,
          unit: 'imperial'
        }), 'bottom-left'
      );
    })
    map.setStyle('mapbox://styles/compepi/cjnxhx2q84zo12rqom3w1m25i')
    map.on('style.load', () => {
      this.setState({
        mapStylesLoaded: true
      })
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  onHandleChangeZoom = level => () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        zoom: this.state.viewport.zoom + level
      }
    })
  };

  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.parentElement.clientWidth || this.state.viewport.width,
        height: this.parentElement.clientHeight || this.state.viewport.height
      }
    });
  };

  _onViewportChange = viewport => {
    this.setState({
        viewport: {...this.state.viewport, ...viewport}
    })
  };

  render() {
    const {viewport, settings} = this.state;

    return (
      <div className="map" ref={ (parentElement) => this.parentElement = parentElement}>
        <ReactMapGL
          {...viewport}
          {...settings}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          ref={ map => this.mapRef = map }
          onViewportChange={this._onViewportChange}
        />
        <ZoomButtons>
          <ZoomButton disabled={viewport.zoom >= 20} onClick={this.onHandleChangeZoom(1)}>+</ZoomButton>
          <ZoomButton disabled={viewport.zoom <= 2} onClick={this.onHandleChangeZoom(-1)}>-</ZoomButton>
        </ZoomButtons>
      </div>
    );
  }
}

export default RiskMap
