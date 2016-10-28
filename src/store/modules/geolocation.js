// ------------------------------------
// Constants
// ------------------------------------
export const SET_GEOLOCATION = 'SET_GEOLOCATION'
export const SET_GEOLOCATION_ERROR = 'SET_GEOLOCATION_ERROR'

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

export function setGeoError (value) {
  console.log('setLocation', value)
  return {
    type    : SET_GEOLOCATION_ERROR,
    payload : value
  }
}

export const actions = {
  setLocation,
  setGeoError
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_GEOLOCATION] : (state, action) => {
    var newState = Object.assign({}, state)
    newState.location = action.payload
    newState.status = { code:0, message: 'OK' }
    // console.log('handle set location', newState, action)
    return newState
  },
  [SET_GEOLOCATION_ERROR] : (state, action) => {
    var newState = Object.assign({}, state)
    newState.status = action.payload
    // console.log('handle set location error', newState, action)
    return newState
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  status: {
    code: 0,
    message: 'loading'
  },
  location: null
}
export default function geolocationReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
