// @flow

export class ResourceManager {
  redis: any
  constructor (redisClient:any) {
    this.redis = redisClient
  }

  async modifySharedResource (path:string, keys: Array<string>, modify: Function) {
    const { redis } = this
    let lock = await redis.lock(`${path}:lock`)
    // TODO this is a naive multi-get, it can normally be done in one query
    const initialObject = {}
    for (let key of keys) {
      initialObject[key] = await redis.get(`${path}:${key}`)
    }

    const finalObject = await modify(initialObject)

    // Update any fields that have changed
    for (let key in finalObject) {
      if (finalObject[key] !== initialObject[key]) {
        await redis.set(`${path}:${key}`, finalObject[key])
      }
    }

    await lock.unlock()
    return finalObject
  }

}
