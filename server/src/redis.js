// @flow

import { createClient } from 'redis'
import Redlock from 'redlock'

export async function getRedisClient () {
  let client = createClient()
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
    // TODO this has not been tested
    getNested: async (root:string, keys:Array<string>) => {
      return new Promise((resolve, reject) => {
        let query = redis.multi()
        keys.forEach(key => {
          query = query.get(`${root}:${key}`)
        })
        query.exec((err, results) => {
          if (err) return reject(err)
          let obj = {}
          keys.forEach((key, index) => {
            obj[key] = results[index]
          })
          return obj
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
