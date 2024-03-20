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

async function addLink (userId, name, siteName, url, favicons, addedOn = new Date(), expiresOn = null, isTutorial = false, linkId = '') {
  const listId = await getListIdForUser(userId)
  if (!listId) {
    throw new Error(`[lists] addlink() - userId '${userId}' doesn't have a list somehow`)
  }

  // check for a dupe and return it instead
  const existingLink = !isTutorial && await getLinkByUrl(listId, url)
  if (existingLink) {
    return existingLink._id
  }

  const userPrefs = await getUserPrefs(userId)
  if (!userPrefs){ 
    throw new Error(`[lists] addlink() - userId '${userId}' doesn't have a userPrefs somehow`)
  }

  if (!expiresOn) {
    expiresOn = new Date(addedOn)
    expiresOn.setDate(expiresOn.getDate() + userPrefs.linkTTL)
  }

  const newLink = {
    _id: linkId ? toObjectId(linkId) : generateObjectId(),
    name,
    siteName,
    url,
    favicons,
    addedOn,
    expiresOn,
    isTutorial
  }
  await geoffrey.getLists().updateOne({ _id: listId }, { $push: { links: newLink } })

  return newLink._id
}

async function deleteLink (userId, linkId) {
  if (!userId || !linkId) return false

  const listId = await getListIdForUser(userId)
  const linkObjId = toObjectId(linkId)
  geoffrey.getLists().updateOne({ _id: listId }, { $pull: { links: { _id: linkObjId } } })
  return true
}

async function getLinkByUrl (listId, url) {
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
