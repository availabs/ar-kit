import React from 'react'
import { connect } from 'react-redux'

// import mapboxgl from 'components/utils/mapbox-gl.js';
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
// import controls from 'components/Controls'
import WorldMap from 'components/WorldMap'
import Settings from 'components/Settings'
import Game from 'components/Game'
import './HomeView.scss'

class HomeView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      map: null
    }
    // this.subscribeToGame = this.subscribeToGame.bind(this)
    this.onMapLoad = this.onMapLoad.bind(this)
    this.renderGame = this.renderGame.bind(this)
  }

  onMapLoad (map) {
    console.log('map loaded')
    this.setState({
      map
    })
    // controls(client, map, this.state.currentPlayer)
    // this.subscribeToGame(map)
  }

  renderGame () {
    if (this.state.map && this.props.player && this.props.game.name){
      return <Game map={this.state.map} currentPlayer={this.props.player} gameId={this.props.game.name}/>
    }
    return <span />
  }

  render () {
    return (
      <div>
        <WorldMap onMapLoad={this.onMapLoad} />
        <div className='reducerView'>
          {this.props.player} <br />
          {this.props.game.name} <br />
          {this.props.game.status}
        </div>
        {this.renderGame()}
        <Settings />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  player : state.player,
  game: state.game
})

export default connect(mapStateToProps, {})(HomeView)
