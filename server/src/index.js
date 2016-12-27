/** @flow */
import express from 'express'
import { Server } from 'http'
import setupAPIRoutes from './routes'
import { start as startClient } from 'generals-client'
import getConfig from './config'
import proxy from 'http-proxy-middleware'

export async function serve () {
  console.log('starting generals server')
  const config = await getConfig()
  let app = express()
  let server = Server(app)

  server.listen(8080)

  await setupAPIRoutes(app)

  // reverse proxy to client in development mode
  if (config.mode === 'development') {
    startClient()
    app.use('/*', proxy({
      target: 'http://127.0.0.1:3000',
      changeOrigin: true
    }))
  }

  return server
}

export default serve

if (!module.parent) {
  serve()
}
