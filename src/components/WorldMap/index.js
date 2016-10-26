/* global mapboxgl */
import React from 'react'
import './WorldMap.scss'
// import mapboxgl from 'components/utils/mapbox-gl.js';
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
// import deepstream from 'deepstream.io-client-js'

// global variables

class WorldMap extends React.Component {

  componentDidMount () {
    mapboxgl.accessToken =
    // 'pk.eyJ1IjoiYW0zMDgxIiwiYSI6IkxzS0FpU0UifQ.rYv6mHCcNd7KKMs7yhY3rw'
    'pk.eyJ1Ijoic2FtYW4iLCJhIjoiS1ptdnd0VSJ9.19qza-F_vXkgpnh80oZJww'
    var map = new mapboxgl.Map({
      container: 'map',
      style:
      // 'mapbox://styles/am3081/cin7zv0c5006lbckv6v8lvtxk',
      'mapbox://styles/saman/ciql4uao1000xbkm7knq5qf52',
      center: [-73.8135831, 42.6762733],
      zoom: 19,
      // bearing: -9.47,
      pitch: 60.00
    })
    map.boxZoom.disable()
    map.dragPan.disable()
    map.doubleClickZoom.disable()
    map.scrollZoom.disable()
    map.keyboard.disable()
    // var test = new TouchZoomRotateHandler()
    console.log('zoom rotate', map.touchZoomRotate.isEnabled())
    // map.touchZoomRotate.disable()

    map.on('load', () => {
      if (this.props.onMapLoad) {
        this.props.onMapLoad(map)
      }

      map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill',
        'minzoom': 15,
        'paint': {
          'fill-color': '#aaa',
          'fill-extrude-height': {
            'type': 'identity',
            'property': 'height'
          },
          'fill-extrude-base': {
            'type': 'identity',
            'property': 'min_height'
          },
          'fill-opacity': 0.6
        }
      })
    })
  }

  render () {
    return (
      <div className='pin-top pin-left map' id='map' />
    )
  }
}

export default WorldMap

