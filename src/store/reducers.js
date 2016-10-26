import { combineReducers } from 'redux'
import locationReducer from 'store/location'
import player from 'store/modules/player'
import game from 'store/modules/game'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    player,
    game,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
