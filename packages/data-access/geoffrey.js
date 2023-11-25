// Data access for Sooner
const mongoClient = require('mongodb').MongoClient

if (!process.env.MONGODB_URL) throw new Error('MONGODB_URL is not defined')
if (!process.env.MONGODB_NAME) throw new Error('MONGODB_NAME is not defined')

let geoffrey

(async function connect () {
  const numRetries = 10
  const delaySecs = 60
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

  let client

  for (let i = 0; i < numRetries; i++) {
    console.log('Attempting MongoDB connection...')
    try {
      client = await mongoClient.connect(process.env.MONGODB_URL, { useUnifiedTopology: true })
      break
    } catch (error) {
      console.error('Error connecting to MongoDB:\n\t' + error)
      console.log(`Waiting ${delaySecs} seconds before retrying...`)
      await delay(delaySecs * 1000)
    }
  }

  if (!client) {
    throw new Error(`Failed to connect to MongoDB after ${numRetries} retries`)
  }

  geoffrey = client.db(process.env.MONGODB_NAME)

  console.log('Connected successfully to MongoDB')
})()

module.exports.getUsers = () => geoffrey.collection('users')
module.exports.getSessions = () => geoffrey.collection('sessions')
module.exports.getLists = () => geoffrey.collection('lists')
module.exports.getResetRequests = () => geoffrey.collection('resetRequests')
module.exports.getPushSubcriptions = () => geoffrey.collection('pushSubscriptions')
module.exports.getFavicons = () => geoffrey.collection('favicons')
module.exports.getFaviconOverrides = () => geoffrey.collection('faviconOverrides')