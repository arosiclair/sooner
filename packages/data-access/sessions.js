const geoffrey = require('./geoffrey')
const { v4: uuidv4 } = require('uuid')

module.exports.createSession = async (userId) => {
  var newToken = uuidv4()
  var newSession = {
    updatedAt: new Date(),
    userId: userId,
    token: newToken
  }

  await geoffrey.getSessions().insertOne(newSession)
  return newToken
}

module.exports.deleteSession = async (token) => {
  if (!token) return null

  const result = await geoffrey.getSessions().deleteOne({ token: token })
  return result.deletedCount === 1
}

module.exports.getSession = (token) => {
  if (!token) return null
  return geoffrey.getSessions().findOne({ token: token })
}

module.exports.invalidateSessions = (userId) => {
  if (!userId) return false

  geoffrey.getSessions().deleteMany({ userId })
  return true
}

/**
 * Extend the life of this session by updating its `updatedAt` timestamp
 */
module.exports.refreshSession = (token) => {
  if (!token) return

  return geoffrey.getSessions().findOneAndUpdate({ token: token }, { '$set': { updatedAt: new Date() }})
}