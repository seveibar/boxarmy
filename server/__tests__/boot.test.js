/*
 * These tests are to make sure the menu can handle a reasonable number of
 * requests and not "automatically boot" users.
 */
// @flow

import serve from '../src'
import { range } from 'range'
import request from 'request-promise'
import { sample } from 'lodash'

const apiURL = 'http://127.0.0.1:8080/api'

class User {

  sessionId:string
  status: string
  roomId: string
  inRoom: boolean

  async getSessionId () {
    const response = JSON.parse(await request({
      url: `${apiURL}/sessionid`,
      qs: {
        nick: 'player1'
      }
    }))
    this.sessionId = response.sessionId
  }

  async enterRoom (roomId = 'public') {
    const { sessionId } = this
    this.roomId = roomId
    const response = JSON.parse(await request.post({
      url: `${apiURL}/room`,
      qs: {
        gametype: 'FFA8',
        sessionid: sessionId,
        roomid: roomId
      }
    }))
    this.inRoom = true
    this.status = response.status
  }

  async pollRoom () {
    const { sessionId, roomId } = this
    const response = JSON.parse(await request.post({
      url: `${apiURL}/room`,
      qs: {
        gametype: 'FFA8',
        sessionid: sessionId,
        roomid: roomId
      }
    }))
    this.status = response.status
  }

  isInGame () {
    return this.status === 'in game'
  }

}

function delay (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

describe('boot (from room) tests', () => {
  let server
  beforeAll(async () => {
    server = await serve({
      proxyClient: false
    })
  })

  it('should allow 24 users to connect, poll and be assigned (ordered, fast)', async () => {
    const users = range(26).map(() => new User())
    for (let user of users) {
      await user.getSessionId()
    }
    for (let user of users) {
      await user.enterRoom('room1')
    }
    for (let user of users) {
      await user.pollRoom()
    }
    for (let user of users.slice(0, 24)) {
      expect(await user.isInGame()).toBe(true)
    }
    for (let user of users.slice(24, 26)) {
      expect(await user.isInGame()).toBe(false)
    }
  })

  it('should allow 10 users to connect, poll and be assigned (ordered, slow)', async () => {
    const users = range(10).map(() => new User())
    for (let user of users) {
      await user.getSessionId()
      await delay(50)
    }
    for (let user of users) {
      await user.enterRoom('room2')
      await delay(10 + Math.random() * 50)
    }
    for (let user of users) {
      await user.pollRoom()
      await delay(40 + Math.random() * 60)
    }
    for (let user of users.slice(0, 8)) {
      expect(await user.isInGame()).toBe(true)
    }
    for (let user of users.slice(8, 10)) {
      expect(await user.isInGame()).toBe(false)
    }
  })

  it('should allow 80 users to connect, poll and be assigned (unordered, slow)', async () => {
    const users = range(80).map(() => new User())
    while (users.some((user) => !user.isInGame())) {
      const user = sample(users.filter((user) => !user.isInGame()))
      if (!user.sessionId) {
        user.getSessionId()
      } else if (!user.inRoom) {
        user.enterRoom('room3')
      } else {
        user.pollRoom()
      }
      await delay(10)
    }
    for (let user of users) {
      expect(await user.isInGame()).toBe(true)
    }
  })

  afterAll(() => {
    server.close()
  })
})
