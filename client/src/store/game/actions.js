// @flow

import {
  MOUSE_DOWN,
  MOUSE_UP,
  MOUSE_MOVE,
  SCROLL,
  CELL_SELECTED,
  MOVE_SELECTED_CELL,
  CLEAR_MOVES,
  START_GAME
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

export function cellSelected (ri:number, ci:number) {
  return { type: CELL_SELECTED, ri, ci }
}

export function moveSelectedCell (direction: "up"|"left"|"right"|"down") {
  return { type: MOVE_SELECTED_CELL, direction }
}

export function clearMoves () {
  return { type: CLEAR_MOVES }
}

export function startGame () {
  return { type: START_GAME }
}
