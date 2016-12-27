// @flow

import serve from '../src'
import request from 'request-promise'
import { getRedisClient } from '../src/redis'

describe('basic connection and response tests', async () => {
  let server, redis
  const apiURL = 'http://127.0.0.1:8080/api'

  beforeAll(async () => {
    server = await serve({
      proxyClient: false
    })
    redis = await getRedisClient()
    await redis.flush()
  })

  it('main http end point', async () => {
    const response = await request(apiURL)
    expect(response).toEqual('api server')
  })

  let sessionid1
  it('should be able to get a session id w/ nick', async () => {
    const response = JSON.parse(await request({
      url: `${apiURL}/sessionid`,
      qs: {
        nick: 'player1'
      }
    }))
    expect(response.sessionId).toBeDefined()
    sessionid1 = response.sessionId
    expect(await redis.get(`session:${response.sessionId}:nick`)).toBe('player1')
  })

  let sessionid2
  it('should be able to get a session id w/o nick', async () => {
    const response = JSON.parse(await request({
      url: `${apiURL}/sessionid`
    }))
    expect(response.sessionId).toBeDefined()
    sessionid2 = response.sessionId
    expect(await redis.get(`session:${response.sessionId}:nick`)).toContain('Anonymous_')
  })

  let room
  it('should be able request a game without a room id', async () => {
    const response = JSON.parse(await request.post({
      url: `${apiURL}/room`,
      qs: {
        gametype: '1v1',
        sessionid: sessionid1
      }
    }))
    const { status } = response
    expect(status).toBe('waiting')
  })

  it('should be able to request a game with a room id', async () => {
    const response = JSON.parse(await request.post({
      url: `${apiURL}/room`,
      qs: {
        gametype: 'FFA8',
        sessionid: sessionid1,
        roomid: 'private_01'
      }
    }))
    const { status } = response
    expect(status).toBe('waiting')
  })

  let gameid
  it('should be able to join a game', async () => {
    const response = JSON.parse(await request.post({
      url: `${apiURL}/room`,
      qs: {
        gametype: '1v1',
        sessionid: sessionid2
      }
    }))
    const { status } = response
    gameid = response.gameId
    expect(status).toBe('in game')
    expect(gameid).toBeDefined()
  })

  it('should be able to get the game state', async () => {
    const response = JSON.parse(await request({
      url: `${apiURL}/game`,
      qs: {
        sessionid: sessionid1,
        gameid
      }
    }))
    expect(response.ticks).toBeDefined()
    expect(response.players).toBeDefined()
    expect(response.cells).toBeDefined()
  })

  it('should be able to make moves', async () => {
    const response = JSON.parse(await request.post({
      url: `${apiURL}/game`,
      qs: {
        type: 'addMove',
        move: {
          cell: { x: 0, y: 0 },
          direction: 'down'
        },
        sessionid: sessionid1,
        gameid
      }
    }))
    expect(response.ticks).toBeDefined()
    expect(response.players).toBeDefined()
    expect(response.players[1].moves).toHaveLength(1)
    expect(response.cells).toBeDefined()
  })

  it('should be able to clear moves', async () => {
    const response = JSON.parse(await request.post({
      url: `${apiURL}/game`,
      qs: {
        sessionid: sessionid1,
        type: 'clearMoves',
        gameid
      }
    }))
    expect(response.ticks).toBeDefined()
    expect(response.players).toBeDefined()
    expect(response.players[1].moves).toHaveLength(0)
    expect(response.cells).toBeDefined()
  })

  afterAll(() => {
    server.close()
    redis.close()
  })
})
