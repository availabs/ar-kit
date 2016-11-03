import React from 'react'
import { connect } from 'react-redux'
import { setPlayer, setPlayerTeam } from 'store/modules/player'
import { setGameId } from 'store/modules/game'
import './Settings.scss'

class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      playerName:'',
      playerTeam:'blue',
      gameId: '',
      message: '',
      open: true
    }
    this.handleInput = this.handleInput.bind(this)
    this.joinGame = this.joinGame.bind(this)
    this.toggleView = this.toggleView.bind(this)
    this.setTeam = this.setTeam.bind(this)
    this.isActiveTeam = this.isActiveTeam.bind(this)
  }

  componentDidMount (nextProps) {
    console.log('settings mount', this.props.player.name)
    this.setState({
      playerName: this.props.player.name,
      playerTeam: this.props.player.team,
      gameId: this.props.game.name
    })
  }

  handleInput (e) {
    let newState = {}
    let attr = e.target.getAttribute('id')
    newState[attr] = e.target.value
    this.setState(newState)
  }

  setTeam (team) {
    this.setState({
      playerTeam: team
    })
  }

  joinGame () {
    if (this.state.playerName.length < 3) {
      this.setState({
        message: `Invalid Player Name ${this.state.playerName}`
      })
      return
    }
    this.props.setPlayer(this.state.playerName)
    this.props.setPlayerTeam(this.state.playerTeam)

    if (this.state.gameId.length < 3) {
      this.setState({
        message: `Invalid Game Id ${this.state.gameId}`
      })
      return
    }

    if(this.state.gameId !== this.props.game.name) {
      this.props.setGameId(this.state.gameId)
    }

    this.setState({
      open: false,
      message: ''
    })
  }

  toggleView () {
    this.setState({
      open: !this.state.open
    })
  }

  isActiveTeam (color) {
    return color === this.state.playerTeam ? 'active' : null
  }

  render () {
    return (
      <div>
        <div className='optionsModal' style={{ display: this.state.open ? 'block' : 'none' }}>
          <div className='container'>
            <div className='row'>
              <div className='col-xs-12'>
                <h1 style={{ textAlign: 'center', color : '#5d5d5d' }}>
                  Capture the Flag
                  <small style={{ fontSize: 10 }}>
                    alpha 0.0.0
                  </small>
                </h1>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-11'>
                <div className='md-form'>
                  <input type='text' id='playerName' className='form-control see-through'
                    placeholder='Call Sign'
                    value={this.state.playerName}
                    onChange={this.handleInput}
                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-11'>
                <div className='md-form'>
                  <input type='text' id='gameId' className='form-control see-through'
                    placeholder='Game Id'
                    value={this.state.gameId}
                    onChange={this.handleInput}
                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12' style={{paddingBottom: 10}}>
                <div className='btn-group btn-block' data-toggle='buttons'>
                  <label className={`btn col-xs-6 btn-primary btn ${this.isActiveTeam('blue')}`}
                    onClick={ this.setTeam.bind(null, 'blue') }
                  >
                    <input type='radio' name='options' id='option1' checked />
                    Blue Team
                  </label>
                  <label className={`btn col-xs-6 btn-danger btn ${this.isActiveTeam('red')}`}
                    style={{ style : this.isActiveTeam('red') ?  'border 2px black' : '' }}
                    onClick={ this.setTeam.bind(null, 'red') }
                  >
                    <input type='radio' name='options' id='option3' />
                    Red Team
                  </label>
                  <br />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12'>
                <button
                  type='button'
                  className='btn btn-primary btn-lg btn-block'
                  onClick={this.joinGame}
                >
                  Join Game
                </button>
              </div>
            </div>
            
          </div>
        </div>
        <div className='optionsButton btn btn-floating btn-action share-toggle btn-ptc' onClick={this.toggleView}>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  setPlayer,
  setGameId,
  setPlayerTeam
}

const mapStateToProps = (state) => ({
  player : state.player,
  game: state.game
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)