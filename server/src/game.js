// @flow

export type GameType = 'FFA8'|'1v1'
import Game from 'boxarmy-game-logic'
import moment from 'moment'
import { ResourceManager } from './resourceManager'

export type PlayerInfo = {
  nick: string,
  sessionId: string
}

export const requiredPlayers = {
  'FFA8': 8,
  '1v1': 2
}

export const gameTypeUpdateTime = {
  'FFA8': 500,
  '1v1': 500
}

export class GameManager {

  resourceManager: ResourceManager
  redis: any
  constructor (redis:any) {
    this.redis = redis
    this.resourceManager = new ResourceManager(redis)
  }

  async initializeGame (options: {
    type: GameType,
    gameId: string,
    players: Array<PlayerInfo>
  }) {
    const { resourceManager } = this
    const { type, gameId, players } = options

    // Initialize the game
    let game = new Game()
    game.init({
      type,
      players: players.map((player) => ({ name: player.nick }))
    })

    const sessionMap = {}
    players.forEach((player, index) => {
      sessionMap[player.sessionId] = index + 1
    })

    await resourceManager.modifySharedResource(`game:${gameId}`, [
      'state', 'type', 'sessions', 'start_time', 'last_update_time'
    ], async () => {
      return {
        state: JSON.stringify(game.getState()),
        type,
        sessions: JSON.stringify(sessionMap),
        start_time: moment().format('x'),
        last_update_time: moment().format('x')
      }
    })
  }

  async getLatestState (gameId: string, playerIndex:number) {
    const game = await this.alterGame(gameId, function () {})
    return game.getState()
  }

  async getLatestStateForSession (gameId:string, playerSession:string) {
    const gameSessions = await this.redis.get(`game:${gameId}:sessions`)
    const playerIndex = JSON.parse(gameSessions)[playerSession]
    return await this.getLatestState(gameId, playerIndex)
  }

  async addMoveForSession (gameId:string, sessionId:string, move:any) {
    const gameSessions = await this.redis.get(`game:${gameId}:sessions`)
    const playerIndex = JSON.parse(gameSessions)[sessionId]
    return await this.addMove(gameId, playerIndex, move)
  }

  async addMove (gameId: string, playerIndex: number, move: any) {
    const game = await this.alterGame(gameId, (game) => {
      game.addMove(playerIndex, move)
    })
    return game.getState()
  }

  async clearMovesForSession (gameId:string, sessionId:string) {
    const gameSessions = await this.redis.get(`game:${gameId}:sessions`)
    const playerIndex = JSON.parse(gameSessions)[sessionId]
    return await this.clearMoves(gameId, playerIndex)
  }

  async clearMoves (gameId: string, playerIndex: number) {
    let game = await this.alterGame(gameId, (game) => {
      game.clearMoves(playerIndex)
    })

    return game.getState()
  }

  /*
   * Any time the game state is altered or accessed, every tick that should have
   * happened since the last request should be executed, then if there is an
   * action, it should be applied. This function is a utility method to
   * automatically grab the game state as a shared, locked resource and
   * allow the user to make any necessary modifications after the game is
   * updated.
   */
  async alterGame (gameId: string, modify: Function): Promise<Game> {
    const { resourceManager } = this

    let game
    await resourceManager.modifySharedResource(`game:${gameId}`, [
      'type', 'last_update_time', 'state'
    ], async (obj) => {
      const { type, state, last_update_time } = obj
      let lastUpdateTime = moment(last_update_time, 'x')
      game = new Game(JSON.parse(state))

      // Update the game if it needs to be updated
      while (moment().diff(lastUpdateTime, 'ms') > gameTypeUpdateTime[type]) {
        lastUpdateTime = lastUpdateTime.add(gameTypeUpdateTime[type], 'ms')
        game.tick()
      }

      await modify(game)

      return {
        type,
        last_update_time: lastUpdateTime.format('x'),
        state: JSON.stringify(game.getState())
      }
    })

    return game
  }

}
