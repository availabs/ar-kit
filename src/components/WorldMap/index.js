/* global mapboxgl */
import React from 'react'
import { connect } from 'react-redux'
import { setLocation } from 'store/modules/geolocation'
import './WorldMap.scss'
// import mapboxgl from 'components/utils/mapbox-gl.js';
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
// import deepstream from 'deepstream.io-client-js'

// global variables
var map

class WorldMap extends React.Component {

  componentDidMount () {
    // ========================================================
    // Geolocation Instantiation
    // ========================================================
    navigator.geolocation.watchPosition(
      this.props.setLocation,
      (error) => {
        console.log('geolocation error', error)
      },
      {
        enableHighAccuracy: true,
        maximumAge        : 3000,
        timeout           : 2000
      }

    )
    var center = this.getGeoArray(this.props.geo) || [0,0]
    mapboxgl.accessToken =
    // 'pk.eyJ1IjoiYW0zMDgxIiwiYSI6IkxzS0FpU0UifQ.rYv6mHCcNd7KKMs7yhY3rw'
    'pk.eyJ1Ijoic2FtYW4iLCJhIjoiS1ptdnd0VSJ9.19qza-F_vXkgpnh80oZJww'
    map = new mapboxgl.Map({
      container: 'map',
      style:
      // 'mapbox://styles/am3081/cin7zv0c5006lbckv6v8lvtxk',
      'mapbox://styles/saman/ciql4uao1000xbkm7knq5qf52',
      center: [0,0],
      zoom: 19,
      // minZoom: 19,
      // maxZoom: 19,
      // bearing: -9.47,
      pitch: 60.00
    })
    map.boxZoom.disable()
    map.dragPan.disable()
    map.doubleClickZoom.disable()
    map.scrollZoom.disable()
    map.keyboard.disable()
    map.touchZoomRotate.disable()
    var prev = null

    // ----------------------------------------
    // -- mobile rotate , no zoom, no drag
    map.on('touchmove', e => {
      var currentbearing = map.getBearing()
      if (prev) {
        map.setBearing(currentbearing + (prev - e.points[0].x))
      }
      prev = e.points[0].x
    })
    map.on('touchend', e => { prev = null })
    // ----------------------------------------

    map.on('load', () => {
      if (this.props.onMapLoad) {
        this.props.onMapLoad(map)
      }
      // map.setMinZoom(19)
      // map.setMaxZoom(19)
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

  getGeoArray(geo) {
    console.log('getGeoArray', location)
    if (geo.location && geo.location.coords &&
      geo.location.coords.latitude && geo.location.coords.longitude) {
      console.log('geo success', [geo.location.coords.longitude, geo.location.coords.latitude])
      return [geo.location.coords.longitude, geo.location.coords.latitude]
    }
    return false
    
  }
  componentWillReceiveProps (nextProps) {
    console.log('map props', nextProps.geo)
    var center = this.getGeoArray(nextProps.geo)
    if (center && map) {
      map.setCenter(center)
    }
  }

  render () {
    return (
      <div className='pin-top pin-left map' id='map' />
    )
  }
}

const mapStateToProps = (state) => ({
  geo: state.geolocation
})

export default connect(mapStateToProps, { setLocation })(WorldMap)
