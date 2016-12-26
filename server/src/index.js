/** @flow */
import express from 'express'
import { Server } from 'http'
import setupRoutes from './routes'

export async function serve () {
  let app = express()
  let server = Server(app)
  server.listen(3001)

  await setupRoutes(app)

  return server
}

export default serve

if (!module.parent){
  serve()
}
