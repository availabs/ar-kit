// ------------------------------------
// Constants
// ------------------------------------
export const SET_GAME = 'SET_GAME'

// ------------------------------------
// Actions
// ------------------------------------
export function setGameId (value) {
  return {
    type    : SET_GAME,
    payload : value
  }
}

export const actions = {
  setGameId
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_GAME] : (state, action) => {
    var newState = Object.assign({}, state)
    newState.name = action.payload
    return newState
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  name: null,
  status: null
}
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
