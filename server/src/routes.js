// @flow

import type { $Application } from 'express'
import { Router } from 'express'
import { generate as getUniqueID } from 'shortid'

import { getRedisClient } from './redis'

export default async function setupRoutes (app: $Application) {
  const redis = await getRedisClient()

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

  router.get('/room', async (req, res) => {
    const { sessionid, roomid } = req.query
    if (!sessionid) {
      return res.json({'success': false, 'message': 'must supply session id'})
    }

    if (roomid){
      const lock = await redis.lock(`room:${roomid}:lock`)
      await lock.unlock()
    }else{
      // get the public room

    }
  })

  app.use('/api', router)
}
