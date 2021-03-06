import React, {Component} from 'react';
import ReactMapGL, { Popup } from 'react-map-gl';
import { ScaleControl } from 'mapbox-gl';
import { guinea, sierraLeone, liberia } from '../assets/countries'

import {ZoomButtons, ZoomButton} from '../components/styled-components/ZoomButtons'
import MarkerStyled from '../components/styled-components/MarkerStyled'

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
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  componentDidUpdate() {
    const map = this.mapRef.getMap()
    const caseCountLayers = {
      "Liberia": {
        geometry: {
          type: "Point",
          coordinates: [-9.3, 5.8],
        },
        properties: {
          title: '(' + this.getCaseCount('Liberia') + ')',
        }
      },
      "Guinea": {
        geometry: {
          type: "Point",
          coordinates: [-11.02, 10.1],
        },
        properties: {
          title: '(' + this.getCaseCount('Guinea') + ')',
        }
      },
      "Sierra Leone": {
        geometry: {
          type: "Point",
          coordinates: [-11.8, 7.9],
        },
        properties: {
          title: '(' + this.getCaseCount('Sierra Leone') + ')',
        }
      }
    }

    // This loads the case counts layer for all 3 countries once the mapbox style is loaded if the showCaseCounts property in MapParent.js is set to true
    if (this.state.mapStylesLoaded && this.props.showCaseCounts) {
      map.addLayer({
        id: "points",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              caseCountLayers['Liberia'], 
              caseCountLayers['Guinea'],
              caseCountLayers['Sierra Leone']
          ]
          }
        },
        layout: {
          'text-field': "{title}",
          'text-font': ["Open Sans Semibold", "Arial Unicode MS Bold"],
          'text-offset': [0, 0],
          'text-anchor': "top",
          'text-size': 12,
          'text-line-height': 0,
          'text-justify': 'center',
          'visibility': 'visible'
        },
        paint: {
          'text-halo-color': 'rgba(255,255,255,1)',
          'text-halo-width': 1,
        }
      });
    } 

    const countries = ['Sierra Leone', 'Liberia', 'Guinea']
    // This adds updates the color layer and case counts for all 3 countries. 
    if (this.state.mapStylesLoaded && this.props.stateDataFromApp.filters.country === "All") {
      countries.forEach((layer) => {
        map.setPaintProperty(layer, 'fill-color', this._resolveColor(layer))
        map.setPaintProperty(layer, 'fill-opacity', 1)
        // This updates and makes the case counts visible if the showCaseCounts property in MapParent.js is set to true
        if (this.state.mapStylesLoaded && this.props.showCaseCounts) {
          map.getSource("points").setData({
            type: "FeatureCollection",
            features: [
              caseCountLayers['Liberia'], 
              caseCountLayers['Guinea'],
              caseCountLayers['Sierra Leone']
            ]
          })
          map.setLayoutProperty('points', 'visibility', 'visible')
          // This makes the case counts invisible if the showCaseCounts property in MapParent.js is set to false
        } else if (this.state.mapStylesLoaded && !this.props.showCaseCounts) {
          map.setLayoutProperty('points', 'visibility', 'none')
        }
      })
      // This updates the color layer and case counts for one country and removes the color and case counts for the other countries.
    } else if (this.state.mapStylesLoaded && this.props.stateDataFromApp.filters.country !== "All") {
      let country = this.props.stateDataFromApp.filters.country
      countries.forEach((layer) => {
        if (layer === country) {
        map.setPaintProperty(layer, 'fill-color', this._resolveColor(layer))
        map.setPaintProperty(layer, 'fill-opacity', 1)
        // This updates and makes the case counts visible if the showCaseCounts property in MapParent.js is set to true
        if (this.state.mapStylesLoaded && this.props.showCaseCounts) {
          map.getSource("points").setData({
            type: "FeatureCollection",
            features: [
              caseCountLayers[layer]
            ]
          })
          map.setLayoutProperty('points', 'visibility', 'visible')
            // This makes the case counts invisible if the showCaseCounts property in MapParent.js is set to false
          } else if (this.state.mapStylesLoaded && !this.props.showCaseCounts) {
            map.setLayoutProperty('points', 'visibility', 'none')
          }
          // This removes the color for the non-selected countries
        } else {
          map.setPaintProperty(layer, 'fill-opacity', 0)
        }
      })
    }
  }

  getCaseCount = (country) => {
    return this.props.data[country]
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
    const {data, scale, colorFunction} = this.props;
    const percentage = data[country] / scale
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

export default Map
