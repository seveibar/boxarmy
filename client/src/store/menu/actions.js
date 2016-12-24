// @flow

import {
  PLAY_SELECTED,
  MODE_SELECTED,
  GO_TO_MAIN,
} from './constants'

export function selectPlay(){
  return { type: PLAY_SELECTED }
}

export function selectMode (mode: "1v1" | "FFA8") {
  return { type: MODE_SELECTED, mode }
}

export function goToMain () {
  return { type: GO_TO_MAIN }
}
