const express = require('express')
const router = express.Router()

const { getListIdForUser, getListById, updateLinks, addLink, deleteLink } = require('@sooner/data-access/lists')
const { getUserPrefs } = require('@sooner/data-access/users')
const { ErrorResponse, InvalidJSONResponse } = require('@sooner/responses/errors')
const validation = require('@sooner/middleware/validation')
const multer = require('multer')
const { getMetadata, parseLink } = require('../utils/metadata')
const { body } = require('express-validator')
const { getFavicons } = require('./favicon')
const { getHostname } = require('../utils/misc')
const upload = multer()

router.get('/', async function (req, res) {
  const listId = await getListIdForUser(req.userId)
  const list = await getListById(listId)

  if (!list) {
    return res.status(500).json(new ErrorResponse('no list data found'))
  }

  // clean the list of expired links
  const links = list.links

  // TODO: remove legacy support for links without expiresOn
  const prefs = await getUserPrefs(req.userId)
  const linkTTL = prefs ? prefs.linkTTL : 5
  list.links.forEach(link => addExpiresOn(link, linkTTL))

  const freshLinks = cleanExpiredLinks(links)
  if (freshLinks !== links) {
    updateLinks(listId, freshLinks)
  }

  res.json({
    result: 'success',
    list: freshLinks,
    numExpired: links.length - freshLinks.length
  })
})

/*
  Endpoint for adding a link to a user's list
  Creates a document in the list collection for the user if they do not already have one
*/
const linkValidation = [
  body('url').optional().isURL({ require_valid_protocol: true, protocols: ['http', 'https'] }),
  body('link').optional().isURL({ require_valid_protocol: true, protocols: ['http', 'https'] }),
  body('addedOn').optional().isISO8601(),
  validation
]
router.post('/', ...linkValidation, async function (req, res) {
  // TODO: remove legacy support for 'link'
  const url = req.body.link || req.body.url
  if (!url) {
    return res.status(400).json(new InvalidJSONResponse(['url']))
  }

  try {
    var { title, site } = await getMetadata(url)
  } catch (error) {
    return res.status(400).json(new InvalidJSONResponse(['url']))
  }

  const favicons = await getFavicons(getHostname(url), [])

  try {
    const newLinkId = await addLink(req.userId, title, site, url, favicons, req.body.addedOn)
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
    const url = req.body.url || parseLink(req.body.text)
    const { title, site } = await getMetadata(url)
    const favicons = await getFavicons(getHostname(url), [])

    if (!url) {
      throw new Error('No link provided')
    } else if (!title || !site) {
      throw new Error("Couldn't find metadata")
    } else {
      const newLinkId = await addLink(req.userId, title, site, url, favicons)
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

function cleanExpiredLinks (links) {
  const hasExpiredLinks = links.some(linkExpired)
  if (hasExpiredLinks) {
    const freshLinks = links.filter(link => !linkExpired(link))
    return freshLinks
  } else {
    return links
  }
}

function linkExpired (link) {
  return new Date() > new Date(link.expiresOn.valueOf())
}

function addExpiresOn (link, linkTTL) {
  if (link.expiresOn) return

  const addedOn = new Date(link.addedOn.valueOf())
  const expiresOn = new Date(addedOn)
  expiresOn.setDate(expiresOn.getDate() + linkTTL)
  link.expiresOn = expiresOn
}
