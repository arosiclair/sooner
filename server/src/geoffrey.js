/* eslint-disable no-prototype-builtins */
// Data access for ReadItNow

const dbUrl = process.env.MONGODB_URL
const dbName = process.env.MONGODB_NAME

if (!dbUrl) throw new Error('MONGODB_URL is not defined')
if (!dbName) throw new Error('MONGODB_NAME is not defined')

const mongoClient = require('mongodb').MongoClient
const bson = require('bson')

let geoffrey
let usersCollection
let sessionsCollection
let listsCollection

mongoClient.connect(dbUrl, { useUnifiedTopology: true }, function (err, client) {
  if (err) {
    console.error('Error connecting to MongoDB: ' + err)
  }

  console.log('Connected successfully to MongoDB')

  geoffrey = client.db(dbName)
  usersCollection = geoffrey.collection('users')
  sessionsCollection = geoffrey.collection('sessions')
  listsCollection = geoffrey.collection('lists')
})

const getUsers = () => usersCollection

const getSessions = () => sessionsCollection

const getLists = () => listsCollection

const getObjectId = (id = null) => {
  if (id) {
    return new bson.ObjectID(id)
  } else {
    return new bson.ObjectID()
  }
}

// taken from https://gist.github.com/penguinboy/762197
const flattenObject = (obj) => {
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
  flattenObject
}
