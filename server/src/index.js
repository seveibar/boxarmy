/** @flow */
import express from 'express'
import { Server } from 'http'
import setupRoutes from './routes'
import { start as startClient } from 'generals-client'

export async function serve () {
  console.log('starting generals server')
  let app = express()
  let server = Server(app)
  server.listen(3001)

  await setupRoutes(app)

  return server
}

export default serve

if (!module.parent) {
  // serve()
  startClient()
}
