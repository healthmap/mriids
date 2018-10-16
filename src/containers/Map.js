import React, { Component } from 'react'
import ReactMapGL, {Popup} from 'react-map-gl'
import { ScaleControl } from 'mapbox-gl';

import Container from '../components/styled-components/Container'

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZGFtaWFuc2tvbmVjem55IiwiYSI6ImNqOGs2c3hyNTA5cnMyd254aDZnN3k1ZGwifQ.RaPv0-Oe6bz3PQ9XAkH-Rw'
const MAX_BOUNDS = [
        [-180, -90],
        [180, 90]
    ]

class Map extends Component {
    state = {
        mapStylesLoaded: false,
        viewport: {
            width: 500,
            height: 300,
            latitude: 8.555216,
            longitude: -11.322184,
            zoom: 4,
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
    }

    componentDidMount() {
        window.addEventListener('resize', this._resize);
    }

    render() {
        return (
            <Container innerRef={ (parentElement) => this.parentElement = parentElement}>
            <ReactMapGL
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({viewport})}
                mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            />
            </Container>
        )
    }
}

export default Map