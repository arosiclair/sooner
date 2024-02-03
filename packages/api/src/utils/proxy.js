const hostname = require('./hostname')
const axios = require('axios')
const https = require('https')

const { BRD_HOST, BRD_PORT, BRD_USERNAME, BRD_PASSWORD } = process.env
if (!BRD_HOST) throw new Error('BRD_HOST is not defined')
if (!BRD_PORT) throw new Error('BRD_PORT is not defined')
if (!BRD_USERNAME) throw new Error('BRD_USERNAME is not defined')
if (!BRD_PASSWORD) throw new Error('BRD_PASSWORD is not defined')

const proxy = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  proxy: {
    protocol: 'https',
    host: BRD_HOST,
    port: BRD_PORT,
    auth: {
      username: BRD_USERNAME,
      password: BRD_PASSWORD
    }
  }
})

module.exports = async (url) => {
  console.log(`[proxy] proxying for '${hostname(url)}'...`)
  try {
    const result = await proxy.get(url)
    return result.data || null
  } catch (error) {
    if (error.response) {
      console.log(`[proxy] failed to proxy for '${hostname(url)}'. Error: ${error.response.status}`)
    } else {
      console.log(`[proxy] failed to proxy for '${hostname(url)}'. Error: ${error.response.status} '${error.message}'`)
    }
    return null
  }
}
