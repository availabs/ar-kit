import React from 'react'
import { connect } from 'react-redux'
import { loadLevel } from 'store/modules/game'
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
      map: null,
      level: null
    }
    // this.subscribeToGame = this.subscribeToGame.bind(this)
    this.onMapLoad = this.onMapLoad.bind(this)
    this.renderGame = this.renderGame.bind(this)
  }

  onMapLoad (map) {
    // console.log('map loaded')
    this.setState({
      map
    })
    // controls(client, map, this.state.currentPlayer)
    // this.subscribeToGame(map)
  }

  // componentWillReceiveProps(nextProps) {

  // }
  renderGame () {
    if (this.state.map && this.props.player && this.props.game.name) {
      if (!this.props.game.level) {
        this.props.loadLevel('level_one')
        return <span />
      }
      return (
        <Game
          map={this.state.map}
          player={this.props.player}
          gameId={this.props.game.name}
          level={this.props.game.level}
        />
      )
    }
    return <span />
  }

  render () {
    return (
      <div>
        <WorldMap onMapLoad={this.onMapLoad} />
        <div className='reducerView'>
          {this.props.player.name} <br />
          {this.props.player.team} <br />
          {this.props.game.name} <br />
          {this.props.game.status}
        </div>
        {this.renderGame()}
        <Settings />
      </div>
    )
  }
}

HomeView.propTypes = {
  player: React.PropTypes.object,
  game: React.PropTypes.object,
  loadLevel: React.PropTypes.func
}

const mapStateToProps = (state) => ({
  player : state.player,
  game: state.game
})

export default connect(mapStateToProps, { loadLevel })(HomeView)
