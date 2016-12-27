// @flow

import { select, put, call, fork, take } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import axios from 'axios'
import {
  MODE_SELECTED
} from './constants'
import {
  receivedSessionId
} from '../auth/actions'

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

    console.log(roomInfo)
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
      console.log(response)
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
