// @flow

import { createClient } from 'redis'
import Redlock from 'redlock'

const { REDIS_HOST } = process.env

export async function getRedisClient () {
  if (!REDIS_HOST) return await getFakeRedisClient()

  const client = createClient(REDIS_HOST)

  const redlock = new Redlock([client], {
    driftFactor: 0.01,
    retryCount: 4,
    retryDelay: 200
  })

  return {
    get: async (key:string) => {
      return new Promise((resolve, reject) => {
        client.get(key, (err, result) => {
          if (err) return reject(err)
          resolve(result)
        })
      })
    },
    flush: async () => {
      return new Promise((resolve, reject) => {
        client.flushdb((err, success) => {
          if (err) return reject(err)
          resolve()
        })
      })
    },
    lock: async (key:string) => {
      return await redlock.lock(key, 200)
    },
    set: async (key:string, value:string) => {
      client.set(key, value)
    },
    close: async () => {
      client.quit()
    }
  }
}

let fakeClient
export async function getFakeRedisClient () {
  if (fakeClient) return fakeClient
  console.log(`using fake redis client\nset REDIS_HOST to use real redis client and persist data`)
  let store = {}
  fakeClient = {
    get: async (key:string) => {
      return store[key] || null
    },
    flush: async () => {
      store = {}
    },
    lock: async (key:string) => {
      while (store[key]) {
        await new Promise((resolve) => setTimeout(resolve, 10))
      }
      store[key] = true
      return { unlock: async () => {
        store[key] = false
      }}
    },
    set: async (key:string, value:string) => {
      store[key] = value
    },
    close: async () => {
      // nop
    }
  }
  return fakeClient
}
