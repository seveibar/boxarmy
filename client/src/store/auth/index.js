import {
  RECEIVED_SESSION_ID,
  SET_NICKNAME
} from './constants'

export default function AuthReducer (state, action) {
  if (state === undefined) return {}
  switch (action.type) {
    case RECEIVED_SESSION_ID:
      return {
        ...state,
        sessionId: action.sessionId,
        nick: action.nick
      }
    case SET_NICKNAME:
      return {
        ...state,
        nick: action.nick
      }
    default:
      return state
  }
}
