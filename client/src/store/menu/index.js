// @flow

import {
  MODE_SELECTED,
  GO_TO_MAIN,
  PLAY_SELECTED
} from './constants'

import {
  START_GAME
} from '../game/constants'

const initialState = {
  submenu: 'intro',
  mode: undefined
}

const MenuPageReducer = (state: any, action: any) => {
  if (state === undefined) return initialState
  switch (action.type) {
    case MODE_SELECTED:
      return {
        ...state,
        submenu: 'waiting',
        mode: action.mode
      }
    case PLAY_SELECTED:
      return {
        ...state,
        submenu: 'select-mode'
      }
    case GO_TO_MAIN:
      return {
        ...state,
        submenu: 'intro'
      }
    case START_GAME:
      return {
        ...state,
        submenu: 'in game'
      }
    default:
      return state
  }
}

export default MenuPageReducer
