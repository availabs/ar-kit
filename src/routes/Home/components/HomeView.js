import React from 'react'
// import mapboxgl from 'components/utils/mapbox-gl.js';
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import controls from 'components/Controls'
import './HomeView.scss'
// import deepstream from 'deepstream.io-client-js'
const deepstream = require('deepstream.io-client-js')
const playerColors = ['#3D9101', '#F0F0E1', '#E89D0C', '#B51C04', '#451005']

// global variables
var map = null
var client = deepstream('localhost:6020').login()

class HomeView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      currentPlayer: makeid(),
      currentPosition: [-73.8135831, 42.6762733],
      game: 'game1',
      players: []
    }
    this.subscribeToGame = this.subscribeToGame.bind(this)
  }

  subscribeToGame () {
    console.log('subscribeToGame1')
    var currentPlayer = this.state.currentPlayer
    client.record.getList(this.state.game).whenReady(gameList => {
      var entries = gameList.getEntries()
      console.log(entries)
      if (!entries.includes(this.state.currentPlayer)) {
        // add entry and remove on unload
        console.log('add entry: ', currentPlayer)
        gameList.addEntry(currentPlayer)
        // this.addPlayer(name, playerColors[i % 6])\
        window.addEventListener('beforeunload', (event) => {
          gameList.removeEntry(currentPlayer)
          console.log('remove entry: ', currentPlayer)
          gameList.delete()
        }, false)
      }
      gameList.subscribe(entries => {
        console.log('subscribe', entries)
        var playerList = entries.filter(d => d !== currentPlayer)
        var players = this.state.players
        playerList.forEach((player, i) => {
          if (!players.includes(player)) {
            console.log('add player', player)
            this.addPlayer(player, playerColors[i % 6])
            players.push(player)
          }
        })
        this.setState({
          players
        })
      }, true)
    })
  }

  componentDidMount () {
    // client.event.listen('status/.*', (match, isSubcribed, response) => {
    //   console.log('somehting', match, isSubcribed, response)
    //   var name = match.replace('status/', '')
    //   this.addPlayer(name, playerColors[i % 6])
    //   if (isSubcribed) {
    //     response.accept()
    //   }
    //   i++
    // })
    console.log('did mount')
    client.on('connectionStateChanged', function (connectionState) {
      console.log('connectionState', connectionState)
    })

    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtYW4iLCJhIjoiS1ptdnd0VSJ9.19qza-F_vXkgpnh80oZJww'
    map = new mapboxgl.Map({
      container: 'map',
      attributionControl: {
        position: 'top-left'
      },
      style: 'mapbox://styles/saman/ciql4uao1000xbkm7knq5qf52',
      center: [-73.8135831, 42.6762733],
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
      controls(client, map, this.state.currentPlayer)
      this.subscribeToGame()
      // this.addPlayer([42.6762733, -73.8135831], 'player2', 'red')
      // this.addPlayer([-73.8135831, 42.6762733], 'player1')
      // this.addPlayer([42.6762733, -73.8135831], 'player2')
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

  addPlayer (id, color) {
    var record = client.record.getRecord(`player/${id}`)
    record.subscribe('pos', value => {
      this.movePlayer(value, id)
    })
    var data = record.get('pos')
    console.log('adding player', id, data)
    map.addSource(id, {
      'type': 'geojson',
      'data': {
        'type': 'Point',
        'coordinates': [-73.8135831, 42.6762733] // record.get('pos')
      }
    })

    map.addLayer({
      'id': id + '-glow',
      'type': 'circle',
      'source': id,
      'paint': {
        'circle-radius': 40,
        'circle-color': color || '#fff',
        'circle-opacity': 0.9
      }
    })

    map.addLayer({
      'id': id,
      'type': 'symbol',
      'source': id,
      'layout': {
        'icon-image': 'airport-15'
      }
    })
  }

  movePlayer (location, id) {
    // Update the data to a new position based on the animation timestamp. The
    // divisor in the expression `timestamp / 1000` controls the animation speed.
    // console.log('move', location, id)
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
          <h4 style={{ fontSize:24 }}>{this.state.currentPlayer}</h4>
        </div>
        <div className='mb-attribution-container pad1x pad0y pin-topleft space-top2 space-left1 fill-darken1'>
          <h4>Players:</h4>
          <table className='table'>
            <tbody>
              {
                this.state.players.map(d => {
                  return (<tr key={d}><td>{d}</td></tr>)
                })
              }
            </tbody>
          </table>
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

function makeid () {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
