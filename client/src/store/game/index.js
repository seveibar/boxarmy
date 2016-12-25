// @flow

import boardStateExample from '../../../../game/__tests__/state_example.json'

import {
  MOUSE_DOWN,
  MOUSE_UP,
  MOUSE_MOVE,
  SCROLL,
  CELL_SELECTED
} from './constants'

const initialState = {
  boardState: boardStateExample,
  playerIndex: 1,
  mouse: { x: 0, y: 0, down: false },
  camera: {
    x: 0, y: 0,
    scale: { x: 1, y: 1 }
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
      if (Math.abs(action.x - mouse.x) < 2 &&
          Math.abs(action.y - mouse.y) < 2) return state
      return {
        ...state,
        camera: {
          ...camera,
          x: camera.x + (mouse.x - action.x) / 2 / camera.scale.x,
          y: camera.y + (mouse.y - action.y) / 2 / camera.scale.y
        },
        mouse: { ...mouse, x: action.x, y: action.y }
      }
    case SCROLL:
      return {
        ...state,
        camera: {
          ...camera,
          scale: {
            x: Math.max(camera.scale.x + action.scrollAmount * camera.scale.x / 4, 0.1),
            y: Math.max(camera.scale.y + action.scrollAmount * camera.scale.y / 4, 0.1)
          }
        }
      }
    case CELL_SELECTED:
      const {ri, ci} = action
      return {
        ...state,
        selectedCell: { ri, ci }
      }
    default:
      return initialState
  }
}

export default GamePageReducer
