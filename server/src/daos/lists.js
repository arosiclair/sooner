const geoffrey = require('../geoffrey')
const { getUserById } = require('./users')

async function getListById (listId) {
  if (!listId) return null

  return geoffrey.getLists().findOne({ _id: listId })
}

async function updateLinks (listId, links) {
  if (!listId || !links) return false

  geoffrey.getLists().updateOne({ _id: listId }, { $set: { links: links } })
  return true
}

/*
  Gets the Mongo ObjectID for the user's list or creates one for the user
  if they do not have one
*/
async function getListIdForUser (userId) {
  if (!userId) return null

  const user = await getUserById(userId)
  if (!user) {
    return null
  }

  if (user.listId) {
    return user.listId
  } else {
    return createListForUser(userId)
  }
}

async function createListForUser (userId) {
  if (!userId) return null

  var newList = {
    userId: userId,
    links: []
  }

  var result = await geoffrey.getLists().insertOne(newList)
  geoffrey.getUsers().updateOne({ _id: userId }, { $set: { listId: result.insertedId } })
  return result.insertedId
}

async function addLink (userId, name, siteName, link, addedOn) {
  if (!userId || !name || !siteName || !link) return false

  const newLink = {
    _id: geoffrey.getObjectId(),
    name,
    siteName,
    link,
    addedOn: addedOn || new Date()
  }

  const listId = await getListIdForUser(userId)
  geoffrey.getLists().updateOne({ _id: listId }, { $push: { links: newLink } })
  return newLink._id
}

async function deleteLink (userId, linkId) {
  if (!userId || !linkId) return false

  const listId = await getListIdForUser(userId)
  const linkObjId = geoffrey.getObjectId(linkId)
  geoffrey.getLists().updateOne({ _id: listId }, { $pull: { links: { _id: linkObjId } } })
  return true
}

module.exports = {
  getListById,
  updateLinks,
  addLink,
  deleteLink,
  getListIdForUser
}
