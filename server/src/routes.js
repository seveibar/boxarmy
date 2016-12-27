// @flow

import { Router } from 'express'
import type { $Application } from 'express'
import { generate as getUniqueID } from 'shortid'

import { RoomManager } from './room'
import { GameManager } from './game'

import { getRedisClient } from './redis'

export default async function setupRoutes (app: $Application) {
  const redis = await getRedisClient()

  const roomManager = new RoomManager(redis)
  const gameManager = new GameManager(redis)

  const router = new Router()

  router.get('/', (req, res) => {
    res.send('api server')
  })

  router.get('/sessionid', async (req, res) => {
    const sessionId = getUniqueID()
    const nick = req.query.nick || `Anonymous_${getUniqueID()}`
    await redis.set(`session:${sessionId}:nick`, nick)
    res.json({ sessionId, nick })
  })

  router.post('/room', async (req, res) => {
    const { sessionid, roomid, gametype, status } = req.query
    // sessionid: string, roomid:string, gametype:string, status:string
    const result = await roomManager.setUserStatus(roomid || 'public', sessionid, {
      status, gameType: gametype
    })
    res.json(result)
  })

  router.get('/room', async (req, res) => {
    const { sessionid, roomid } = req.query
    try {
      const result = await roomManager.getUserStatus(roomid || 'public', sessionid)
      res.json(result)
    } catch (e) {
      res.json({ error: e.toString() })
    }
  })

  router.get('/game', async (req, res) => {
    const { sessionid, gameid } = req.query
    try {
      const result = await gameManager.getLatestStateForSession(gameid, sessionid)
      res.json(result)
    } catch (e) {
      res.json({ error: e.toString() })
    }
  })

  router.post('/game', async (req, res) => {
    const { sessionid, gameid, type } = req.query
    try {
      let result
      if (type === 'addMove') {
        const { move } = req.query
        result = await gameManager.addMoveForSession(gameid, sessionid, move)
      } else if (type === 'clearMoves') {
        result = await gameManager.clearMovesForSession(gameid, sessionid)
      }
      res.json(result)
    } catch (e) {
      res.json({ error: e.toString() })
    }
  })

  app.use('/api', router, (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
      error: err.stack
    })
  })
}
