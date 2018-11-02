import React, {Component} from 'react';
import ReactMapGL, { Popup } from 'react-map-gl';
import { ScaleControl } from 'mapbox-gl';
import { guinea, sierraLeone, liberia } from '../assets/countries'

import Button from '../components/styled-components/Button'
import ZoomButtons from '../components/styled-components/ZoomButtons'
import MarkerStyled from '../components/styled-components/MarkerStyled'

import MapToggle from './MapToggle/MapToggle';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY29tcGVwaSIsImEiOiJjam4zaDd0cm4wZWE1M3JsYm8zMnJtcTU2In0.my4lxowcqSdygJmxVgz5sA'
const MAX_BOUNDS = [
  [-180, -90],
  [180, 90]
]
class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapStylesLoaded: false,
      viewport: {
        width: 500,
        height: 300,
        latitude: 8.555216,
        longitude: -11.322184,
        zoom: 5,
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
      map.addSource('sierra', {
        type: 'geojson',
        data: sierraLeone
      });
      map.addSource('guinea', {
        type: 'geojson',
        data: guinea
      });
      map.addSource('liberia', {
        type: 'geojson',
        data: liberia
      });
      map.addLayer({
        id: 'Sierra Leone',
        source: 'sierra',
        type: 'fill',
        paint: {
          "fill-color": this._resolveColor('Sierra Leone'),
          "fill-outline-color": 'black',
          "fill-opacity": 1
        }
      });
      map.addLayer({
        id: 'Guinea',
        source: 'guinea',
        type: 'fill',
        paint: {
          "fill-color": this._resolveColor('Guinea'),
          "fill-outline-color": 'black',
          "fill-opacity": 1
        }
      });
      map.addLayer({
        id: 'Liberia',
        source: 'liberia',
        type: 'fill',
        paint: {
          "fill-color": this._resolveColor('Liberia'),
          "fill-outline-color": 'black',
          "fill-opacity": 1
        }
      });
    })
    map.setStyle('mapbox://styles/compepi/cjnxgpr991b6h2rpcvqmh5j4f')
    map.on('style.load', () => {
      this.setState({
        mapStylesLoaded: true
      })
    })
    // console.log("[Map.js][componentDidMount()] Before updating the style, the map is: ", map)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  componentDidUpdate() {
    const map = this.mapRef.getMap()
    const countries = ['Sierra Leone', 'Liberia', 'Guinea']
    if (this.state.mapStylesLoaded && this.props.stateDataFromApp.filters.country === "All") {
      countries.forEach((layer) => {
        map.setPaintProperty(layer, 'fill-color', this._resolveColor(layer))
        map.setPaintProperty(layer, 'fill-opacity', 1)
      })
    } else if (this.state.mapStylesLoaded && this.props.stateDataFromApp.filters.country !== "All") {
      let country = this.props.stateDataFromApp.filters.country
      countries.forEach((layer) => {
        if (layer === country) {
        map.setPaintProperty(layer, 'fill-color', this._resolveColor(layer))
        map.setPaintProperty(layer, 'fill-opacity', 1)
        } else {
          map.setPaintProperty(layer, 'fill-opacity', 0)
        }
      })
    }
  }


  onHandleChangeZoom = level => () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        zoom: this.state.viewport.zoom + level
      }
    })
  };

  _resolveColor = (country) => {
    // console.log("[Map.js][_resolveColor] The country data is: ", country)
    const {data, scale, colorFunction} = this.props;
    // console.log('[Map.js][_resolveColor] The data coming from props is: ', data)
    const percentage = data[country] / scale
    // console.log("[Map.js][_resolveColor] The percentage for this country is: ", percentage)
    // colorFunction refers to the _resolveColor function in MapParent.js
    return colorFunction(percentage)
  }

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

  _renderMarkerWithPopup(item, i) {
    const {geometry: {coordinates}, properties: {alertId}} = item;
    return (
      [<MarkerStyled key={`random-marker-${i}`} longitude={parseInt(coordinates[0], 10)} latitude={parseInt(coordinates[1], 10)} >
        <div className="station"><span>{alertId}</span></div>
      </MarkerStyled>,
        <Popup key={`random-popup-${i}`} latitude={parseInt(coordinates[1], 10)} longitude={parseInt(coordinates[0], 10)} closeButton={false} closeOnClick={true} anchor="top">
          <div>You are here</div>
        </Popup>]
    );
  }

  render() {
    const {viewport, settings} = this.state;

    return (
      <div className="map" ref={ (parentElement) => this.parentElement = parentElement}>
        <MapToggle changeMapView={this.props.changeMapView} />
        <ReactMapGL
          {...viewport}
          {...settings}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          ref={ map => this.mapRef = map }
          onViewportChange={this._onViewportChange}
        />
        <ZoomButtons>
          <Button disabled={viewport.zoom >= 20} onClick={this.onHandleChangeZoom(1)}>+</Button>
          <Button disabled={viewport.zoom <= 2} onClick={this.onHandleChangeZoom(-1)}>-</Button>
        </ZoomButtons>
      </div>
    );
  }
}

export default Map
