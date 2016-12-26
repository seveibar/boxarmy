import { GameManager } from '../src/game'
import { getRedisClient } from '../src/redis'

describe('game management tests', () => {
  let game, redis
  beforeAll(async () => {
    redis = await getRedisClient()
    await redis.flush()
    game = new GameManager(redis)
  })

  const gameId = 'game_01'
  it('should allow game creation', async () => {
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

  it('should progress the game as players request updates', async () => {
    const initialState = await game.getLatestState('game_01')
    await new Promise((resolve) => setTimeout(resolve, 501))
    const nextState = await game.getLatestState('game_01')
    expect(nextState.ticks).toBeGreaterThan(initialState.ticks)
  })

  it('should allow players to add moves', async () => {
    const finalState = await game.addMove('game_01', 1, {
      cell: { x: 0, y: 0 },
      direction: 'down'
    })
    expect(finalState.players[1].moves.length).toBe(1)
  })

  it('should allow players to clear moves', async () => {
    const finalState = await game.clearMoves('game_01', 1)
    expect(finalState.players[1].moves.length).toBe(0)
  })
})
