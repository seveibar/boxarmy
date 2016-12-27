/** @flow */
import express from 'express'
import { Server } from 'http'
import setupAPIRoutes from './routes'
import { start as startClient } from 'generals-client'
import getConfig from './config'
import proxy from 'http-proxy-middleware'
import bodyParser from 'body-parser'

export async function serve (options) {
  console.log('starting generals server')

  const defaultConfig = await getConfig()

  const config = {
    ...defaultConfig,
    ...options
  }

  let app = express()
  let server = Server(app)

  app.use(bodyParser.json())

  server.listen(8080, '0.0.0.0')

  await setupAPIRoutes(app)

  // reverse proxy to client in development mode
  if (config.mode === 'development' && config.proxyClient) {
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
