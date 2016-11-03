// ------------------------------------
// Constants
// ------------------------------------
export const SET_PLAYER = 'SET_PLAYER'
export const SET_PLAYER_TEAM = 'SET_PLAYER_TEAM'

// ------------------------------------
// Actions
// ------------------------------------
export function setPlayer (value) {
  return {
    type    : SET_PLAYER,
    payload : value
  }
}

export function setPlayerTeam (value) {
  return {
    type    : SET_PLAYER_TEAM,
    payload : value
  }
}

export const actions = {
  setPlayer,
  setPlayerTeam
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_PLAYER] : (state, action) => {
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('player', action.payload)
    }
    var newState = Object.assign({}, state)
    newState.name = action.payload
    return newState
  },
  [SET_PLAYER_TEAM] : (state, action) => {
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('playerTeam', action.payload)
    }
    var newState = Object.assign({}, state)
    newState.team = action.payload
    return newState
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  name: '',
  team: 'blue'
}
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
