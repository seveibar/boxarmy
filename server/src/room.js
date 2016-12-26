// @flow

import { GameManager, requiredPlayers } from './game'
import type { GameType, PlayerInfo } from './game'
import { generate as getUniqueID } from 'shortid'

type SessionId = string

type UserStatus = "idle"|"waiting"|"in game"

type Sessions = {
  [key: SessionId]: {
    status: UserStatus,
    gameid: ?string,
    gameType: GameType
  }
}

export class RoomManager {
  redis:any
  gameManager:any

  constructor (redis: any) {
    this.redis = redis
    this.gameManager = new GameManager(redis)
  }

  async setUserStatus (roomid:string, sessionId:string, statusInfo: {
    gameType: ?GameType,
    status: ?UserStatus
  }) {
    const { redis } = this
    const { gameType, status } = statusInfo

    let lock = await redis.lock(`room:${roomid}:lock`)
    let sessions = JSON.parse(await redis.get(`room:${roomid}:sessions`)) || {}

    // Create user session if it doesn't already exist
    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        status: 'waiting',
        gameType: gameType
      }
    }

    if (status) {
      sessions[sessionId].status = status
    }
    if (gameType) {
      sessions[sessionId].gameType = gameType
    }

    sessions = await this._updateSessions(sessions)

    await redis.set(`room:${roomid}:sessions`, JSON.stringify(sessions))
    await lock.unlock()
    return sessions[sessionId]
  }

  async getUserStatus (roomid:string, sessionId:SessionId, gameType: ?GameType = null) {
    const { redis } = this
    let lock = await redis.lock(`room:${roomid}:lock`)
    let sessions = JSON.parse(await redis.get(`room:${roomid}:sessions`)) || {}
    if (!sessions[sessionId]) {
      await lock.unlock()
      throw new Error('User has not entered room')
    }
    sessions = await this._updateSessions(sessions)
    await redis.set(`room:${roomid}:sessions`, JSON.stringify(sessions))
    await lock.unlock()
    return sessions[sessionId]
  }

  async _updateSessions (sessions: Sessions): Sessions {
    const { redis, gameManager } = this
    const gameWaitingLists:{
      [key: GameType]: Array<SessionId>
    } = {}

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
          const playerSession = sessions[sid]
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
          sessions[sid].gameid = gameId
        })
      }
    }
    return sessions
  }
}
