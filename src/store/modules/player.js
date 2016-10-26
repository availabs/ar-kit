// ------------------------------------
// Constants
// ------------------------------------
export const SET_PLAYER = 'SET_PLAYER'

// ------------------------------------
// Actions
// ------------------------------------
export function setPlayer (value) {
  return {
    type    : SET_PLAYER,
    payload : value
  }
}

export const actions = {
  setPlayer
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_PLAYER] : (state, action) => {
    return action.payload
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
