// @flow

import boardStateExample from '../../../../game/__tests__/state_example.json'

import {
  MOUSE_DOWN,
  MOUSE_UP,
  MOUSE_MOVE
} from './constants'

const initialState = {
  boardState: boardStateExample,
  playerIndex: 1,
  mouse: { x: 0, y: 0, down: false },
  camera: {
    x: 200, y: 200,
    scale: { x: 3, y: 3 }
  }
}

const GamePageReducer = (state: any, action: any) => {
  if (!state) return initialState
  const { camera, mouse } = state
  switch (action.type) {
    case MOUSE_DOWN:
      return {
        ...state,
        mouse: {
          x: action.x, y: action.y, down: true
        }
      }
    case MOUSE_UP:
      return {
        ...state,
        mouse: {
          x: action.x, y: action.y, down: false
        }
      }
    case MOUSE_MOVE:
      if (!mouse.down) return state
      return {
        ...state,
        camera: {
          ...camera,
          x: camera.x + (mouse.x - action.x) / 2,
          y: camera.y + (mouse.y - action.y) / 2
        },
        mouse: { ...mouse, x: action.x, y: action.y }
      }
    default:
      return initialState
  }
}

export default GamePageReducer
