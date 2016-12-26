// @flow

import serve from '../src'
import request from 'request-promise'
import { getRedisClient } from '../src/redis'

describe('basic connection and response tests', async () => {
  let server, redis
  const apiURL = 'http://127.0.0.1:3001/api'

  beforeAll(async () => {
    server = await serve()
    redis = await getRedisClient()
  })

  it('main http end point', async () => {
    const response = await request(apiURL)
    expect(response).toEqual('api server')
  })

  it('should be able to get a session id w/ nick', async () => {
    const response = JSON.parse(await request({
      url: `${apiURL}/sessionid`,
      qs: {
        nick: 'player1'
      }
    }))
    expect(response.sessionId).toBeDefined()
    expect(await redis.get(`session:${response.sessionId}:nick`)).toBe('player1')
  })

  it('should be able to get a session id w/o nick', async () => {
    const response = JSON.parse(await request({
      url: `${apiURL}/sessionid`,
    }))
    expect(response.sessionId).toBeDefined()
    expect(await redis.get(`session:${response.sessionId}:nick`)).toContain('Anonymous_')
  })

  let room
  it.only('should be able request a game without a room id', async () => {
    const response = JSON.parse(await request(`${apiURL}/room`))
    const { roomid, state, users, gameid } = response
    expect(roomid).toContain("public_")
    expect(state).toEqual("waiting")
    expect(users).toContain('player1')
    expect(gameid).toBeDefined()

    room = roomid
  })

  it('should be able to request a game with a room id', async () => {

  })

  it('should be able to join a game', async () => {

  })

  it('should be able to get the game state', async () => {

  })

  it('should be able to make moves at the server', async () => {

  })

  afterAll(() => {
    server.close()
    redis.close()
  })

});
