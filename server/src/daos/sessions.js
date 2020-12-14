const geoffrey = require('../geoffrey')
const { v4: uuidv4 } = require('uuid')

async function createSession (userId) {
  var newToken = uuidv4()
  var newSession = {
    createdAt: new Date(),
    userId: userId,
    token: newToken
  }

  await geoffrey.getSessions().insertOne(newSession)
  return newToken
}

async function deleteSession (token) {
  if (!token) return null

  const result = await geoffrey.getSessions().deleteOne({ token: token })
  return result.deletedCount === 1
}

async function getSession (token) {
  if (!token) return null
  return geoffrey.getSessions().findOne({ token: token })
}

module.exports = {
  createSession,
  deleteSession,
  getSession
}
