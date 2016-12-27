import {
  RECEIVED_SESSION_ID,
  SET_NICKNAME
} from './constants'

export function receivedSessionId (sessionId: string, nick: string) {
  return {
    type: RECEIVED_SESSION_ID,
    sessionId,
    nick
  }
}

export function setNickname (nickname: string) {
  return {
    type: SET_NICKNAME,
    nick: nickname
  }
}
