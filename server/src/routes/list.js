const express = require('express')
const router = express.Router()

const { getListIdForUser, getListById, updateLinks, addLink, deleteLink } = require('../daos/lists')
const { getUserPrefs } = require('../daos/users')
const { ErrorResponse, InvalidJSONResponse } = require('../utils/errors')
const { validation } = require('../utils/validation')
const multer = require('multer')
const { getMetadata, parseLink } = require('../utils/metadata')
const { body } = require('express-validator')
const upload = multer()

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
const linkValidation = [
  body('url').isURL({ require_valid_protocol: true, protocols: ['http', 'https'] }),
  body('addedOn').optional().isISO8601(),
  validation
]
router.post('/', ...linkValidation, async function (req, res) {
  try {
    var { title, site } = await getMetadata(req.body.url)
  } catch (error) {
    return res.status(400).json(new InvalidJSONResponse(['link']))
  }

  try {
    const newLinkId = await addLink(req.userId, title, site, req.body.url, req.body.addedOn)
    res.status(201).json({
      result: 'success',
      linkId: newLinkId
    })
  } catch (error) {
    console.error(error)
    res.status(500).json(new ErrorResponse('an unexpected error occurred'))
  }
})

const shareValidation = [
  body('url').optional().isURL({ require_valid_protocol: true, protocols: ['http', 'https'] }),
  body('text').optional().isString(),
  validation
]
router.post('/share', upload.none(), ...shareValidation, async function (req, res) {
  try {
    const link = req.body.url || parseLink(req.body.text)
    const { title, site } = await getMetadata(link)

    if (!link) {
      throw new Error('No link provided')
    } else if (!title || !site) {
      throw new Error("Couldn't find metadata")
    } else {
      const newLinkId = await addLink(req.userId, title, site, link)
      if (!newLinkId) {
        throw new Error('Add link DB error')
      }

      res.redirect('/list?share=true&success=true')
    }
  } catch {
    res.redirect('/list?share=true&failed=true')
  }
})

router.delete('/:linkId', async function (req, res) {
  const linkId = req.params.linkId
  await deleteLink(req.userId, linkId)
  res.json({
    result: 'success'
  })
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
