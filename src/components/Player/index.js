import React from 'react'
import { connect } from 'react-redux'
// import { increment, doubleAsync } from 'store/modules/player'
// import './GameContainer.scss'

const playerColors = ['#3D9101', '#F0F0E1', '#E89D0C', '#B51C04', '#451005']

// global variables

class Player extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      record:  this.props.client.record.getRecord(`player/${props.id}`),
      position: [-73.8135831, 42.6762733]
    }
    // this.subscribeToGame = this.subscribeToGame.bind(this)
    // this.loadLevel = this.loadLevel.bind(this)
    this.changePosition = this.changePosition.bind(this)
    this.movePlayer = this.movePlayer.bind(this)
  }

  componentDidMount () {
    // var batWrapper = document.createElement('div')
    // batWrapper.className = 'bat-wrapper'
    // var bat = document.createElement('div')
    // bat.classList.add('bat')
    // bat.classList.add('js-bat')
    // batWrapper.appendChild(bat)
    // var marker = new mapboxgl.Marker(batWrapper).setLngLat(e.lngLat).addTo(map)
    var data = this.state.record.get('pos')
    // console.log('adding player', id, data)
    var color = '#B51C04'
    this.props.map.addSource(this.props.id, {
      'type': 'geojson',
      'data': {
        'type': 'Point',
        'coordinates': [-73.8135831, 42.6762733] // record.get('pos')
      }
    })

    this.state.record.subscribe('pos', value => {
      this.movePlayer(map, value, this.props.id)
    })

    this.props.map.addLayer({
      'id': this.props.id + '-glow',
      'type': 'circle',
      'source': this.props.id,
      'paint': {
        'circle-radius': 40,
        'circle-color': color || '#fff',
        'circle-opacity': 0.3
      }
    })

    this.props.map.addLayer ({
      'id': this.props.id,
      'type': 'symbol',
      'source': this.props.id,
      'layout': {
        'icon-image': 'player_up'
      }
    })
  } 

  componentWillUnmount () {
    this.state.record.unsubscribe()
  }

  changePosition (pos) {
    this.setState({
      position:pos
    })
  }

  movePlayer (map, location, id) {
    // Update the data to a new position based on the animation timestamp. The
    // divisor in the expression `timestamp / 1000` controls the animation speed.
    // console.log('move', location, id)
    this.props.map.getSource(id).setData({
      'type': 'Point',
      'coordinates': location
    })

    // Request the next frame of the animation.
    // requestAnimationFrame(animateMarker);
  }

  getGeoArray (geo) {
    if (geo.location && geo.location.coords &&
      geo.location.coords.latitude && geo.location.coords.longitude) {
      return [+geo.location.coords.longitude.toFixed(4), +geo.location.coords.latitude.toFixed(4)]
    }
    return false
  }

  render () {
    
    return (
      <tr>
        <td style={{ padding: 2}}>
          {this.props.id}
        </td>
      </tr> 
    )
  }
}

const mapStateToProps = (state) => ({
  geo: state.geolocation
})

Player.propTypes = {
  map: React.PropTypes.object,
  gameId: React.PropTypes.string,
  player: React.PropTypes.object,
  geo: React.PropTypes.object,
  level: React.PropTypes.object
}

export default connect(mapStateToProps, {})(Player)
