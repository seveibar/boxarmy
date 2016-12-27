// @flow

import { select, put, call, fork, take } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import axios from 'axios'
import {
  MODE_SELECTED
} from './constants'

const apiURL = 'http://127.0.0.1:3001/api'

export function* sendSelectionInformation () {
  while (true) {
    yield take(MODE_SELECTED)
    const { menu, sessionId } = yield select((state) => ({
      menu: state.menu,
      sessionId: state.sessionId
    }))
    if (!sessionId) {
      const response = yield call(axios, `${apiURL}/sessionid`)
      console.log(response)
    }
    // yield call(request.post, {
    //   url: `${apiURL}/room`,
    //   qs: {
    //
    //   }
    // })
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
    fork(sendSelectionInformation)
    // pollRoomStatus()
  ]
}
