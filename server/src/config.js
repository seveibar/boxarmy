// @flow

let configPromise
async function loadConfig () {
  return {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
  }
}

export default function getConfig (): Promise<{
  mode: "development" | "production"
}> {
  if (!configPromise) {
    configPromise = loadConfig()
  }
  return configPromise
}
