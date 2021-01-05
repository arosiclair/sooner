const express = require('express')
const router = express.Router()

const urlMetadata = require('url-metadata')
const { getListIdForUser, getListById, updateLinks, addLink, deleteLink } = require('../daos/lists')
const { getUserPrefs } = require('../daos/users')
const { ErrorResponse } = require('../utils/errors')
const { jsonValidation } = require('../utils/validation')

router.get('/', async function (req, res) {
  const listId = await getListIdForUser(req.userId)
  const list = await getListById(listId)

  if (list) {
    // clean the list of expired links
    const links = list.links
    const { linkTTL } = await getUserPrefs(req.userId)

    const unexpiredLinks = cleanExpiredLinks(links, linkTTL)
    if (unexpiredLinks !== links) {
      updateLinks(listId, unexpiredLinks)
    }

    res.json({
      result: 'success',
      list: unexpiredLinks,
      numExpired: links.length - unexpiredLinks.length
    })
  } else {
    res.status(500).json(new ErrorResponse('no list data found'))
  }
})

/*
  Endpoint for adding a link to a user's list
  Creates a document in the list collection for the user if they do not already have one
*/
const addLinkSchema = {
  linkName: (val) => typeof val === 'string' && val.length <= 140,
  siteName: (val) => typeof val === 'string' && val.length <= 140,
  link: (val) => typeof val === 'string',
  addedOn: (val) => val === undefined || (typeof val === 'string' && new Date(val).toString().toLowerCase() !== 'invalid date')
}
router.post('/', jsonValidation(addLinkSchema), async function (req, res) {
  const newLinkId = await addLink(req.userId, req.body.linkName, req.body.siteName, req.body.link, req.body.addedOn)
  res.json({
    result: 'success',
    linkId: newLinkId
  })
})

router.delete('/:linkId', async function (req, res) {
  const linkId = req.params.linkId
  await deleteLink(req.userId, linkId)
  res.json({
    result: 'success'
  })
})

router.get('/linkMetadata', async function (req, res) {
  if (!req.query.url) {
    res.status(400).json(new ErrorResponse('bad link'))
    return
  }

  try {
    var metadata = await urlMetadata(req.query.url)
    res.json({
      result: 'success',
      metadata: metadata
    })
  } catch (error) {
    res.status(406).json(new ErrorResponse('metadata not found'))
  }
})

module.exports = router

function cleanExpiredLinks (links, linkTTL) {
  var unexpiredLinks = []
  var changed = false

  for (var i = 0; i < links.length; i++) {
    var link = links[i]

    if (!link.addedOn) {
      changed = true
      continue
    }

    var expireTime = new Date(link.addedOn.valueOf())
    expireTime.setDate(expireTime.getDate() + linkTTL)
    if (new Date() > expireTime) {
      changed = true
      continue
    }

    unexpiredLinks.push(link)
  }

  return changed ? unexpiredLinks : links
}
