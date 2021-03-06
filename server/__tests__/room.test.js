
import { RoomManager } from '../src/room'
import { getRedisClient } from '../src/redis'

describe('room tests', () => {
  let room, redis

  beforeAll(async () => {
    redis = await getRedisClient()
    await redis.flush()
    room = new RoomManager(redis)
  })

  beforeAll(async () => {
    await redis.set('session:user1:nick', 'user1')
    await redis.set('session:user2:nick', 'user2')
  })

  it('should allow first player to join', async () => {
    const userStatus = await room.setUserStatus('room1', 'user1', {
      gameType: '1v1'
    })
    expect(userStatus.status).toEqual('waiting')
    expect(userStatus.gameType).toEqual('1v1')
  })

  it('should allow second player to join and start game', async () => {
    await room.setUserStatus('room1', 'user2', {
      gameType: '1v1'
    })
    const userStatus = await room.getUserStatus('room1', 'user2', '1v1')
    expect(userStatus.gameId).toBeDefined()
    expect(userStatus.status).toBe('in game')
    const gameInfo = await redis.get(`game:${userStatus.gameId}:state`)
    const gameSessions = await redis.get(`game:${userStatus.gameId}:sessions`)
    expect(gameInfo).toBeDefined()
    expect(JSON.parse(gameSessions)).toEqual({
      'user1': 1,
      'user2': 2
    })
  })
})
