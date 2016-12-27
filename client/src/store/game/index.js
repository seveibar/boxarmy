// @flow

import boardStateExample from '../../../../game/__tests__/state_example.json'

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

import lodash from 'lodash'

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
  const { boardState, playerIndex, camera, mouse, selectedCell } = state
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
    case MOVE_CELL:

      if (!selectedCell) return state

      const { direction, cell } = action
      let newPlayers = [...boardState.players]
      const myPlayer = lodash.cloneDeep(newPlayers[playerIndex])

      // If the last move is on the same cell, just change it
      const lastMove = myPlayer.moves.length > 0
                          ? myPlayer.moves[myPlayer.moves.length - 1]
                          : null
      if (lastMove &&
          lastMove.cell.x === cell.ci &&
          lastMove.cell.y === cell.ri) {
        lastMove.direction = direction
      } else {
        myPlayer.moves.push({
          cell: { x: cell.ci, y: cell.ri },
          direction
        })
      }
      newPlayers[playerIndex] = myPlayer

      const rdiff = (direction === 'up' && -1) || (direction === 'down' && 1) || 0
      const cdiff = (direction === 'right' && 1) || (direction === 'left' && -1) || 0

      return {
        ...state,
        selectedCell: {
          ri: Math.min(Math.max(cell.ri + rdiff, 0), boardState.size.y - 1),
          ci: Math.min(Math.max(cell.ci + cdiff, 0), boardState.size.x - 1)
        },
        boardState: {
          ...boardState,
          players: newPlayers
        }
      }
    case CLEAR_MOVES:
      let playersCopy = [...boardState.players]
      playersCopy[playerIndex] = lodash.cloneDeep(boardState.players[playerIndex])
      playersCopy[playerIndex].moves = []
      return {
        ...state,
        boardState: {
          ...boardState,
          players: playersCopy
        }
      }
    case START_GAME:
      return {
        ...state,
        gameId: action.gameId,
        gameType: action.gameType,
        playerIndex: action.playerIndex
      }
    case UPDATE_STATE:
      return {
        ...state,
        boardState: action.state
      }
    default:
      return initialState
  }
}

export default GamePageReducer
