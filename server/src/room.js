// @flow

import { GameManager, requiredPlayers } from './game'
import type { GameType, PlayerInfo } from './game'
import { generate as getUniqueID } from 'shortid'
import moment from 'moment'

type SessionId = string

type UserStatus = "waiting"|"in game"

type SessionInfo = {
  status: UserStatus,
  lastPing: ?string,
  gameId: ?string,
  gameType: GameType
}

type SessionMap = {
  [key: SessionId]: SessionInfo
}

export class RoomManager {
  redis:any
  gameManager:any

  constructor (redis: any) {
    this.redis = redis
    this.gameManager = new GameManager(redis)
  }

  /*
   * Called when user requests to change status or game type while in
   * waiting room.
   */
  async setUserStatus (roomid:string, sessionId:string, changeInfo: {
    gameType: ?GameType,
    status: ?UserStatus
  }): Promise<SessionInfo> {
    const { redis } = this
    const { gameType, status } = changeInfo
    let lock = await redis.lock(`room:${roomid}:lock`)
    let sessions: SessionMap = JSON.parse(await redis.get(`room:${roomid}:sessions`)) || {}

    // Create user session if it doesn't already exist
    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        status: 'waiting'
      }
    }

    if (status) {
      sessions[sessionId].status = status
    }
    if (gameType) {
      sessions[sessionId].gameType = gameType
    }

    sessions[sessionId].lastPing = moment().format()
    sessions = await this._updateSessions(sessions)

    await redis.set(`room:${roomid}:sessions`, JSON.stringify(sessions))
    await lock.unlock()
    return sessions[sessionId]
  }

  /*
   * Gets the user status in the waiting room
   */
  async getUserStatus (roomid:string, sessionId:SessionId): Promise<SessionInfo> {
    const { redis } = this
    let lock = await redis.lock(`room:${roomid}:lock`)
    let sessions = JSON.parse(await redis.get(`room:${roomid}:sessions`)) || {}
    if (!sessions[sessionId]) {
      await lock.unlock()
      throw new Error('User has not entered room')
    }
    sessions[sessionId].lastPing = moment().format()
    sessions = await this._updateSessions(sessions)
    await redis.set(`room:${roomid}:sessions`, JSON.stringify(sessions))
    await lock.unlock()
    return sessions[sessionId]
  }

  /*
   * Internally used to update all the users in the waiting room. This is
   * called on any kind of change to the room, e.g. a user leaving.
   */
  async _updateSessions (sessions: SessionMap): SessionMap {
    const { redis, gameManager } = this
    const gameWaitingLists:{
      [key: GameType]: Array<SessionId>
    } = {}

    // Remove any users that haven't pinged in some time
    for (let sessionId in sessions) {
      if (moment().diff(moment(sessions[sessionId].lastPing), 's') > 2) {
        delete sessions[sessionId]
      }
    }

    // Add waiting users to their game waiting lists
    Object.keys(sessions).forEach((sessionId) => {
      const { status, gameType } = sessions[sessionId]
      if (status === 'waiting') {
        gameWaitingLists[gameType] = (gameWaitingLists[gameType] || []).concat([sessionId])
      }
    })

    // Place users with the required number of players into games
    for (let gameType in gameWaitingLists) {
      const waitingList = gameWaitingLists[gameType]
      const nRequiredPlayers = requiredPlayers[gameType]
      if (waitingList.length >= requiredPlayers[gameType]) {
        // Assign players on waiting list to a game
        const assignedPlayers = waitingList.slice(0, nRequiredPlayers)

        // Create player info for game and initialize game
        const playerInfos = await Promise.all(assignedPlayers.map(async (sid) => {
          return {
            sessionId: sid,
            nick: await redis.get(`session:${sid}:nick`)
          }
        }))

        const gameId = getUniqueID()
        await gameManager.initializeGame({
          gameId,
          type: gameType,
          players: playerInfos
        })

        // Mark each player as being in the game
        assignedPlayers.forEach((sid) => {
          sessions[sid].status = 'in game'
          sessions[sid].gameId = gameId
        })
      }
    }
    return sessions
  }
}
