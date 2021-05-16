const geoffrey = require('../geoffrey')
const { getUserByEmail } = require('./users')
const { v4: uuidv4 } = require('uuid')

async function createResetRequest (email) {
  const user = await getUserByEmail(email)
  if (!user) return null
  const existingRequest = await getResetRequestByUserId(user._id)
  if (existingRequest) return null

  const resetRequest = {
    userId: user._id,
    token: uuidv4(),
    createdAt: new Date()
  }

  geoffrey.getResetRequests().insertOne(resetRequest)
  return resetRequest.token
}

async function getResetRequestByUserId (userId) {
  if (!userId) return null

  return geoffrey.getResetRequests().findOne({ userId })
}

async function getResetRequestByToken (token) {
  if (!token) return null

  return geoffrey.getResetRequests().findOne({ token })
}

async function deleteResetRequest (token) {
  if (!token) return null

  return geoffrey.getResetRequests().deleteOne({ token })
}

module.exports = {
  createResetRequest,
  getResetRequestByToken,
  deleteResetRequest
}
