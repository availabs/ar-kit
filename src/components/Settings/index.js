import React from 'react'
import { connect } from 'react-redux'
import { setPlayer } from 'store/modules/player'
import { setGameId } from 'store/modules/game'
import './Settings.scss'


class Settings extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      playerName:'',
      gameId: '',
      message: '',
      open: true
    }
    this.handleInput = this.handleInput.bind(this)
    this.joinGame = this.joinGame.bind(this)
    this.toggleView = this.toggleView.bind(this)
  }

  componentDidMount (nextProps) {
    console.log('settings mount', this.props.player)
    this.setState({
      playerName: this.props.player,
      gameId: this.props.game.name
    })
  }

  handleInput(e) {
    let newState = {};
    let attr = e.target.getAttribute('id')    
    newState[attr] = e.target.value
    // console.log('testing', newState)
    this.setState(newState)
  }

  joinGame () {
    if(this.state.playerName.length < 3){
      this.setState({
        message: `Invalid Player Name ${this.state.playerName}`
      })
      return
    }
    this.props.setPlayer(this.state.playerName)

    if(this.state.gameId.length < 3) {
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

  render () {
    return (
      <div>
        <div className='optionsModal' style={{display: this.state.open ? 'block' :  'none'}}>
          <div className='container'>
            <div className='row'>
              <div className='col-xs-12'>
                <h1 style={{ textAlign: 'center', color : '#5d5d5d' }}> Capture the Flag <small style={{fontSize: 10}}>alpha 0.0.0</small></h1>
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
  setGameId
}

const mapStateToProps = (state) => ({
  player : state.player,
  game: state.game
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)