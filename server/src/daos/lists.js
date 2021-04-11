const geoffrey = require('../geoffrey')
const { getUserById, getUserPrefs } = require('./users')

async function getListById (listId) {
  if (!listId) return null

  try {
    return await geoffrey.getLists().findOne({ _id: listId })
  } catch (error) {
    return null
  }
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

async function addLink (userId, name, siteName, link, favicons, addedOn = new Date()) {
  if (!userId || !name || !siteName || !link) return false

  const listId = await getListIdForUser(userId)

  // check for a dupe and return it instead
  const existingLink = await checkExists(listId, link)
  if (existingLink) {
    return existingLink._id
  }

  const userPrefs = await getUserPrefs(userId)
  if (!userPrefs) return null

  const addedDTS = addedOn || new Date()
  const expireDTS = new Date(addedDTS)
  expireDTS.setDate(expireDTS.getDate() + userPrefs.linkTTL)

  const newLink = {
    _id: geoffrey.getObjectId(),
    name,
    siteName,
    link,
    favicons,
    addedOn: addedDTS,
    expiresOn: expireDTS
  }

  try {
    await geoffrey.getLists().updateOne({ _id: listId }, { $push: { links: newLink } })
  } catch (error) {
    console.error('addLink() - db error: ' + error)
    return null
  }

  return newLink._id
}

async function deleteLink (userId, linkId) {
  if (!userId || !linkId) return false

  const listId = await getListIdForUser(userId)
  const linkObjId = geoffrey.getObjectId(linkId)
  geoffrey.getLists().updateOne({ _id: listId }, { $pull: { links: { _id: linkObjId } } })
  return true
}

async function checkExists (listId, link) {
  if (!listId || !link) return false

  const list = await getListById(listId)
  if (!list) return false

  return list.links.find(linkItem => linkItem.link === link)
}

module.exports = {
  getListById,
  updateLinks,
  addLink,
  deleteLink,
  getListIdForUser
}
