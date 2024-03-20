const express = require('express')
const router = express.Router()

const { getListIdForUser, getListById, updateLinks, addLink, deleteLink } = require('@sooner/data-access/lists')
const { ErrorResponse } = require('@sooner/responses/errors')
const validation = require('@sooner/middleware/validation')
const multer = require('multer')
const { getMetadata, parseLink } = require('../utils/metadata')
const { body } = require('express-validator')
const { getFavicons } = require('./favicon')
const hostname = require('../utils/hostname')
const upload = multer()

router.get('/', async function (req, res) {
  const listId = await getListIdForUser(req.userId)
  const list = await getListById(listId)

  if (!list) {
    return res.status(500).json(new ErrorResponse('no list data found'))
  }

  // clean the list of expired links
  const links = list.links
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
  body('url').isURL({ require_valid_protocol: true, protocols: ['http', 'https'] }),
  body('linkId').optional().isString().isLength({ min: 24, max: 24 }).isHexadecimal(),
  body('addedOn').optional().isISO8601(),
  body('expiresOn').optional().isISO8601(),
  body('name').optional(),
  body('siteName').optional(),
  validation
]
router.post('/', ...linkValidation, async function (req, res) {
  const { linkId, url, addedOn, expiresOn } = req.body
  let { name, siteName } = req.body

  if (!name || !siteName) {
    try {
      const metadata = await getMetadata(url)
      name = metadata.title
      siteName = metadata.site
    } catch (error) {
      return res.status(500).json(new ErrorResponse(error.message))
    }
  }

  const favicons = await getFavicons(hostname(url), [])

  try {
    const newLinkId = await addLink(req.userId, name, siteName, url, favicons, addedOn, expiresOn, false, linkId)
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
    const favicons = await getFavicons(hostname(url), [])

    if (!url) {
      throw new Error('no link')
    }

    if (!title || !site) {
      throw new Error('no metadata')
    }

    await addLink(req.userId, title, site, url, favicons)
    res.redirect('/list?share=true&success=true')
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
