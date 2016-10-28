import React from 'react'
import { connect } from 'react-redux'
// import { increment, doubleAsync } from 'store/modules/player'
import controls from 'components/Controls'
// import './GameContainer.scss'

// import deepstream from 'deepstream.io-client-js'
const deepstream = require('deepstream.io-client-js')
const playerColors = ['#3D9101', '#F0F0E1', '#E89D0C', '#B51C04', '#451005']

// global variables
var client = deepstream('lor.availabs.org:6020').login()

class GameContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      players: []
    }
     this.subscribeToGame = this.subscribeToGame.bind(this)
     // this.onMapLoad = this.onMapLoad.bind(this)
  }

  componentDidMount () {
    this.subscribeToGame()
    controls(client, this.props.map, this.props.currentPlayer)
    client.on('connectionStateChanged', function (connectionState) {
      console.log('connectionState', connectionState)
    })
  }

  subscribeToGame () {
    var map = this.props.map
    console.log('subscribeToGame1')
    var currentPlayer = this.props.currentPlayer
    client.record.getList(this.props.gameId).whenReady(gameList => {
      var entries = gameList.getEntries()
      console.log(entries)
      if (!entries.includes(this.props.currentPlayer)) {
        // add entry and remove on unload
        // console.log('add entry: ', currentPlayer)
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
            this.addPlayer(map, player, playerColors[i % 6])
            players.push(player)
          }
        })
        this.setState({
          players
        })
      }, true)
    })
  }

  addPlayer (map, id, color) {
    // var batWrapper = document.createElement('div')
    // batWrapper.className = 'bat-wrapper'
    // var bat = document.createElement('div')
    // bat.classList.add('bat')
    // bat.classList.add('js-bat')
    // batWrapper.appendChild(bat)
    // var marker = new mapboxgl.Marker(batWrapper).setLngLat(e.lngLat).addTo(map)
    var record = client.record.getRecord(`player/${id}`)
    var data = record.get('pos')
    console.log('adding player', id, data)
    map.addSource(id, {
      'type': 'geojson',
      'data': {
        'type': 'Point',
        'coordinates': [-73.8135831, 42.6762733] // record.get('pos')
      }
    })

    record.subscribe('pos', value => {
      this.movePlayer(map, value, id)
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

  movePlayer (map, location, id) {
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

  renderPlayer () {
    return (
      <div className='bat-container pin-bottom'>
        <div className='bat-wrapper'>
          <div className='bat js-bat'>
            <div className='bat-leg-1' />
            <div className='bat-leg-2' />
          </div>
        </div>
        <div className='bat-shadow' />
      </div>
    )
  }
  getGeoArray (geo) {
    if (geo.location && geo.location.coords &&
      geo.location.coords.latitude && geo.location.coords.longitude) {
      console.log('geo success', [geo.location.coords.longitude, geo.location.coords.latitude])
      return [+geo.location.coords.longitude.toFixed(4), +geo.location.coords.latitude.toFixed(4)]
    }
    return false
  }

  render () {
    console.log(this.props.geo)
    return (
      <div>
        <div className='mb-attribution-container pad1x pad0y pin-bottomleft space-bottom1 space-left1 fill-darken1'>
          <h4 style={{ fontSize:24 }}>{this.props.currentPlayer}</h4>
        </div>
        <div className='pad1x pad0y pin-topleft space-top2 space-left1 fill-darken1'>
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
          Status: {this.props.geo.status.message} <br />
          Coords: {this.getGeoArray (this.props.geo) ? JSON.stringify(this.getGeoArray (this.props.geo)) : '...'}

        </div>
        {this.renderPlayer()}
        <div className='compass dot fill-white pad1 pin-topright space-right1'>
          <div className='js-compass compass-dot compass icon' />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  geo: state.geolocation
})

export default connect(mapStateToProps, {})(GameContainer)
