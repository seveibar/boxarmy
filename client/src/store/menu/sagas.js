// @flow

import { select, put, call, fork, take } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { push } from 'react-router-redux'
import axios from 'axios'
import {
  MODE_SELECTED
} from './constants'
import {
  receivedSessionId
} from '../auth/actions'
import {
  goToMain
} from './actions'
import {
  startGame
} from '../game/actions'

const apiURL = '/api'

export function* sendSelectionInformation () {
  while (true) {
    yield take(MODE_SELECTED)
    let { menu, sessionId, nick } = yield select((state) => ({
      menu: state.menu,
      sessionId: state.auth.sessionId,
      nick: state.auth.nick
    }))
    if (!sessionId) {
      const getParams = nick ? `nick=${encodeURIComponent(nick)}` : ''
      const response = yield call(axios, `${apiURL}/sessionid?${getParams}`)
      yield put(receivedSessionId(response.data.sessionId, response.data.nick))
      sessionId = response.data.sessionId
    }

    // tell the room we're ready for a game
    const roomInfo = yield call(axios.post, `${apiURL}/room`, {
      sessionid: sessionId,
      gametype: menu.mode
    })
  }
}

export function* pollRoomStatus () {
  while (true) {
    const { menu, sessionId } = yield select((state) => ({
      menu: state.menu,
      sessionId: state.auth.sessionId
    }))
    if (menu.submenu === 'waiting') {
      let getParams = [
        menu.roomId ? `roomid=${encodeURIComponent(menu.roomId)}` : '',
        `sessionid=${sessionId}`
      ].join('&')
      const response = yield call(axios, `${apiURL}/room?${getParams}`)
      if (response.data.error) {
        yield put(goToMain())
        continue
      }
      const { gameId, gameType, status, playerIndex } = response.data

      if (status === 'in game') {
        yield put(push('/game'))
        yield put(startGame(gameId, gameType, playerIndex))
      }
    }
    yield delay(4000)
  }
}

export default function* saga () {
  yield [
    fork(sendSelectionInformation),
    fork(pollRoomStatus)
  ]
}
