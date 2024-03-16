const geoffrey = require('./geoffrey')
const { getUserById, getUserPrefs } = require('./users')
const { generateObjectId, toObjectId } = require('./utils/object-id')
const introLinks = require('./intro-links.json')

async function getListById (listId) {
  if (!listId) return null

  try {
    return await geoffrey.getLists().findOne({ _id: listId })
  } catch (error) {
    return null
  }
}

async function getListByUserId (userId) {
  if (!userId) return null

  return getListById(await getListIdForUser(userId))
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
  await populateIntroLinks(userId)
  return result.insertedId
}

async function populateIntroLinks (userId) {
  return Promise.all(introLinks.map(introLink => addLink(userId, introLink.name, introLink.siteName, introLink.url, introLink.favicons, undefined, undefined, true)))
}

async function addLink (userId, name, siteName, url, favicons, addedOn = new Date(), expiresOn = null, isTutorial = false) {
  if (!userId) return false

  if (isTutorial) {
    if (!name || !siteName) {
      return false
    }
  } else {
    if (!name || !siteName || !url) {
      return false
    }
  }

  const listId = await getListIdForUser(userId)

  // check for a dupe and return it instead
  const existingLink = !isTutorial && await checkExists(listId, url)
  if (existingLink) {
    return existingLink._id
  }

  const userPrefs = await getUserPrefs(userId)
  if (!userPrefs) return null

  if (!expiresOn) {
    expiresOn = new Date(addedOn)
    expiresOn.setDate(expiresOn.getDate() + userPrefs.linkTTL)
  }

  const newLink = {
    _id: generateObjectId(),
    name,
    siteName,
    url,
    favicons,
    addedOn,
    expiresOn,
    isTutorial
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
  const linkObjId = toObjectId(linkId)
  geoffrey.getLists().updateOne({ _id: listId }, { $pull: { links: { _id: linkObjId } } })
  return true
}

async function checkExists (listId, url) {
  if (!listId || !url) return false

  const list = await getListById(listId)
  if (!list) return false

  return list.links.find(link => link.url === url || link.link === url)
}

module.exports = {
  getListById,
  getListByUserId,
  updateLinks,
  addLink,
  deleteLink,
  getListIdForUser
}
