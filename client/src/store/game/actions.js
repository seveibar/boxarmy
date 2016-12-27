// @flow

import {
  MOUSE_DOWN,
  MOUSE_UP,
  MOUSE_MOVE,
  SCROLL,
  CELL_SELECTED,
  MOVE_CELL,
  CLEAR_MOVES,
  START_GAME,
  UPDATE_STATE
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

export function moveCell (direction: "up"|"left"|"right"|"down", cell: {ci: number, ri: number}) {
  return { type: MOVE_CELL, direction, cell }
}

export function clearMoves () {
  return { type: CLEAR_MOVES }
}

export function startGame (gameId: string, type: string, playerIndex: number) {
  return { type: START_GAME, gameId, playerIndex }
}

export function updateState (newGameState: any) {
  return { type: UPDATE_STATE, state: newGameState }
}
