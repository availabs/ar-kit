// ------------------------------------
// Constants
// ------------------------------------
export const SET_GEOLOCATION = 'SET_GEOLOCATION'

// ------------------------------------
// Actions
// ------------------------------------
export function setLocation (value) {
  console.log('setLocation', value)
  return {
    type    : SET_GEOLOCATION,
    payload : value
  }
}

export const actions = {
  setLocation
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_GEOLOCATION] : (state, action) => {
    var newState = Object.assign({}, state)
    newState.location = action.payload
    console.log('handle set location', newState, action)
    return newState
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  status: 'loading',
  location: null
}
export default function geolocationReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
