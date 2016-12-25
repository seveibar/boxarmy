// @flow

import {
  MOUSE_DOWN,
  MOUSE_UP,
  MOUSE_MOVE,
  SCROLL
} from './constants'

export function mouseDown (x:number, y:number) {
  return { type: MOUSE_DOWN, x, y }
}

export function mouseMove (x:number, y:number) {
  return { type: MOUSE_MOVE, x, y }
}

export function mouseUp (x:number, y:number) {
  return { type: MOUSE_UP, x, y }
}

export function scroll (amt: number) {
  return { type: SCROLL, scrollAmount: amt }
}
