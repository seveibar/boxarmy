// @flow

import stateExample from '../../../../game/__tests__/state_example.json'

import {
} from './constants'

const initialState = stateExample

const GamePageReducer = (state: any, action: any) => {
  switch (action.type) {
    default:
      return {
        boardState: initialState,
        playerIndex: 1
      }
  }
}

export default GamePageReducer
