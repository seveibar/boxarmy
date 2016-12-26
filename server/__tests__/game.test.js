import { GameManager } from '../src/game'
import { getRedisClient } from '../src/redis'

describe('game management tests', () => {

  let game, redis
  beforeAll(async () => {
    redis = await getRedisClient()
    await redis.flush()
    game = new GameManager(redis)
  })

  it('should allow game creation', async () => {
    const gameId = 'game_01'
    await game.initializeGame({
      gameId,
      type: '1v1',
      players: [{
        nick: 'nick1',
        sessionId: 'user1'
      }, {
        nick: 'nick2',
        sessionId: 'user2'
      }]
    })
    expect(await redis.get(`game:${gameId}:state`)).toBeDefined()
    expect(JSON.parse(await redis.get(`game:${gameId}:sessions`))).toEqual({
      'user1': 1,
      'user2': 2
    })
  })

})
