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
    const { menu, sessionId, nick } = yield select((state) => ({
      menu: state.menu,
      sessionId: state.auth.sessionId,
      nick: state.auth.nick
    }))
    if (!sessionId) {
      const response = yield call(axios, `${apiURL}/sessionid`, {
        nick
      })
      const { sessionId, nick } = response.data
      yield put(receivedSessionId(sessionId, nick))
    }
  }
}

export function* pollRoomStatus () {
  while (true) {
    const menu = yield select((state) => state.menu)
    if (menu.submenu === 'waiting') {
      // yield call(request,
    }
    yield delay(400)
  }
}

export default function* saga () {
  yield [
    fork(sendSelectionInformation),
    fork(pollRoomStatus)
  ]
}
