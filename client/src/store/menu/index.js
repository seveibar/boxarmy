// @flow

import {
  MODE_SELECTED,
  GO_TO_MAIN,
  PLAY_SELECTED
} from './constants'

const initialState = {
  submenu: 'intro',
  mode: undefined
}

const MenuPageReducer = (state: any, action: any) => {
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
    default:
      return initialState
  }
}

export default MenuPageReducer
