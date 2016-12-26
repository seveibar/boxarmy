// @flow

export type GameType = 'FFA8'|'1v1'
import Game from 'gederals-game'
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

export const gameSize = {
  'FFA8': { 'x': 10, 'y': 10 },
  '1v1': { 'x': 6, 'y': 6 }
}

export const gameTypeUpdateTime = {
  'FFA8': 500,
  '1v1': 500
}

export class GameManager {

  resourceManager: ResourceManager
  constructor (redis:any) {
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
      size: gameSize[type],
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
        start_time: moment().format(),
        last_update_time: moment().format()
      }
    })
  }

  async getLatestState (gameId: string) {
    const { resourceManager } = this

    let game
    const finalState = await resourceManager.modifySharedResource(`game:${gameId}`, [
      'type', 'last_update_time', 'state'
    ], async (obj) => {
      const { type, state, last_update_time } = obj
      let lastUpdateTime = moment(last_update_time)
      game = new Game(JSON.parse(state))

      // Update the game if it needs to be updated
      while (moment().diff(lastUpdateTime, 'ms') > gameTypeUpdateTime[type]) {
        lastUpdateTime = lastUpdateTime.add(gameTypeUpdateTime[type], 'ms')
        game.tick()
      }

      return {
        type,
        last_update_time: lastUpdateTime.format(),
        state: JSON.stringify(game.getState())
      }
    })

    return game.getState()
  }

  async addMove (gameId: string, playerIndex: number, move: {
    cell: { x: number, y: number },
    direction: string
  }) {

  }

  async clearMoves (gameId: string, playerIndex: number) {
    // let lock = await redis.lock(`game:${gameId}:lock`)
    // const type = await redis.get(`game:${gameId}:type`)
    // let lastUpdateTime = moment(await redis.get(`game:${gameId}:last_update_time`))
    // const initialGameState = JSON.parse(await redis.get(`game:${gameId}:state`))
    // const game = new Game(initialGameState)
    //
    // // Update the game if it needs to be updated
    // while (moment().diff(lastUpdateTime, 'ms') > gameTypeUpdateTime[type]) {
    //   lastUpdateTime = lastUpdateTime.add(gameTypeUpdateTime[type], 'ms')
    //   game.tick()
    // }
    //
    // await lock.unlock()
  }

}
