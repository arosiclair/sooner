var express = require('express')
var router = express.Router()

var geoffrey = require('../geoffrey')

/*
  Endpoint for adding a link to a user's list
  Creates a document in the list collection for the user if they do not already have one
  Expects the following params:
  linkName: string
  link: string
*/
router.post('/add', async function (req, res) {
  if (!req.userId) {
    console.error('list request received without userId')

    res.json({
      result: 'error',
      reason: 'invalid login'
    })
    return
  }

  var error = validateLink(req)
  if (error) {
    res.json(error)
    return
  }

  var listId = await getListId(req.userId)

  var newLink = {
    _id: geoffrey.getNewObjectId(),
    name: req.body.linkName,
    link: req.body.link
  }

  geoffrey.getLists().updateOne({ _id: listId }, { '$push': { 'links': newLink } })

  res.json({
    result: 'success'
  })
})

module.exports = router

/*
  Gets the Mongo ObjectID for the user's list or creates one for the user
  if they do not have one
*/
async function getListId (userId) {
  var user = await geoffrey.getUsers().findOne({ '_id': userId })
  if (user) {
    if (!user.listId) {
      return createListForUser(userId)
    } else {
      return user.listId
    }
  } else {
    // TODO: handle not found
  }
}

async function createListForUser (userId) {
  var newList = {
    userId: userId,
    links: []
  }

  var result = await geoffrey.getLists().insertOne(newList)
  geoffrey.getUsers().updateOne({ _id: userId }, { '$set': { 'listId': result.insertedId } })
  return result.insertedId
}

function validateLink (req) {
  var errorReason
  if (!req.body.linkName || typeof req.body.linkName !== 'string' || req.body.linkName > 140) {
    errorReason = 'bad link name'
  }

  if (!req.body.link || typeof req.body.link !== 'string') {
    errorReason = 'bad link'
  }

  if (errorReason) {
    return {
      result: 'error',
      reason: errorReason
    }
  } else {
    return null
  }
}
