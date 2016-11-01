import React from 'react'
import { connect } from 'react-redux'
// import { increment, doubleAsync } from 'store/modules/player'
import './Flag.scss'


// global variables
class Flag extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      score:0
    }
    // this.subscribeToGame = this.subscribeToGame.bind(this)
    this.createMarker = this.createMarker.bind(this)
  }

  createMarker () {
    var markerEl = document.createElement('div')
    var dot = document.createElement('div')
    dot.className = 'flag-dot'
    var shadow = document.createElement('div')
    shadow.className = 'flag-shadow'
    markerEl.appendChild(dot)
    markerEl.appendChild(shadow)
    var marker = new mapboxgl.Marker(markerEl)
      .setLngLat({lat: this.props.lat, lng: this.props.lng})
      .addTo(this.props.map)
  }

  componentDidMount () {
    this.createMarker()
  }

  render () {
    return (
      <tr>
        <td style={{ padding: 2}}>
        </td>
        <td style={{ padding: 2}}>
        Flag  {this.props.id}
        </td>
        <td style={{ padding: 2}}>
          {this.state.score}
        </td>
      </tr> 
    )
  }
}

const mapStateToProps = (state) => ({
  geo: state.geolocation
})

Flag.propTypes = {
  map: React.PropTypes.object,
  gameId: React.PropTypes.string
}

export default connect(mapStateToProps, {})(Flag)
