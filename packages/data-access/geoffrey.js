/* eslint-disable no-prototype-builtins */
// Data access for Sooner
const bson = require('bson')
const mongoClient = require('mongodb').MongoClient

const dbUrl = process.env.MONGODB_URL
const dbName = process.env.MONGODB_NAME
if (!dbUrl) throw new Error('MONGODB_URL is not defined')
if (!dbName) throw new Error('MONGODB_NAME is not defined')

let geoffrey
let usersCollection
let sessionsCollection
let listsCollection
let resetRequestsCollection

const getUsers = () => usersCollection
const getSessions = () => sessionsCollection
const getLists = () => listsCollection
const getResetRequests = () => resetRequestsCollection

connect()

async function connect () {
  const numRetries = 10
  const delaySecs = 60
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

  let client

  for (let i = 0; i < numRetries; i++) {
    console.log('Attempting MongoDB connection...')
    try {
      client = await mongoClient.connect(dbUrl, { useUnifiedTopology: true })
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

  geoffrey = client.db(dbName)
  usersCollection = geoffrey.collection('users')
  sessionsCollection = geoffrey.collection('sessions')
  listsCollection = geoffrey.collection('lists')
  resetRequestsCollection = geoffrey.collection('resetRequests')

  console.log('Connected successfully to MongoDB')
}

function getObjectId (id = null) {
  if (id) {
    return new bson.ObjectID(id)
  } else {
    return new bson.ObjectID()
  }
}

// taken from https://gist.github.com/penguinboy/762197
function flattenObject (obj) {
  var toReturn = {}

  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue

    if ((typeof obj[i]) === 'object') {
      var flatObject = flattenObject(obj[i])
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue

        toReturn[i + '.' + x] = flatObject[x]
      }
    } else {
      toReturn[i] = obj[i]
    }
  }
  return toReturn
}

module.exports = {
  getUsers,
  getSessions,
  getLists,
  getObjectId,
  flattenObject,
  getResetRequests
}
