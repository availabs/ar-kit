import { combineReducers } from 'redux'
import locationReducer from 'store/location'
import player from 'store/modules/player'
import game from 'store/modules/game'
import geolocation from 'store/modules/geolocation'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    player,
    game,
    geolocation,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
