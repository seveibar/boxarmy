// @flow

export type GameType = 'FFA8'|'1v1'
import Game from 'gederals-game'
import moment from 'moment'

export type PlayerInfo = {
  nick: string,
  sessionId: string
}

export const requiredPlayers = {
  'FFA8': 8,
  '1v1': 2
}

export const gameSize = {
  'FFA8': { 'x': 10, 'y': 10 },
  '1v1': { 'x': 6, 'y': 6 }
}

export class GameManager {

  redis:any
  constructor (redis:any) {
    this.redis = redis
  }

  async initializeGame (options: {
    type: GameType,
    gameId: string,
    players: Array<PlayerInfo>
  }) {
    const { redis } = this
    const { type, gameId, players } = options

    // Initialize the game
    let game = new Game()
    game.init({
      size: gameSize[type],
      players: players.map((player) => ({ name: player.nick }))
    })

    const sessionMap = {}
    players.forEach((player, index) => {
      sessionMap[player.sessionId] = index + 1
    })
    let lock = await redis.lock(`game:${gameId}:lock`)
    await redis.set(`game:${gameId}:state`, JSON.stringify(game.getState()))
    await redis.set(`game:${gameId}:sessions`, JSON.stringify(sessionMap))
    await redis.set(`game:${gameId}:start_time`, moment().format())
    await redis.set(`game:${gameId}:last_update_time`, moment().format())
    await lock.unlock()
  }

  async getLatestState (gameId: string) {

  }

}
