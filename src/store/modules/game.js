// ------------------------------------
// Constants
// ------------------------------------
export const SET_GAME = 'SET_GAME'
export const LOAD_LEVEL = 'LOAD_LEVEL'

// ------------------------------------
// Actions
// ------------------------------------
export function setGameId (value) {
  return {
    type    : SET_GAME,
    payload : value
  }
}

export function receiveLevel (value) {
  return {
    type    : LOAD_LEVEL,
    payload : value
  }
}

export const loadLevel = (levelName) => {
  return (dispatch) => {
    console.log(`/levels/${levelName}.json`)
    return fetch(`/levels/${levelName}.json`)
      .then(response => response.json())
      .then(json => {
        console.log('load level', json)
        return dispatch(receiveLevel(json))
      })
  }
}

export const actions = {
  setGameId,
  loadLevel
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_GAME] : (state, action) => {
    var newState = Object.assign({}, state)
    newState.name = action.payload
    return newState
  },
  [LOAD_LEVEL] : (state, action) => {
    var newState = Object.assign({}, state)
    newState.level = action.payload
    return newState
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  name: 'game1',
  status: null,
  level: null
}
export default function gameReducer (state = initialState, action) {
  console.log('action', action)
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
