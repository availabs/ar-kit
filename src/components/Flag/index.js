import React from 'react'
import { connect } from 'react-redux'
import './Flag.scss'

const R = 6371000; // Radius of the earth in m
var the_timer = null;

// global variables
class Flag extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      score:0,
      active: false,
      record: props.client.record.getRecord(`flag/${this.props.gameId}/${this.props.id}`),
      timer: null
    }
    // this.subscribeToGame = this.subscribeToGame.bind(this)
    this.createMarker = this.createMarker.bind(this)
    this.updateScore = this.updateScore.bind(this)
    this.reset = this.reset.bind(this)
  }

  createMarker () {
    var markerEl = document.createElement('div')
    var dot = document.createElement('div')
    dot.className = 'flag-dot'
    dot.setAttribute('id', `flag_${this.props.id}`)
    dot.innerHTML = `${this.props.id}`
    var shadow = document.createElement('div')
    shadow.className = 'flag-shadow'
    markerEl.appendChild(dot)
    markerEl.appendChild(shadow)
    var marker = new mapboxgl.Marker(markerEl)
      .setLngLat({lat: this.props.pos[1], lng: this.props.pos[0]})
      .addTo(this.props.map)
  }

  componentDidMount () {
    this.createMarker()
    this.state.record.subscribe('score', score => {
      //console.log(`flag ${this.props.id} score`, score)
      this.updateScore(score)
    })

  }

  componentWillUnmount () {
    clearInterval(the_timer)
    this.state.record.unsubscribe()
  }

  componentWillReceiveProps (nextProps) {
    var nextDistance = this.getDistanceFromLatLonInM(nextProps),
      currentDistance = this.getDistanceFromLatLonInM(this.props)
    
    if (nextDistance < 25 && currentDistance >= 25) {
      console.log('make active')
       document.getElementById(`flag_${this.props.id}`)
        .classList.add('active')

      this.setState({
        timer: 10
      })
       
      the_timer = setInterval(()=> {
        
        if(this.state.timer == 0) {
          this.setState({timer: 10})
          let currentScore = this.state.record.get(`score.${this.props.player.team}.${this.props.player.name}`) || 0
          this.state.record.set(`score.${this.props.player.team}.${this.props.player.name}`, currentScore + 1) 
        } else {
          this.setState({timer: this.state.timer-1}) 
        }

      }, 1000)
        
      
    }

    if (currentDistance < 25 && nextDistance >= 25) {
      console.log('make inactive')
      document.getElementById(`flag_${this.props.id}`)
        .classList.remove('active')
      clearInterval(the_timer)
      this.setState({timer: null})
    }

  }

  updateScore (flagScore) {
    var redScore = flagScore.red ? Object.keys(flagScore.red).reduce((p,n) => { return p + flagScore.red[n]}, 0) : 0;
    var blueScore = flagScore.blue ? Object.keys(flagScore.blue).reduce((p,n) => { return p + flagScore.blue[n]}, 0) : 0;
    this.setState({
      score: redScore - blueScore
    })
  }
  
  reset () {
    this.state.record.set('score', {})
  }

  getDistanceFromLatLonInM(props) {
    var lat1 = props.player_position[0], lon1 = props.player_position[1]
    var lat2 = props.pos[0], lon2 = props.pos[1]
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in m
    return d;
  }

  render () {
    return (
      <tr>
        <td style={{ padding: 2}}>
        Flag  {this.props.id}
        </td>
        <td style={{ padding: 2, color: this.state.score > 0 ? 'red' : 'blue'}} >
          {Math.abs(this.state.score)}
        </td>
        <td style={{ padding: 2}}>
          { this.state.timer }
        </td>
         <td style={{ padding: 2, cursor: 'pointer'}} onClick={ this.reset }>
           reset
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

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
