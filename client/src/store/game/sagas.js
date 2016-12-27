// @flow

import { select, put, call, fork, take } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { push } from 'react-router-redux'
import axios from 'axios'

import {
  START_GAME,
  MOVE_CELL,
  CLEAR_MOVES,
  UPDATE_STATE
} from './constants'

import {
  updateState
} from './actions'

const apiURL = '/api'

export function* pollForGameState (): Generator<*, *, *> {
  while (true) {
    const { inGame, gameId, sessionId } = yield select((state) => ({
      inGame: state.menu.submenu === 'in game',
      gameId: state.game.gameId,
      sessionId: state.auth.sessionId
    }))
    if (inGame && gameId) {
      const response = yield call(axios, `${apiURL}/game?sessionid=${sessionId}&gameid=${gameId}`)
      yield put(updateState(response.data))
    }
    yield delay(400)
  }
}

export function* sendCellMoves (): Generator<*, *, *> {
  while (true) {
    const { direction, cell } = yield take(MOVE_CELL)
    const move = {
      cell: {x: cell.ci, y: cell.ri},
      direction
    }
    const { gameId, sessionId } = yield select((state) => ({
      gameId: state.game.gameId,
      sessionId: state.auth.sessionId
    }))
    const response = yield call(axios.post, `${apiURL}/game`, {
      move, gameid: gameId, sessionid: sessionId, type: 'addMove'
    })
  }
}

export function* sendClearMoves (): Generator<*, *, *> {
  while (true) {
    yield take(CLEAR_MOVES)
    const { gameId, sessionId } = yield select((state) => ({
      gameId: state.game.gameId,
      sessionId: state.auth.sessionId
    }))
    const response = yield call(axios.post, `${apiURL}/game`, {
      gameid: gameId, sessionid: sessionId, type: 'clearMoves'
    })
  }
}

export default function* saga (): Generator<*, *, *> {
  yield [
    pollForGameState(),
    sendCellMoves(),
    sendClearMoves()
  ]
}
