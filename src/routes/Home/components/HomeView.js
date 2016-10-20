import React from 'react'
// import mapboxgl from 'components/utils/mapbox-gl.js';
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import './HomeView.scss'
// import deepstream from 'deepstream.io-client-js'
const deepstream = require('deepstream.io-client-js')

//global variables
var map = null
var client = deepstream('localhost:6020').login()

class HomeView extends React.Component {
  constructor (props) {
    super(props)
    this.state = { 
      currentPlayer: makeid(),
      currentPosition: [ -73.8135831, 42.6762733]
    }
  }

  connect () {
    client.record.getRecord(`player/${this.state.currentPlayer}`).whenReady(record => {
      record.set({
        name: this.state.currentPlayer,
        pos: this.state.currentPosition,
        bearing: -9.47
      })
      // Interact with the record here
      var marker
      var delta = 100

      function easeTo (t) {
        if (marker && t === 1) marker.remove()
        return t * (2 - t)
      }

      function move (pos, bearing) {
        // console.log(pos, bearing)
        if (bearing) {
          map.easeTo({
            bearing: pos,
            easing: easeTo
          })
        } else {
          map.panBy(pos, {
            easing: easeTo
          })
        }
        console.log([map.getCenter().lng, map.getCenter().lat])
        record.set(
          'pos', [map.getCenter().lng, map.getCenter().lat]
        )
      }

      function goDirection (dir) {
        switch (dir) {
          case 'left':
            move(map.getBearing() - 25, true)
            break
          case 'right':
            move(map.getBearing() + 25, true)
            break
          case 'up':
            move([0, -delta])
            break
          case 'down':
            move([0, delta])
            break
        }
      }

      window.addEventListener('keydown', function (e) {
        switch (e.which) {
          case 38: // up
            goDirection('up')
            break
          case 40: // down
            goDirection('down')
            break
          case 37: // left
            goDirection('left')
            break
          case 39: // right
            goDirection('right')
            break
        }
      }, true)

      var compass = document.querySelector('.js-compass')
      map.on('rotate', function () {
        var rotate = 'rotate(' + (map.transform.angle * (180 / Math.PI)) + 'deg)'
        compass.style.transform = rotate
      })

      var buttonLeft = ['left', document.querySelector('.js-left')]
      var buttonRight = ['right', document.querySelector('.js-right')]
      var buttonTop = ['up', document.querySelector('.js-up')]
      var buttonBottom = ['down', document.querySelector('.js-down')]

      var buttons = [buttonLeft, buttonRight, buttonTop, buttonBottom]
      var persist

      function buttonStart (b) {
        persist = setInterval(function () {
          goDirection(b[0])
        }, 20)
      }

      function buttonEnd () {
        clearInterval(persist)
      }

      buttons.forEach(function (b) {
        b[1].addEventListener('mousedown', buttonStart.bind(this, b))
        b[1].addEventListener('touchstart', buttonStart.bind(this, b))
        b[1].addEventListener('mouseup', buttonEnd.bind(this, b))
        b[1].addEventListener('touchend', buttonEnd.bind(this, b))
      })

      function createMarker (e) {
        var markerEl = document.createElement('div')
        var dot = document.createElement('div')
        dot.className = 'waypoint-dot'
        var shadow = document.createElement('div')
        shadow.className = 'waypoint-shadow'
        markerEl.appendChild(dot)
        markerEl.appendChild(shadow)
        marker = new mapboxgl.Marker(markerEl).setLngLat(e.lngLat).addTo(map)

        window.setTimeout(function () {
          map.flyTo({
            center: e.lngLat,
            easing: easeTo
          })
        }, 500)
      }

      map.on('click', createMarker)
      map.on('touchstart', createMarker)
    })
  }

  componentDidMount () {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtYW4iLCJhIjoiS1ptdnd0VSJ9.19qza-F_vXkgpnh80oZJww'
    map = new mapboxgl.Map({
      container: 'map',
      attributionControl: {
        position: 'top-left'
      },
      style: 'mapbox://styles/saman/ciql4uao1000xbkm7knq5qf52',
      center: [ -73.8135831, 42.6762733],
      zoom: 24,
      bearing: -9.47,
      pitch: 90.00
    })
    map.boxZoom.disable()
    map.dragPan.disable()
    map.doubleClickZoom.disable()
    map.scrollZoom.disable()
    map.keyboard.disable()
    map.touchZoomRotate.disable()

    map.on('load', () => {
      this.connect()
      this.addPlayer([-73.8135831, 42.6762733], 'player1')
      //this.addPlayer([42.6762733, -73.8135831], 'player2')
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

  addPlayer (location, id) {
    var i = 0;
    map.addSource(id, {
      'type': 'geojson',
      'data': {
        'type': 'Point',
        'coordinates': location
      }
    })

    map.addLayer({
      'id': id,
      'source': id,
      'type': 'circle',
      'paint': {
        'circle-radius': 40,
        'circle-color': '#007cbf'
      }
    })
    window.setInterval(() => {
      i++
      // console.log('')
      location[i % 2] += 0.00008
      this.movePlayer(location, id)
    }, 1000)
  }

  movePlayer (location, id) {
    // Update the data to a new position based on the animation timestamp. The
    // divisor in the expression `timestamp / 1000` controls the animation speed.
    map.getSource(id).setData({
      'type': 'Point',
      'coordinates': location
    })

    // Request the next frame of the animation.
    // requestAnimationFrame(animateMarker);
  }

  render () {
    return (
      <div>
        <div className='pin-top pin-left map' id='map' />
        <div className='mb-attribution-container pad1x pad0y pin-bottomleft space-bottom1 space-left1 fill-darken1'>
          <h4 style={{fontSize:24 }}>{this.state.currentPlayer}</h4>
        </div>
        <div className='pin-top pin-left fade' />
        <div className='bat-container pin-bottom'>
          <div className='bat-wrapper'>
            <div className='bat js-bat'>
              <div className='bat-leg-1' />
              <div className='bat-leg-2' />
            </div>
          </div>
          <div className='bat-shadow' />
        </div>
        <div className='buttons pin-bottomright space-right1 space-bottom1'>
          <button className='fl quiet round-left button icon caret-left js-left' />
          <button className='fl quiet round-top button icon caret-up pin-bottom button-up js-up' />
          <button className='fl quiet unround button icon caret-down js-down' />
          <button className='fl quiet round-right button icon caret-right js-right' />
        </div>
        <div className='compass dot fill-white pad1 pin-topright space-right1'>
          <div className='js-compass compass-dot compass icon' />
        </div>
      </div>
    )
  }

}

export default HomeView

function makeid()
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
